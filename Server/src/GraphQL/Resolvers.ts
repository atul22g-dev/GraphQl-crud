import { allTodo, createTodo, deleteTodo, findTodo, updateTodo, dbHeartbeat } from "./Todo/Mutation";


const Resolvers = {
    Query: {
        hello: () => 'Hello World!',
        allTodo: allTodo,
        dbHeartbeat: dbHeartbeat
    },
    Mutation: {
        createTodo: createTodo,
        deleteTodo: deleteTodo,
        findTodo: findTodo,
        updateTodo: updateTodo,
    }
}

export default Resolvers;