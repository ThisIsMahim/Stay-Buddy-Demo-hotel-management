# Directory Structure

```text
stay-buddy/
├── .agent/                 # Agent-specific configurations and skills
├── backend/                # Express + Node.js API
│   ├── config/             # DB and service configurations
│   ├── middleware/         # Auth, validation, error handlers
│   ├── models/             # Mongoose/MongoDB schemas
│   ├── routes/             # API endpoint definitions
│   ├── utils/              # Helper utilities (Cloudinary, etc.)
│   ├── server.js           # API entry point
│   └── seed.js             # DB seeding scripts
├── public/                 # Static assets (images, favicon)
├── src/                    # React Frontend (TypeScript)
│   ├── assets/             # Images and local binary assets
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   └── ...             # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries (e.g., utils.ts for tailwind-merge)
│   ├── pages/              # Route components
│   ├── services/           # API service classes (api.ts)
│   ├── test/               # Test suites and setup
│   ├── App.tsx             # Main App component & routing
│   ├── main.tsx            # React entry point
│   └── i18n.ts             # Localization configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── package.json            # Main project metadata & dependencies
└── bun.lockb               # Bun lockfile
```

## Significant Files
- `src/pages/OwnerDashboard.tsx`: Largest file in the project, complex property management UI.
- `src/pages/AdminDashboard.tsx`: Core administrative control panel.
- `src/services/api.ts`: Centralized data fetching service.
- `backend/server.js`: Orchestrates the entire API layer.
