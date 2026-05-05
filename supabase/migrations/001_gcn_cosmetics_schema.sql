create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.product_gender as enum ('men', 'women', 'unisex');
create type public.product_stock_status as enum ('in-stock', 'low-stock', 'out-of-stock');
create type public.product_status as enum ('published', 'draft');
create type public.order_status as enum ('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled');
create type public.customer_status as enum ('active', 'inactive');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  gender public.product_gender not null default 'unisex',
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2) check (original_price >= 0),
  discount_price numeric(10, 2) check (discount_price >= 0),
  description text,
  materials text,
  delivery_info text,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  stock_status public.product_stock_status not null default 'in-stock',
  stock integer not null default 0 check (stock >= 0),
  style text,
  status public.product_status not null default 'draft',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null unique,
  default_address text,
  status public.customer_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id text primary key default ('ORD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  customer_id uuid not null references public.customers(id) on delete restrict,
  total numeric(10, 2) not null check (total >= 0),
  status public.order_status not null default 'confirmed',
  shipping_address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger customers_set_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.testimonials enable row level security;

create policy "profiles own read" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles admin update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

create policy "categories public read" on public.categories for select using (true);
create policy "categories admin insert" on public.categories for insert with check (public.is_admin());
create policy "categories admin update" on public.categories for update using (public.is_admin()) with check (public.is_admin());
create policy "categories admin delete" on public.categories for delete using (public.is_admin());

create policy "products public read active published" on public.products for select using (is_active = true and status = 'published');
create policy "products admin read" on public.products for select using (public.is_admin());
create policy "products admin insert" on public.products for insert with check (public.is_admin());
create policy "products admin update" on public.products for update using (public.is_admin()) with check (public.is_admin());

create policy "customers checkout insert" on public.customers for insert with check (true);
create policy "customers checkout read" on public.customers for select using (true);
create policy "customers checkout update by phone" on public.customers for update using (true) with check (true);
create policy "customers admin read" on public.customers for select using (public.is_admin());
create policy "customers admin update" on public.customers for update using (public.is_admin()) with check (public.is_admin());

create policy "orders checkout insert" on public.orders for insert with check (true);
create policy "orders checkout read" on public.orders for select using (true);
create policy "orders admin read" on public.orders for select using (public.is_admin());
create policy "orders admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "order items checkout insert" on public.order_items for insert with check (true);
create policy "order items checkout read" on public.order_items for select using (true);
create policy "order items admin read" on public.order_items for select using (public.is_admin());

create policy "testimonials public read active" on public.testimonials for select using (is_active = true);
create policy "testimonials admin all" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

create index products_category_id_idx on public.products(category_id);
create index products_status_active_idx on public.products(status, is_active);
create index orders_customer_id_idx on public.orders(customer_id);
create index order_items_order_id_idx on public.order_items(order_id);
