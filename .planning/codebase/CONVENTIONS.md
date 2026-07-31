# Coding Conventions

## Language & Tooling
- **Strictness**: TypeScript used throughout the frontend. ESLint is configured with `recommended` rules for JS and TS.
- **Language Level**: ES2020+.

## Frontend Conventions
- **Components**: Functional components only. PascalCase file naming (e.g., `HotelCard.tsx`).
- **Styling**: Tailwind CSS for all styling. No CSS modules or Styled Components observed.
- **State**: Prefer TanStack Query for server-side state. Use React `useState`/`useContext` for local/global UI state.
- **Icons**: Standardized on Lucide React.
- **File Organization**:
  - `pages/` for route-level components.
  - `components/` for smaller units.
  - `services/` for API abstraction.

## Backend Conventions
- **Module System**: CommonJS (`require`/`module.exports`).
- **Structure**: Route -> Model pattern.
- **Error Handling**: Centralized error handling middleware in `server.js`.
- **Naming**: camelCase for routes and utilities.

## General
- **Naming**: Descriptive and semantic naming for variables and functions.
- **Type Safety**: Prefer explicit types where possible, though some `any` usages might exist in complex dashboard logic.
- **Environment**: Environment variables used for secrets and configurations (`.env`).
