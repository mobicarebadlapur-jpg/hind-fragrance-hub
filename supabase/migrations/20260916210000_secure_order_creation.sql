-- Secure checkout writes: clients may read their orders, but cannot forge orders or line items directly.
-- The RPC below validates products, prices, quantities, totals and referral attribution atomically.

CREATE OR REPLACE FUNCTION public.create_order(
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
  IF actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
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
  VALUES (
    actor,
    btrim(_shipping_name),
    _mobile,
    btrim(_address),
    btrim(_city),
    btrim(_state),
    _pincode
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    mobile = EXCLUDED.mobile,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    pincode = EXCLUDED.pincode;

  INSERT INTO public.orders (
    customer_id,
    referral_code,
    referral_visitor_id,
    partner_id,
    subtotal,
    shipping,
    total,
    status
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
    order_id,
    product_id,
    product_name,
    unit_price,
    quantity,
    line_total
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

REVOKE ALL ON FUNCTION public.create_order(jsonb, text, uuid, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(jsonb, text, uuid, text, text, text, text, text, text) TO authenticated, service_role;

-- Do not allow a browser client to forge financial order rows or line items.
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM authenticated;
REVOKE ALL ON public.orders FROM anon;
REVOKE ALL ON public.order_items FROM anon;

COMMENT ON FUNCTION public.create_order(jsonb, text, uuid, text, text, text, text, text, text)
IS 'Atomically validates checkout inputs, resolves prices/totals and referral attribution, then creates the order and its line items.';
