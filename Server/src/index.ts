import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import TypeDefs from './GraphQL/TypeDefs';
import Resolvers from './GraphQL/Resolvers';

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: TypeDefs,
        resolvers: Resolvers,
    });

    app.use(cors({ origin: '*' }));
    app.use(express.json());

    await server.start();
    app.use('/graphql', expressMiddleware(server));
    app.get('/', (_, res) => res.send('Server is Running'));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}/graphql`));
}

startServer();