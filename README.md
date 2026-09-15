# DevOps Task Manager

A simple full-stack task management application, built as the application
layer for a DevOps learning project (Docker, Jenkins, Kubernetes,
Prometheus, and Grafana are added separately on top of this codebase).

## Description

A minimal task manager where users can create, view, edit, delete, and
mark tasks as completed. Deliberately kept simple — no authentication, no
complex state management — so the focus can stay on infrastructure and
deployment concerns.

## Architecture

```text
Frontend (React + Vite)
        |
        | HTTP REST API (JSON)
        v
Backend (Node.js + Express)
        |
        | Mongoose
        v
MongoDB
```

- **Frontend**: React (Vite, functional components + hooks, Axios)
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB via Mongoose

## Repository Structure

```text
devops-task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/       # TaskForm, TaskList, TaskItem
│   │   ├── services/         # api.js (Axios client)
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/Task.js
│   │   ├── controllers/taskController.js
│   │   ├── routes/taskRoutes.js
│   │   ├── middleware/validateTask.js
│   │   ├── middleware/errorHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/task.test.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB (installed locally, or available via a container/managed instance)

## Installation

Clone the repository, then install dependencies for each part separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and adjust as needed:

```text
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devops-task-manager
FRONTEND_URL=http://localhost:5173
```

- `PORT` — port the Express server listens on.
- `MONGODB_URI` — full MongoDB connection string. Never hardcode
  hostnames, credentials, or database names in code — always read them
  from this variable.
- `FRONTEND_URL` — origin allowed by CORS.

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

- `VITE_API_BASE_URL` — base URL the frontend uses to reach the backend
  API. When you later containerize or deploy to Kubernetes, change this
  value to point at the backend service (e.g. a Kubernetes Service DNS
  name, an Ingress hostname, or a load balancer URL) — either by
  rebuilding the frontend with a different `.env` at build time, or by
  injecting it at container startup via an entrypoint script that writes
  a small runtime-config file. No application code changes are needed.

## Running Locally (no Docker)

1. **Start MongoDB locally** (example using a local install):

   ```bash
   mongod --dbpath /path/to/your/data/directory
   ```

   (Or use any local MongoDB instance already running on
   `localhost:27017`.)

2. **Start the backend**:

   ```bash
   cd backend
   npm install
   cp .env.example .env   # then edit if needed
   npm run dev             # or: npm start
   ```

   The API will be available at `http://localhost:5000`.

3. **Start the frontend** (in a separate terminal):

   ```bash
   cd frontend
   npm install
   cp .env.example .env   # then edit if needed
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                  | Description                     |
|--------|----------------------------|----------------------------------|
| GET    | `/health`                 | Health check                    |
| GET    | `/api/tasks`              | Get all tasks                   |
| GET    | `/api/tasks/:id`          | Get a single task by ID         |
| POST   | `/api/tasks`              | Create a new task               |
| PUT    | `/api/tasks/:id`          | Update a task                   |
| DELETE | `/api/tasks/:id`          | Delete a task                   |
| PATCH  | `/api/tasks/:id/status`   | Update only a task's status     |

**Task object shape:**

```json
{
  "_id": "665f1c2e8f1b2c0012a3b456",
  "title": "Write documentation",
  "description": "Draft the README for the project",
  "status": "pending",
  "createdAt": "2024-06-04T10:00:00.000Z",
  "updatedAt": "2024-06-04T10:00:00.000Z"
}
```

## Testing

Backend tests use **Jest** and **Supertest**, with **mongodb-memory-server**
to spin up an in-memory MongoDB instance — no real database connection or
network access is required to run them.

```bash
cd backend
npm test
```

Tests cover:

- `GET /health`
- Creating a task (including a validation failure case)
- Getting all tasks
- Getting a task by ID (including a 404 case)
- Updating a task
- Updating a task's status
- Deleting a task
