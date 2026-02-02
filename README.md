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

#### Example Code ([source](https://github.com/mel-ugaddan/graphql_typescript_with_caching/blob/main/src/graphql/resolvers/post.ts#L7-L65)) :

```javascript
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

