-- Seed initial tag set so Contact form has work_type options out of the box.
-- moku can edit these later via /admin/tags.

insert into public.tags (name, category) values
  ('브로슈어·리플렛', 'type'),
  ('회사소개서',     'type'),
  ('패키지',         'type'),
  ('포스터',         'type'),
  ('명함',           'type'),
  ('로고/CI',        'type'),
  ('웹디자인',       'type'),
  ('뷰티·웰니스',    'industry'),
  ('공공기관',       'industry'),
  ('테크·플랫폼',    'industry'),
  ('F&B',            'industry'),
  ('교육',           'industry'),
  ('패션',           'industry')
on conflict do nothing;
