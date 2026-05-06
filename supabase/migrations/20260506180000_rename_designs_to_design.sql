-- Rename `designs` to `design` for naming consistency with the /design route
-- and the "Design" menu label. Idempotent so it's safe on fresh DBs (no-op
-- when the table is already named `design`).

do $$
begin
  if exists (
    select 1 from pg_class
    where relname = 'designs' and relnamespace = 'public'::regnamespace
  ) then
    alter table public.designs rename to design;
  end if;
end $$;

alter index if exists public.designs_published_date_idx
  rename to design_published_date_idx;
alter index if exists public.designs_tags_gin_idx
  rename to design_tags_gin_idx;

do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'design'
      and policyname = 'designs_select_public_published'
  ) then
    alter policy "designs_select_public_published" on public.design
      rename to "design_select_public_published";
  end if;
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'design'
      and policyname = 'designs_select_authenticated_all'
  ) then
    alter policy "designs_select_authenticated_all" on public.design
      rename to "design_select_authenticated_all";
  end if;
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'design'
      and policyname = 'designs_write_authenticated'
  ) then
    alter policy "designs_write_authenticated" on public.design
      rename to "design_write_authenticated";
  end if;
end $$;
