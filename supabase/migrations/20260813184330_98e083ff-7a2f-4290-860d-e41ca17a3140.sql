
CREATE OR REPLACE FUNCTION public.next_partner_code()
RETURNS text LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT 'HFBP' || nextval('public.partner_id_seq')::text;
$$;
REVOKE ALL ON FUNCTION public.next_partner_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_partner_code() TO service_role;
