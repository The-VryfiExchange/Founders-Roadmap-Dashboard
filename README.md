# Founder Dashboard

Private operating dashboard for VryfID / The Exchange. Magic-link auth restricted to a single email. Supabase backend. Deployed to Vercel.

## What it does

Six tabs that live in one tool:

- **Today** — daily focus, todos, activity counters, end-of-day notes
- **This Week** — Monday review: big bet, wins, blockers, priorities. Rolling history.
- **KPIs** — 15 metrics across Sales/Revenue/Marketplace/Product/Marketing/Hiring/Capital
- **Milestones** — 30 things that have to happen for Year 1 to be a win
- **Pipeline** — Priority 10 PM target accounts with stage tracking
- **Hiring** — 8 planned hires with status tracking

All data persists in Supabase. Multi-device: log in anywhere, your data is there.

## Setup (one-time, ~30 minutes)

### 1. Create the Supabase project

1. Go to https://supabase.com/dashboard and create a new project. Pick a name like `founder-dashboard`.
2. Choose a strong database password (save it).
3. Pick a region close to you (US East works fine).
4. Wait ~2 minutes for the project to provision.

### 2. Run the schema

1. In your Supabase project, go to **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy the entire contents, paste into the SQL Editor.
3. Click **Run**. You should see "Success. No rows returned."

This creates 6 tables (kpis, milestones, pipeline, hires, daily_entries, weekly_reviews) and Row Level Security policies so only your authenticated user can read/write your data.

### 3. Configure auth

1. In Supabase, go to **Authentication** → **Providers**.
2. Make sure **Email** is enabled (it is by default).
3. Go to **Authentication** → **URL Configuration**.
4. Set **Site URL** to your Vercel domain (you'll have it after step 6). For local dev, you can use `http://localhost:3000`.
5. Add `http://localhost:3000/auth/callback` and your eventual Vercel URL (e.g. `https://dashboard.vryfid.com/auth/callback`) to **Redirect URLs**.

### 4. Get your API keys

1. In Supabase, go to **Settings** → **API**.
2. Copy two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon / public key** (the long JWT string)

### 5. Set up locally (test before deploy)

```bash
# Clone or unzip this project
cd founder-dashboard

# Copy env template
cp .env.example .env.local

# Edit .env.local — fill in:
#   NEXT_PUBLIC_SUPABASE_URL=<your project URL>
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
#   NEXT_PUBLIC_ALLOWED_EMAIL=<your email>

# Install + run
npm install
npm run dev
```

Open http://localhost:3000. You'll be redirected to login. Enter your email. Check your inbox for the magic link. Click it. You should land on an empty dashboard.

### 6. Seed the initial data

Now that you've logged in once, your user exists in Supabase. Seed the dashboard with the operating-plan data:

1. In Supabase, go to **SQL Editor** → **New query**.
2. Open `supabase/seed.sql` from this repo, copy and paste, click **Run**.

This inserts 15 KPIs, 30 milestones, 10 pipeline accounts (Priority 10 PMs), and 8 hires — all tagged to your user via `auth.uid()`.

Refresh your dashboard. You should now see populated tabs.

### 7. Deploy to Vercel

```bash
# If you haven't already
npm install -g vercel

# Deploy from project root
vercel
```

Follow prompts. When asked for env variables, paste the same three from your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ALLOWED_EMAIL`

Or set them in the Vercel dashboard under **Settings** → **Environment Variables**.

After deploy, go back to Supabase **Authentication** → **URL Configuration** and add your production Vercel URL to **Redirect URLs**.

### 8. Pin to home screen (optional but recommended)

On iPhone: open your Vercel URL in Safari, tap Share, "Add to Home Screen." Now it lives like an app.

## Architecture

- **Next.js 14** App Router
- **Supabase** for auth (magic link) and Postgres data
- **Row Level Security** — every table policy is `auth.uid() = user_id`. Even if someone gets a Supabase anon key, they can't read your data without your auth token.
- **Middleware** double-enforces the email allow-list. Anyone who somehow signs in with a non-allowed email gets signed out and bounced to login.
- **Debounced writes** — the Today and Week views save 600ms after you stop typing.

## File structure

```
src/
├── app/
│   ├── auth/callback/route.ts    # Magic-link callback
│   ├── login/page.tsx             # Login page
│   ├── page.tsx                   # Home (server-rendered auth check)
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Tailwind + fonts
├── components/
│   ├── Dashboard.tsx              # Tab orchestrator
│   ├── TodayView.tsx              # Today tab
│   ├── WeekView.tsx               # This Week tab
│   ├── KPIView.tsx                # KPIs tab
│   ├── MilestoneView.tsx          # Milestones tab
│   ├── PipelineView.tsx           # Pipeline tab
│   ├── HireView.tsx               # Hiring tab
│   └── shared.tsx                 # Utilities + style constants
├── lib/
│   ├── supabase-client.ts         # Browser Supabase client
│   └── supabase-server.ts         # Server-side Supabase client
└── middleware.ts                  # Session refresh + email allow-list

supabase/
├── schema.sql                     # Tables + RLS policies
└── seed.sql                       # Initial data (run after first login)
```

## Updating the seed data

If you want to change the seed milestones or KPIs:

- For your existing account: edit rows directly in Supabase **Table Editor**.
- For a fresh start: in **SQL Editor**, run `delete from public.kpis where user_id = auth.uid();` (and same for other tables), then re-run `seed.sql`.

## Costs

- **Supabase free tier**: 500MB database, 50K monthly active users, 5GB egress. You'll never hit these limits as a single user. Free indefinitely.
- **Vercel free tier**: Hobby plan covers everything you need.

Total monthly cost: $0.

## Security notes

- The `NEXT_PUBLIC_ALLOWED_EMAIL` env var is visible in the client bundle. That's fine — it's not a secret. The actual security is enforced by middleware (server-side check on every request) plus Supabase RLS (database-level enforcement).
- Magic links expire in 1 hour by default. Change in Supabase **Authentication** → **Email** if you want longer.
- If you ever want to lock down further: enable MFA in Supabase or move auth to passwordless+TOTP.

## Migrating away from Supabase later

The data model is straightforward Postgres. To migrate to a different backend:

1. Export each table via Supabase **Table Editor** → export as CSV.
2. Adapt the queries in `*View.tsx` components to your new API.

## Troubleshooting

- **Magic link goes to spam**: check, and add `noreply@mail.app.supabase.io` to contacts.
- **"Email not authorized" error**: your `.env.local` `NEXT_PUBLIC_ALLOWED_EMAIL` doesn't match what you entered.
- **Empty dashboard after login**: you haven't run `seed.sql` yet, or you ran it in a different account context.
- **Data isn't saving**: check browser console for Supabase errors. Most common cause is missing `NEXT_PUBLIC_SUPABASE_*` env vars in Vercel.

## License

Internal — VryfID. Not for distribution.
