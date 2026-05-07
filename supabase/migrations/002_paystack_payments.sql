alter table public.orders
  add column if not exists payment_provider text,
  add column if not exists payment_reference text,
  add column if not exists payment_verified_at timestamptz;

create unique index if not exists orders_payment_reference_key
  on public.orders(payment_reference)
  where payment_reference is not null;
