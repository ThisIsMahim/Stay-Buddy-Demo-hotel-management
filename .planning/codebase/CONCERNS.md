# Codebase Concerns

## Structural Concerns
- **Fat Components**: The dashboard files (`OwnerDashboard.tsx`, `AdminDashboard.tsx`) are extremely large (up to 164KB/2600+ lines). This makes them difficult to maintain, test, and reason about. Logic should be extracted into hooks or smaller sub-components.
- **Dependency Entanglement**: The root `package.json` contains some backend-specific libraries (`firebase-admin`, `mongodb`, `node-cron`, `nodemailer`) while the `backend/` directory has its own `package.json`. It's unclear which logic stays where, or if the root is meant to be a monorepo manager or a second server.
- **Mixed Module Systems**: Frontend uses ESM while Backend uses CommonJS. This is standard but can lead to confusion if code sharing is attempted.

## Technical Debt
- **Low Test Coverage**: Minimal tests found in the codebase.
- **ESLint Rule Slack**: `@typescript-eslint/no-unused-vars` is explicitly turned `off`, which can lead to dead code accumulation.
- **Service Layer Complexity**: API integration is centralized but might grow unmanageably if not partitioned by feature.

## Security & Reliability
- **CORS Configuration**: `origin: true` in production might be too permissive.
- **Environment Variables**: Heavy reliance on `.env` files without explicit validation (e.g., using `dotenv-safe` or Zod-validated envs).
- **Backend Validation**: Need to ensure all backend routes verify the Clerk token/session before acting on sensitive data.

## Future Scaling
- **Prop Drilling**: Large dashboard components likely suffer from deep prop drilling or excessive local state. Consideration for a more formal global state manager (Zustand/Redux) or more effective context usage might be needed as features grow.
