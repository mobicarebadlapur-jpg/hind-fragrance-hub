CREATE OR REPLACE FUNCTION public.get_available_commission(_partner_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor uuid := auth.uid();
  result numeric;
BEGIN
  -- actor is NULL for trusted service-role/server calls and internal trigger use.
  IF actor IS NOT NULL
     AND NOT public.has_role(actor, 'admin')
     AND NOT EXISTS (SELECT 1 FROM public.partners
                     WHERE id = _partner_id AND user_id = actor) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  SELECT GREATEST(
    COALESCE((
      SELECT SUM(c.amount) FROM public.commissions c
      WHERE c.partner_id = _partner_id
        AND (c.status = 'available'
             OR (c.status = 'approved' AND c.available_at IS NOT NULL AND c.available_at <= now()))
    ), 0)
    -
    COALESCE((
      SELECT SUM(p.amount) FROM public.payouts p
      WHERE p.partner_id = _partner_id AND p.status <> 'rejected'
    ), 0)
  , 0)::numeric INTO result;

  RETURN result;
END; $$;

REVOKE ALL ON FUNCTION public.get_available_commission(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_available_commission(uuid) TO authenticated, service_role;