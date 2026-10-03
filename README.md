# Todo List

Todo List is a responsive React + TypeScript frontend backed by an AdonisJS 5 REST API and PostgreSQL. Todo records are stored in the database, so they remain available after refreshing the page.

ยังทำไม่ได้ตอนนี้: บันทึกลง PostgreSQL หรือทดสอบ API จริงผ่าน Postman เพราะ PostgreSQL/backend ยังไม่ทำงาน ต้องเปิดฐานข้อมูล รัน migration และ start backend ก่อน

## Requirements

- Node.js 18 or newer and npm
- PostgreSQL 14 or newer

## PostgreSQL

Create a database named `todo_app` and a PostgreSQL user with permission to connect and create tables. The sample backend environment expects `postgres` / `postgres`; change these values in `backend/.env` to match your local PostgreSQL setup.

## Run the API

```powershell
cd backend
npm install
npm run migration:run
npm run seed
npm run dev
```

`npm run seed` เพิ่ม Todo ตัวอย่าง 5 รายการให้หน้าเว็บ โดยใช้ชื่อรายการเป็น key จึงรันซ้ำได้โดยไม่สร้างรายการซ้ำ

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

For UI testing without PostgreSQL, `frontend/.env.local` enables mock mode with five sample todos stored in browser local storage. Restart the Vite dev server after changing environment values. To use the real API, set `VITE_USE_MOCK_API=false` in `frontend/.env.local` (or remove that local file).

## Test the API

Import [Todo API.postman_collection.json](postman/Todo%20API.postman_collection.json) into Postman and run the collection in order. The requests test list, create, fresh-read persistence, update/completion, delete, and a final read confirming deletion.

## Build

```powershell
npm --prefix frontend run build
npm --prefix backend run build
```