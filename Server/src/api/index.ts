import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import TypeDefs from '../GraphQL/TypeDefs';
import Resolvers from '../GraphQL/Resolvers';

const app = express();

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
});

// Initialize the server asynchronously and export a readiness promise
const serverReady = server.start().then(() => {
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));
  app.get('/', (_, res) => res.send('Server is Running'));
});

serverReady.catch(console.error);

// Export both the app and the readiness promise
export { serverReady };
export default app;
