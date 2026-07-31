# Requirements

## 1. Visual & Aesthetic Requirements
- **Rounded Corners**: All cards, containers, buttons, and sections must use consistent, generous border-radius (e.g., `rounded-2xl` to `rounded-[32px]`).
- **Premium Design System**: Use high-end typography (e.g., Inter/Outfit), smooth gradients, glassmorphism (backdrop-blur), and subtle micro-animations (Framer Motion).
- **Interactive Feedback**: All user actions (hovers, clicks, transitions) must provide visual confirmation.
- **Consistency**: The "Highly Polished" look applied to the Search Results must be propagated to all Dashboards and static pages.

## 2. Feature Requirements

### Guest Experience
- **Discovery**: Fast, filterable hotel search with "highly polished" cards.
- **Property Details**: Informative detail pages with image carousels, maps, and amenity lists.
- **Booking Flow**: Frictionless checkout process with clear pricing and availability.
- **Wishlist**: Save/Unsave properties with persistent state.
- **User Profile**: Management of bookings and personal preferences.

### Owner Management
- **Dashboard**: High-density analytics, recent bookings, and revenue stats.
- **Inventory**: Full control over hotels and room archetypes.
- **Operational Tools**: Occupancy calendar, housekeeping task management, and pricing control.
- **Financials**: Wallet management and transaction history.

### Admin Oversight
- **Global Control**: Oversight over all users, hotels, and bookings.
- **Quality Control**: Red-marking/flagging and verification status for properties.
- **Dispute Resolution**: Complaint management system with status tracking.

## 3. Technical Requirements
- **Modularity**: Codebase must be broken down into small, reusable components (refactoring "Fat Components").
- **Scalability**: Architecture must support future third-party integrations (Payment APIs, Maps, etc.).
- **Readability**: Code must be well-documented and follow strict TypeScript types for AI-friendliness.
- **Performance**: Optimized asset loading and efficient React Query caching.

## 4. Stability & Polish (MVP Goal)
- Full end-to-end testing of the booking flow.
- Validation of all form inputs (Zod).
- Error boundary implementation and custom "NotFound" / "Error" states.
