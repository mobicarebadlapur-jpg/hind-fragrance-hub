-- Keep payment confirmation atomic with the transaction row created at checkout.
-- The checkout flow already creates a pending transaction with the gateway order id.
-- Confirmation must lock and settle that row instead of inserting a second ledger entry.

CREATE OR REPLACE FUNCTION public.confirm_paid_order(
  _order_id uuid,
  _gateway_order_id text,
  _payment_id text,
  _gateway text,
  _gateway_payment_id text,
  _amount numeric,
  _gateway_signature text DEFAULT NULL
)
RETURNS TABLE (order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  o public.orders%ROWTYPE;
  txn public.transactions%ROWTYPE;
  item record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF _order_id IS NULL
     OR _gateway_order_id IS NULL OR trim(_gateway_order_id) = ''
     OR _payment_id IS NULL OR trim(_payment_id) = ''
     OR _gateway IS NULL OR trim(_gateway) = ''
     OR _gateway_payment_id IS NULL OR trim(_gateway_payment_id) = ''
     OR _amount IS NULL OR _amount < 0 THEN
    RAISE EXCEPTION 'Invalid payment confirmation.';
  END IF;

  SELECT * INTO o
  FROM public.orders
  WHERE id = _order_id
    AND customer_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found.';
  END IF;

  IF o.status = 'paid' THEN
    RETURN QUERY SELECT o.order_number;
    RETURN;
  END IF;

  IF o.status NOT IN ('created', 'payment_pending') THEN
    RAISE EXCEPTION 'Order is not awaiting payment.';
  END IF;

  IF _amount <> o.total THEN
    RAISE EXCEPTION 'Payment amount does not match order total.';
  END IF;

  -- Lock and validate the exact pending ledger entry created at checkout.
  SELECT * INTO txn
  FROM public.transactions
  WHERE order_id = o.id
    AND user_id = o.customer_id
    AND payment_type = 'order'
    AND gateway_order_id = _gateway_order_id
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment transaction not found.';
  END IF;

  IF txn.status = 'success' THEN
    RETURN QUERY SELECT o.order_number;
    RETURN;
  END IF;

  IF txn.status <> 'created' THEN
    RAISE EXCEPTION 'Payment transaction is not pending.';
  END IF;

  IF txn.amount <> o.total THEN
    RAISE EXCEPTION 'Payment transaction amount does not match order total.';
  END IF;

  IF txn.gateway <> _gateway THEN
    RAISE EXCEPTION 'Payment gateway does not match the pending transaction.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.transactions
    WHERE payment_type = 'order'
      AND gateway_payment_id = _gateway_payment_id
      AND status = 'success'
      AND id <> txn.id
  ) THEN
    RAISE EXCEPTION 'Payment has already been processed.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.order_items WHERE order_id = o.id) THEN
    RAISE EXCEPTION 'Order has no items.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = o.id AND product_id IS NULL
  ) THEN
    RAISE EXCEPTION 'Order contains an invalid product line.';
  END IF;

  -- Lock every product involved in the order in deterministic id order.
  FOR item IN
    SELECT p.id, p.stock, p.status, q.quantity
    FROM public.products p
    JOIN (
      SELECT product_id, SUM(quantity)::int AS quantity
      FROM public.order_items
      WHERE order_id = o.id
      GROUP BY product_id
    ) q ON q.product_id = p.id
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

  UPDATE public.orders
  SET status = 'paid',
      payment_id = _payment_id
  WHERE id = o.id;

  UPDATE public.transactions
  SET status = 'success',
      gateway_payment_id = _gateway_payment_id,
      gateway_signature = _gateway_signature,
      updated_at = now()
  WHERE id = txn.id;

  RETURN QUERY SELECT o.order_number;
END;
$$;

-- Remove the obsolete five-argument version so callers cannot accidentally use
-- the old implementation that inserted a second payment transaction.
DROP FUNCTION IF EXISTS public.confirm_paid_order(uuid, text, text, text, numeric);

REVOKE ALL ON FUNCTION public.confirm_paid_order(uuid, text, text, text, text, numeric, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(uuid, text, text, text, text, numeric, text) TO authenticated, service_role;

COMMENT ON FUNCTION public.confirm_paid_order(uuid, text, text, text, text, numeric, text) IS
  'Atomically confirms an authenticated customer order by locking and settling its existing checkout transaction, deducting stock, and marking the order paid.';
