# GraphQL Caching Architecture Example

This repository demonstrates how I professionally will structure a GraphQL project, using a simple `User–Post` use case.  
It focuses on clean architecture, `Decorator` patterns for `middlewares` like error handling (DRY Principle), resolver design, and efficient data fetching patterns.

---

## 🚀 Features

- GraphQL API design
- User–Post relationship handling
- Caching layer (e.g. Custom DataLoader / In-memory cache using LRU )
- Prisma ORM integration
- Clean, scalable project structure
- Type-safe resolvers (TypeScript)

---

## 🧱 Project Structure

```text
src/
├── graphql/
│   ├── resolvers/
│   ├── schema/
│   └── context/
├── lib/
│   ├── cachemap/
│   ├── constants/
│   ├── dataloaders/
│   ├── middlewares/
│   ├── prisma/
│   ├── types/
│   ├── utils/
│   └── validations/
└── index.ts
```

📂 `graphql/` - Contains all graphql-related files e.g. Schema definition, Resolvers, Query, Mutations and Context Type for incoming requests.
* `resolvers/` - Contains GraphQL resolver functions that implement the logic for queries and mutations. Example: fetching users, posts, or handling mutations like creating/updating posts.
* `schema/` - Holds your GraphQL schema definition files (.graphql) or typeDefs. Defines types, queries, mutations, and relationships in your API.
* `context/` - Provides the GraphQL context, that contains the dataloader clients, caching layers, and user authentication info. This context is accessible in all resolvers.

📂 `lib/` – Core Library Utilities
*  `cachemap/` - Contains caching mechanisms, such as  LRU caches , to optimize repeated data fetching and prevent N+1 query issues. I wrote a custom LRU cache using doubly-linked list ( A well-known leetcode problem ).
* `constants/` - Holds constant values and messages used across the project, such as resolver success/error messages, configuration keys such as cache item limit, and status codes. **Example use:** `POST_RESOLVER_MESSAGES.fetch_post_success`.
* `dataloaders/` - Implements **DataLoader utilities** for batching and caching database requests efficiently. This helps reduce the number of queries when resolving fields like `User.posts`.
* `middlewares/` - Reusable middleware functions for GraphQL resolvers and dataloaders. For now it is Error handling using `decorators`.
* `prisma/` - Contains prisma client setup.  
* `types/` - Contains both Custom Type-safe and Generated types and interfaces for:  GraphQL context, Resolver arguments and responses and Prisma models. **Purpose:** maintain type safety and improve developer experience.
* `utils/` - Contains helpers for our resolvers (For now), these `helper` functions are :
  - `getRequestedFields()` — Extracts requested fields from resolver info
  - `validateOrThrow()` — Zod validation
  - `formatResponse()` — Response formatter
  - `roupPostsByUser(): Post[]` — Assigns `User` / author to each `Post`
  - `mapPostsWithAuthors(): User[]` - Group `Posts` by `authorid` then assign to each `User`
* `validations/` - Contains the validation schema using `Zod`.

## 🧑‍💻 Code Examples :

#### Code 1 ([source](https://github.com/mel-ugaddan/graphql_typescript_with_caching/blob/main/src/graphql/resolvers/post.ts#L7-L65)) :

```javascript
### src/graphql/resolvers
export const postResolvers: Resolvers = {
  Query: {
    post: ComposeResolver(
      async (_parent, args, context, info) => {
        let return_val;
        ....
        # perform fetching
        ....
        return ResolverUtils.formatResponse(return_val, POST_RESOLVER_MESSAGES.fetch_post_success);
      },
      [ExceptionHandler]
    )
};
```

#### Code 2 ([source](https://github.com/mel-ugaddan/graphql_typescript_with_caching/blob/main/src/graphql/resolvers/post.ts#L7-L65)) :
```javascript
### @lib/cachemap
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

    this.tail = new LRUNode<K, V>(null as K, null as V);
    this.head = new LRUNode<K, V>(null as K, null as V);

    this.tail.next = this.head;
    this.head.prev = this.tail;
  }
}
````


#### Code 3 ([source](https://github.com/mel-ugaddan/graphql_typescript_with_caching/blob/main/src/graphql/resolvers/post.ts#L7-L65)) :
```javascript
### @lib/dataloaders

export class PostDataLoader {
  protected cachemap: PostCache;
  protected repository: PrismaDelegates['post'];
  protected prismaClient: PrismaClient;

  constructor(prisma: PrismaClient, cache: PostCache) {
    this.repository = prisma.post;
    this.cachemap = cache;
    this.prismaClient = prisma;
  }

  @HandleErrors()
  async load(id: PostModelId): Promise<PostModel | null> {
    if (this.cachemap.has(id)) return this.cachemap.get(id)!;

    const queried_item = await this.repository.findUnique({
      where: { id },
    });

    this.cachemap.set(id, queried_item);
    return queried_item;
  }
}
```

#### Code 4 ([source](https://github.com/mel-ugaddan/graphql_typescript_with_caching/blob/main/src/graphql/resolvers/post.ts#L7-L65)) :
```javascript
### @lib/validations
const BaseUserInputSchema = z.object({
  name: z.string().min(2).max(150),
  bio: z.string().max(150).nullable().optional(),
  age: z.number().max(150).int().positive(),
}) satisfies z.ZodType<UserSafeCreateInput>;

export const CreateUserInputSchema = BaseUserInputSchema;

export const UpdateUserInputSchema = CreateUserInputSchema.partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.keys(rest).length > 0;
    },
    {
      message: VALIDATION_MESSAGES.provide_at_least_one_field,
    }
  ) satisfies z.ZodType<UserSafeUpdateInput>;
```

```javascript
### @lib/types
export type PostSafeCreateInput = Prisma.PostUncheckedCreateInput;
export type PostSafeUpdateInput = Override<
  Prisma.PostUncheckedUpdateInput, {authorId?: number;}
>;
export type UserSafeCreateInput = Prisma.UserCreateWithoutPostsInput;
export type UserSafeUpdateInput = Prisma.UserUpdateWithoutPostsInput;

export type PostModelId = PostModel['id'];
export type UserModelId = UserModel['id'];
```
