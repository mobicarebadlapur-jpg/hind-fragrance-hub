-- Restore inventory exactly once when a paid order is cancelled, refunded, or returned.
-- Stock is deducted by confirm_paid_order(); only orders that reached a stock-consuming
-- lifecycle state are eligible for restoration.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stock_released_at timestamptz;

CREATE OR REPLACE FUNCTION public.restore_order_stock_on_reversal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  item record;
BEGIN
  IF NEW.status IN ('cancelled', 'refunded', 'returned')
     AND OLD.status IN ('paid', 'processing', 'shipped', 'delivered')
     AND NEW.stock_released_at IS NULL THEN

    -- Lock the affected products in deterministic order to avoid cross-order
    -- deadlocks when multiple reversals touch the same products concurrently.
    FOR item IN
      SELECT oi.product_id, SUM(oi.quantity)::int AS quantity
      FROM public.order_items oi
      WHERE oi.order_id = NEW.id
        AND oi.product_id IS NOT NULL
      GROUP BY oi.product_id
      ORDER BY oi.product_id
      FOR UPDATE
    LOOP
      UPDATE public.products
      SET stock = stock + item.quantity
      WHERE id = item.product_id;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Cannot restore stock: product % no longer exists.', item.product_id;
      END IF;
    END LOOP;

    UPDATE public.orders
    SET stock_released_at = now()
    WHERE id = NEW.id
      AND stock_released_at IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_restore_stock_on_reversal ON public.orders;
CREATE TRIGGER orders_restore_stock_on_reversal
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_order_stock_on_reversal();

REVOKE ALL ON FUNCTION public.restore_order_stock_on_reversal() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.restore_order_stock_on_reversal() TO service_role;

COMMENT ON FUNCTION public.restore_order_stock_on_reversal() IS
  'Restores paid-order inventory once when an order transitions to cancelled, refunded, or returned.';
