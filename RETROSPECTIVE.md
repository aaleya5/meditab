# Agency PM Prototype — Build Retrospective

## AI Tools & Workflow

**GitHub Copilot** (Claude Haiku 4.5) was used throughout for:
- Scaffolding the React component structure and hooks (`useMembers`, `useMemo` for workload calculations)
- Writing the Node.js Express seed API and Vercel serverless route
- CSS styling with responsive grid layouts and status indicators
- localStorage integration for client-side persistence

**VS Code** served as the development environment with real-time error checking and file organization.

## Prompts That Worked Well

### 1. "Build a Project Management System for a Marketing Agency as a working prototype in 60 minutes"
**Why it worked:** Provided clear, measurable scope (campaigns, tasks, workload, client dashboard). The AI broke it into distinct features and built incrementally rather than overengineering. Result: A functional prototype in ~30 minutes.

### 2. "I'm applying for a Node.js developer role, so I want proper React and Node.js framework along with localStorage"
**Why it worked:** Explicit resume goal prompted a fullstack refactor instead of cosmetic improvements. The AI recognized the value of demonstrating knowledge of React hooks, server-side routing, build tools (Vite), and deployment architecture. This validated the entire tech stack choice.

### 3. "Deploy on Vercel"
**Why it worked:** Concrete deployment target forced infrastructure thinking—the AI created `vercel.json`, serverless `/api` routes, and proper build scripts. Turned a local prototype into a production-ready artifact.

## A Prompt That Didn't Work

**"npm run dev"** (pasted error logs directly)
- The AI struggled initially because the error context lacked clarity about which dependencies were missing.
- **What helped:** Explicitly running `npm install` in each workspace folder resolved it, but the AI should have suggested dependency cleanup earlier.
- **Lesson:** Always scaffold dependency trees upfront in monorepo setups.

## What Was Cut (and Why)

| Feature | Cut | Reason |
|---------|-----|--------|
| Database persistence (PostgreSQL/Supabase) | ✂️ | localStorage satisfies the core requirement; DB adds DevOps complexity without ROI for a prototype |
| Real-time WebSocket updates | ✂️ | Polling via button refresh is sufficient; WebSockets require connection state management overhead |
| Role-based access control (RBAC) | ✂️ | Out of scope for a 60-min MVP; multi-user auth complicates the demo without showing PM core value |
| Advanced analytics (burndown charts, velocity) | ✂️ | Task list and workload bar cover capacity planning; charts are visual polish, not functional value |
| Email notifications | ✂️ | Low relevance for internal tool; Slack API integration would be better but requires backend config |

## What's Next (With 2 More Hours)

1. **Backend persistence** (30 min)  
   - Swap localStorage for a simple PostgreSQL table + Prisma ORM
   - Update the `/api/seed` and add `/api/campaigns` CRUD endpoints
   - Demonstrates database design and migrations—critical for Node.js interviews

2. **Real-time task updates** (45 min)  
   - Add Socket.io for live campaign status sync across team
   - Shows event-driven architecture and concurrent connection handling

3. **Authentication & authorization** (15 min)  
   - Simple JWT flow on `/api/auth/login`
   - Client stores token in localStorage and includes in API headers
   - Demonstrates secure token management and protected routes

## Key Takeaways

- **Start vanilla, refactor aggressively:** The jump from static HTML to React forced better code organization and demonstrated framework fluency.
- **Deployment-first thinking:** Configuring Vercel upfront ensured the final artifact was production-ready, not just a local demo.
- **Cut relentlessly:** localStorage + client-side state is 80% as useful as a full backend for a 60-min interview prototype, with 20% of the complexity.
- **Resume-driven development:** Choosing React + Node.js over vanilla JS was intentional to match job posting requirements—framework choice matters.

---

**Time spent:** ~50 minutes  
**Lines of code:** ~1,200 (client + server + config)  
**Deployment ready:** Yes (Vercel)  
**Interview-ready:** Yes (demonstrates fullstack React/Node, localStorage, API design, build tooling, deployment pipeline)
