create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  category text not null,
  short_description text,
  description text,
  image_url text,
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or (sale_price >= 0 and sale_price <= price)),
  stock integer not null default 0 check (stock >= 0),
  commission_percent numeric(5,2) check (commission_percent is null or (commission_percent >= 0 and commission_percent <= 100)),
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active','draft','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('HF-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  customer_id uuid not null references auth.users(id) on delete restrict,
  partner_id uuid references public.partners(id) on delete set null,
  referral_code text,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  tax numeric(12,2) not null default 0 check (tax >= 0),
  shipping numeric(12,2) not null default 0 check (shipping >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  payment_id text,
  status text not null default 'payment_pending' check (status in ('created','payment_pending','paid','processing','shipped','delivered','cancelled','refunded')),
  shipping_name text,
  mobile text,
  address text,
  city text,
  state text,
  pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete restrict,
  order_amount numeric(12,2) not null check (order_amount >= 0),
  percent numeric(5,2) not null check (percent >= 0 and percent <= 100),
  amount numeric(12,2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending','available','paid','cancelled')),
  available_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products(status);
create index if not exists orders_customer_idx on public.orders(customer_id, created_at desc);
create index if not exists orders_partner_idx on public.orders(partner_id, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists commissions_partner_idx on public.commissions(partner_id, status, created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.commissions enable row level security;

create policy products_public_active on public.products for select to anon, authenticated using (status = 'active');
create policy orders_select_own on public.orders for select to authenticated using (customer_id = (select auth.uid()));
create policy order_items_select_own on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.customer_id = (select auth.uid())));
create policy commissions_partner_select on public.commissions for select to authenticated using (exists (select 1 from public.partners p where p.id = commissions.partner_id and p.user_id = (select auth.uid())));

create or replace function public.create_order(_customer_id uuid,_items jsonb,_referral_code text default null,_referral_visitor_id uuid default null,_shipping_name text default null,_mobile text default null,_address text default null,_city text default null,_state text default null,_pincode text default null)
returns table(order_id uuid, order_number text, total numeric)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_order_id uuid; v_order_number text; v_subtotal numeric(12,2):=0; v_shipping numeric(12,2):=0; v_partner_id uuid:=null; v_partner_code text:=null; v_item jsonb; v_product public.products%rowtype; v_qty integer; v_unit numeric(12,2); v_line numeric(12,2); v_commission numeric(12,2):=0; v_percent numeric(5,2):=0;
begin
  if _customer_id is null or _customer_id <> auth.uid() then raise exception 'Unauthorized'; end if;
  if jsonb_typeof(_items) <> 'array' or jsonb_array_length(_items)=0 then raise exception 'Cart is empty'; end if;
  if _referral_code is not null and length(trim(_referral_code))>0 then
    select p.id,p.referral_code into v_partner_id,v_partner_code from public.partners p where upper(p.referral_code)=upper(trim(_referral_code)) and p.status='active' limit 1;
    if v_partner_id is not null and exists(select 1 from public.partners p where p.id=v_partner_id and p.user_id=_customer_id) then v_partner_id:=null; v_partner_code:=null; end if;
  end if;
  insert into public.orders(customer_id,partner_id,referral_code,shipping_name,mobile,address,city,state,pincode,status) values(_customer_id,v_partner_id,v_partner_code,_shipping_name,_mobile,_address,_city,_state,_pincode,'payment_pending') returning id,order_number into v_order_id,v_order_number;
  for v_item in select * from jsonb_array_elements(_items) loop
    select * into v_product from public.products where id=(v_item->>'product_id')::uuid and status='active' for update;
    if not found then raise exception 'Product is no longer available'; end if;
    v_qty:=(v_item->>'quantity')::integer;
    if v_qty<1 or v_qty>20 then raise exception 'Invalid quantity'; end if;
    if v_product.stock<v_qty then raise exception 'Product is no longer available'; end if;
    v_unit:=coalesce(v_product.sale_price,v_product.price); v_line:=round(v_unit*v_qty,2); v_subtotal:=v_subtotal+v_line;
    insert into public.order_items(order_id,product_id,product_name,quantity,unit_price,line_total) values(v_order_id,v_product.id,v_product.name,v_qty,v_unit,v_line);
    if v_partner_id is not null and coalesce(v_product.commission_percent,0)>0 then v_commission:=v_commission+round(v_line*v_product.commission_percent/100,2); v_percent:=greatest(v_percent,v_product.commission_percent); end if;
  end loop;
  v_shipping:=case when v_subtotal>=999 then 0 else 59 end;
  update public.orders set subtotal=v_subtotal,shipping=v_shipping,total=v_subtotal+v_shipping,updated_at=now() where id=v_order_id;
  if v_partner_id is not null and v_commission>0 then insert into public.commissions(order_id,partner_id,customer_id,order_amount,percent,amount,status) values(v_order_id,v_partner_id,_customer_id,v_subtotal,v_percent,v_commission,'pending'); end if;
  return query select v_order_id,v_order_number,v_subtotal+v_shipping;
end; $$;

create or replace function public.confirm_paid_order(_order_id uuid,_payment_id text,_gateway text,_gateway_payment_id text,_amount numeric)
returns table(order_number text)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_order public.orders%rowtype; v_item record;
begin
  select * into v_order from public.orders where id=_order_id and customer_id=auth.uid() for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.status not in ('payment_pending','created') then raise exception 'Order already processed'; end if;
  if round(_amount,2)<>round(v_order.total,2) then raise exception 'Payment amount mismatch'; end if;
  for v_item in select product_id,quantity from public.order_items where order_id=_order_id loop
    if v_item.product_id is not null then update public.products set stock=stock-v_item.quantity,updated_at=now() where id=v_item.product_id and stock>=v_item.quantity; if not found then raise exception 'Insufficient stock'; end if; end if;
  end loop;
  update public.orders set status='paid',payment_id=_payment_id,updated_at=now() where id=_order_id;
  return query select v_order.order_number;
end; $$;

revoke all on function public.create_order(uuid,jsonb,text,uuid,text,text,text,text,text,text) from public,anon;
grant execute on function public.create_order(uuid,jsonb,text,uuid,text,text,text,text,text,text) to authenticated;
revoke all on function public.confirm_paid_order(uuid,text,text,text,numeric) from public,anon;
grant execute on function public.confirm_paid_order(uuid,text,text,text,numeric) to authenticated;

create or replace function public.set_commerce_updated_at() returns trigger language plpgsql set search_path=public,pg_temp as $$ begin new.updated_at=now(); return new; end; $$;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_commerce_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_commerce_updated_at();
create trigger commissions_set_updated_at before update on public.commissions for each row execute function public.set_commerce_updated_at();