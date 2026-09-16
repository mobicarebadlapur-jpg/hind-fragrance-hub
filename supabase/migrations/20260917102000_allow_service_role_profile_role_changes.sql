create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role and current_user <> 'service_role' then
    raise exception 'Profile role can only be changed by a trusted server process';
  end if;
  return new;
end;
$$;
