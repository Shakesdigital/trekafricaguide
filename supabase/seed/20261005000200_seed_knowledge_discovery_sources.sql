-- Seed curated African travel source domains for continuous discovery.
-- These are reliable tourism boards, publications, and operators that the
-- Knowledge Engine will periodically crawl for new content.

insert into public.cm_discovery_sources (domain, name, seed_urls, category, verified, check_interval_hours)
values
  ('www.ugandawildlife.org', 'Uganda Wildlife Authority',
    ARRAY['https://ugandawildlife.org/activities/gorilla-tracking/',
          'https://ugandawildlife.org/parks/bwindi-impenetrable-national-park/',
          'https://ugandawildlife.org/parks/murchison-falls-national-park/'],
    'tourism_board', true, 168),
  ('www.kws.go.ke', 'Kenya Wildlife Service',
    ARRAY['https://kws.go.ke/park/amboseli-national-park/',
          'https://kws.go.ke/wildlife-safaris/',
          'https://kws.go.ke/park/maasai-mara-national-reserve/'],
    'tourism_board', true, 168),
  ('www.sanparks.org', 'South African National Parks',
    ARRAY['https://www.sanparks.org/parks/table-mountain/',
          'https://www.sanparks.org/parks/kruger/'],
    'tourism_board', true, 168),
  ('www.tanzaniaparks.go.tz', 'Tanzania National Parks',
    ARRAY['https://www.tanzaniaparks.go.tz/',
          'https://www.tanzaniaparks.go.tz/park/serengeti-national-park'],
    'tourism_board', true, 168),
  ('www.visitmorocco.com', 'Morocco National Tourism',
    ARRAY['https://www.visitmorocco.com/',
          'https://www.visitmorocco.com/regions/north-morocco'],
    'tourism_board', true, 168),
  ('www.africageographic.com', 'Africa Geographic',
    ARRAY['https://www.africageographic.com/',
          'https://www.africageographic.com/category/travel/'],
    'magazine', true, 48),
  ('www.slowmag.com', 'Slow Travel Magazine',
    ARRAY['https://www.slowmag.com/',
          'https://www.slowmag.com/category/destinations'],
    'magazine', false, 48)
on conflict (domain) do update
  set name = excluded.name,
      seed_urls = excluded.seed_urls,
      category = excluded.category,
      verified = excluded.verified,
      check_interval_hours = excluded.check_interval_hours,
      updated_at = now();
