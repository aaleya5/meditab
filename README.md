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

The React client runs on `http://localhost:3000` (or `3001` if the port is occupied) and the Express API runs on `http://localhost:4000`.

### Vercel deployment
This repository is configured for Vercel deployment with a static React build and a serverless `/api/seed` route.

To deploy:

```bash
vercel login
vercel
```

Vercel will use `vercel.json` and the root `package.json` scripts. The static site is built from `client/dist` and the API route is served from `api/seed.js`.

If you prefer separate installs locally:

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
