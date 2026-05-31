# LifeBrain MVP Architecture

LifeBrain is a diary-first personal memory system. The MVP keeps the daily experience small and human: one meaningful prompt, one voice answer, one to three natural follow-ups, then background extraction into a long-term memory graph.

## Product Principles

- Diary first, digital-clone infrastructure second.
- Keep daily sessions to 2-5 minutes.
- Ask deep but natural questions.
- Store raw evidence so future models can reprocess memories.
- Never invent memories during retrieval.
- Treat future digital-twin support as long-term memory preservation, not immortality.

## App Structure

- `src/app/page.tsx`: mobile-first LifeBrain product surface.
- `src/components/lifebrain-app.tsx`: interactive MVP UI for today, voice journaling, timeline, brain graph, search, and insights.
- `src/app/api/journal/session/route.ts`: creates or returns a daily journal session.
- `src/app/api/journal/upload-url/route.ts`: creates private R2 signed upload URLs for voice audio.
- `src/app/api/journal/transcribe/route.ts`: pluggable speech-to-text boundary.
- `src/app/api/journal/extract-memories/route.ts`: AI summary and memory extraction boundary.
- `src/app/api/search/route.ts`: RAG answer boundary for memory search.
- `src/lib/ai/prompts.ts`: companion behavior and extraction prompt.
- `src/lib/ai/providers.ts`: model provider abstraction with demo fallback.
- `src/lib/r2.ts`: Cloudflare R2 signing helper.
- `src/lib/supabase/admin.ts`: lazy Supabase admin client for server routes.
- `supabase/migrations/20260531000000_lifebrain_mvp.sql`: database schema, pgvector setup, indexes, and RLS.

## Data Flow

1. User signs in with Supabase Auth.
2. User chooses a daily check-in time stored on `profiles`.
3. The app opens or creates a `journal_sessions` row for the date.
4. The client records audio and requests `/api/journal/upload-url`.
5. Audio uploads directly to private Cloudflare R2.
6. `/api/journal/transcribe` turns the audio into transcript text.
7. `/api/journal/extract-memories` summarizes the session and extracts structured memories.
8. Background jobs persist `daily_summaries`, `memory_nodes`, `memory_edges`, embeddings, and graph links.
9. `/api/search` retrieves vector-similar memories, expands via graph edges, pulls transcript snippets and summaries, then answers with references.

## MVP Build Steps

1. Connect Supabase Auth and create the `profiles` row on signup.
2. Wire the daily check-in time form to `profiles.daily_checkin_time`.
3. Persist journal sessions and messages through the API routes.
4. Replace demo recording handling with full audio blob upload to R2.
5. Plug in the chosen speech-to-text provider behind `/api/journal/transcribe`.
6. Persist extraction JSON into summaries, memory nodes, and edges.
7. Add embeddings to memory nodes and transcript chunks with pgvector.
8. Replace demo search with vector retrieval plus edge expansion.
9. Add export/delete account flows before private beta.

## Background Jobs

The MVP can start with synchronous API calls. Move these tasks to a queue before real users:

- Audio compression.
- Speech-to-text.
- Session summarization.
- Structured memory extraction.
- Embedding generation.
- Graph edge reconciliation.
- Weekly and monthly insight generation.

## RAG Rules

- Retrieve memory nodes by vector similarity.
- Expand to graph neighbors with strong edges.
- Pull transcript snippets and daily/monthly summaries.
- Include date references in the answer.
- If evidence is weak, answer: `I don't have enough memory about that yet.`
