-- JANITTAH WHITE LUXE BEAUTY — SUPABASE DATABASE
-- Run this entire file in Supabase SQL Editor.
-- Then create your admin user in Authentication > Users and insert its UUID into profiles.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  service text not null,
  preferred_date date not null,
  preferred_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','declined','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  subject text not null,
  service text,
  message text not null,
  status text not null default 'unread' check (status in ('unread','read','replied')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.support_messages enable row level security;

-- Helper: only an authenticated admin can read/change private records.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admin can read own profile" on public.profiles;
create policy "admin can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "public can submit appointments" on public.appointments;
create policy "public can submit appointments"
on public.appointments for insert
to anon, authenticated
with check (
  char_length(trim(customer_name)) between 2 and 120
  and position('@' in customer_email) > 1
  and char_length(trim(service)) between 2 and 120
);

drop policy if exists "admins can read appointments" on public.appointments;
create policy "admins can read appointments"
on public.appointments for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can update appointments" on public.appointments;
create policy "admins can update appointments"
on public.appointments for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can submit support messages" on public.support_messages;
create policy "public can submit support messages"
on public.support_messages for insert
to anon, authenticated
with check (
  char_length(trim(customer_name)) between 2 and 120
  and position('@' in customer_email) > 1
  and char_length(trim(subject)) between 2 and 180
  and char_length(trim(message)) between 1 and 5000
);

drop policy if exists "admins can read support messages" on public.support_messages;
create policy "admins can read support messages"
on public.support_messages for select
to authenticated
using (public.is_admin());

drop policy if exists "admins can update support messages" on public.support_messages;
create policy "admins can update support messages"
on public.support_messages for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- After creating the admin user in Authentication > Users, replace YOUR_ADMIN_USER_UUID:
-- insert into public.profiles (id, is_admin) values ('YOUR_ADMIN_USER_UUID', true);
