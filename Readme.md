# GraphQL CRUD - Todo App

A full-stack **GraphQL CRUD** application built with **Apollo Server**, **Prisma ORM**, **[Neon (Serverless Postgres)](https://neon.tech)**, and **React**. This project demonstrates how to perform **Create, Read, Update, and Delete** operations using GraphQL mutations and queries.

---

## Tech Stack

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| **Backend**    | [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **GraphQL**    | [Apollo Server 4](https://www.apollographql.com/docs/apollo-server/) via Express |
| **Database**   | [Neon](https://neon.tech) (Serverless PostgreSQL)            |
| **ORM**        | [Prisma](https://www.prisma.io/)                             |
| **Frontend**   | [React 18](https://react.dev/) + [Apollo Client](https://www.apollographql.com/docs/react/) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Neon](https://neon.tech) account (free tier available)

---

## Project Structure

```
GraphQl-crud/
├── Server/                         # Backend (Apollo Server + Prisma)
│   ├── prisma/
│   │   └── schema.prisma          # Database schema definition
│   ├── src/
│   │   ├── GraphQL/
│   │   │   ├── Todo/
│   │   │   │   └── Mutation.ts    # GraphQL mutation resolvers
│   │   │   ├── Resolvers.ts       # Combined resolvers (Query + Mutation)
│   │   │   └── TypeDefs.ts        # GraphQL type definitions
│   │   ├── services/
│   │   │   └── todo.ts            # Business logic (Prisma operations)
│   │   └── index.ts               # Server entry point (Express)
│   ├── package.json
│   └── tsconfig.json
├── client/                        # Frontend (React + Apollo Client)
│   ├── public/
│   └── src/
│       ├── forms/
│       │   └── editTodoForm.js    # Add/Edit todo form
│       ├── table/
│       │   └── todoTable.js       # Todo list table
│       ├── App.js                 # Main app with CRUD logic
│       ├── gql.js                 # GraphQL queries & mutations
│       ├── index.js
│       └── index.css
│   └── package.json
└── Readme.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GraphQl-crud
```

### 2. Set Up Neon Database

1. Go to [console.neon.tech](https://console.neon.tech) and sign up / log in
2. Create a new project (or use an existing one)
3. Go to **Connection Details** and copy the **Connection string** (PostgreSQL)

### 3. Configure Environment Variables

Create a `.env` file in the `Server/` directory:

```env
GraphQl_CRUD_POSTGRES_PRISMA_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

> Replace with your actual Neon connection string from step 2.

### 4. Install Dependencies

```bash
# Install backend dependencies
cd Server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 5. Run Database Migrations

```bash
# From the Server/ directory
npx prisma migrate dev --name init
```

This creates the `todos` table in your Neon database.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the Application

#### Backend (Apollo Server on port 4000)

```bash
cd Server
npm run dev
```

The server starts at **http://localhost:4000/graphql** with Apollo Studio Sandbox.

#### Frontend (React on port 3000)

In a **new terminal**:

```bash
cd client
npm start
```

The React app opens at **http://localhost:3000**.

---

## Database Schema

The `Todo` model is defined in `Server/prisma/schema.prisma`:

```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  Title       String   @map("title")
  Description String   @map("description")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("todos")
}
```

| Column      | Type     | Description                         |
| ----------- | -------- | ----------------------------------- |
| `id`        | Int      | Primary key (auto-increment)        |
| `title`     | String   | Todo title                          |
| `description` | String | Todo description                    |
| `createdAt` | DateTime | Auto-generated creation timestamp   |
| `updatedAt` | DateTime | Auto-updated modification timestamp |

---

## GraphQL API

### Type Definitions

```graphql
type Todo {
  id: Int
  Title: String
  Description: String
}

type Query {
  hello: String
  allTodo: [Todo]
}

type Mutation {
  createTodo(Title: String, Description: String): String!
  deleteTodo(id: Int): String!
  findTodo(id: Int): Todo!
  updateTodo(id: Int, Title: String, Description: String): String!
}
```

---

## How to Add a Todo

### Backend Service

All business logic lives in `Server/src/services/todo.ts`:

```typescript
// Create a todo — insert a new row into the database
static async create(payload: CreateTodoPayload) {
    await prisma.todo.create({ data: payload });
    return 'Todo Created Successfully';
}
```

### GraphQL Mutation

Send this to `POST /graphql`:

```graphql
mutation CreateTodo {
  createTodo(Title: "Buy groceries", Description: "Milk, eggs, bread")
}
```

**Response:**
```json
{ "data": { "createTodo": "Todo Created Successfully" } }
```

### Frontend (React)

The `addTodo` function in `App.js` calls the `CREATE_TODO` mutation:

```javascript
const addTodo = todo => {
    createTodo({variables: { title: todo.Title, description: todo.Description }});
    setTodos([...todos, todo]);
};
```

The form in `EditTodoForm.js` collects **Title** and **Description**, then calls `addTodo` on submit.

---

## How to View Todos

### Backend Service

```typescript
// Get all todos — fetch every row from the database
static async all() {
    return prisma.todo.findMany();
}
```

### GraphQL Query

```graphql
query GetAllTodos {
  allTodo {
    id
    Title
    Description
  }
}
```

**Response:**
```json
{
  "data": {
    "allTodo": [
      { "id": 1, "Title": "Buy groceries", "Description": "Milk, eggs, bread" }
    ]
  }
}
```

### Frontend (React)

`App.js` uses `useQuery(GET_TODOS)` to fetch all todos on mount and stores them in state. The `TodoTable` component renders them as a table with **Edit** and **Delete** buttons.

---

## How to Update a Todo

### Backend Service

```typescript
// Update a todo — find by id, update title & description
static async update(payload: UpdateTodoPayload) {
    const { id, ...data } = payload;
    await prisma.todo.update({ where: { id }, data });
    return 'Todo Updated Successfully';
}
```

### GraphQL Mutation

```graphql
mutation UpdateTodo {
  updateTodo(id: 1, Title: "Buy organic groceries", Description: "Organic milk, eggs, bread")
}
```

**Response:**
```json
{ "data": { "updateTodo": "Todo Updated Successfully" } }
```

### Frontend (React)

1. Click the **Edit** button on a todo row → populates the form with the todo's data
2. Modify the **Title** and/or **Description** fields
3. Click **Update Todo** → calls `updateTodof(id, updatedTodo)` which runs the `UPDATE_TODO` mutation
4. The **Cancel** button resets the form back to "Add" mode

---

## How to Delete a Todo

### Backend Service

```typescript
// Delete a todo — remove a row by id
static async delete(payload: TodoIdPayload) {
    await prisma.todo.delete({ where: { id: payload.id } });
    return 'Todo Deleted Successfully';
}
```

### GraphQL Mutation

```graphql
mutation DeleteTodo {
  deleteTodo(id: 1)
}
```

**Response:**
```json
{ "data": { "deleteTodo": "Todo Deleted Successfully" } }
```

### Frontend (React)

Click the **Delete** button on any todo row → calls `deletetodo(id)` which:
1. Runs the `DELETE_TODO` mutation via Apollo Client
2. Removes the todo from local state so the table updates instantly

---

## Database Migration

### What is a Migration?

A migration updates your Neon database schema to match changes in `schema.prisma`. Run this after editing the Prisma model:

```bash
npx prisma migrate dev --name <migration_name>
```

### Useful Prisma Commands

| Command                                        | Description                                  |
| ---------------------------------------------- | -------------------------------------------- |
| `npx prisma migrate dev --name <name>`         | Create + apply a new migration               |
| `npx prisma migrate dev`                       | Apply pending migrations                     |
| `npx prisma migrate deploy`                    | Apply migrations in production               |
| `npx prisma migrate reset`                     | Drop all tables and re-apply migrations      |
| `npx prisma generate`                          | Regenerate Prisma client after schema change |
| `npx prisma studio`                            | Open browser GUI for your database           |
| `npx prisma db push`                           | Push schema directly (without migration)     |

---

## Available Scripts

### Backend (`Server/`)

| Script        | Command                               | Description                              |
| ------------- | ------------------------------------- | ---------------------------------------- |
| `npm run dev` | `tsc-watch --onSuccess "npm start"`  | Watch files and auto-restart on changes  |
| `npm start`   | `node dist/index.js`                  | Start production build                   |

### Frontend (`client/`)

| Script          | Command                   | Description            |
| --------------- | ------------------------- | ---------------------- |
| `npm start`     | `react-scripts start`     | Start React dev server |
| `npm run build` | `react-scripts build`     | Build for production   |
| `npm test`      | `react-scripts test`      | Run tests              |

---

## Troubleshooting

| Issue                     | Solution                                                        |
| ------------------------- | --------------------------------------------------------------- |
| Prisma client not found   | Run `npx prisma generate` in `Server/`                          |
| Neon connection fails     | Check your `.env` `GraphQl_CRUD_POSTGRES_PRISMA_URL` includes `?sslmode=require`    |
| CORS errors               | The server allows `*` origin — check your fetch URL is correct  |
| Migration fails           | Verify Neon is running (check [console.neon.tech](https://console.neon.tech)) |

---

## References

- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma CRUD Reference](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- [Neon Docs](https://neon.tech/docs)
- [GraphQL Docs](https://graphql.org/learn/)

---

## Project Flow Summary

```
User clicks "Add" / "Edit" / "Delete"
        ↕
React (Apollo Client) sends GraphQL mutation
        ↕
Apollo Server (Express) receives & resolves
        ↕
TodoService runs Prisma CRUD operations
        ↕
Neon Serverless PostgreSQL stores the data
```