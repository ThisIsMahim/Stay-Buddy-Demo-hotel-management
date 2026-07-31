# Testing Strategy

## Frameworks
- **Runner**: Vitest
- **Frontend Utilities**: React Testing Library, `@testing-library/jest-dom`
- **Backend Testing**: Currently no explicit backend test suite found (no `test/` in `backend/`).

## Patterns
- **Unit Tests**: Focus on utility functions and individual UI components (e.g., `src/test/example.test.ts`).
- **Integration Tests**: React Testing Library usage in `src/` to test component interactions.
- **Setup**: `src/test/setup.ts` initializes the JSDOM environment and jest-dom matchers.

## Execution
- **Commands**: 
  - `npm test`: Runs vitest once.
  - `npm run test:watch`: Runs vitest in watch mode.

## State of Testing
- **Coverage**: Likely low, only example tests visible in the main directory.
- **Automation**: Vitest integrated into the CI/CD pipeline (implied by Vite setup).
