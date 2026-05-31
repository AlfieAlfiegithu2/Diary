create extension if not exists vector;

create type public.journal_session_status as enum ('scheduled', 'active', 'processing', 'complete', 'failed');
create type public.journal_message_role as enum ('ai', 'user');
create type public.memory_node_type as enum (
  'person',
  'event',
  'belief',
  'value',
  'emotion',
  'goal',
  'decision',
  'story',
  'place',
  'topic',
  'pattern'
);
create type public.memory_edge_relationship_type as enum (
  'related_to',
  'caused_by',
  'influenced',
  'loves',
  'fears',
  'values',
  'changed_after',
  'occurred_during',
  'connected_to'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  timezone text not null default 'UTC',
  daily_checkin_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  status public.journal_session_status not null default 'scheduled',
  main_question text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table public.journal_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.journal_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.journal_message_role not null,
  transcript_text text,
  audio_url text,
  audio_r2_key text,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create table public.memory_nodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.memory_node_type not null,
  title text not null,
  description text not null,
  confidence_score numeric(4,3) not null check (confidence_score >= 0 and confidence_score <= 1),
  source_session_id uuid references public.journal_sessions(id) on delete set null,
  source_message_id uuid references public.journal_messages(id) on delete set null,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memory_edges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_node_id uuid not null references public.memory_nodes(id) on delete cascade,
  target_node_id uuid not null references public.memory_nodes(id) on delete cascade,
  relationship_type public.memory_edge_relationship_type not null,
  strength numeric(4,3) not null check (strength >= 0 and strength <= 1),
  evidence text not null,
  created_at timestamptz not null default now(),
  check (source_node_id <> target_node_id)
);

create table public.daily_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid not null references public.journal_sessions(id) on delete cascade,
  short_summary text not null,
  emotional_summary text,
  key_people text[] not null default '{}',
  key_events text[] not null default '{}',
  key_values text[] not null default '{}',
  behavior_patterns text[] not null default '{}',
  future_questions text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (session_id)
);

create table public.transcript_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid not null references public.journal_sessions(id) on delete cascade,
  message_id uuid references public.journal_messages(id) on delete cascade,
  chunk_text text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index journal_sessions_user_date_idx on public.journal_sessions (user_id, date desc);
create index journal_messages_session_created_idx on public.journal_messages (session_id, created_at);
create index memory_nodes_user_type_idx on public.memory_nodes (user_id, type);
create index memory_edges_user_source_idx on public.memory_edges (user_id, source_node_id);
create index memory_edges_user_target_idx on public.memory_edges (user_id, target_node_id);
create index daily_summaries_user_created_idx on public.daily_summaries (user_id, created_at desc);
create index transcript_chunks_user_session_idx on public.transcript_chunks (user_id, session_id);
create index memory_nodes_embedding_idx on public.memory_nodes using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index transcript_chunks_embedding_idx on public.transcript_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.profiles enable row level security;
alter table public.journal_sessions enable row level security;
alter table public.journal_messages enable row level security;
alter table public.memory_nodes enable row level security;
alter table public.memory_edges enable row level security;
alter table public.daily_summaries enable row level security;
alter table public.transcript_chunks enable row level security;

create policy "profiles own rows"
on public.profiles for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "journal sessions own rows"
on public.journal_sessions for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "journal messages own rows"
on public.journal_messages for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "memory nodes own rows"
on public.memory_nodes for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "memory edges own rows"
on public.memory_edges for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "daily summaries own rows"
on public.daily_summaries for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "transcript chunks own rows"
on public.transcript_chunks for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.journal_sessions,
  public.journal_messages,
  public.memory_nodes,
  public.memory_edges,
  public.daily_summaries,
  public.transcript_chunks
to authenticated;
