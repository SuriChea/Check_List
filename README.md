# Todo List

Todo List is a responsive React + TypeScript frontend backed by an AdonisJS 5 REST API and PostgreSQL. Todo records are stored in the database, so they remain available after refreshing the page.

การบันทึกจริงใช้ Prisma เชื่อมต่อ PostgreSQL; ต้องเปิด PostgreSQL และตั้งค่า `DATABASE_URL` ก่อนเริ่ม API ส่วน frontend mock mode ใช้ทดสอบหน้าจอได้โดยไม่ต้องเปิดฐานข้อมูล

## Requirements

- Node.js 18 or newer and npm
- PostgreSQL 14 or newer

## PostgreSQL

Create a database named `todo_app` and a PostgreSQL user with permission to connect and create tables. Set `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, and `PG_DB_NAME` in `backend/.env`. `DATABASE_URL` is built from those values for Prisma CLI commands.

## Run the API

```powershell
cd backend
npm install
npm run db:push
npm run seed
npm run dev
```

`npm run db:push` syncs `prisma/schema.prisma` with PostgreSQL (the legacy `npm run migration:run` command is retained as an alias). `npm run seed` adds five sample Todo records and can be rerun without duplicating them. `npm install` generates Prisma Client automatically.

## View database with Prisma Studio

Run this from the `backend` directory to open a browser UI for the PostgreSQL database:

```powershell
cd backend
npx prisma studio
```

Prisma Studio opens at `http://localhost:5555`. Select the `Todo` model to view and edit records in the `todos` table.

The API listens on `http://localhost:3333`. Its endpoints are:

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/todos` | List todos |
| POST | `/todos` | Create a todo with `{ "title": "..." }` |
| PUT | `/todos/:id` | Update with `{ "title": "...", "isCompleted": true }` |
| DELETE | `/todos/:id` | Delete a todo |

## Run the frontend

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The frontend defaults to `http://localhost:3333` for its API. To change it, copy `frontend/.env.example` to `frontend/.env` and update `VITE_API_URL`.

The local `frontend/.env.local` connects the UI to the real API. For UI testing without PostgreSQL, set `VITE_USE_MOCK_API=true` there to use five sample todos stored in browser local storage. Restart the Vite dev server after changing environment values.

## Test the API

Import [Todo API.postman_collection.json](postman/Todo%20API.postman_collection.json) into Postman and run the collection in order. The requests test list, create, fresh-read persistence, update/completion, delete, and a final read confirming deletion.

## Build

```powershell
npm --prefix frontend run build
npm --prefix backend run build
```