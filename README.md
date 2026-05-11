# AI Chat App

A modern, full-stack AI chat application built with Next.js 16, featuring real-time conversations with Gemini AI, Google authentication, chat history management, and an analytics dashboard.

## Features

- **AI-powered chat** — Conversational AI using Google Gemini (via OpenAI-compatible endpoint)
- **Google OAuth** — Secure authentication with Google SSO via Better Auth
- **Chat history** — Persistent session storage with PostgreSQL via Drizzle ORM
- **Content type selection** — Choose between General, Code, Technical, and Creative modes for tailored responses
- **Dark mode** — System-aware theming with next-themes
- **Analytics dashboard** — Track usage stats with charts (sessions over time, message distribution by type)
- **Responsive design** — Works on desktop and mobile with collapsible sidebar
- **Typewriter effect** — Streaming-style AI response display
- **Rate limiting** — Built-in rate limiter for API endpoints

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) 16.2 (App Router, Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 + [shadcn/ui](https://ui.shadcn.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/)) |
| ORM | [Drizzle](https://orm.drizzle.team/) |
| Auth | [Better Auth](https://better-auth.com/) with Google OAuth |
| AI | [Google Gemini](https://ai.google.dev/) (OpenAI-compatible endpoint) |
| Charts | [Recharts](https://recharts.org/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide](https://lucide.dev/) |
| Package Manager | [Bun](https://bun.sh/) |

## Prerequisites

- [Bun](https://bun.sh/) v1.3+ (or Node.js 20+)
- A PostgreSQL database (local or [Neon](https://neon.tech/))
- [Google Cloud Console](https://console.cloud.google.com/) project for OAuth
- [Google AI Studio](https://aistudio.google.com/) API key for Gemini

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd ai-chat-app
bun install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for Better Auth (generate with `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Your app URL (e.g. `http://localhost:3000`) |
| `OPENAI_API_KEY` | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### 3. Database setup

```bash
bun run db:push     # Push schema to database
bun run db:seed     # (Optional) Seed with sample data
```

### 4. Run the app

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google OAuth Setup

1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000` to **Authorized JavaScript origins**
4. Add `http://localhost:3000/api/auth/callback/google` to **Authorized redirect URIs**
5. Copy the Client ID and Client Secret to your `.env` file

## Project Structure

```
app/
├── api/
│   ├── auth/[...all]/route.ts    # Better Auth handler
│   ├── chat/route.ts             # AI chat endpoint
│   └── storage/route.ts          # Session/message CRUD + dashboard stats
├── dashboard/page.tsx            # Analytics dashboard
├── sign-in/page.tsx              # Sign-in page
├── layout.tsx                    # Root layout
└── page.tsx                      # Main chat page

components/
├── chat/                         # Chat UI components
├── dashboard/                    # Dashboard components
├── profile/                      # Profile dialog
├── settings/                     # Settings dialog
└── ui/                           # shadcn/ui components

contexts/                         # React contexts (auth, chat, settings)
db/                               # Drizzle schema files
lib/                              # Auth client, DB client, utilities
services/                         # API service layer
types/                            # TypeScript type definitions
constants/                        # App constants
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server with Turbopack |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:push` | Push schema to database |
| `bun run db:seed` | Seed database with sample data |
| `bun run db:setup` | Push schema + seed |

## API Routes

### `POST /api/chat`

Send a message to the AI and get a response.

```json
{ "message": "Hello!", "contentType": "general" }
```

### `POST /api/storage`

CRUD operations for sessions, messages, and settings. Actions:
- `getMessages`, `saveMessages`
- `getSessions`, `saveSession`, `deleteSession`
- `getSettings`, `saveSettings`
- `getDashboardStats` — aggregated stats for the dashboard

## Deployment

Deploy to any platform that supports Next.js (Vercel, Railway, Fly.io, etc.).

Make sure to set all environment variables in your deployment environment and update the Google OAuth redirect URIs to match your production domain.
