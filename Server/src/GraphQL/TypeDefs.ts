const TypeDefs = `
    type Todo {
        id: Int
        Title: String
        Description: String
    }
    type DbHeartbeatResult {
        ok: Boolean!
        timestamp: String!
        message: String!
    }
    type Query {
        hello: String
        allTodo: [Todo]
        dbHeartbeat: DbHeartbeatResult!
    }
    type Mutation {
        createTodo(Title: String, Description: String): String!
        deleteTodo(id: Int): String!
        findTodo(id: Int): Todo!
        updateTodo(id: Int, Title: String, Description: String): String!
    }
`;

export default TypeDefs;