import { PrismaClient } from '@prisma/client';

export interface CreateTodoPayload {
    Title: string;
    Description: string;
}

interface TodoIdPayload {
    id: number;
}

export interface UpdateTodoPayload {
    id: number;
    Title: string;
    Description: string;
}

// Singleton PrismaClient instance for serverless (prevents connection exhaustion on warm starts)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Always cache on globalThis so Vercel warm starts reuse the same instance
globalForPrisma.prisma = prisma;

class TodoService {
    static async dbHeartbeat() {
        try {
            // Run a lightweight query to verify DB connectivity
            await prisma.$queryRaw`SELECT 1`;
            return {
                ok: true,
                timestamp: new Date().toISOString(),
                message: 'Database is connected and healthy',
            };
        } catch (error: any) {
            return {
                ok: false,
                timestamp: new Date().toISOString(),
                message: `Database connection failed: ${error.message}`,
            };
        }
    }

    static async create(payload: CreateTodoPayload) {
        await prisma.todo.create({ data: payload });
        return 'Todo Created Successfully';
    }

    static async all() {
        return prisma.todo.findMany();
    }

    static async find(payload: TodoIdPayload) {
        return prisma.todo.findUnique({ where: { id: payload.id } });
    }

    static async update(payload: UpdateTodoPayload) {
        const { id, ...data } = payload;
        await prisma.todo.update({ where: { id }, data });
        return 'Todo Updated Successfully';
    }

    static async delete(payload: TodoIdPayload) {
        await prisma.todo.delete({ where: { id: payload.id } });
        return 'Todo Deleted Successfully';
    }
}

export default TodoService;