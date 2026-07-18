"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const TypeDefs_1 = __importDefault(require("../src/GraphQL/TypeDefs"));
const Resolvers_1 = __importDefault(require("../src/GraphQL/Resolvers"));
const app = (0, express_1.default)();
const server = new server_1.ApolloServer({
    typeDefs: TypeDefs_1.default,
    resolvers: Resolvers_1.default,
});
// Initialize the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use(express_1.default.json());
    app.use('/graphql', (0, express4_1.expressMiddleware)(server));
    app.get('/', (_, res) => res.send('Server is Running'));
});
startServer().catch(console.error);
// Export the Express app as a Vercel serverless function
exports.default = app;
