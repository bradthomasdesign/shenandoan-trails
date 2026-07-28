# Handoff: Shenandoan Trails — push to GitHub + deploy to Vercel

## What this is

A Next.js 14 app (App Router) that renders trail guide pages for Shenandoan,
a Shenandoah Valley digital magazine. Each trail page shows a Leaflet map,
elevation summary, and "what to expect" details (parking, fees, dogs,
hazards, seasons), pulled from a Supabase Postgres database. No user
accounts or photo uploads yet — that's intentionally deferred to a later
phase.

## Current state

- Code is complete and working locally (unzipped into this folder).
- Next.js pinned to `14.2.35` (patched — do not downgrade; earlier 14.x
  versions have a known App Router DoS vulnerability, CVE-2025-55184 /
  CVE-2025-67779).
- Supabase project `shenandoan` (project ref `sxpuhpupcwksvpswjnqf`) already
  has the schema live: `trails` and `trail_waypoints` tables, RLS enabled,
  public read-only access scoped to `is_published = true`. One real trail
  record exists and is published: Old Rag Mountain (`old-rag`), sourced
  from the official NPS trail guide.
- This has NOT yet been pushed to GitHub or deployed to Vercel. That's the
  task.
- No `.env` file is committed (see `.gitignore`) — see `.env.example` for
  the two variables needed. The real Supabase anon key is safe to expose
  client-side (RLS enforces the actual access control) but the editor
  wants it set via Vercel env vars, not committed to git.

## What I need you to do

1. Initialize git in this folder, commit, and push to a **new GitHub repo**
   named `shenandoan-trails` (ask the user which GitHub account/org if it's
   ambiguous).
2. Connect that repo to Vercel as a new project (the user's Vercel team is
   `bradthomasdesigns-projects` — ask if project creation is blocked there
   again; it was blocked once before under an unclear permissions issue).
3. Set the two environment variables on the Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://sxpuhpupcwksvpswjnqf.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (ask the user — I'm not including
     the live key in this handoff doc since it'll sit in plain text; they
     have it from Supabase → Project Settings → API, or I can fetch it
     again if you have Supabase MCP access)
4. Deploy to production and confirm both `/` (trail index) and
   `/trail/old-rag` render correctly, including the Leaflet map.

## Design constraints — please preserve

- **No serif fonts anywhere.** The design uses Inter exclusively (weights
  400–800). This was a deliberate, explicit correction from the editor —
  don't reintroduce Fraunces or any other serif for headings.
- Palette is fixed in `app/globals.css` as CSS variables: forest ink
  (`--ink: #1f2e23`), parchment background (`--parchment: #f5f0e6`), trail
  blue (`--trail-blue: #3d5a80`), rust accent (`--rust: #b5573a`), stone
  gray (`--stone: #7a7568`). Keep using these variables rather than
  hardcoding new colors.
- Map tiles are OpenTopoMap via Leaflet (`components/TrailMap.tsx`), loaded
  client-side only via `components/TrailMapClient.tsx` (dynamic import,
  `ssr: false`) — this avoids a `window is not defined` SSR crash. Don't
  remove that wrapper.

## Adding more trails later

Trail data lives in Supabase, not in the codebase. A trail appears on the
site once its row in `public.trails` has `is_published = true`. New trails
get inserted via SQL (Supabase SQL editor, or the Supabase MCP tool if
available) — there's no admin UI yet. See the `Trail` type in
`lib/supabase.ts` for the full column list.

## Editorial context (for tone/quality bar only — not code-relevant)

This is one property of Shenandoan, a Substack magazine covering the
Shenandoah Valley of Virginia. The editor (Brad) holds a high bar for
factual accuracy sourced from primary references (NPS, USFS, etc.) and has
zero tolerance for AI-sounding writing tics in any user-facing copy. If you
touch any UI copy (button labels, empty states, error messages), keep it
plain, direct, and specific — no "delve," no "matters because," no
cliché outdoor-brand language.
