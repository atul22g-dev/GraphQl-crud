import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import TypeDefs from './GraphQL/TypeDefs';
import Resolvers from './GraphQL/Resolvers';
import { prisma } from './services/todo';
import cronAuth from './middleware/middleware';

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: TypeDefs,
    resolvers: Resolvers,
  });

  app.use(cors({ origin: '*' }));
  app.use(express.json());

  await server.start();

  app.get('/', (_, res) => res.send('Server is Running'));

  app.use('/graphql', expressMiddleware(server));

  app.get('/api/status', async (_, res) => {
    const start = Date.now();

    try {
      const result = await prisma.$queryRaw<
        { uptime_seconds: number }[]
      >`
        SELECT
          ROUND(
            (EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time())))::numeric,
            9
          ) AS uptime_seconds
      `;

      res.json({
        status: 'success',
        message: 'Server is running',
        type: 'postgresSQL',
        data: {
          database: 'connected',
          uptime: Number(result[0].uptime_seconds),
          timestamp: new Date().toISOString(),
          latency: Date.now() - start,
        },
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

  // DB Heartbeat Endpoint
  app.get('/api/db-heartbeat',cronAuth ,async (_, res) => {
    
    try {
      // Create table if it doesn't exist
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS heartbeat (
          id TEXT PRIMARY KEY,
          last_run TIMESTAMP NOT NULL
        )
      `);

      // Upsert heartbeat record
      await prisma.$executeRaw`
        INSERT INTO heartbeat (id, last_run)
        VALUES ('heartbeat', NOW())
        ON CONFLICT (id)
        DO UPDATE SET last_run = NOW()
      `;

      const heartbeat = await prisma.$queryRaw<
        { id: string; last_run: Date }[]
      >`
        SELECT id, last_run
        FROM heartbeat
        WHERE id = 'heartbeat'
      `;

      res.json({
        success: true,
        message: 'Heartbeat updated',
        data: heartbeat[0],
      });
    } catch (error) {
      console.error('Heartbeat failed:', error);

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at: http://localhost:${PORT}/graphql`)
  );
}

startServer();