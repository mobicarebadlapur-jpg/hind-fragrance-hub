-- Orders: remove client-side create/update ability; server functions use the service role.
DROP POLICY IF EXISTS "orders insert" ON public.orders;
DROP POLICY IF EXISTS "orders admin update" ON public.orders;

CREATE POLICY "orders admin update"
ON public.orders
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

REVOKE INSERT, UPDATE ON public.orders FROM authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Order items: creation happens server-side alongside the order.
DROP POLICY IF EXISTS "order items insert" ON public.order_items;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;