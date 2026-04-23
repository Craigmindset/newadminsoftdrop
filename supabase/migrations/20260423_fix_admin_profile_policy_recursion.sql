-- Prevent RLS recursion on admin_profile policies by using a non-inlinable
-- SECURITY DEFINER function that evaluates with row security disabled.
create or replace function public.is_super_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
  return exists (
    select 1
    from public.admin_profile ap
    where ap.id = auth.uid()
      and ap.role = 'super_admin'
      and ap.is_active = true
  );
end;
$$;

drop policy if exists "admin_profile_select_own_or_super_admin" on public.admin_profile;
drop policy if exists "admin_profile_update_own_or_super_admin" on public.admin_profile;
drop policy if exists "admin_profile_insert_super_admin" on public.admin_profile;
drop policy if exists "admin_profile_delete_super_admin" on public.admin_profile;

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
