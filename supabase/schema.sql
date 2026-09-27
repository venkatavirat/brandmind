create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  objective text not null,
  hypothesis text not null,
  audience text not null,
  strategy_used text not null,
  variables text[],
  result_metrics text not null,
  audience_reaction text not null,
  outcome_status text not null,
  interpretation text not null,
  learning text not null,
  created_at timestamptz default now()
);

alter table public.experiments enable row level security;

alter table public.experiments add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.experiments add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create or replace function public.user_is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.workspace_members where workspace_id = target_workspace_id and user_id = auth.uid());
$$;

drop policy if exists "Users can view their workspaces" on public.workspaces;
create policy "Users can view their workspaces" on public.workspaces for select to authenticated
  using (owner_id = auth.uid() or public.user_is_workspace_member(id));

drop policy if exists "Users can create workspaces" on public.workspaces;
create policy "Users can create workspaces" on public.workspaces for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists "Users can view workspace members" on public.workspace_members;
create policy "Users can view workspace members" on public.workspace_members for select to authenticated
  using (public.user_is_workspace_member(workspace_id));

drop policy if exists "Users can add workspace members" on public.workspace_members;
create policy "Users can add workspace members" on public.workspace_members for insert to authenticated
  with check (exists (select 1 from public.workspaces where id = workspace_id and owner_id = auth.uid()) or user_id = auth.uid());

drop policy if exists "Anon can read and write experiments" on public.experiments;
create policy "Anon can read and write experiments"
  on public.experiments
  for all
  to anon
  using (true)
  with check (true);

drop policy if exists "Users can manage their own experiments" on public.experiments;
create policy "Users can manage their own experiments"
  on public.experiments
  for all
  to authenticated
  using (public.user_is_workspace_member(experiments.workspace_id))
  with check (auth.uid() = user_id and public.user_is_workspace_member(experiments.workspace_id));
