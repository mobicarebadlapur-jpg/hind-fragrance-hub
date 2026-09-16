-- Bind referral attribution to the same browser visitor that recorded the click.
-- This prevents a referral code from being attributed merely because any click
-- for that partner exists within the cookie window.

ALTER TABLE public.referral_clicks
  ADD COLUMN IF NOT EXISTS visitor_id uuid;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS referral_visitor_id uuid;

CREATE INDEX IF NOT EXISTS referral_clicks_partner_visitor_created_idx
  ON public.referral_clicks (partner_id, visitor_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.validate_order_attribution()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  cfg jsonb;
  window_days int;
  p record;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    NEW.referral_code := upper(trim(NEW.referral_code));
  END IF;

  SELECT value INTO cfg FROM public.app_settings WHERE key = 'referral';
  window_days := COALESCE((cfg->>'cookie_days')::int, 30);

  IF NEW.referral_code IS NOT NULL THEN
    SELECT id, user_id, status INTO p
    FROM public.partners
    WHERE referral_code = NEW.referral_code;

    IF p.id IS NULL OR p.status <> 'active' OR p.user_id = NEW.customer_id THEN
      NEW.partner_id := NULL;
      NEW.referral_code := NULL;
      NEW.referral_visitor_id := NULL;
    ELSE
      NEW.partner_id := p.id;
    END IF;
  ELSE
    NEW.partner_id := NULL;
    NEW.referral_visitor_id := NULL;
  END IF;

  -- The order must carry the same visitor identifier that was stored with the
  -- referral click. Without that proof of the click, do not attribute a commission.
  IF NEW.partner_id IS NOT NULL
     AND NEW.referral_visitor_id IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM public.referral_clicks
       WHERE partner_id = NEW.partner_id
         AND visitor_id = NEW.referral_visitor_id
         AND created_at >= now() - (window_days || ' days')::interval
     ) THEN
    NEW.partner_id := NULL;
    NEW.referral_code := NULL;
    NEW.referral_visitor_id := NULL;
  ELSIF NEW.partner_id IS NOT NULL AND NEW.referral_visitor_id IS NULL THEN
    NEW.partner_id := NULL;
    NEW.referral_code := NULL;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS orders_validate_attribution ON public.orders;
CREATE TRIGGER orders_validate_attribution
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_attribution();
