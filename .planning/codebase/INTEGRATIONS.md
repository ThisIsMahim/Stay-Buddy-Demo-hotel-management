# Integrations

## External Services

### Clerk
- **Purpose**: User authentication, session management, and user profiles.
- **Library**: `@clerk/react`
- **Frontend Usage**: Wrap the app with `<ClerkProvider>`, use `useUser` and `useAuth` hooks.

### MongoDB (via Mongoose)
- **Purpose**: Primary database for hotels, rooms, bookings, reviews, and user metadata.
- **Connection**: Managed in the `backend/` directory using Mongoose models.

### Cloudinary
- **Purpose**: Image hosting for hotel photos, room images, and user avatars.
- **Integration**: `multer-storage-cloudinary` in the backend for direct uploads.

### Firebase / Firebase Admin
- **Purpose**: Potentially used for messaging, background tasks, or secondary data storage (as seen in root `package.json`).
- **Status**: Needs verification on active usage vs. legacy.

### Nodemailer
- **Purpose**: Sending transactional emails (booking confirmations, welcome emails).
- **Library**: `nodemailer`

### Node Cron
- **Purpose**: Background jobs (e.g., automated status updates, reminder emails).
- **Library**: `node-cron`

### Google Maps (Shortened URLs)
- **Purpose**: Handling and expanding Google Maps short URLs for location data.
- **Library**: `gmaps-expand-shorturl`

## Internal APIs
- **Base URL**: Typically Proxy/Direct to `backend/server.js`.
- **Protocol**: RESTful JSON API.
