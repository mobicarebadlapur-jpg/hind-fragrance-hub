-- ============ PART A: PAYOUT SECURITY ============

-- 1. Live available commission (server-side source of truth)
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
        AND (c.status = 'available'
             OR (c.status = 'approved' AND c.available_at IS NOT NULL AND c.available_at <= now()))
    ), 0)
    -
    COALESCE((
      SELECT SUM(p.amount) FROM public.payouts p
      WHERE p.partner_id = _partner_id AND p.status <> 'rejected'
    ), 0)
  , 0)::numeric;
$$;

REVOKE ALL ON FUNCTION public.get_available_commission(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_available_commission(uuid) TO authenticated, service_role;

-- 2. No direct payout creation from the browser
DROP POLICY IF EXISTS "payouts insert" ON public.payouts;
REVOKE INSERT, UPDATE, DELETE ON public.payouts FROM authenticated;
REVOKE ALL ON public.payouts FROM anon;
GRANT SELECT (id, partner_id, amount, method, account_holder, bank_name, status, notes, created_at, updated_at)
  ON public.payouts TO authenticated;
GRANT UPDATE (status, notes) ON public.payouts TO authenticated;
GRANT ALL ON public.payouts TO service_role;

-- 3. Masked bank/UPI exposure for non-admin clients
ALTER TABLE public.payouts
  ADD COLUMN IF NOT EXISTS account_number_last4 text
    GENERATED ALWAYS AS (CASE WHEN account_number IS NULL THEN NULL ELSE right(account_number, 4) END) STORED,
  ADD COLUMN IF NOT EXISTS upi_id_masked text
    GENERATED ALWAYS AS (CASE WHEN upi_id IS NULL THEN NULL ELSE '****' || right(upi_id, 4) END) STORED,
  ADD COLUMN IF NOT EXISTS ifsc_masked text
    GENERATED ALWAYS AS (CASE WHEN ifsc IS NULL THEN NULL ELSE '****' || right(ifsc, 4) END) STORED;

GRANT SELECT (account_number_last4, upi_id_masked, ifsc_masked) ON public.payouts TO authenticated;

-- Admin-only full detail lookup
CREATE OR REPLACE FUNCTION public.get_payout_bank_details(_payout_id uuid)
RETURNS TABLE (account_holder text, bank_name text, account_number text, ifsc text, upi_id text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  RETURN QUERY
    SELECT p.account_holder, p.bank_name, p.account_number, p.ifsc, p.upi_id
    FROM public.payouts p WHERE p.id = _payout_id;
END; $$;

REVOKE ALL ON FUNCTION public.get_payout_bank_details(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_payout_bank_details(uuid) TO authenticated, service_role;

-- 4. Payout request validation (applies to every path, including server functions)
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
  SELECT EXISTS (SELECT 1 FROM public.partners
                 WHERE id = NEW.partner_id AND status = 'active') INTO partner_active;
  IF NOT partner_active THEN
    RAISE EXCEPTION 'Only active business partners can request a payout.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.payouts
             WHERE partner_id = NEW.partner_id
               AND status IN ('requested','under_review','approved','processing')) THEN
    RAISE EXCEPTION 'You already have a payout in progress.';
  END IF;

  SELECT value INTO cfg FROM public.app_settings WHERE key = 'commission';
  min_payout := COALESCE((cfg->>'min_payout')::numeric, 500);
  available := public.get_available_commission(NEW.partner_id);

  -- Frontend amount is never trusted: clamp to the live balance.
  IF NEW.amount IS NULL OR NEW.amount > available THEN
    NEW.amount := available;
  END IF;
  IF NEW.amount < min_payout THEN
    RAISE EXCEPTION 'Minimum payout amount is %', min_payout;
  END IF;

  NEW.status := 'requested';
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS payouts_validate_request ON public.payouts;
CREATE TRIGGER payouts_validate_request
  BEFORE INSERT ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.validate_payout_request();

-- 5. Immutable financial fields + admin-only status workflow + audit + idempotent Paid transaction
CREATE OR REPLACE FUNCTION public.guard_payout_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor uuid := auth.uid();
  partner_user uuid;
BEGIN
  IF NEW.partner_id IS DISTINCT FROM OLD.partner_id
     OR NEW.amount IS DISTINCT FROM OLD.amount
     OR NEW.method IS DISTINCT FROM OLD.method
     OR NEW.account_holder IS DISTINCT FROM OLD.account_holder
     OR NEW.bank_name IS DISTINCT FROM OLD.bank_name
     OR NEW.account_number IS DISTINCT FROM OLD.account_number
     OR NEW.ifsc IS DISTINCT FROM OLD.ifsc
     OR NEW.upi_id IS DISTINCT FROM OLD.upi_id THEN
    RAISE EXCEPTION 'Payout amount, partner and payment details cannot be modified.';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- actor is NULL for trusted service-role/server calls, which already verify admin in code.
    IF actor IS NOT NULL AND NOT public.has_role(actor, 'admin') THEN
      RAISE EXCEPTION 'Only an administrator can change payout status.';
    END IF;

    INSERT INTO public.audit_logs(admin_id, action, target, old_value, new_value)
    VALUES (actor, 'payout.status', NEW.id::text,
            to_jsonb(OLD.status::text), to_jsonb(NEW.status::text));

    IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
      SELECT user_id INTO partner_user FROM public.partners WHERE id = NEW.partner_id;
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions
        WHERE payment_type = 'payout' AND gateway_order_id = NEW.id::text
      ) THEN
        INSERT INTO public.transactions(user_id, partner_id, amount, gateway, gateway_order_id, status, payment_type)
        VALUES (partner_user, NEW.partner_id, NEW.amount, 'internal', NEW.id::text, 'success', 'payout');
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS payouts_guard_update ON public.payouts;
CREATE TRIGGER payouts_guard_update
  BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.guard_payout_update();

CREATE UNIQUE INDEX IF NOT EXISTS transactions_payout_unique
  ON public.transactions (gateway_order_id) WHERE payment_type = 'payout';

-- ============ PART B: REFERRAL / FRAUD SECURITY ============

-- 6. Referral clicks: resolve partner server-side, only active partners attribute
CREATE OR REPLACE FUNCTION public.validate_referral_click()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  resolved uuid;
BEGIN
  NEW.referral_code := upper(trim(NEW.referral_code));
  SELECT id INTO resolved FROM public.partners
   WHERE referral_code = NEW.referral_code AND status = 'active';
  NEW.partner_id := resolved; -- NULL when code is invalid/inactive/suspended
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS referral_clicks_validate ON public.referral_clicks;
CREATE TRIGGER referral_clicks_validate
  BEFORE INSERT ON public.referral_clicks
  FOR EACH ROW EXECUTE FUNCTION public.validate_referral_click();

-- 7. Orders: server-side attribution guard (self-referral / inactive partner)
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
    SELECT id, user_id, status INTO p FROM public.partners WHERE referral_code = NEW.referral_code;
    IF p.id IS NULL OR p.status <> 'active' OR p.user_id = NEW.customer_id THEN
      NEW.partner_id := NULL;
      NEW.referral_code := NULL;
    ELSE
      NEW.partner_id := p.id; -- never trust a client supplied partner_id
    END IF;
  ELSE
    NEW.partner_id := NULL;
  END IF;

  -- last-click window: attribution requires a recorded click inside the configured window
  IF NEW.partner_id IS NOT NULL
     AND EXISTS (SELECT 1 FROM public.referral_clicks WHERE partner_id = NEW.partner_id)
     AND NOT EXISTS (
       SELECT 1 FROM public.referral_clicks
       WHERE partner_id = NEW.partner_id
         AND created_at >= now() - (window_days || ' days')::interval
     ) THEN
    NEW.partner_id := NULL;
    NEW.referral_code := NULL;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS orders_validate_attribution ON public.orders;
CREATE TRIGGER orders_validate_attribution
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_attribution();

-- 8. Commission engine: keep existing rules, add reversal audit logging
CREATE OR REPLACE FUNCTION public.handle_order_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  cfg jsonb;
  default_pct numeric;
  holding int;
  pct numeric;
  base numeric;
  partner_user uuid;
  partner_state membership_status;
  weighted numeric := 0;
  item record;
BEGIN
  SELECT value INTO cfg FROM public.app_settings WHERE key = 'commission';
  default_pct := COALESCE((cfg->>'default_percent')::numeric, 10);
  holding := COALESCE((cfg->>'holding_days')::int, 7);

  IF NEW.status IN ('cancelled','refunded','returned') THEN
    UPDATE public.commissions SET status = 'reversed'
      WHERE order_id = NEW.id AND status <> 'paid';
    IF FOUND THEN
      INSERT INTO public.audit_logs(admin_id, action, target, old_value, new_value)
      VALUES (auth.uid(), 'commission.reversed', NEW.order_number,
              to_jsonb(OLD.status::text), to_jsonb(NEW.status::text));
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.status = 'paid' AND OLD.status IS DISTINCT FROM 'paid' AND NEW.partner_id IS NOT NULL THEN
    SELECT user_id, status INTO partner_user, partner_state
      FROM public.partners WHERE id = NEW.partner_id;
    IF partner_user IS NULL OR partner_state <> 'active' OR partner_user = NEW.customer_id THEN
      RETURN NEW;
    END IF;
    IF EXISTS (SELECT 1 FROM public.commissions WHERE order_id = NEW.id) THEN RETURN NEW; END IF;

    base := NEW.subtotal;
    FOR item IN
      SELECT oi.line_total, p.commission_percent
      FROM public.order_items oi LEFT JOIN public.products p ON p.id = oi.product_id
      WHERE oi.order_id = NEW.id
    LOOP
      weighted := weighted + item.line_total * COALESCE(item.commission_percent, default_pct);
    END LOOP;

    IF base > 0 AND weighted > 0 THEN pct := round(weighted / base, 2); ELSE pct := default_pct; END IF;

    INSERT INTO public.commissions(order_id, partner_id, customer_id, order_amount, percent, amount, status, available_at)
    VALUES (NEW.id, NEW.partner_id, NEW.customer_id, base, pct, round(base * pct / 100, 2), 'pending', now() + (holding || ' days')::interval)
    ON CONFLICT (order_id) DO NOTHING;

    INSERT INTO public.notifications(user_id, title, body, type)
    VALUES (partner_user, 'New commission earned',
      'Order ' || NEW.order_number || ' generated a commission of Rs ' || round(base * pct / 100, 2), 'commission');
  END IF;
  RETURN NEW;
END; $function$;