create or replace function public.normalize_commission_status()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status = 'approved' then
    new.status := 'available';
    new.available_at := coalesce(new.available_at, now());
  elsif new.status = 'reversed' then
    new.status := 'cancelled';
  end if;
  return new;
end;
$$;

drop trigger if exists commissions_normalize_status on public.commissions;
create trigger commissions_normalize_status
before insert or update of status on public.commissions
for each row execute function public.normalize_commission_status();
