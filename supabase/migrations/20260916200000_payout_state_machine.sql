-- Enforce a one-way payout workflow at the database boundary.
-- The existing guard already protects financial fields and restricts status changes
-- to administrators/trusted server calls. This migration additionally rejects
-- arbitrary status jumps and makes the paid transition settlement-safe.

CREATE OR REPLACE FUNCTION public.guard_payout_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor uuid := auth.uid();
  partner_user uuid;
  allowed boolean := false;
BEGIN
  -- Financial identity/details are immutable after creation.
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
    -- Only admins or trusted service-role calls may advance payout state.
    IF actor IS NOT NULL AND NOT public.has_role(actor, 'admin') THEN
      RAISE EXCEPTION 'Only an administrator can change payout status.';
    END IF;

    -- Explicit state machine; no skipping directly to paid and no reopening
    -- rejected/paid payouts.
    allowed :=
      (OLD.status = 'requested'   AND NEW.status IN ('under_review', 'rejected'))
      OR (OLD.status = 'under_review' AND NEW.status IN ('approved', 'rejected'))
      OR (OLD.status = 'approved'  AND NEW.status IN ('processing', 'rejected'))
      OR (OLD.status = 'processing' AND NEW.status IN ('paid', 'rejected'));

    IF NOT allowed THEN
      RAISE EXCEPTION 'Invalid payout status transition: % -> %.', OLD.status, NEW.status;
    END IF;

    INSERT INTO public.audit_logs(admin_id, action, target, old_value, new_value)
    VALUES (
      actor,
      'payout.status',
      NEW.id::text,
      to_jsonb(OLD.status::text),
      to_jsonb(NEW.status::text)
    );

    -- A paid payout gets exactly one ledger transaction. The unique index from
    -- the earlier payout hardening migration also protects concurrent attempts.
    IF NEW.status = 'paid' THEN
      SELECT user_id INTO partner_user
      FROM public.partners
      WHERE id = NEW.partner_id;

      IF partner_user IS NULL THEN
        RAISE EXCEPTION 'Payout partner is invalid.';
      END IF;

      INSERT INTO public.transactions(
        user_id,
        partner_id,
        amount,
        gateway,
        gateway_order_id,
        status,
        payment_type
      )
      VALUES (
        partner_user,
        NEW.partner_id,
        NEW.amount,
        'internal',
        NEW.id::text,
        'success',
        'payout'
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payouts_guard_update ON public.payouts;
CREATE TRIGGER payouts_guard_update
  BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.guard_payout_update();

REVOKE ALL ON FUNCTION public.guard_payout_update() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guard_payout_update() TO service_role;

COMMENT ON FUNCTION public.guard_payout_update() IS
  'Protects payout financial fields, restricts status changes to admin/trusted server calls, enforces the payout state machine, audits transitions, and records one paid-payout transaction.';
