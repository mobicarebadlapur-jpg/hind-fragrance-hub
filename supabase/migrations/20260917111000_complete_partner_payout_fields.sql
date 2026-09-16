alter table public.payouts add column if not exists method text check (method in ('bank','upi'));
alter table public.payouts add column if not exists account_holder text;
alter table public.payouts add column if not exists bank_name text;
alter table public.payouts add column if not exists account_number text;
alter table public.payouts add column if not exists ifsc text;
alter table public.payouts add column if not exists upi_id text;
alter table public.payouts add column if not exists account_number_last4 text;
alter table public.payouts add column if not exists upi_id_masked text;
alter table public.payouts add column if not exists ifsc_masked text;

update public.payouts set account_number_last4 = right(account_number,4) where account_number is not null and account_number_last4 is null;
update public.payouts set upi_id_masked = case when upi_id is null then null else left(upi_id,2) || '***' || right(upi_id,3) end where upi_id is not null and upi_id_masked is null;
update public.payouts set ifsc_masked = case when ifsc is null then null else left(ifsc,4) || '***' || right(ifsc,2) end where ifsc is not null and ifsc_masked is null;

alter table public.payouts alter column method set default 'upi';
