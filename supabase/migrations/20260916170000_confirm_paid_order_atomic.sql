-- Atomic order payment confirmation.
-- Locks the order and its products, verifies the canonical total, deducts stock,
-- records one payment transaction, and marks the order paid in one transaction.

CREATE OR REPLACE FUNCTION public.confirm_paid_order(
  _order_id uuid,
  _payment_id text,
  _gateway text,
  _gateway_payment_id text,
  _amount numeric
)
RETURNS TABLE (order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  o public.orders%ROWTYPE;
  item record;
  existing_tx public.transactions%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF _order_id IS NULL OR _payment_id IS NULL OR trim(_payment_id) = ''
     OR _gateway IS NULL OR trim(_gateway) = ''
     OR _gateway_payment_id IS NULL OR trim(_gateway_payment_id) = ''
     OR _amount IS NULL OR _amount < 0 THEN
    RAISE EXCEPTION 'Invalid payment confirmation.';
  END IF;

  -- Serialize all confirmations for this order.
  SELECT * INTO o
  FROM public.orders
  WHERE id = _order_id
    AND customer_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found.';
  END IF;

  -- A concurrent/retried request after the first commit is idempotent.
  IF o.status = 'paid' THEN
    RETURN QUERY SELECT o.order_number;
    RETURN;
  END IF;

  IF o.status NOT IN ('created', 'payment_pending') THEN
    RAISE EXCEPTION 'Order is not awaiting payment.';
  END IF;

  -- The client cannot choose the amount: it must equal the order total stored in DB.
  IF _amount <> o.total THEN
    RAISE EXCEPTION 'Payment amount does not match order total.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.transactions
    WHERE payment_type = 'order'
      AND gateway_order_id = o.id::text
  ) THEN
    RAISE EXCEPTION 'Payment transaction already exists for this order.';
  END IF;

  -- Lock every product involved in the order in deterministic id order.
  -- This serializes competing orders and prevents overselling.
  FOR item IN
    SELECT p.id, p.stock, p.status, SUM(oi.quantity)::int AS quantity
    FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = o.id
    GROUP BY p.id, p.stock, p.status
    ORDER BY p.id
    FOR UPDATE OF p
  LOOP
    IF item.status <> 'active' THEN
      RAISE EXCEPTION 'Product is no longer available.';
    END IF;
    IF item.stock < item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product %.', item.id;
    END IF;

    UPDATE public.products
    SET stock = stock - item.quantity
    WHERE id = item.id;
  END LOOP;

  -- Every order must have at least one persisted line before payment can settle.
  IF NOT EXISTS (SELECT 1 FROM public.order_items WHERE order_id = o.id) THEN
    RAISE EXCEPTION 'Order has no items.';
  END IF;

  UPDATE public.orders
  SET status = 'paid',
      payment_id = _payment_id
  WHERE id = o.id;

  INSERT INTO public.transactions(
    user_id, amount, currency, gateway, gateway_order_id,
    gateway_payment_id, status, payment_type
  )
  VALUES (
    o.customer_id, o.total, 'INR', _gateway, o.id::text,
    _gateway_payment_id, 'success', 'order'
  );

  RETURN QUERY SELECT o.order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_paid_order(uuid, text, text, text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(uuid, text, text, text, numeric) TO authenticated, service_role;

COMMENT ON FUNCTION public.confirm_paid_order(uuid, text, text, text, numeric) IS
  'Atomically confirms an authenticated customer order: validates amount, locks products, deducts stock, records the payment transaction, and marks the order paid.';
