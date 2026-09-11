create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mosquito_count integer not null check (mosquito_count between 1 and 10000),
  caught_at timestamptz not null default now(),
  catch_method text not null,
  note text,
  proof_image_url text,
  latitude numeric,
  longitude numeric,
  public_latitude numeric,
  public_longitude numeric,
  city text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.room_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  image_url text,
  image_hash text not null,
  estimated_capacity integer not null,
  estimated_occupancy integer not null,
  suitability_score integer not null check (suitability_score between 0 and 100),
  risk_level text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.catches enable row level security;
alter table public.room_scans enable row level security;

create policy "profiles are public to read" on public.profiles for select using (true);
create policy "users create their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "users read their own catches" on public.catches for select using (auth.uid() = user_id);
create policy "users insert their own catches" on public.catches for insert with check (auth.uid() = user_id);
create policy "users update their own catches" on public.catches for update using (auth.uid() = user_id);
create policy "users delete their own catches" on public.catches for delete using (auth.uid() = user_id);
create policy "users read their own scans" on public.room_scans for select using (auth.uid() = user_id or user_id is null);
create policy "users create scans" on public.room_scans for insert with check (auth.uid() = user_id or user_id is null);

-- Public map queries should use an RPC/view that only returns rounded coordinates
-- and aggregated cells. Never select latitude/longitude for anonymous clients.
create or replace view public.public_catch_cells as
select public_latitude, public_longitude, sum(mosquito_count)::integer as total_catches,
  count(distinct user_id)::integer as unique_reporters,
  round((sum(mosquito_count)::numeric / greatest(count(distinct user_id), 1)), 1) as intensity
from public.catches
where public_latitude is not null and public_longitude is not null
group by public_latitude, public_longitude;
