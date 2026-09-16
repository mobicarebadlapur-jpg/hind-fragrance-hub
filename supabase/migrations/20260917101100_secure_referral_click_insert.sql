drop function if exists public.track_referral_click(text,text,uuid);
alter table public.referral_clicks enable row level security;
drop policy if exists referral_clicks_anon_insert on public.referral_clicks;
create policy referral_clicks_anon_insert on public.referral_clicks for insert to anon, authenticated
with check (
  exists (select 1 from public.partners p where p.id = referral_clicks.partner_id and p.status = 'active' and upper(p.referral_code) = upper(referral_clicks.referral_code))
  and length(referral_clicks.referral_code) between 1 and 32
  and length(referral_clicks.landing_page) between 1 and 500
);
create or replace function public.track_referral_click(p_referral_code text, p_landing_page text, p_visitor_id uuid default null)
returns void language sql security invoker set search_path = public, pg_temp as $$
  insert into public.referral_clicks(referral_code, partner_id, landing_page, visitor_id)
  select trim(p_referral_code), p.id, left(trim(p_landing_page),500), p_visitor_id
  from public.partners p
  where upper(p.referral_code)=upper(trim(p_referral_code)) and p.status='active'
  limit 1;
$$;
grant execute on function public.track_referral_click(text,text,uuid) to anon, authenticated;