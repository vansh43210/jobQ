# JobQ — Job Queue Management & Monitoring System

## Core Problems Solved

1. **State Transition Integrity**: In distributed or asynchronous systems, invalid job state transitions (such as moving from `completed` back to `pending`, or `pending` directly to `completed`) lead to race conditions and inconsistent job records. JobQ enforces strict state machine validation at both the middleware and frontend layers.
2. **Operational Visibility**: Provides instant aggregate metrics across all job states (`Total`, `Pending`, `Running`, `Completed`, `Failed`) alongside a granular tabular view of every job.
3. **Safe Queue Administration**: Enables operators to create new jobs, transition statuses safely according to allowed workflows, and delete obsolete jobs with immediate UI reflection.

---

## Architecture Overview

```
jobQ/
├── backend/                     # NestJS REST API + Drizzle ORM
│   └── src/
│       ├── db/                  # Database connection & Drizzle schemas
│       │   └── schemas/         # PostgreSQL schema definition (jobsTable)
│       ├── jobs/                # Jobs feature module (controller, service)
│       ├── validate-status/     # Middleware validating transition state machines
│       └── main.ts              # Application bootstrap & CORS configuration
│
└── frontend/                    # React 19 + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── App.tsx              # Root coordinator & state synchronization
        ├── jobcomponent.tsx     # Metrics dashboard (status counters)
        └── jobsHandler.tsx      # Table management, status transitions, creation modal
```

### 1. Backend Architecture (NestJS + Drizzle ORM + PostgreSQL)
- **Framework**: NestJS (modular architecture with dependency injection).
- **Database Access**: Drizzle ORM connected to PostgreSQL via `postgres-js`.
- **Validation Middleware (`ValidateStatusMiddleware`)**:
  Interceps `PATCH /jobs/:id/status` requests and validates:
  - Current status and requested status belong to valid enum values (`pending`, `running`, `completed`, `failed`).
  - Transition matches one of the allowed paths:
    - `pending` → `running`
    - `running` → `completed`
    - `running` → `failed`
- **Database Schema (`jobsTable`)**:
  - `job_id`: Auto-incrementing primary key.
  - `job_title`: Title / description of the task.
  - `type`: Job category (e.g. `Batch`, `Scheduled`, `On-demand`).
  - `status`: Enum type (`pending`, `running`, `completed`, `failed`), defaulting to `pending`.
  - `createdAt`: Timestamp with default now.

### 2. Frontend Architecture (React + Vite + Tailwind CSS)
- **Data Flow**: `JobsHandler` owns API interactions (fetching, status updates, deletion, creation) and communicates state changes upwards via the `onJobsChange` callback. `App.tsx` relays this data down to `JobComponent` for synchronized counter updates.
- **Dynamic State Machine UI**: The status dropdown in the table dynamically computes allowed transitions per job row, preventing invalid client-side actions.
- **Inline Modal**: A lightweight stateful creation popover positioned next to the "Create Job" button for rapid workflow creation without page reloads.
- **Defensive UI Rendering**: Gracefully handles empty queues, loading spinners, and date formatting.

---

## Allowed State Machine Transitions

| Current Status | Allowed Next Statuses | Description |
|---|---|---|
| `pending` | `running` | Job picked up by worker |
| `running` | `completed`, `failed` | Execution finished or encountered error |
| `completed` | *None* | Terminal success state |
| `failed` | *None* | Terminal failure state |

---

## API Reference

### 1. Fetch All Jobs
- **Method**: `GET`
- **Path**: `/jobs`
- **Response**: `200 OK`
  ```json
  [
    {
      "job_id": 1,
      "job_title": "Image Resize Pipeline",
      "type": "Batch",
      "status": "completed",
      "createdAt": "2026-09-16T14:30:00.000Z"
    }
  ]
  ```

### 2. Create Job
- **Method**: `POST`
- **Path**: `/jobs`
- **Request Body**:
  ```json
  {
    "data": {
      "jobTitle": "Email Notification Sender",
      "jobType": "Scheduled"
    }
  }
  ```
- **Response**: `201 Created`

### 3. Update Job Status
- **Method**: `PATCH`
- **Path**: `/jobs/:id/status`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "currentStatus": "pending",
    "requestedStatus": "running"
  }
  ```
- **Response**: `200 OK` (or `400 Bad Request` if transition is illegal)

### 4. Delete Job
- **Method**: `DELETE`
- **Path**: `/jobs/:id`
- **Response**: `200 OK`

---

## Getting Started & Setup Instructions

### Prerequisites
- Node.js (v18+) or Bun
- PostgreSQL database instance

---

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or npm install
   ```

3. **Configure Environment Variables**:
   Create or verify a `.env` file in `backend/`:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
   ```

4. **Generate / Push Database Schema**:
   ```bash
   bunx drizzle-kit push
   # or npx drizzle-kit push
   ```

5. **Start the Backend Server**:
   ```bash
   bun run start:dev
   # or npm run start:dev
   ```
   The backend API will run on `http://localhost:3000`.

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or npm install
   ```

3. **Run Development Server**:
   ```bash
   bun run dev
   # or npm run dev
   ```
   The frontend application will run on `http://localhost:5173` (or the port specified by Vite).

---

## Verification & Testing

- Access the frontend dashboard in your browser.
- Use **+ Create Job** to add jobs with custom titles and types.
- Check that the metrics cards at the top immediately reflect the total and pending count.
- Change the status of a job from `Pending` to `Running`, then to `Completed` or `Failed`.
- Confirm terminal states (`Completed`, `Failed`) do not allow invalid transitions.
- Delete a job and observe that both the table and counter cards update instantly.
