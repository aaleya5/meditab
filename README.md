# Marketing Agency Project Management Prototype

A fullstack React + Node.js prototype for a marketing agency project management system.

## Architecture
- `server/` — Node.js + Express backend that serves seed campaign data via `/api/seed`.
- `client/` — React app powered by Vite with campaign/task management, workload analytics, and client dashboards.
- Local persistence is implemented in the browser using `localStorage`.

## Features
- Campaigns view with status, deadlines, owners, and progress.
- In-campaign task management with assignee, due date, priority, and status.
- Team workload view with per-person task counts and capacity indicators.
- Client dashboard with a read-only-style summary for client-facing visibility.
- Backend seed API and front-end localStorage persistence.

## Setup
From the workspace root:

```bash
npm install
npm run dev
```

The React client runs on `http://localhost:3000` and the Express API runs on `http://localhost:4000`.

If you prefer separate installs:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## Notes
- The browser stores campaign and task state locally, so refreshes preserve your data.
- The server provides baseline seed data for first-time visitors.
- This project demonstrates a proper React front-end and Node.js back-end architecture.
