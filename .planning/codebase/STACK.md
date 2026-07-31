# Tech Stack

## Core
- **Frontend Framework**: React 18.3 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI (Radix UI)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM (v6)
- **Backend Framework**: Node.js with Express
- **Database**: MongoDB (via Mongoose)

## Authentication & Authorization
- **Identity Provider**: Clerk (@clerk/react)

## UI Components & Icons
- **UI Library**: Radix UI (via Shadcn)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Modals/Drawers**: Vaul, Radix Dialog
- **Charts**: Recharts

## Data Handling & Validation
- **Schema Validation**: Zod
- **Forms**: React Hook Form with Zod resolver
- **API Client**: Fetch (assumed, or native fetch)

## Utilities
- **Date Management**: date-fns
- **Localization**: i18next, react-i18next
- **Class Merging**: tailwind-merge, clsx, class-variance-authority

## Media
- **Storage**: Cloudinary
- **Handling**: Multer, multer-storage-cloudinary

## Infrastructure & Dev Tools
- **Runtime Manager**: Bun (indicated by bun.lockb, though package.json exists)
- **Linter**: ESLint
- **Formatter**: PostCSS, Autoprefixer
- **Type Checking**: TypeScript
- **Task Scheduling**: Node Cron (in root package.json)
- **Mailing**: Nodemailer
