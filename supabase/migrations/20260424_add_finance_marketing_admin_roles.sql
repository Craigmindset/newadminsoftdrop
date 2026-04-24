alter table public.admin_profile
drop constraint if exists admin_profile_role_check;

alter table public.admin_profile
add constraint admin_profile_role_check
check (
  role = any (
    array[
      'super_admin'::text,
      'manager'::text,
      'support'::text,
      'finance'::text,
      'marketing'::text
    ]
  )
);
