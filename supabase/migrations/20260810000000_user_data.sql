create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_slug)
);

create table if not exists public.user_routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  routine_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_macro_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  calories numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  entry_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

alter table public.user_favorites enable row level security;
alter table public.user_routines enable row level security;
alter table public.user_macro_history enable row level security;

create policy "Users manage their own favorites" on public.user_favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own routines" on public.user_routines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own macro history" on public.user_macro_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
