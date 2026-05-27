# Invité — AI Wedding & Event Invitation Platform

A premium, AI-powered platform for creating breathtaking digital event invitations.

## Stack

- **Frontend**: Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion
- **State**: Zustand + React Query
- **Auth**: NextAuth.js (Google + Email/Password)
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: Cloudinary
- **Deployment**: Vercel (frontend) · Railway (database)

## Features

- 🤖 AI invitation generator (theme, colors, wording, animations)
- 🎨 Drag-and-drop invitation builder with live preview
- 📱 Mobile-first cinematic invitation experience
- ✉️ RSVP system with meal preferences and guest management
- 📊 Analytics dashboard with response rate tracking
- 🌍 Multilingual support (English, French, Arabic)
- 🎵 Background music with fade-in effects
- 🔗 Personalized guest links (/i/slug?guest=Name)
- 📱 PWA-ready + WhatsApp sharing optimized

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/medtrab/AI-Weeding-Invitation-App.git
cd AI-Weeding-Invitation-App
npm install

# 2. Set up environment
cp .env.example .env
# Fill in your DATABASE_URL, ANTHROPIC_API_KEY, etc.

# 3. Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Run dev server
npm run dev
```

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth credentials |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `CLOUDINARY_*` | Cloudinary credentials |

## Project Structure

```
app/              # Next.js App Router pages + API routes
components/       # React components (ui, marketing, builder, invitation, dashboard)
hooks/            # Custom React hooks
stores/           # Zustand state stores
lib/              # API clients, AI prompts, auth, DB, validators, utils
types/            # TypeScript type definitions
config/           # App configuration (defaults, fonts, music)
prisma/           # Schema + seed data
```

## Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Database (Railway)
1. Create a PostgreSQL service on Railway
2. Copy the `DATABASE_URL` to your Vercel env vars
3. Run `npx prisma migrate deploy`

## License

MIT
