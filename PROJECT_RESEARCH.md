# Stay-Buddy Project Research & Overview

## 1. Technology Stack
**Frontend:**
- **Core:** React 18 (Vite), TypeScript
- **Styling & UI:** Tailwind CSS, Shadcn UI (Radix UI), Framer Motion, Lucide React
- **State Management & Routing:** React Router Dom, TanStack React Query
- **Others:** i18next (Multi-language Support), React Hook Form & Zod, Firebase, Date-fns

**Backend:**
- **Core:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Token (JWT) & Bcrypt.js
- **File Uploads:** Multer & Cloudinary
- **Others:** Nodemailer, Node-cron, Cors, Morgan

## 2. Core Modules

### 🏨 Customer Panel (User App/Website)
- **Pages:** `Index.tsx`, `HotelSearch.tsx`, `Booking.tsx`, `CheckoutPage.tsx`, `PropertyDetails.tsx`, `UserDashboard.tsx`
- **Features:**
  - Location and Google Maps based hotel search.
  - Advanced filters (Room type, Budget, Star rating).
  - Real-time room booking & checkout.
  - Extra service bookings (Gym, Spa, Airport Pickup).
  - User dashboard, booking history, favorites, review & rating.

### 🏢 Hotel Owner Panel
- **Pages:** `OwnerDashboard.tsx`, `OwnerLogin.tsx`
- **Features:**
  - Hotel verification & subscription management.
  - Room & pricing management.
  - Online & offline booking tracking.
  - Monthly revenue tracking (Anti-Theft).
  - Direct payment gateway.

### ⚙️ Super Admin Panel
- **Pages:** `AdminDashboard.tsx`, `AdminLogin.tsx`
- **Features:**
  - User & vendor control (Block, Unblock, Suspend).
  - Hotel owner verification (NID & Documents).
  - Centralized complaint management and direct messaging.

## 3. Directory Structure Overview

### Frontend (`src/`)
- **`components/`**: Reusable components (`Header`, `Footer`, `HeroSection`, `SearchBar`, `PropertyGrid`, `AuthModal`, etc.).
- **`pages/`**: Main application views (Login, Signup, Dashboards, Booking Pages).
- **`context/` & `hooks/`**: Global state management and custom hooks.
- **`i18n.ts`**: Language configuration for English and Bengali.

### Backend (`backend/`)
- **`models/`**: Database schemas (`User.js`, `Hotel.js`, `Room.js`, `Booking.js`, `Complaint.js`, etc.).
- **`routes/`**: API Endpoints (`authRoutes.js`, `hotelRoutes.js`, `bookingRoutes.js`, `adminRoutes.js`, etc.).
- **`middleware/`**: Authentication and error handling logic.
- **`server.js`**: Main entry point for the Express backend.

---
*This file was generated based on the current state of the Stay-Buddy codebase.*
