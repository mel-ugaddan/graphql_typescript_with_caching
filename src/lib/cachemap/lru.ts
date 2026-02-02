import type { PostModel } from '@lib/types/generated/prisma/models';

class LRUNode<K, V> {
  key: K;
  val: V | null;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;
  constructor(key: K, val: V | null) {
    this.key = key;
    this.val = val;
  }
}

/**
 * Typical LRU Cache using doubly-linked list.
 */
export class LRUCache<K, V> {
  public capacity: number;
  public cache: Map<K, LRUNode<K, V>>;
  public tail: LRUNode<K, V>;
  public head: LRUNode<K, V>;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }

    this.capacity = capacity;
    this.cache = new Map();

    // Sentinel nodes for easier list management
    this.tail = new LRUNode<K, V>(null as K, null as V);
    this.head = new LRUNode<K, V>(null as K, null as V);

    this.tail.next = this.head;
    this.head.prev = this.tail;
  }

  remove(node: LRUNode<K, V>): void {
    const prevNode = node.prev;
    const nextNode = node.next;

    if (prevNode) prevNode.next = nextNode;
    if (nextNode) nextNode.prev = prevNode;

    // Clear references to help garbage collection
    node.prev = null;
    node.next = null;
  }

  moveToHead(node: LRUNode<K, V>): void {
    // Insert right before head (most recently used position)
    node.prev = this.head.prev;
    node.next = this.head;

    if (this.head.prev) {
      this.head.prev.next = node;
    }
    this.head.prev = node;
  }

  get(key: K): V | undefined | null {
    if (!this.cache.has(key)) {
      return undefined;
    }
    const node = this.cache.get(key)!;
    this.remove(node);
    this.moveToHead(node);
    return node.val;
  }

  set(key: K, value: V | null): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.val = value;
      this.remove(node);
      this.moveToHead(node);
    } else {
      const node = new LRUNode(key, value);
      this.cache.set(key, node);
      this.moveToHead(node);

      if (this.cache.size > this.capacity) {
        const lruNode = this.tail.next!;
        this.cache.delete(lruNode.key);
        this.remove(lruNode);
      }
    }
  }

  delete(key: K): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    const node = this.cache.get(key)!;
    this.cache.delete(key);
    this.remove(node);

    return true;
  }

  clear(): void {
    let current = this.tail.next;
    while (current && current !== this.head) {
      const next = current.next;
      current.prev = null;
      current.next = null;
      current = next;
    }
    this.cache.clear();
    this.tail.next = this.head;
    this.head.prev = this.tail;
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  get size(): number {
    return this.cache.size;
  }

  keys(): K[] {
    const keys: K[] = [];
    let current = this.head.prev;
    while (current && current !== this.tail) {
      keys.push(current.key);
      current = current.prev;
    }
    return keys;
  }

  getValues(): (V | null)[] {
    const values: (V | null)[] = [];
    let current = this.head.prev;

    while (current && current !== this.tail) {
      values.push(current.val);
      current = current.prev;
    }
    return values;
  }

  getIds(): K[] {
    return this.keys();
  }
}

/**
 * I created an extended version of my custom LRUCache to have
 * additional `userPosts` state to manage the mapping of `posts` to a user.
 */
export class PostCache extends LRUCache<number, PostModel> {
  userPosts = new Map<number, Map<number, PostModel>>();
  constructor(limit: number) {
    super(limit);
  }

  set(key: number, value: PostModel | null): void {
    let node: LRUNode<number, PostModel>;

    if (this.cache.has(key)) {
      node = this.cache.get(key)!;
      node.val = value;
      this.remove(node);
      this.moveToHead(node);
    } else {
      node = new LRUNode(key, value);
      this.cache.set(key, node);
      this.moveToHead(node);

      if (this.cache.size > this.capacity) {
        const lruNode = this.tail.next!;
        this.cache.delete(lruNode.key);

        if (lruNode.val) {
          const { authorId, id } = lruNode.val;
          const posts = this.userPosts.get(authorId);
          if (posts) {
            posts.delete(id);
            if (posts.size === 0) {
              this.userPosts.delete(authorId);
            }
          }
        }
        this.remove(lruNode);
      }
    }

    if (node.val) {
      let posts = this.userPosts.get(node.val.authorId);
      if (!posts) {
        posts = new Map<number, PostModel>();
        this.userPosts.set(node.val.authorId, posts);
      }
      posts.set(node.val.id, node.val);
    }
  }

  delete(key: number): boolean {
    const node = this.cache.get(key);
    if (!node) return false;
    this.cache.delete(key);
    this.remove(node);

    if (node.val) {
      const posts = this.userPosts.get(node.val.authorId);
      if (posts) {
        posts.delete(node.val.id);
        if (posts.size === 0) {
          this.userPosts.delete(node.val.authorId);
        }
      }
    }
    return true;
  }

  getUserCachedPosts(user_id: number): { ids: number[]; values: PostModel[] } {
    const ids: number[] = [];
    const values: PostModel[] = [];
    const posts = this.userPosts.get(user_id);
    if (!posts) return { ids, values };
    for (const [id, value] of posts) {
      ids.push(id);
      values.push(value);
    }
    return { ids, values };
  }
}
