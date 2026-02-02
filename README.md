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
