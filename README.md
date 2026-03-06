# Neon Database Template

<p align="center">
  <a href="https://edgeone.ai/pages/new?template=neon-starter">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy to EdgeOne Pages" height="40">
  </a>
</p>

A simple Next.js starter with Neon Postgres and authentication.

## Features

- Email/password authentication
- Neon Postgres database
- Dark mode support
- Page visit tracking
- User statistics
- Database connection status

## Quick Start

### 1. Create Neon Database

1. Go to [https://console.neon.tech](https://console.neon.tech) and sign up
2. Create a new project
3. Copy the connection string (starts with `postgresql://`)

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Neon connection string:
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Initialize Database

```bash
# Create database tables
pnpm db:init
```

This will create:
- `users` table - stores user accounts
- `page_visits` table - tracks page statistics

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm db:init` | Initialize database tables |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |

## Database Schema

The template uses Drizzle ORM with two tables:

### users
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | User email (unique) |
| password_hash | TEXT | Bcrypt hashed password |
| name | VARCHAR(255) | Optional display name |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

### page_visits
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| page | VARCHAR(100) | Page identifier |
| count | INTEGER | Visit count |
| last_visit | TIMESTAMP | Last visit time |

## Deploy to EdgeOne Pages

### One-Click Deploy

[![Deploy to EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=neon-starter)

Click the button above to deploy this template directly to EdgeOne Pages.

> **Note**: After deployment, you need to configure environment variables in the EdgeOne Pages dashboard.

### Manual Deploy

1. Push code to Git repository
2. Connect repository in EdgeOne Pages dashboard
3. Add environment variables:
   - `DATABASE_URL` - Your Neon connection string
   - `SESSION_SECRET` - A random string (min 32 chars)
4. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | Yes |
| `SESSION_SECRET` | Secret for session encryption (min 32 chars) | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL (default: http://localhost:3000) | No |

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Neon Postgres](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [iron-session](https://github.com/vvo/iron-session)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## Project Structure

```
neon-starter/
├── app/
│   ├── actions/authActions.ts    # Authentication Server Actions
│   ├── api/logout/route.ts       # Logout API route
│   ├── components/
│   │   ├── ui/                   # UI components (Card, Button, Input, etc.)
│   │   ├── header.tsx            # Navigation header
│   │   └── theme-provider.tsx    # Dark mode provider
│   ├── lib/
│   │   ├── auth.ts               # Session & password utils
│   │   ├── db.ts                 # Database connection
│   │   └── utils.ts              # Helper functions
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Register page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── db/schema.ts                  # Database schema definition
├── scripts/init-db.ts            # Database initialization script
├── .env.example                  # Environment variables template
├── drizzle.config.ts             # Drizzle ORM configuration
├── edgeone.json                  # EdgeOne Pages deployment config
└── package.json
```

## Troubleshooting

### Database not connected
- Check `DATABASE_URL` in `.env` file
- Ensure database tables are created: `pnpm db:init`
- Verify Neon database is active in [console.neon.tech](https://console.neon.tech)

### Session errors
- Ensure `SESSION_SECRET` is at least 32 characters
- Clear browser cookies and try again
