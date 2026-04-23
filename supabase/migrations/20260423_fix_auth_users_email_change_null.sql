-- Fix Supabase Auth login crash:
-- error finding user: Scan error on column "email_change": converting NULL to string is unsupported
--
-- On hosted Supabase projects, roles often cannot ALTER auth.users ownership-level
-- properties (e.g. SET NOT NULL / SET DEFAULT), but can still patch data.
-- The update below is the essential runtime fix.

update auth.users
set email_change = ''
where email_change is null;
