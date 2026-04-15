create extension if not exists "pgcrypto";

create table if not exists public.admin_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  role text default 'manager'::text check (role in (
    'super_admin',
    'manager',
    'support'
  )),
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists admin_profile_role_idx on public.admin_profile(role);
create index if not exists admin_profile_email_idx on public.admin_profile(email);

create or replace function public.set_admin_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_profile_updated_at on public.admin_profile;
create trigger trg_admin_profile_updated_at
before update on public.admin_profile
for each row execute function public.set_admin_profile_updated_at();

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profile ap
    where ap.id = auth.uid()
      and ap.role = 'super_admin'
      and ap.is_active = true
  );
$$;

alter table public.admin_profile enable row level security;

create policy "admin_profile_select_own_or_super_admin"
on public.admin_profile
for select
using (auth.uid() = id or public.is_super_admin());

create policy "admin_profile_update_own_or_super_admin"
on public.admin_profile
for update
using (auth.uid() = id or public.is_super_admin())
with check (auth.uid() = id or public.is_super_admin());

create policy "admin_profile_insert_super_admin"
on public.admin_profile
for insert
with check (public.is_super_admin());

create policy "admin_profile_delete_super_admin"
on public.admin_profile
for delete
using (public.is_super_admin());
