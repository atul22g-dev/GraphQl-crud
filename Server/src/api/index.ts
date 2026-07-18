import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import TypeDefs from '../GraphQL/TypeDefs';
import Resolvers from '../GraphQL/Resolvers';
import { prisma } from '../services/todo';

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
  app.get('/status', async (_, res) => {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        latency: Date.now() - start,
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({
        status: 'error',
        database: 'disconnected',
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        latency: Date.now() - start,
      });
    }
  });
});

serverReady.catch(console.error);

// Export both the app and the readiness promise
export { serverReady };
export default app;
