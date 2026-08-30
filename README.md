# Redef & Focas Director Board

Organization news site. A single admin can post text/photo/video updates and manage the
organization's public details. Anyone visiting the site can view posts, like them, and leave
comments — only the admin can create or delete posts. Visitors see a notification badge
whenever the admin publishes something new.

## Features

- **Admin-only posting** — login-protected dashboard to publish text, photo, or video updates.
- **Organization profile** — admin can edit the org name, tagline, description, logo, contact
  info, and social links; shown on the public homepage.
- **Viewer interactions** — likes and comments are open to everyone, no account needed (a
  lightweight per-browser identity is used so likes/comments are attributed).
- **Notifications** — a bell icon shows how many new posts have appeared since a viewer's last
  visit, polling in the background.

## Tech stack

Next.js (App Router, TypeScript) + MongoDB/Mongoose + Tailwind CSS. Admin auth uses a JWT stored
in an httpOnly cookie; passwords are hashed with bcrypt.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` (already done for local dev) and set:

- `MONGODB_URI` — connection string for MongoDB
- `JWT_SECRET` — long random string used to sign admin session tokens
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — used once by the seed script below

### 3. Start MongoDB

Any MongoDB instance works. For local development with Docker:

```bash
docker run -d --name redef-focas-mongo -p 27017:27017 -v redef_focas_mongo_data:/data/db mongo:7
```

### 4. Create the admin account

```bash
npm run seed:admin
```

This reads `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `.env.local` and creates (or updates) the one
admin account. Re-run it any time to change the password.

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` to
sign in as the admin.

## Project layout

- `src/app` — pages and API routes (App Router)
- `src/app/api/admin/*` — admin-only endpoints (protected by `src/middleware.ts`)
- `src/app/api/*` — public endpoints (org info, posts, likes, comments)
- `src/models` — Mongoose schemas (`Admin`, `Organization`, `Post`)
- `src/components` — UI components; `src/components/admin` holds dashboard-only pieces
- `public/uploads` — uploaded photos/videos are stored here on disk

## Notes

- There is intentionally only one admin account/role. Viewers never log in.
- Uploaded media is capped at 100MB and limited to common image/video formats
  (`src/lib/upload.ts`).
