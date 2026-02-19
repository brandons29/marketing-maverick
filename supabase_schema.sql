-- ============================================================
-- Marketing Maverick — Supabase Schema
-- Run this in Supabase SQL Editor before first deploy.
-- ============================================================

-- 1. Enable pgcrypto (optional but available for key encryption)
create extension if not exists pgcrypto;

-- 2. Users table
create table if not exists public.users (
  id                  uuid primary key references auth.users on delete cascade,
  api_key             text,           -- User's OpenAI key (store encrypted with pgcrypto in prod)
  subscription_status text not null default 'free' check (subscription_status in ('free', 'pro')),
  run_count           integer not null default 0 check (run_count >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 3. Row Level Security
alter table public.users enable row level security;

-- 4. RLS Policies
-- SELECT: users can only read their own row
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

-- INSERT: users can only insert their own row (profile creation on signup)
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

-- UPDATE: users can only update their own row
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Note: Service Role bypasses RLS — used by webhook handler for admin writes.

-- 5. Atomic increment function for chat runs
create or replace function public.increment_run_count(user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.users
  set run_count = run_count + 1,
      updated_at = now()
  where id = user_id;
end;
$$;

-- 6. Auto-create profile row when a new auth user signs up
-- This prevents "Profile not found" errors on first dashboard visit.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, run_count, subscription_status)
  values (new.id, 0, 'free')
  on conflict (id) do nothing;  -- idempotent: safe to call multiple times
  return new;
end;
$$;

-- Drop trigger if re-running this script, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Updated_at auto-stamp trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- OPTIONAL: pgcrypto encryption helpers
-- If you want to encrypt the api_key column at rest:
--
-- Store:
--   UPDATE users SET api_key = pgp_sym_encrypt('sk-...', current_setting('app.encryption_key'))
--   WHERE id = '...';
--
-- Read (in service role only — never in client queries):
--   SELECT pgp_sym_decrypt(api_key::bytea, current_setting('app.encryption_key'))
--   FROM users WHERE id = '...';
--
-- Set the passphrase in Supabase:
--   ALTER DATABASE postgres SET "app.encryption_key" = 'your-secret-passphrase';
-- ============================================================
