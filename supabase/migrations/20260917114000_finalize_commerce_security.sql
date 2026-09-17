-- Final commerce hardening pass.
-- The earlier commerce bootstrap migration creates compatible RPC names, but this
-- migration restores the stronger server-only checkout/payment invariants after it.

CREATE OR REPLACE FUNCTION public.create_order(
  _customer_id uuid,
  _items jsonb,
  _referral_code text,
  _referral_visitor_id uuid,
  _shipping_name text,
  _mobile text,
  _address text,
  _city text,
  _state text,
  _pincode text
)
RETURNS TABLE (order_id uuid, order_number text, total numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor uuid := auth.uid();
  item_count integer;
  subtotal numeric;
  shipping numeric;
  computed_total numeric;
  new_order_id uuid;
BEGIN
  IF actor IS NULL OR _customer_id IS NULL OR actor <> _customer_id THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF jsonb_typeof(_items) <> 'array' THEN
    RAISE EXCEPTION 'Invalid checkout items.';
  END IF;

  item_count := jsonb_array_length(_items);
  IF item_count < 1 OR item_count > 30 THEN
    RAISE EXCEPTION 'Checkout must contain between 1 and 30 products.';
  END IF;

  IF _shipping_name IS NULL OR length(btrim(_shipping_name)) < 2 OR length(btrim(_shipping_name)) > 100
     OR _mobile IS NULL OR _mobile !~ '^[0-9]{10}$'
     OR _address IS NULL OR length(btrim(_address)) < 5 OR length(btrim(_address)) > 300
     OR _city IS NULL OR length(btrim(_city)) < 2 OR length(btrim(_city)) > 80
     OR _state IS NULL OR length(btrim(_state)) < 2 OR length(btrim(_state)) > 80
     OR _pincode IS NULL OR _pincode !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'Invalid shipping details.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(_items) AS i(product_id uuid, quantity integer)
    WHERE i.product_id IS NULL OR i.quantity IS NULL OR i.quantity < 1 OR i.quantity > 20
  ) THEN
    RAISE EXCEPTION 'Invalid product quantity.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(_items) AS i(product_id uuid, quantity integer)
    GROUP BY i.product_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate products are not allowed in checkout.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(_items) AS i(product_id uuid, quantity integer)
    LEFT JOIN public.products p ON p.id = i.product_id
    WHERE p.id IS NULL OR p.status <> 'active'
  ) THEN
    RAISE EXCEPTION 'One or more products are no longer available.';
  END IF;

  SELECT round(COALESCE(SUM(round(COALESCE(p.sale_price, p.price) * i.quantity, 2)), 0), 2)
    INTO subtotal
  FROM jsonb_to_recordset(_items) AS i(product_id uuid, quantity integer)
  JOIN public.products p ON p.id = i.product_id;

  shipping := CASE WHEN subtotal >= 999 THEN 0 ELSE 59 END;
  computed_total := round(subtotal + shipping, 2);

  INSERT INTO public.profiles (id, full_name, mobile, address, city, state, pincode)
  VALUES (actor, btrim(_shipping_name), _mobile, btrim(_address), btrim(_city), btrim(_state), _pincode)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    mobile = EXCLUDED.mobile,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    pincode = EXCLUDED.pincode;

  INSERT INTO public.orders (
    customer_id, referral_code, referral_visitor_id, partner_id,
    subtotal, shipping, total, status
  )
  VALUES (
    actor,
    NULLIF(btrim(_referral_code), ''),
    _referral_visitor_id,
    NULL,
    subtotal,
    shipping,
    computed_total,
    'payment_pending'
  )
  RETURNING id INTO new_order_id;

  INSERT INTO public.order_items (
    order_id, product_id, product_name, unit_price, quantity, line_total
  )
  SELECT
    new_order_id,
    p.id,
    p.name,
    round(COALESCE(p.sale_price, p.price), 2),
    i.quantity,
    round(COALESCE(p.sale_price, p.price) * i.quantity, 2)
  FROM jsonb_to_recordset(_items) AS i(product_id uuid, quantity integer)
  JOIN public.products p ON p.id = i.product_id;

  RETURN QUERY
  SELECT o.id, o.order_number, o.total
  FROM public.orders o
  WHERE o.id = new_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order(uuid, jsonb, text, uuid, text, text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(uuid, jsonb, text, uuid, text, text, text, text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.confirm_paid_order(
  _order_id uuid,
  _payment_id text,
  _gateway text,
  _gateway_payment_id text,
  _amount numeric
)
RETURNS TABLE (order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor uuid := auth.uid();
  o public.orders%rowtype;
  item_count integer;
  product_count integer;
  expected_total numeric;
BEGIN
  IF actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;
  IF _order_id IS NULL OR _payment_id IS NULL OR length(btrim(_payment_id)) < 3
     OR _gateway IS NULL OR length(btrim(_gateway)) < 2
     OR _gateway_payment_id IS NULL OR length(btrim(_gateway_payment_id)) < 3
     OR _amount IS NULL OR _amount < 0 THEN
    RAISE EXCEPTION 'Invalid payment confirmation.';
  END IF;

  SELECT * INTO o
  FROM public.orders
  WHERE id = _order_id AND customer_id = actor
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found.';
  END IF;

  IF o.status = 'paid' THEN
    RETURN QUERY SELECT o.order_number;
    RETURN;
  END IF;

  IF o.status NOT IN ('created', 'payment_pending') THEN
    RAISE EXCEPTION 'Order cannot be paid in its current state.';
  END IF;

  expected_total := round(o.total, 2);
  IF round(_amount, 2) <> expected_total THEN
    RAISE EXCEPTION 'Payment amount mismatch.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.transactions t
    WHERE t.order_id = o.id AND t.payment_type = 'order' AND t.status = 'success'
  ) THEN
    RETURN QUERY SELECT o.order_number;
    RETURN;
  END IF;

  SELECT count(*) INTO item_count
  FROM public.order_items oi
  WHERE oi.order_id = o.id;
  IF item_count < 1 THEN
    RAISE EXCEPTION 'Order has no line items.';
  END IF;

  SELECT count(*) INTO product_count
  FROM public.order_items oi
  JOIN public.products p ON p.id = oi.product_id
  WHERE oi.order_id = o.id;
  IF product_count <> item_count THEN
    RAISE EXCEPTION 'One or more ordered products no longer exist.';
  END IF;

  -- Lock products in deterministic ID order to make concurrent payments safe.
  PERFORM p.id
  FROM public.products p
  WHERE p.id IN (
    SELECT oi.product_id
    FROM public.order_items oi
    WHERE oi.order_id = o.id AND oi.product_id IS NOT NULL
    GROUP BY oi.product_id
  )
  ORDER BY p.id
  FOR UPDATE OF p;

  IF EXISTS (
    SELECT 1
    FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = o.id
      AND (p.status <> 'active' OR p.stock < oi.quantity)
  ) THEN
    RAISE EXCEPTION 'Insufficient stock.';
  END IF;

  UPDATE public.products p
  SET stock = p.stock - totals.quantity,
      updated_at = now()
  FROM (
    SELECT oi.product_id, sum(oi.quantity)::integer AS quantity
    FROM public.order_items oi
    WHERE oi.order_id = o.id AND oi.product_id IS NOT NULL
    GROUP BY oi.product_id
  ) totals
  WHERE p.id = totals.product_id;

  UPDATE public.orders
  SET status = 'paid', payment_id = _payment_id, updated_at = now()
  WHERE id = o.id;

  INSERT INTO public.transactions (
    user_id, order_id, amount, currency, gateway, payment_type,
    gateway_order_id, gateway_payment_id, status
  )
  VALUES (
    actor, o.id, o.total, 'INR', btrim(_gateway), 'order',
    _payment_id, _gateway_payment_id, 'success'
  )
  ON CONFLICT DO NOTHING;

  RETURN QUERY SELECT o.order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_paid_order(uuid, text, text, text, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(uuid, text, text, text, numeric) TO authenticated, service_role;

COMMENT ON FUNCTION public.create_order(uuid, jsonb, text, uuid, text, text, text, text, text, text)
IS 'Trusted-server checkout RPC. Validates the authenticated customer, products, prices, quantities and totals, then creates the order atomically.';

COMMENT ON FUNCTION public.confirm_paid_order(uuid, text, text, text, numeric)
IS 'Atomic payment confirmation RPC. Locks the order and products, validates the amount and stock, deducts inventory and records the successful transaction.';
