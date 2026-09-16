create table if not exists public.partner_bank_details (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null unique references public.partners(id) on delete cascade,
  account_name text not null,
  account_number text not null,
  ifsc text not null,
  bank_name text,
  upi_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  status text not null default 'requested' check (status in ('requested','under_review','approved','processing','paid','rejected')),
  notes text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payouts_partner_status_idx on public.payouts(partner_id,status,created_at desc);
create index if not exists payouts_status_idx on public.payouts(status,created_at desc);

alter table public.partner_bank_details enable row level security;
alter table public.payouts enable row level security;
revoke all on public.partner_bank_details from anon, authenticated;
revoke all on public.payouts from anon, authenticated;
grant all on public.partner_bank_details to service_role;
grant all on public.payouts to service_role;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists partner_bank_details_updated_at on public.partner_bank_details;
create trigger partner_bank_details_updated_at before update on public.partner_bank_details for each row execute function public.set_updated_at();
drop trigger if exists payouts_updated_at on public.payouts;
create trigger payouts_updated_at before update on public.payouts for each row execute function public.set_updated_at();
