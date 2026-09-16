create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid null references public.partners(id) on delete set null,
  order_id uuid null references public.orders(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  gateway text not null default 'razorpay',
  payment_type text not null check (payment_type in ('membership','order')),
  gateway_order_id text not null unique,
  gateway_payment_id text,
  gateway_signature text,
  status text not null default 'created' check (status in ('created','success','failed','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_order_id_idx on public.transactions(order_id);

alter table public.transactions enable row level security;
revoke all on public.transactions from anon, authenticated;

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();
