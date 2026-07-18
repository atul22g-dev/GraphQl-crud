import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import TypeDefs from '../src/GraphQL/TypeDefs';
import Resolvers from '../src/GraphQL/Resolvers';

const app = express();

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
});

// Initialize the server
const startServer = async () => {
  await server.start();
  
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));
  
  app.get('/', (_, res) => res.send('Server is Running'));
};

startServer().catch(console.error);

// Export the Express app as a Vercel serverless function
export default app;
