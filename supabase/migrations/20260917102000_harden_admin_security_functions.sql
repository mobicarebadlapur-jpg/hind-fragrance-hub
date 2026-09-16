create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role then
    raise exception 'Profile role can only be changed by a trusted server process';
  end if;
  return new;
end;
$$;

revoke execute on function public.rls_auto_enable() from anon, authenticated;

revoke execute on function public.prevent_profile_role_change() from anon, authenticated;
