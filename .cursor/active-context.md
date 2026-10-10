> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `backend\.env` (Domain: **Config/Infrastructure**)

### 🔴 Config/Infrastructure Gotchas
- **Low cohesion detected in Domain Cluster 1**: Cluster 1 (13 nodes) has a very low cohesion score (0.08). This suggests the community is a "spaghetti" module containing unrelated logic that should be separated into cleaner domain boundaries.

### 📐 Config/Infrastructure Conventions & Fixes
- **[discovery] 13 potentially unused files detected**: These files are not imported by any other file in the codebase and may be dead code:
  • use-toast.ts
  • use-advanced-memo.ts
  • use-toast.ts
  • useauth.ts
  • i18n.ts
  • utils.ts
  • api.ts
  • mockbackend.ts
  • offline-sync.ts
  • setup.ts
  • tailwind.config.ts
  • vite.config.ts
  • vitest.config.ts

Consider verifying if they are entry points, dynamically required, or can be safely removed.
