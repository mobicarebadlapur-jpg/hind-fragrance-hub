-- Checkout hardening: prevent a failed payment-ledger insert from leaving an unusable payment_pending order.
-- The trusted server may remove only a freshly-created order that has no successful payment.

CREATE OR REPLACE FUNCTION public.delete_unpaid_order(_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted boolean := false;
BEGIN
  IF _order_id IS NULL THEN
    RETURN false;
  END IF;

  DELETE FROM public.orders o
  WHERE o.id = _order_id
    AND o.status IN ('created', 'payment_pending')
    AND o.payment_id IS NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.transactions t
      WHERE t.order_id = o.id
        AND t.payment_type = 'order'
        AND t.status = 'success'
    );

  deleted := FOUND;
  RETURN deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_unpaid_order(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_unpaid_order(uuid) TO service_role;

COMMENT ON FUNCTION public.delete_unpaid_order(uuid)
IS 'Removes only an unpaid checkout order with no successful order transaction; callable only by the trusted server.';
