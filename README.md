# Diary

Diary is an open-source, mobile-first AI journal MVP: a daily voice or text diary that captures short reflections and builds a long-term memory graph from transcripts, summaries, emotions, people, values, decisions, and patterns.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase Auth and Postgres
- pgvector for memory search
- Cloudflare R2 for private audio storage
- Pluggable speech-to-text
- Gemini-compatible JSON extraction boundary

## Run Locally

```bash
npm install
npm run dev
```

The app runs with demo data if no secrets are configured.

Copy `.env.example` to `.env.local` when connecting real services.

## Open Source

This project is released under the MIT License. You can fork it, learn from it, modify it, and build your own diary experience from it.

## Important Files

- `docs/architecture.md`: architecture, data flow, API map, and MVP plan.
- `supabase/migrations/20260531000000_lifebrain_mvp.sql`: database schema and RLS.
- `src/components/lifebrain-app.tsx`: first working MVP interface.
- `src/app/api/journal/*`: journal session, upload, transcription, and memory extraction APIs.
- `src/app/api/search/route.ts`: first RAG search boundary.

## Next Steps

1. Create a Supabase project and run the migration.
2. Add Supabase and R2 credentials to `.env.local`.
3. Replace the demo transcript provider with the selected speech-to-text API.
4. Persist extracted memories and embeddings in the background job layer.
