-- Protect order lifecycle transitions at the database boundary.
-- Customers may only cancel their own orders before fulfillment; administrative
-- and trusted server paths may advance an order through the defined lifecycle.

CREATE OR REPLACE FUNCTION public.guard_order_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor uuid := auth.uid();
  is_admin boolean := false;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  -- service_role/server-side calls have no end-user auth.uid().
  -- Authenticated admin users may manage the full lifecycle.
  IF actor IS NOT NULL THEN
    is_admin := public.has_role(actor, 'admin'::app_role);

    IF NOT is_admin THEN
      -- A customer can only cancel their own order while it is still awaiting
      -- payment or immediately after payment, before fulfillment begins.
      IF NEW.customer_id <> actor
         OR NEW.status <> 'cancelled'
         OR OLD.status NOT IN ('created', 'payment_pending', 'paid') THEN
        RAISE EXCEPTION 'You are not allowed to change this order status.';
      END IF;
    END IF;
  END IF;

  -- Enforce a monotonic/explicit lifecycle for all non-admin trusted writes too.
  IF OLD.status = 'created' AND NEW.status NOT IN ('payment_pending', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  ELSIF OLD.status = 'payment_pending' AND NEW.status NOT IN ('paid', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  ELSIF OLD.status = 'paid' AND NEW.status NOT IN ('processing', 'cancelled', 'refunded') THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  ELSIF OLD.status = 'processing' AND NEW.status NOT IN ('shipped', 'cancelled', 'refunded') THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  ELSIF OLD.status = 'shipped' AND NEW.status NOT IN ('delivered', 'returned', 'refunded', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  ELSIF OLD.status = 'delivered' AND NEW.status NOT IN ('returned', 'refunded') THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status;
  ELSIF OLD.status IN ('cancelled', 'refunded', 'returned') THEN
    RAISE EXCEPTION 'Terminal order status cannot be changed.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_guard_status_transition ON public.orders;
CREATE TRIGGER orders_guard_status_transition
  BEFORE UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_order_status_transition();

REVOKE ALL ON FUNCTION public.guard_order_status_transition() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.guard_order_status_transition() TO authenticated, service_role;

COMMENT ON FUNCTION public.guard_order_status_transition() IS
  'Restricts customer order updates to cancellation and enforces the allowed order lifecycle transitions at the database boundary.';
