-- PAYOUT + REFERRAL/FRAUD SECURITY HARDENING (phase 2)
-- No new tables, no column renames, no data deletion.

-- 1) Authenticated partners are read-only on payouts/commissions; all writes stay server-side.
REVOKE INSERT, UPDATE, DELETE ON public.payouts FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.commissions FROM authenticated;
GRANT SELECT ON public.commissions TO authenticated;

-- 2) Payout transaction idempotency is case-insensitive because payment_type is text.
DROP INDEX IF EXISTS public.transactions_payout_unique;
CREATE UNIQUE INDEX IF NOT EXISTS transactions_payout_unique_ci
  ON public.transactions (gateway_order_id)
  WHERE lower(payment_type) = 'payout';

-- 3) Payout status changes: preserve the existing enum and enforce the existing workflow.
-- Protected financial fields remain immutable after request creation.
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
    IF actor IS NOT NULL AND NOT public.has_role(actor, 'admin') THEN
      RAISE EXCEPTION 'Only an administrator can change payout status.';
    END IF;

    IF NOT (
      (OLD.status = 'requested' AND NEW.status IN ('under_review','rejected')) OR
      (OLD.status = 'under_review' AND NEW.status IN ('approved','rejected')) OR
      (OLD.status = 'approved' AND NEW.status IN ('processing','rejected')) OR
      (OLD.status = 'processing' AND NEW.status IN ('paid','rejected')) OR
      (OLD.status = 'paid' AND NEW.status = 'paid') OR
      (OLD.status = 'rejected' AND NEW.status = 'rejected')
    ) THEN
      RAISE EXCEPTION 'Invalid payout status transition: % -> %', OLD.status, NEW.status;
    END IF;

    INSERT INTO public.audit_logs(admin_id, action, target, old_value, new_value)
    VALUES (actor, 'payout.status', NEW.id::text,
            to_jsonb(OLD.status::text), to_jsonb(NEW.status::text));

    IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
      SELECT user_id INTO partner_user FROM public.partners WHERE id = NEW.partner_id;
      IF NOT EXISTS (
        SELECT 1 FROM public.transactions
        WHERE lower(payment_type) = 'payout'
          AND gateway_order_id = NEW.id::text
      ) THEN
        INSERT INTO public.transactions(
          user_id, partner_id, amount, gateway, gateway_order_id, status, payment_type
        )
        VALUES (
          partner_user, NEW.partner_id, NEW.amount, 'internal', NEW.id::text, 'success', 'Payout'
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_payout_update() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guard_payout_update() TO service_role;

-- 4) Referral attribution: the submitted referral code is only a hint. The database
-- requires a matching active partner and a recorded click inside the configured
-- attribution window, then resolves the most recent click for that code.
CREATE OR REPLACE FUNCTION public.validate_order_attribution()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  cfg jsonb;
  window_days int;
  resolved_partner uuid;
  resolved_code text;
  clicked_at timestamptz;
  partner_user uuid;
BEGIN
  NEW.partner_id := NULL;
  NEW.referral_code := NULL;

  IF NEW.referral_code IS NULL OR btrim(NEW.referral_code) = '' THEN
    RETURN NEW;
  END IF;

  SELECT value INTO cfg FROM public.app_settings WHERE key = 'referral';
  window_days := GREATEST(COALESCE((cfg->>'cookie_days')::int, 30), 0);

  SELECT rc.partner_id, rc.referral_code, rc.created_at
    INTO resolved_partner, resolved_code, clicked_at
  FROM public.referral_clicks rc
  JOIN public.partners p ON p.id = rc.partner_id
  WHERE upper(rc.referral_code) = upper(btrim(NEW.referral_code))
    AND p.status = 'active'
    AND rc.created_at >= now() - (window_days || ' days')::interval
  ORDER BY rc.created_at DESC
  LIMIT 1;

  IF resolved_partner IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT user_id INTO partner_user
  FROM public.partners
  WHERE id = resolved_partner AND status = 'active';

  IF partner_user IS NULL OR partner_user = NEW.customer_id THEN
    RETURN NEW;
  END IF;

  NEW.partner_id := resolved_partner;
  NEW.referral_code := upper(resolved_code);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_order_attribution() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_order_attribution() TO service_role;

-- 5) Commission creation: require a current server-validated referral attribution,
-- active partner, non-self-referral, and one commission per order.
CREATE OR REPLACE FUNCTION public.handle_order_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  cfg jsonb;
  referral_cfg jsonb;
  default_pct numeric;
  holding int;
  referral_days int;
  pct numeric;
  base numeric;
  partner_user uuid;
  partner_state public.membership_status;
  weighted numeric := 0;
  item record;
  has_recent_click boolean;
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

    SELECT value INTO referral_cfg FROM public.app_settings WHERE key = 'referral';
    referral_days := GREATEST(COALESCE((referral_cfg->>'cookie_days')::int, 30), 0);
    SELECT EXISTS (
      SELECT 1
      FROM public.referral_clicks rc
      WHERE rc.partner_id = NEW.partner_id
        AND upper(rc.referral_code) = upper(NEW.referral_code)
        AND rc.created_at >= now() - (referral_days || ' days')::interval
    ) INTO has_recent_click;
    IF NOT has_recent_click THEN
      RETURN NEW;
    END IF;

    IF EXISTS (SELECT 1 FROM public.commissions WHERE order_id = NEW.id) THEN
      RETURN NEW;
    END IF;

    base := NEW.subtotal;
    FOR item IN
      SELECT oi.line_total, p.commission_percent
      FROM public.order_items oi LEFT JOIN public.products p ON p.id = oi.product_id
      WHERE oi.order_id = NEW.id
    LOOP
      weighted := weighted + item.line_total * COALESCE(item.commission_percent, default_pct);
    END LOOP;

    IF base > 0 AND weighted > 0 THEN pct := round(weighted / base, 2); ELSE pct := default_pct; END IF;

    INSERT INTO public.commissions(
      order_id, partner_id, customer_id, order_amount, percent, amount, status, available_at
    )
    VALUES (
      NEW.id, NEW.partner_id, NEW.customer_id, base, pct,
      round(base * pct / 100, 2), 'pending', now() + (holding || ' days')::interval
    )
    ON CONFLICT (order_id) DO NOTHING;

    INSERT INTO public.notifications(user_id, title, body, type)
    VALUES (
      partner_user,
      'New commission earned',
      'Order ' || NEW.order_number || ' generated a commission of Rs ' || round(base * pct / 100, 2),
      'commission'
    );
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.handle_order_commission() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_order_commission() TO service_role;
