-- Atomic payment confirmation + inventory decrement.
-- The server uses the service role for this RPC; clients cannot execute it directly.
CREATE OR REPLACE FUNCTION public.confirm_paid_order(
  _order_id uuid,
  _payment_id text,
  _gateway text,
  _gateway_payment_id text,
  _amount numeric
)
RETURNS TABLE(order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor_role text := auth.role();
  locked_order public.orders%ROWTYPE;
  item record;
BEGIN
  IF actor_role IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  SELECT * INTO locked_order
  FROM public.orders
  WHERE id = _order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  -- Idempotent replay: an already-paid order is successful only when the
  -- same payment identifier is presented.
  IF locked_order.status = 'paid' THEN
    IF locked_order.payment_id = _payment_id THEN
      RETURN QUERY SELECT locked_order.order_number;
      RETURN;
    END IF;
    RAISE EXCEPTION 'Order has already been paid';
  END IF;

  IF locked_order.status NOT IN ('payment_pending','created') THEN
    RAISE EXCEPTION 'Order is not payable';
  END IF;

  IF _amount IS DISTINCT FROM locked_order.total THEN
    RAISE EXCEPTION 'Payment amount does not match order total';
  END IF;

  -- Lock every affected product row and validate stock before changing any
  -- inventory. PostgreSQL row locks serialize competing checkouts for the
  -- same product, preventing overselling under concurrent payment calls.
  FOR item IN
    SELECT oi.product_id, oi.quantity, p.stock, p.status
    FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = locked_order.id
    ORDER BY oi.product_id
    FOR UPDATE OF p
  LOOP
    IF item.product_id IS NULL OR item.status <> 'active' THEN
      RAISE EXCEPTION 'Product is no longer available';
    END IF;
    IF item.stock < item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock';
    END IF;
  END LOOP;

  FOR item IN
    SELECT oi.product_id, oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = locked_order.id
    ORDER BY oi.product_id
  LOOP
    UPDATE public.products
    SET stock = stock - item.quantity
    WHERE id = item.product_id;
  END LOOP;

  INSERT INTO public.transactions(
    user_id, partner_id, amount, gateway, gateway_order_id,
    gateway_payment_id, status, payment_type
  )
  VALUES (
    locked_order.customer_id, locked_order.partner_id, locked_order.total,
    _gateway, locked_order.order_number, _gateway_payment_id,
    'success', 'product_order'
  );

  UPDATE public.orders
  SET status = 'paid', payment_id = _payment_id
  WHERE id = locked_order.id;

  RETURN QUERY SELECT locked_order.order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_paid_order(uuid,text,text,text,numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(uuid,text,text,text,numeric) TO service_role;
