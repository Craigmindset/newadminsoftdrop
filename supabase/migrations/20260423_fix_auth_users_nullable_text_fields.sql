-- Defensive patch for GoTrue schema scan failures during sign-in.
-- Some projects can contain NULL values in auth.users text fields that
-- GoTrue expects to deserialize as strings.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'email_change'
  ) then
    update auth.users
    set email_change = ''
    where email_change is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'email_change_token_new'
  ) then
    update auth.users
    set email_change_token_new = ''
    where email_change_token_new is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'email_change_token_current'
  ) then
    update auth.users
    set email_change_token_current = ''
    where email_change_token_current is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'phone_change'
  ) then
    update auth.users
    set phone_change = ''
    where phone_change is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'phone_change_token'
  ) then
    update auth.users
    set phone_change_token = ''
    where phone_change_token is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'reauthentication_token'
  ) then
    update auth.users
    set reauthentication_token = ''
    where reauthentication_token is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'confirmation_token'
  ) then
    update auth.users
    set confirmation_token = ''
    where confirmation_token is null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'recovery_token'
  ) then
    update auth.users
    set recovery_token = ''
    where recovery_token is null;
  end if;
end;
$$;
