create extension if not exists "pgcrypto";

create table if not exists public.admin_notification (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  target text not null check (target in (
    'all',
    'senders',
    'carriers'
  )),
  priority text not null default 'medium'::text check (priority in (
    'high',
    'medium',
    'low'
  )),
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists admin_notification_created_at_idx
  on public.admin_notification(created_at desc);

alter table public.admin_notification enable row level security;

drop policy if exists "admin_notification_select_super_admin"
on public.admin_notification;

create policy "admin_notification_select_super_admin"
on public.admin_notification
for select
using (public.is_super_admin());

drop policy if exists "admin_notification_insert_super_admin"
on public.admin_notification;

create policy "admin_notification_insert_super_admin"
on public.admin_notification
for insert
with check (public.is_super_admin());

insert into public.admin_notification (title, message, target, priority)
values
  (
    'System Maintenance',
    'Scheduled maintenance is planned for Sunday from 2:00 AM to 4:00 AM. During this window, the app may be unavailable.',
    'all',
    'high'
  ),
  (
    'New App Update',
    'A new app update is available with performance improvements and bug fixes. Please update to the latest version.',
    'all',
    'medium'
  ),
  (
    'Carrier Incentive',
    'Complete 10 deliveries this week to earn a bonus on all trips. Check your dashboard for details.',
    'carriers',
    'high'
  ),
  (
    'Sender Promotion',
    'Enjoy discounted shipping on your next deliveries. Open the app to view the latest promo code.',
    'senders',
    'medium'
  ),
  (
    'Security Notice',
    'For your security, never share your password or OTP. Contact support if you notice suspicious activity.',
    'all',
    'high'
  );
