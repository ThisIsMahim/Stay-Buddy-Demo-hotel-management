# Architecture

## System Overview
Stay Buddy is a full-stack web application for hotel management, booking, and user interactions. It follows a decoupled Client-Server architecture.

## Frontend Architecture
- **Paradigm**: Component-based UI using React.
- **Organization**:
  - `src/pages/`: Route-level components. Many are "Fat Components" (e.g., `OwnerDashboard.tsx`, `AdminDashboard.tsx`) containing significant business logic.
  - `src/components/`: Reusable UI elements and complex widgets.
    - `src/components/ui/`: Atomic Shadcn/Radix components.
  - `src/services/`: Data fetching layer (e.g., `api.ts`).
  - `src/hooks/`: Custom React hooks for shared logic.
- **State Management**: Mixed approach.
  - Server state: TanStack Query (React Query).
  - Local state: React `useState`/`useEffect`.
- **Styling**: Atomic and utility-first using Tailwind CSS.
- **Routing**: Client-side routing via `react-router-dom`.

## Backend Architecture
- **Paradigm**: RESTful API using Node.js and Express.
- **Structure**:
  - `backend/server.js`: Entry point and middleware configuration.
  - `backend/routes/`: Route definitions mapping HTTP endpoints to logic.
  - `backend/models/`: Mongoose schemas defining MongoDB data structure.
  - `backend/middleware/`: Reusable request handlers (auth, error handling).
  - `backend/utils/`: Helper functions and configurations.
- **Database**: Document-oriented storage with MongoDB.
- **Communication**: JSON over HTTP. CORS enabled for frontend communication.

## Cross-Cutting Concerns
- **Authentication**: Offloaded to Clerk. Frontend uses Clerk SDK; Backend likely verifies Clerk sessions/tokens.
- **Media Storage**: Cloudinary for image management.
- **Scheduling**: Node-cron for background jobs.
