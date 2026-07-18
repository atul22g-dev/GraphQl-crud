// Vercel serverless function for GraphQL API
// Imports the Express app from src/api and awaits server readiness
import app, { serverReady } from '../src/api/index';

// Vercel serverless handler — waits for async Apollo Server startup
export default async function handler(req: any, res: any) {
  await serverReady;
  app(req, res);
}
