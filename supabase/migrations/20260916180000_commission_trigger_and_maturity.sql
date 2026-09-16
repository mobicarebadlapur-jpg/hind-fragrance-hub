-- Keep commission accounting attached to the order lifecycle and make the
-- configured holding period enforceable without requiring a separate status job.

DROP TRIGGER IF EXISTS orders_handle_commission ON public.orders;
CREATE TRIGGER orders_handle_commission
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_commission();

CREATE OR REPLACE FUNCTION public.get_available_commission(_partner_id uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT GREATEST(
    COALESCE((
      SELECT SUM(c.amount) FROM public.commissions c
      WHERE c.partner_id = _partner_id
        AND (
          c.status = 'available'
          OR (
            c.status IN ('pending', 'approved')
            AND c.available_at IS NOT NULL
            AND c.available_at <= now()
          )
        )
    ), 0)
    -
    COALESCE((
      SELECT SUM(p.amount) FROM public.payouts p
      WHERE p.partner_id = _partner_id
        AND p.status <> 'rejected'
    ), 0),
    0
  )::numeric;
$$;

REVOKE ALL ON FUNCTION public.get_available_commission(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_available_commission(uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.get_available_commission(uuid) IS
  'Returns matured commission balance. Pending/approved commissions become available only when available_at has passed; rejected payouts do not reduce the balance.';
