-- 1. Remove client-side partner creation (activation is server-side only)
DROP POLICY IF EXISTS "partner self insert" ON public.partners;

-- 2. Explicit admin insert path (service_role bypasses RLS)
CREATE POLICY "partner admin insert" ON public.partners
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Least-privilege table grants
REVOKE ALL ON public.partners FROM anon, authenticated;
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT UPDATE ON public.partners TO authenticated; -- gated by admin-only UPDATE policy
GRANT INSERT ON public.partners TO authenticated; -- gated by admin-only INSERT policy
GRANT ALL ON public.partners TO service_role;

-- 4. Partner id sequence is server-side only
REVOKE ALL ON SEQUENCE public.partner_id_seq FROM anon, authenticated;
GRANT ALL ON SEQUENCE public.partner_id_seq TO service_role;

-- 5. next_partner_code stays SECURITY DEFINER (it must own the sequence bump)
--    but is executable only by trusted server-side code.
REVOKE ALL ON FUNCTION public.next_partner_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_partner_code() TO service_role;
ALTER FUNCTION public.next_partner_code() SET search_path = public, pg_temp;