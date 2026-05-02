-- SYTEX ARCHIVE - SUPABASE SQL SCHEMA

-- 1. Profiller Tablosu (Kullanıcı bilgileri)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  full_name text,
  updated_at timestamp with time zone default now()
);

-- 2. Assetler Tablosu (Arşivdeki dosyalar)
create table assets (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  title text not null,
  description text,
  category text not null,
  file_type text not null,
  image_url text,
  download_url text not null,
  author_id uuid references profiles(id) on delete cascade not null,
  is_premium boolean default false,
  views_count int default 0,
  downloads_count int default 0
);

-- 3. RLS (Row Level Security) Aktifleştirme
alter table profiles enable row level security;
alter table assets enable row level security;

-- 4. Politikalar (Policies)
create policy "Profiller herkes tarafından görülebilir" on profiles for select using (true);
create policy "Kullanıcılar kendi profillerini güncelleyebilir" on profiles for update using (auth.uid() = id);

create policy "Assetler herkes tarafından görülebilir" on assets for select using (true);
create policy "Giriş yapanlar asset yükleyebilir" on assets for insert with check (auth.role() = 'authenticated');
create policy "Asset sahibi güncelleyebilir" on assets for update using (auth.uid() = author_id);
create policy "Asset sahibi silebilir" on assets for delete using (auth.uid() = author_id);

-- 5. Yeni kullanıcı kaydolduğunda otomatik profil oluşturma tetikleyicisi
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
