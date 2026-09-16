revoke execute on function public.confirm_paid_order(uuid, text, text, text, numeric) from anon, authenticated;
revoke execute on function public.create_order(uuid, jsonb, text, uuid, text, text, text, text, text, text) from anon, authenticated;
