# Plan: Phase 1.2 — Admin Dashboard Decomposition

## Goal
Refactor the monolithic `AdminDashboard.tsx` (~1360 lines) into a modular, maintainable structure by extracting sub-components and panels, following the successful pattern used for `OwnerDashboard.tsx`.

## Analysis of `AdminDashboard.tsx`
The file currently contains:
1. **Auth & Role Guard**: Clerk integration and ensures role is "ADMIN".
2. **Dashboard Shell**: Sidebar navigation and mobile overlay.
3. **Core State**: Large state block for stats, users, hotels, bookings, complaints, notifications, and experiences.
4. **Feature Panels & Components** (currently defined in the same file):
   - `UserManagementPanel`
   - `HotelManagementPanel`
   - `ExperienceManagementPanel`
   - `StatCard`
   - `Badge`
   - `ActionBtn`
   - Tab-specific content (Stats, Bookings, Complaints, Notifications)

## Proposed Structure
We will move everything into `src/pages/admin/`.

```text
src/pages/admin/
├── components/           # Shared components (StatCard, Badge, etc.)
│   ├── AdminSidebar.tsx
│   ├── AdminTopBar.tsx   # To be created (currently integrated in AdminDashboard)
│   ├── AdminModals.tsx   # For AddOwnerModal, ConfirmModal, etc.
│   └── AdminUIElements.tsx # StatCard, Badge, ActionBtn
├── panels/               # Tab-specific panels
│   ├── StatsPanel.tsx
│   ├── UserManagementPanel.tsx
│   ├── HotelManagementPanel.tsx
│   ├── BookingsPanel.tsx
│   ├── ComplaintsPanel.tsx
│   ├── ExperienceManagementPanel.tsx
│   └── NotificationsPanel.tsx
└── hooks/                # (Optional) For data fetching/management
```

## Step-by-Step Execution

### Step 1: Create Directory Structure
- Create `src/pages/admin/components/` and `src/pages/admin/panels/`.

### Step 2: Extract Shared UI Components
- Move `StatCard`, `Badge`, `ActionBtn`, and `Loading` to `src/pages/admin/components/AdminUIElements.tsx`.
- Create `src/pages/admin/components/AdminModals.tsx` and move `AddOwnerModal`, `OwnerInsightModal`, etc.

### Step 3: Extract Sidebar & Shell
- Move the sidebar logic to `src/pages/admin/components/AdminSidebar.tsx`.

### Step 4: Extract Panels
- Extract each tab's content into its own panel file in `src/pages/admin/panels/`.
- Ensure all imports (lucide icons, api services) are correctly mapped.

### Step 5: Update `AdminDashboard.tsx`
- Refactor the main file to be a clean orchestrator.

## Verification
- [ ] No regressions in admin functionality.
- [ ] Role guarding remains strict.
- [ ] All tab transitions work smoothly.
- [ ] CRUD operations (Verify Hotel, Block User, Resolve Complaint) still functional.
