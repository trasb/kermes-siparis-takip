-- Kategoriler tablosu
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  created_at timestamptz default now()
);

-- Menü öğeleri tablosu
create table public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price decimal(10,2) not null,
  category_id uuid references public.categories(id) on delete cascade,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Siparişler tablosu
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  table_number integer not null,
  waiter_id uuid references public.profiles(id),
  status text not null check (status in ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  total_amount decimal(10,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sipariş detayları tablosu
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id),
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  notes text,
  created_at timestamptz default now()
);

-- Ayarlar tablosu
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- RLS politikaları
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.settings enable row level security;

-- Kategori politikaları
create policy "Kategorileri herkes görebilir"
  on public.categories for select
  using (true);

create policy "Kategorileri sadece admin düzenleyebilir"
  on public.categories for insert update delete
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

-- Menü öğeleri politikaları
create policy "Menü öğelerini herkes görebilir"
  on public.menu_items for select
  using (true);

create policy "Menü öğelerini sadece admin düzenleyebilir"
  on public.menu_items for insert update delete
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

-- Sipariş politikaları
create policy "Siparişleri ilgili roller görebilir"
  on public.orders for select
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('admin', 'kitchen', 'accounting')
    ) or
    auth.uid() = waiter_id
  );

create policy "Siparişleri garsonlar ve admin ekleyebilir"
  on public.orders for insert
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('admin', 'waiter')
    )
  );

create policy "Siparişleri ilgili roller güncelleyebilir"
  on public.orders for update
  using (
    auth.uid() in (
      select id from public.profiles 
      where role in ('admin', 'kitchen')
    ) or
    (auth.uid() = waiter_id and status = 'pending')
  );

-- Sipariş detayları politikaları
create policy "Sipariş detaylarını ilgili roller görebilir"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (
        auth.uid() in (
          select id from public.profiles 
          where role in ('admin', 'kitchen', 'accounting')
        ) or
        auth.uid() = o.waiter_id
      )
    )
  );

create policy "Sipariş detaylarını garsonlar ve admin ekleyebilir"
  on public.order_items for insert
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (
        auth.uid() in (
          select id from public.profiles 
          where role in ('admin', 'waiter')
        ) and
        o.status = 'pending'
      )
    )
  );

-- Ayarlar politikaları
create policy "Ayarları herkes görebilir"
  on public.settings for select
  using (true);

create policy "Ayarları sadece admin düzenleyebilir"
  on public.settings for insert update delete
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

-- Örnek veriler
insert into public.settings (key, value) values
  ('table_count', '10'),
  ('printer_settings', '{"enabled": true, "type": "thermal", "width": 48}');

-- Örnek kategoriler
insert into public.categories (name) values
  ('Çorbalar'),
  ('Ana Yemekler'),
  ('Salatalar'),
  ('İçecekler'),
  ('Tatlılar');

-- Örnek menü öğeleri
insert into public.menu_items (name, price, category_id) 
select 'Mercimek Çorbası', 45.00, id from public.categories where name = 'Çorbalar'
union all
select 'Ezogelin Çorbası', 45.00, id from public.categories where name = 'Çorbalar'
union all
select 'Adana Kebap', 160.00, id from public.categories where name = 'Ana Yemekler'
union all
select 'Pide', 120.00, id from public.categories where name = 'Ana Yemekler'
union all
select 'Mevsim Salata', 55.00, id from public.categories where name = 'Salatalar'
union all
select 'Çoban Salata', 50.00, id from public.categories where name = 'Salatalar'
union all
select 'Ayran', 15.00, id from public.categories where name = 'İçecekler'
union all
select 'Kola', 20.00, id from public.categories where name = 'İçecekler'
union all
select 'Künefe', 85.00, id from public.categories where name = 'Tatlılar'
union all
select 'Sütlaç', 65.00, id from public.categories where name = 'Tatlılar';