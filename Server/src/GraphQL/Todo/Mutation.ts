import TodoService, { CreateTodoPayload, UpdateTodoPayload } from "../../services/todo";

const createTodo = async (_: any, payload: CreateTodoPayload) => {
    return TodoService.create(payload);
}

const allTodo = async () => {
    return TodoService.all();
}

const deleteTodo = async (_: any, payload: { id: number }) => {
    return TodoService.delete(payload);
}

const findTodo = async (_: any, payload: { id: number }) => {
    return TodoService.find(payload);
}

const updateTodo = async (_: any, payload: UpdateTodoPayload) => {
    return TodoService.update(payload);
}

const dbHeartbeat = async () => {
    return TodoService.dbHeartbeat();
}

export { createTodo, allTodo, deleteTodo, findTodo, updateTodo, dbHeartbeat };