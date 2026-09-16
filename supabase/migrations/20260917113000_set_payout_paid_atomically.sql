create or replace function public.set_payout_paid_atomically(_payout_id uuid)
returns table(payout_amount numeric, partner_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_payout public.payouts%rowtype;
  v_commission public.commissions%rowtype;
  v_remaining numeric;
  v_amount numeric;
begin
  select * into v_payout
  from public.payouts
  where id = _payout_id
  for update;

  if not found then
    raise exception 'Payout not found';
  end if;

  if v_payout.status = 'paid' then
    return query select v_payout.amount, v_payout.partner_id;
    return;
  end if;

  v_remaining := round(v_payout.amount::numeric, 2);

  for v_commission in
    select *
    from public.commissions
    where partner_id = v_payout.partner_id
      and status = 'available'
    order by created_at asc, id asc
    for update
  loop
    exit when v_remaining <= 0;
    v_amount := round(v_commission.amount::numeric, 2);
    if v_amount <= v_remaining then
      update public.commissions
      set status = 'paid', updated_at = now()
      where id = v_commission.id and status = 'available';
      v_remaining := round(v_remaining - v_amount, 2);
    end if;
  end loop;

  if v_remaining > 0 then
    raise exception 'Available commission balance is insufficient for this payout';
  end if;

  update public.payouts
  set status = 'paid',
      processed_at = now(),
      updated_at = now()
  where id = v_payout.id;

  return query select v_payout.amount, v_payout.partner_id;
end;
$$;

revoke all on function public.set_payout_paid_atomically(uuid) from public, anon, authenticated;
grant execute on function public.set_payout_paid_atomically(uuid) to service_role;
