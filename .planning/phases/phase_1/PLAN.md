# Plan: Phase 1.1 — Owner Dashboard Decomposition

## Goal
Refactor the monolithic `OwnerDashboard.tsx` (2600+ lines) into a modular, maintainable structure by extracting sub-components and shared logic.

## Analysis of `OwnerDashboard.tsx`
The file currently handles:
1.  **Auth & Access Guard**: Clerk integration and role-based access checks.
2.  **Global UI Shell**: Sidebar, TopBar, and Navigation.
3.  **State Management**: Complex state for bookings, rooms, wallet, housekeeping, and notifications.
4.  **Feature Panels**:
    - Analytics (Dashboard overview)
    - Bookings Manager
    - Room Manager
    - Availability Calendar
    - Housekeeping Dashboard
    - Wallet & Transactions
    - Dynamic Pricing
    - Guest CRM
    - System Notifications
    - Property Settings

## Proposed Structure
We will move the panels into a new directory: `src/pages/owner/`.

```text
src/pages/owner/
├── components/           # Shared components specific to owner dashboard
│   ├── OwnerSidebar.tsx
│   ├── OwnerTopBar.tsx
│   └── StatCard.tsx
├── panels/               # Feature-specific panels
│   ├── AnalyticsPanel.tsx
│   ├── BookingsPanel.tsx
│   ├── RoomsPanel.tsx
│   ├── CalendarPanel.tsx
│   ├── HousekeepingPanel.tsx
│   ├── WalletPanel.tsx
│   ├── PricingPanel.tsx
│   ├── GuestsPanel.tsx
│   └── SettingsPanel.tsx
└── hooks/                # Custom hooks for owner logic
    └── useOwnerData.ts
```

## Step-by-Step Execution

### Step 1: Create Directory Structure
- Create `src/pages/owner/` and its subdirectories.

### Step 2: Extract Shared UI Components
- Extract `StatCard`, `Badge`, `ActionBtn`, and specific modal layouts into `src/pages/owner/components/`.

### Step 3: Extract Shell Components
- Extract `Sidebar` and `TopBar` logic.

### Step 4: Extract Panels (Incrementally)
- Move each tab content into its own `Panel` component.
- Pass necessary props (data, loading states, update functions).

### Step 5: Consolidate State into a Custom Hook (Optional but Recommended)
- Move the massive `useEffect` and `useState` block into `useOwnerData`.

### Step 6: Update `OwnerDashboard.tsx`
- The main file will become a clean orchestrator that renders the shell and switches between panels based on the `tab` state.

## Verification
- [ ] No regressions in dashboard functionality.
- [ ] Proper loading states maintained during transition.
- [ ] TypeScript types remain consistent.
