# GraphQL Caching Architecture Example

This repository demonstrates how I professionally structure a GraphQL project with caching, using a simple `User–Post` use case.  
It focuses on clean architecture, `Decorator` patterns for `middlewares` like error handling, resolver design, and efficient data fetching patterns.

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

📂 `graphql/`
* `resolvers/` - Contains GraphQL resolver functions that implement the logic for queries and mutations. Example: fetching users, posts, or handling mutations like creating/updating posts.
* `schema/` - Holds your GraphQL schema definition files (.graphql) or typeDefs. Defines types, queries, mutations, and relationships in your API.
* `context/` - Provides the GraphQL context, such as database clients, caching layers, and user authentication info. This context is accessible in all resolvers.


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

