-- Kullanıcı profilleri için tablo oluşturma
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  name text not null,
  role text not null check (role in ('waiter', 'kitchen', 'accounting', 'admin')),
  created_at timestamptz default now(),
  primary key (id)
);

-- RLS politikaları
alter table public.profiles enable row level security;

create policy "Profiller herkese görünür"
  on public.profiles for select
  using (true);

-- Örnek kullanıcılar için fonksiyon
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1),
    case
      when new.email like '%admin%' then 'admin'
      when new.email like '%kitchen%' then 'kitchen'
      when new.email like '%accounting%' then 'accounting'
      else 'waiter'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Yeni kullanıcı trigger'ı
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Örnek kullanıcılar için şifre: Test123456
insert into auth.users (email, encrypted_password, email_confirmed_at, role)
values
  ('admin@restoran.com', '$2a$10$kHHKPBX.ZGz0UhN7.4VKLeX.dwLUEjF1M0EQWqbGDk9vTHYzF5JSi', now(), 'authenticated'),
  ('garson1@restoran.com', '$2a$10$kHHKPBX.ZGz0UhN7.4VKLeX.dwLUEjF1M0EQWqbGDk9vTHYzF5JSi', now(), 'authenticated'),
  ('garson2@restoran.com', '$2a$10$kHHKPBX.ZGz0UhN7.4VKLeX.dwLUEjF1M0EQWqbGDk9vTHYzF5JSi', now(), 'authenticated'),
  ('mutfak@restoran.com', '$2a$10$kHHKPBX.ZGz0UhN7.4VKLeX.dwLUEjF1M0EQWqbGDk9vTHYzF5JSi', now(), 'authenticated'),
  ('muhasebe@restoran.com', '$2a$10$kHHKPBX.ZGz0UhN7.4VKLeX.dwLUEjF1M0EQWqbGDk9vTHYzF5JSi', now(), 'authenticated');