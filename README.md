# AI Chat App

> A modern, full-stack AI chat application with Google authentication, persistent chat history, analytics dashboard, and an animated canvas background.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-base--nova-000?style=flat-square)](https://ui.shadcn.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Auth-Better--Auth-FF6B6B?style=flat-square)](https://better-auth.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.3-000?style=flat-square&logo=bun)](https://bun.sh/)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone and install](#1-clone-and-install)
  - [Environment variables](#2-environment-variables)
  - [Database setup](#3-database-setup)
  - [Run the app](#4-run-the-app)
- [Google OAuth Setup](#google-oauth-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Dashboard](#dashboard)
- [Deployment](#deployment)

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Chat** | Conversational AI powered by Google Gemini 3.1 Flash Lite via OpenAI-compatible endpoint |
| **Google OAuth** | Secure single sign-on with Google via Better Auth |
| **Chat History** | Persistent session and message storage with PostgreSQL + Drizzle ORM |
| **Content Modes** | Choose between General, Code, Technical, and Creative response styles |
| **Dark Mode** | System-aware theming with `next-themes`, persists across sessions |
| **Analytics Dashboard** | Usage statistics with charts — sessions over time, message type distribution |
| **Animated Background** | Canvas-based dotted glow background with organic shimmer animation |
| **Responsive Design** | Mobile-friendly layout with collapsible sidebar |
| **Typewriter Effect** | Streaming-style AI response display with animated cursor |
| **Rate Limiting** | In-memory rate limiter protecting chat (30/min) and storage (100/min) endpoints |

---

## Screenshots

> _Screenshots coming soon._

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | [Next.js](https://nextjs.org/) 16.2 (App Router) | React framework with server components and Turbopack |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 | Type safety |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 + [shadcn/ui](https://ui.shadcn.com/) (base-nova) | Utility-first styling with prebuilt components |
| Animation | [Framer Motion](https://www.framer.com/motion/) 12 | Page transitions and micro-interactions |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) | Serverless PostgreSQL |
| ORM | [Drizzle](https://orm.drizzle.team/) | Type-safe SQL query builder and migrations |
| Auth | [Better Auth](https://better-auth.com/) + Google OAuth | Authentication and session management |
| AI | [Google Gemini](https://ai.google.dev/) (OpenAI-compatible endpoint) | AI chat completions via `gpt-4o` compatible API |
| State | [TanStack React Query](https://tanstack.com/query) 5 | Server state management and caching |
| Charts | [Recharts](https://recharts.org/) 2 | Dashboard data visualization |
| Icons | [Lucide](https://lucide.dev/) | Consistent icon set |
| Package Manager | [Bun](https://bun.sh/) 1.3 | Fast JavaScript runtime and package manager |
| Background | [Aceternity](https://ui.aceternity.com/) DottedGlowBackground | Canvas-based animated dot grid |

---

## Architecture

```
Client (Browser)          Next.js Server         External
┌─────────────────┐      ┌──────────────┐      ┌──────────┐
│  React 19       │      │  API Routes  │      │ Gemini   │
│  ┌───────────┐  │      │  ┌────────┐  │      │   API    │
│  │ Auth      │──┼──────┼─►│ /auth  │──┼──────┼──────────┤
│  │ Context   │  │      │  └────────┘  │      │          │
│  └───────────┘  │      │  ┌────────┐  │      │ Google   │
│  ┌───────────┐  │      │  │ /chat  │──┼──────┤   OAuth  │
│  │ Chat      │──┼──────┼─►│        │  │      └──────────┘
│  │ Context   │  │      │  └────────┘  │      ┌──────────┐
│  └───────────┘  │      │  ┌────────┐  │      │ Neon     │
│  ┌───────────┐  │      │  │/storage│──┼──────┤ (Postgres)│
│  │ Settings  │──┼──────┼─►│        │  │      └──────────┘
│  │ Context   │  │      │  └────────┘  │
│  └───────────┘  │      └──────────────┘
│  ┌───────────┐  │
│  │ Dashboard │  │
│  └───────────┘  │
└─────────────────┘
```

---

## Prerequisites

- **Runtime:** [Bun](https://bun.sh/) v1.3+ (or Node.js 20+ with npm/pnpm)
- **Database:** PostgreSQL instance (local or [Neon](https://neon.tech/) serverless)
- **Google Cloud:** A project with OAuth 2.0 credentials configured
- **AI API:** A [Gemini API key](https://aistudio.google.com/) from Google AI Studio

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ai-chat-app
bun install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/db`) |
| `BETTER_AUTH_SECRET` | Yes | Secret for signing auth tokens. Generate: `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Yes | Your app's base URL (e.g. `http://localhost:3000`) |
| `OPENAI_API_KEY` | Yes | Gemini API key from [Google AI Studio](https://aistudio.google.com/) |
| `GOOGLE_CLIENT_ID` | Yes | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Yes | OAuth 2.0 client secret from Google Cloud Console |

### 3. Database setup

Push the Drizzle schema to your database and optionally seed sample data:

```bash
bun run db:push      # Creates tables: sessions, messages, settings
bun run db:seed      # (Optional) Insert sample chat sessions
```

### 4. Run the app

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Google OAuth Setup

1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials** → **OAuth 2.0 Client ID** → **Web application**
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Click **Save** and copy the displayed **Client ID** and **Client Secret**
6. Add them to your `.env` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

> **For production:** Replace `http://localhost:3000` with your production domain in both origins and redirect URIs.

---

## Project Structure

```
app/
├── api/                          # Backend API routes
│   ├── auth/[...all]/route.ts    # Better Auth handler
│   ├── chat/route.ts             # AI chat completions (Gemini)
│   └── storage/route.ts          # Session/message CRUD + dashboard stats
├── dashboard/page.tsx            # Analytics dashboard
├── sign-in/page.tsx              # Google OAuth sign-in page
├── layout.tsx                    # Root layout (ThemeProvider, ErrorBoundary, Toaster)
├── globals.css                   # Tailwind v4 theme variables
└── page.tsx                      # Main chat page

components/
├── chat/                         # Chat UI (Header, Sidebar, ChatArea, ChatInput, etc.)
├── dashboard/                    # Dashboard (StatsCard, SessionsChart, ContentTypeChart, RecentSessions)
├── profile/                      # Profile dialog
├── settings/                     # Settings dialog (Appearance, Notifications, Privacy)
├── ui/                           # 80+ shadcn/ui components
│   ├── button.tsx, card.tsx, dialog.tsx, ...
│   ├── chart.tsx                 # Recharts wrapper
│   └── dotted-glow-background.tsx  # Animated canvas background
├── dotted-glow-background-demo.tsx  # Demo of the background component
└── error-boundary.tsx

contexts/                         # React contexts + Query providers
├── auth-context.tsx              # Auth state (useSession from Better Auth)
├── chat-context.tsx              # Chat state + React Query + mutations
└── settings-context.tsx          # App settings state

db/
├── schema.ts                     # App tables: sessions, messages, settings
└── auth-schema.ts                # Better Auth tables: user, session, account, verification

lib/
├── auth.ts                       # Better Auth server config (Google OAuth + Drizzle adapter)
├── auth-client.ts                # Better Auth client (createAuthClient)
├── db.ts                         # Drizzle client (PostgreSQL via postgres-js)
├── rate-limiter.ts               # In-memory rate limiter
└── utils.ts                      # cn() helper

services/
├── api/
│   ├── api-ai-service.ts         # POST /api/chat
│   └── api-storage-service.ts    # POST /api/storage
├── mock/                         # Mock implementations for testing
└── storage-types.ts              # Service interfaces

types/                            # Shared TypeScript types
constants/                        # Content types, quick-start cards, fallback responses
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with Turbopack (hot reload) |
| `bun run build` | Create an optimized production build |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint across the codebase |
| `bun run db:generate` | Generate Drizzle SQL migration files |
| `bun run db:push` | Push the current schema to the database |
| `bun run db:seed` | Insert sample data into the database |
| `bun run db:setup` | Run `db:push` followed by `db:seed` |

---

## API Reference

### `POST /api/chat`

Sends a user message to the AI and returns the generated response.

**Request body:**

```json
{
  "message": "Explain how React hooks work",
  "contentType": "technical"
}
```

**`contentType` options:** `general`, `code`, `technical`, `creative`

**Response:**

```json
{
  "response": "React hooks are functions that let you use state and lifecycle features..."
}
```

**Errors:** Returns `401` if unauthenticated, `429` if rate limited. On AI API failure, falls back to predefined responses.

---

### `POST /api/storage`

Unified CRUD endpoint for all data operations. The `action` field determines the operation.

| Action | Request | Description |
|--------|---------|-------------|
| `getMessages` | `{ action, sessionId }` | Get all messages for a session |
| `saveMessages` | `{ action, sessionId, messages[] }` | Save messages (upsert) |
| `getSessions` | `{ action }` | Get all sessions for the current user |
| `saveSession` | `{ action, session }` | Create or update a session |
| `deleteSession` | `{ action, sessionId }` | Delete a session and its messages |
| `getSettings` | `{ action }` | Get app settings |
| `saveSettings` | `{ action, appSettings }` | Update app settings |
| `getDashboardStats` | `{ action }` | Get aggregated stats for the dashboard |

**`getDashboardStats` response:**

```json
{
  "totalSessions": 12,
  "totalMessages": 87,
  "activeDays": 5,
  "averageMessagesPerSession": 7,
  "sessionsByDay": [{ "date": "2026-05-10", "count": 3 }, ...],
  "contentTypeDistribution": [{ "contentType": "general", "count": 40 }, ...],
  "recentSessions": [...]
}
```

---

## Dashboard

The analytics dashboard at `/dashboard` provides:

- **Stats overview** — Total sessions, messages, active days, average messages per session
- **Sessions over time** — Bar chart showing daily activity (last 30 days)
- **Messages by type** — Donut chart breaking down conversations by content mode
- **Recent sessions** — Table listing the latest conversations with message counts and dates
- **Tabs** — Switch between Overview and Activity views

The dashboard uses server-side aggregation for efficient data retrieval and features `Skeleton` loading states, `Empty` component for zero-data states, and is fully responsive.

---

## Deployment

The app can be deployed to any platform that supports Next.js:

### Recommended: Vercel

```bash
npm i -g vercel
vercel
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Other platforms

- **Railway / Fly.io:** Use the included `Dockerfile` or Node.js buildpacks
- **Self-hosted:** Build with `bun run build` and serve with `bun run start`

### Important notes

- Update `BETTER_AUTH_URL` to your production domain
- Add your production domain to **Google Cloud Console**:
  - **Authorized JavaScript origins:** `https://yourdomain.com`
  - **Authorized redirect URIs:** `https://yourdomain.com/api/auth/callback/google`
- Ensure PostgreSQL connection string is set via `DATABASE_URL`
- Run `bun run db:push` on deployment to apply any pending schema changes

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request
