# Kava & Kratom State Legislative Tracker

A standalone, embeddable React app that lets visitors click their state and see current bills related to kava, kratom, and agriculture. Built for kavaandkratom.org.

## What it does

1. **State landing page** — shows a US map / state grid with the prompt "Click your state to learn more about kava and kratom laws in your area."
2. **Filtered bill list** — pulls from the LegiScan API and shows only bills matching kava / kratom / agriculture keywords.
3. **Bill detail page** — summary, sponsors, official bill link, full-text documents, history, and a "Take Action" discussion section.
4. **Moderated discussions** — visitors can post comments. Posts containing banned words are auto-blocked. All other posts go into a pending queue for admin approval.
5. **Admin moderation** — a simple login-protected screen where the site owner reviews pending posts from the last 24 hours and approves or denies them.
6. **Footer backlink** — includes a link back to RookReader for broader bill tracking.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (optional, for moderated discussions)
- LegiScan API (for bill data)

## Quick start

1. Copy `.env.example` to `.env` and fill in your values.
2. Run `npm install`.
3. Run `npm run dev`.
4. For discussions, create the Supabase tables using `supabase/schema.sql`.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_LEGISCAN_API_KEY` | Yes* | LegiScan API key. |
| `VITE_USE_EDGE_PROXY` | No | Set to `true` to route LegiScan calls through `supabase/functions/legiscan-proxy`. |
| `VITE_SUPABASE_URL` | For discussions | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | For discussions | Supabase public anon key. |
| `VITE_ROOKREADER_URL` | No | URL for the footer backlink (defaults to `https://rookreader.com`). |

\* If `VITE_USE_EDGE_PROXY` is `true`, the key is stored server-side in Supabase secrets instead.

## Security note

Do **not** ship with `VITE_USE_EDGE_PROXY=false` in production if the LegiScan key is personal-use only. Use the included Supabase Edge Function proxy to keep the key server-side.

## Deploying the edge function

```bash
supabase functions deploy legiscan-proxy
supabase secrets set LEGISCAN_API_KEY=your_key_here --project-ref your-project-ref
```

## Moderation workflow

1. Visitor submits a comment.
2. If it contains a banned word, it is rejected immediately with a message.
3. Otherwise it is saved with `status = 'pending'`.
4. The admin visits `/admin/moderate`, signs in with Supabase auth, and sees posts from the last 24 hours.
5. Admin clicks **Approve** or **Deny**. Approved posts appear under the bill; denied posts are hidden.

## Customizing keywords

Edit `src/data/keywords.ts` to change which bills are surfaced or add agriculture terms later.

## Folder structure

```
src/
  components/      # UI components
  data/            # state list, keyword list, banned words
  lib/             # API helpers, Supabase client
  pages/           # page-level views
  types/           # TypeScript types
supabase/
  functions/       # Edge function proxy
  schema.sql       # Database setup
```
