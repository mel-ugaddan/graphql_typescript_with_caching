import fs from 'fs';
import path from 'path';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from '@apollo/server';
import { parse } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './graphql/resolvers';
import { createDataLoaders } from '@lib/dataloaders/index';
import type { GraphQLContext } from './graphql/context';

const typeDefs = parse(fs.readFileSync(path.join(process.cwd(), './src/graphql/schema/schema.graphql'), 'utf8'));

let schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer<GraphQLContext>({
  schema,
  includeStacktraceInErrorResponses: false,
  formatError: (err) => {
    return {
      message: err.message,
    };
  },
});

const { url } = await startStandaloneServer(server, {
  context: async () => {
    return {
      dataloaders: createDataLoaders(),
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
