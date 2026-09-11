# MosquitoNet

MosquitoNet is a humorous, public-health-style mosquito intelligence dashboard. It lets a community scan rooms for a deterministic pseudo-estimate, report catches, explore privacy-safe hotspots, compare hunters, and review personal impact.

> MosquitoNet is an experimental/humorous project and should not be used for real mosquito population surveillance or public-health decisions.

## MVP stack

- Next.js / Vinext + TypeScript
- Tailwind CSS and Lucide icons
- Recharts for personal analytics
- Supabase-ready PostgreSQL schema, RLS policies, and storage fields
- Local seed data and UI fallback so the demo runs without external keys

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The main routes are `/`, `/scanner`, `/report`, `/map`, `/leaderboard`, and `/dashboard`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_mosquitonet.sql` in the SQL editor.
3. Create a storage bucket for proof images and room scans.
4. Run `supabase/seed.sql` after at least one auth user exists. It uses the first auth user as the seed owner and does nothing when no user exists.
5. Add the project URL and anon key to the runtime environment when wiring the real client.

The current MVP intentionally uses local mock data for a zero-config demo. The SQL schema is ready for email/password auth, user-owned catches, room scans, and aggregated map queries.

## Privacy model

Exact coordinates may be stored privately for a signed-in user, but public map data must use `getPublicCoordinates()` and aggregated grid cells. The `public_catch_cells` view never returns exact latitude/longitude or individual reports.

## Room scanner model

`lib/mosquito-calculator.ts` hashes stable file bytes, dimensions, and file metadata into a seeded pseudo-random stream. The same photo produces the same capacity, occupancy, suitability score, risk level, and sub-metrics without calling an ML service.

## Future ideas

- Connect Supabase auth and storage.
- Replace the SVG demo map with MapLibre and server-side cell aggregation.
- Add weather/rainfall context and time-series exports.
- Add moderation, report verification, and regional mosquito species tagging.
