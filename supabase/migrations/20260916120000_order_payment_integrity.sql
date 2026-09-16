-- Order/payment integrity hardening.
-- These constraints protect the database even if a server-side caller bypasses UI validation.

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_totals_nonnegative,
  ADD CONSTRAINT orders_totals_nonnegative
    CHECK (subtotal >= 0 AND shipping >= 0 AND tax >= 0 AND discount >= 0 AND total >= 0);

ALTER TABLE public.order_items
  DROP CONSTRAINT IF EXISTS order_items_quantity_positive,
  ADD CONSTRAINT order_items_quantity_positive
    CHECK (quantity > 0 AND quantity <= 20),
  DROP CONSTRAINT IF EXISTS order_items_financial_values_nonnegative,
  ADD CONSTRAINT order_items_financial_values_nonnegative
    CHECK (unit_price >= 0 AND line_total >= 0);

-- One payment transaction may confirm an order only once.
-- The payment confirmation RPC remains responsible for the atomic stock/order transition;
-- this index provides a database-level replay/idempotency guard for order transactions.
CREATE UNIQUE INDEX IF NOT EXISTS transactions_order_unique
  ON public.transactions (gateway_order_id)
  WHERE payment_type = 'order' AND gateway_order_id IS NOT NULL;

-- A successful order transaction must never be recorded for a different amount than the order.
-- The confirmation RPC should insert the order transaction using the order's canonical total.

COMMENT ON INDEX public.transactions_order_unique IS
  'Prevents duplicate order payment transactions/replay confirmations for the same gateway order id.';
