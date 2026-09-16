-- Harden payout requests against concurrent double-spend attempts.
-- The application checks balance before insert, but two requests can race.
-- Serialize payout creation per partner inside the database transaction.

CREATE OR REPLACE FUNCTION public.validate_payout_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  cfg jsonb;
  min_payout numeric;
  available numeric;
  partner_active boolean;
BEGIN
  -- Serialize payout creation for this partner so two concurrent requests
  -- cannot both observe the same available commission balance.
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.partner_id::text, 0));

  SELECT EXISTS (
    SELECT 1 FROM public.partners
    WHERE id = NEW.partner_id AND status = 'active'
  ) INTO partner_active;

  IF NOT partner_active THEN
    RAISE EXCEPTION 'Only active business partners can request a payout.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.payouts
    WHERE partner_id = NEW.partner_id
      AND status IN ('requested','under_review','approved','processing')
  ) THEN
    RAISE EXCEPTION 'You already have a payout in progress.';
  END IF;

  SELECT value INTO cfg FROM public.app_settings WHERE key = 'commission';
  min_payout := COALESCE((cfg->>'min_payout')::numeric, 500);
  available := public.get_available_commission(NEW.partner_id);

  -- Frontend/server input is never trusted: clamp to the live balance.
  IF NEW.amount IS NULL OR NEW.amount > available THEN
    NEW.amount := available;
  END IF;

  IF NEW.amount < min_payout THEN
    RAISE EXCEPTION 'Minimum payout amount is %', min_payout;
  END IF;

  NEW.status := 'requested';
  RETURN NEW;
END;
$$;
