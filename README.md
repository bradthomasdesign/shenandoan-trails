# Shenandoan Trails

Trail guide pages for Shenandoan — interactive maps, elevation, and trail
stats pulled from Supabase, linked from Shenandoan articles.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key
   (find these in Supabase → Project Settings → API).
3. `npm run dev`

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the GitHub repo.
3. Add the two env vars from `.env.example` under Project Settings → Environment Variables
   (use your real Supabase anon key, not the placeholder).
4. Deploy.

## Adding a trail

Trail data lives in the `trails` and `trail_waypoints` tables in the
`shenandoan` Supabase project. A trail only appears on the site once its
`is_published` column is set to `true`. Insert new rows via the Supabase
SQL editor or table view.
