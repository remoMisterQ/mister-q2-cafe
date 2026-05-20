create extension if not exists "pgcrypto";

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  phone text not null,
  hours text not null default '6:00 AM - 5:00 PM',
  map_embed_url text,
  active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  category_id uuid references categories(id) on delete set null,
  image_url text,
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists menu_item_locations (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  available boolean not null default true,
  unique (menu_item_id, location_id)
);

create table if not exists modifier_groups (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid references menu_items(id) on delete cascade,
  name text not null,
  slug text unique not null,
  min_select int not null default 0,
  max_select int not null default 1,
  active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

alter table modifier_groups add column if not exists menu_item_id uuid references menu_items(id) on delete cascade;

create table if not exists modifier_options (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references modifier_groups(id) on delete cascade,
  name text not null,
  price_delta numeric(10, 2) not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  location_id uuid not null references locations(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  pickup_time text not null,
  notes text,
  subtotal numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  tip numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  stripe_session_id text,
  payment_status text not null default 'pending',
  order_status text not null default 'New' check (order_status in ('New', 'Preparing', 'Ready', 'Completed', 'Cancelled')),
  created_at timestamp with time zone not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  item_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  modifiers jsonb not null default '[]'::jsonb,
  item_comment text
);

alter table order_items add column if not exists modifiers jsonb not null default '[]'::jsonb;
alter table order_items add column if not exists item_comment text;
alter table orders add column if not exists discount_code text;
alter table orders add column if not exists discount_amount numeric(10, 2) not null default 0;

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null check (type in ('percent', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  active boolean not null default true,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create index if not exists menu_items_category_idx on menu_items(category_id);
create index if not exists menu_item_locations_item_idx on menu_item_locations(menu_item_id);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists orders_status_idx on orders(order_status);
create index if not exists gallery_images_sort_idx on gallery_images(sort_order);
create index if not exists discount_codes_code_idx on discount_codes(code);

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = true;

alter table locations enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table menu_item_locations enable row level security;
alter table modifier_groups enable row level security;
alter table modifier_options enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table gallery_images enable row level security;
alter table discount_codes enable row level security;

drop policy if exists "Public can read active locations" on locations;
create policy "Public can read active locations" on locations for select using (active = true);
drop policy if exists "Public can read active categories" on categories;
create policy "Public can read active categories" on categories for select using (active = true);
drop policy if exists "Public can read menu items" on menu_items;
create policy "Public can read menu items" on menu_items for select using (true);
drop policy if exists "Public can read menu item locations" on menu_item_locations;
create policy "Public can read menu item locations" on menu_item_locations for select using (true);
drop policy if exists "Public can read modifier groups" on modifier_groups;
create policy "Public can read modifier groups" on modifier_groups for select using (active = true);
drop policy if exists "Public can read modifier options" on modifier_options;
create policy "Public can read modifier options" on modifier_options for select using (active = true);
drop policy if exists "Public can read active gallery images" on gallery_images;
create policy "Public can read active gallery images" on gallery_images for select using (active = true);

drop policy if exists "Authenticated admins manage locations" on locations;
create policy "Authenticated admins manage locations" on locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage categories" on categories;
create policy "Authenticated admins manage categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage menu items" on menu_items;
create policy "Authenticated admins manage menu items" on menu_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage menu item locations" on menu_item_locations;
create policy "Authenticated admins manage menu item locations" on menu_item_locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage modifier groups" on modifier_groups;
create policy "Authenticated admins manage modifier groups" on modifier_groups for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage modifier options" on modifier_options;
create policy "Authenticated admins manage modifier options" on modifier_options for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins read orders" on orders;
create policy "Authenticated admins read orders" on orders for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins update orders" on orders;
create policy "Authenticated admins update orders" on orders for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins read order items" on order_items;
create policy "Authenticated admins read order items" on order_items for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage gallery images" on gallery_images;
create policy "Authenticated admins manage gallery images" on gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated admins manage discount codes" on discount_codes;
create policy "Authenticated admins manage discount codes" on discount_codes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Public menu image reads" on storage.objects;
create policy "Public menu image reads" on storage.objects for select using (bucket_id = 'menu-images');
drop policy if exists "Authenticated menu image uploads" on storage.objects;
create policy "Authenticated menu image uploads" on storage.objects for insert with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');
drop policy if exists "Authenticated menu image updates" on storage.objects;
create policy "Authenticated menu image updates" on storage.objects for update using (bucket_id = 'menu-images' and auth.role() = 'authenticated');
