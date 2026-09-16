create or replace function public.finalize_order_refund(_order_id uuid, _refund_payment_id text)
returns table(order_number text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.orders%rowtype;
  v_item record;
begin
  select * into v_order
  from public.orders
  where id = _order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if v_order.status = 'refunded' and v_order.refund_status = 'paid' then
    return query select v_order.order_number;
    return;
  end if;

  if v_order.refund_status not in ('requested', 'approved') then
    raise exception 'Refund is not pending';
  end if;

  for v_item in
    select product_id, quantity
    from public.order_items
    where order_id = v_order.id
  loop
    if v_item.product_id is not null then
      update public.products
      set stock = stock + v_item.quantity,
          updated_at = now()
      where id = v_item.product_id;
    end if;
  end loop;

  update public.commissions
  set status = 'cancelled',
      updated_at = now()
  where order_id = v_order.id
    and status in ('pending', 'available');

  update public.orders
  set status = 'refunded',
      refund_status = 'paid',
      refund_processed_at = now(),
      refund_payment_id = _refund_payment_id,
      updated_at = now()
  where id = v_order.id;

  return query select v_order.order_number;
end;
$$;

revoke all on function public.finalize_order_refund(uuid, text) from public, anon, authenticated;
grant execute on function public.finalize_order_refund(uuid, text) to service_role;
