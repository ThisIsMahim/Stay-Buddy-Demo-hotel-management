# Roadmap

## Phase 1: Core Polish & Consolidation (Current)
*Objective: Unify the design language and stabilize the MVP foundation.*
- [ ] **UI Stabilization**: Sweep across all pages to apply the "Rounded & Polished" aesthetic (consistent with new search cards).
- [/] **Structural Refactoring**: Break down the monolithic `OwnerDashboard.tsx` and `AdminDashboard.tsx` into modular sub-components and hooks. (Completed both)
- [ ] **Feature Gap Analysis**: Conduct a full audit of the booking-to-payment flow to identify any breaking issues or missing logic.
- [ ] **SEO & Performance**: Basic meta-tag optimization and image optimization.

## Phase 2: Guest Experience Enhancement
*Objective: Maximize the "Wow" factor for travelers.*
- [ ] **Advanced Filtering**: Implement filtering by budget, specific amenities, and star ratings.
- [ ] **Interactive Maps**: Integrate map views for easier location-based discovery.
- [ ] **Review System Polish**: Ensure the review/rating UI is as premium as the search results.
- [ ] **Animations**: Add subtle entrance animations and skeleton loaders for all pages.

## Phase 3: Operational Tooling & Scale
*Objective: Deepen the professional tools for owners and admins.*
- [ ] **Dynamic Pricing Enhancements**: Add more intelligence to the owner's pricing engine (e.g., weekend surcharges).
- [ ] **Communication Layer**: Simple notification system or chat between guest and owner.
- [ ] **Financial Reporting**: Exportable reports for owners and platform admins.
- [ ] **PWA Support**: Offline capabilities and "Add to Home Screen" support for mobile users.

## Phase 4: Production Readiness
*Objective: Hardening for real-world traffic.*
- [ ] **Hardening Security**: Review all backend routes for authorization checks and rate limiting.
- [ ] **Comprehensive Testing**: Increase E2E test coverage for the critical path (Booking).
- [ ] **Form Validation Audit**: Ensure all user-facing inputs are strictly validated with Zod.
- [ ] **Deployment Finalization**: Environment parity check and production CI/CD setup.

## Backlog / Future Ideas
- [ ] Multi-currency support.
- [ ] Multi-language expansion (beyond i18next basics).
- [ ] Loyalty points system.
- [ ] AI-powered hotel recommendations.
