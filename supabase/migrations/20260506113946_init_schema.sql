-- mokuworks initial schema
-- Source of truth: /SPEC.md §3 and §4

-- =============================================================================
-- Tables
-- =============================================================================

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('type', 'industry')),
  created_at timestamptz not null default now()
);

create index if not exists tags_category_idx on public.tags (category);

create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client text not null,
  description text not null default '',
  date text not null,
  tags text[] not null default '{}',
  image_url text,
  gallery text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists designs_published_date_idx
  on public.designs (published, date desc);
create index if not exists designs_tags_gin_idx
  on public.designs using gin (tags);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text not null default '',
  image_url text,
  external_domain text,
  launch_date text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_published_launch_idx
  on public.products (published, launch_date desc nulls last, created_at desc);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  work_types text[] not null default '{}',
  work_other text,
  budget_range text,
  timeline text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.tags enable row level security;
alter table public.designs enable row level security;
alter table public.products enable row level security;
alter table public.inquiries enable row level security;

-- tags: public read (Contact form needs to read type tags), authenticated write
drop policy if exists "tags_select_public" on public.tags;
create policy "tags_select_public" on public.tags
  for select using (true);

drop policy if exists "tags_write_authenticated" on public.tags;
create policy "tags_write_authenticated" on public.tags
  for all to authenticated using (true) with check (true);

-- designs: public read for published only, authenticated full access
drop policy if exists "designs_select_public_published" on public.designs;
create policy "designs_select_public_published" on public.designs
  for select using (published = true);

drop policy if exists "designs_select_authenticated_all" on public.designs;
create policy "designs_select_authenticated_all" on public.designs
  for select to authenticated using (true);

drop policy if exists "designs_write_authenticated" on public.designs;
create policy "designs_write_authenticated" on public.designs
  for all to authenticated using (true) with check (true);

-- products: public read for published only, authenticated full access
drop policy if exists "products_select_public_published" on public.products;
create policy "products_select_public_published" on public.products
  for select using (published = true);

drop policy if exists "products_select_authenticated_all" on public.products;
create policy "products_select_authenticated_all" on public.products
  for select to authenticated using (true);

drop policy if exists "products_write_authenticated" on public.products;
create policy "products_write_authenticated" on public.products
  for all to authenticated using (true) with check (true);

-- inquiries: anonymous insert (Contact form), authenticated full read/update
drop policy if exists "inquiries_insert_public" on public.inquiries;
create policy "inquiries_insert_public" on public.inquiries
  for insert with check (true);

drop policy if exists "inquiries_select_authenticated" on public.inquiries;
create policy "inquiries_select_authenticated" on public.inquiries
  for select to authenticated using (true);

drop policy if exists "inquiries_update_authenticated" on public.inquiries;
create policy "inquiries_update_authenticated" on public.inquiries
  for update to authenticated using (true) with check (true);

drop policy if exists "inquiries_delete_authenticated" on public.inquiries;
create policy "inquiries_delete_authenticated" on public.inquiries
  for delete to authenticated using (true);

-- =============================================================================
-- Storage buckets
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('design-images', 'design-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies: public read, authenticated write/delete
drop policy if exists "design_images_public_read" on storage.objects;
create policy "design_images_public_read" on storage.objects
  for select using (bucket_id = 'design-images');

drop policy if exists "design_images_authenticated_write" on storage.objects;
create policy "design_images_authenticated_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'design-images')
  with check (bucket_id = 'design-images');

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_authenticated_write" on storage.objects;
create policy "product_images_authenticated_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
