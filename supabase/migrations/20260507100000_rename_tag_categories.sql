-- Rename tag categories to align with the new public-facing labels.
--   'type'     → 'format'  ("Work Type" → "Format")
--   'industry' → 'field'   ("Industry"  → "Field")
--
-- Also rename inquiries.work_types column → formats so the schema matches the
-- new vocabulary end-to-end. All previous tag/inquiry/design data was wiped by
-- the operator before running this migration, so we drop the old tags and
-- reseed cleanly with the new vocabulary.
--
-- Reference English slugs (not stored, kept here for future automation):
--   field:  food-beverage, lifestyle-beauty, culture-education, tech-platform,
--           wellness-healthcare, public-nonprofit, professional-services,
--           manufacturing
--   format: brochure-leaflet, poster, web-app, onsite-exhibition

-- =============================================================================
-- 1. inquiries.work_types → inquiries.formats
-- =============================================================================

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'inquiries'
      and column_name = 'work_types'
  ) then
    alter table public.inquiries rename column work_types to formats;
  end if;
end $$;

-- =============================================================================
-- 2. tags.category check constraint: ('type','industry') → ('format','field')
-- =============================================================================

-- Drop every existing check constraint on public.tags (the only one is the
-- inline check on category, auto-named tags_category_check). Idempotent.
do $$
declare
  cname text;
begin
  for cname in
    select pgc.conname
    from pg_constraint pgc
    join pg_class pcl on pcl.oid = pgc.conrelid
    where pcl.relname = 'tags'
      and pcl.relnamespace = 'public'::regnamespace
      and pgc.contype = 'c'
  loop
    execute format('alter table public.tags drop constraint if exists %I', cname);
  end loop;
end $$;

-- Wipe existing tag rows (test data only; operator confirmed clean).
delete from public.tags;

alter table public.tags
  add constraint tags_category_check
  check (category in ('format', 'field'));

-- =============================================================================
-- 3. Reseed default tags
-- =============================================================================

-- Field (산업 분야): 8
insert into public.tags (name, category) values
  ('식음료',             'field'),
  ('뷰티·라이프스타일',  'field'),
  ('문화·교육',          'field'),
  ('테크·플랫폼',        'field'),
  ('웰니스·헬스케어',    'field'),
  ('공공·비영리',        'field'),
  ('전문서비스',         'field'),
  ('제조업',             'field'),
-- Format (작업 유형): 4
  ('브로슈어·리플렛',    'format'),
  ('포스터',             'format'),
  ('웹·앱',              'format'),
  ('현장·전시',          'format');
