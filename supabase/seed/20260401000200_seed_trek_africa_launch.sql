insert into public.settings (key, group_name, value, is_public)
values
    ('site_name', 'general', '"Trek Africa Guide"', true),
    ('site_tagline', 'general', '"Honest travel insight, curated listings, and affiliate booking paths across Africa."', true),
    ('affiliate_notice', 'general', '"Booking links redirect to trusted partner landing pages including Travelpayouts tools and selected activity partners."', true)
on conflict (key) do update
set value = excluded.value,
    group_name = excluded.group_name,
    is_public = excluded.is_public,
    updated_at = now();

with inserted_regions as (
    insert into public.regions (slug, name, summary, hero_image_url, hero_priority, status)
    values
        ('east-africa', 'East Africa', 'The strongest launch region for classic safaris, gorilla trekking, and first-time multi-country Africa planning.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80', 1, 'published'),
        ('southern-africa', 'Southern Africa', 'Big safari landscapes, strong self-drive and fly-in circuits, dramatic waterfalls, and city-meets-wildlife pairings.', 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80', 2, 'published'),
        ('central-africa', 'Central Africa', 'Dense forest ecosystems, gorilla trekking, and conservation-first journeys.', 'https://images.unsplash.com/photo-1614463770168-e8eaef4fd0e8?auto=format&fit=crop&w=1600&q=80', 3, 'published')
    on conflict (slug) do update
    set name = excluded.name,
        summary = excluded.summary,
        hero_image_url = excluded.hero_image_url,
        hero_priority = excluded.hero_priority,
        status = excluded.status,
        updated_at = now()
    returning id, slug
),
inserted_countries as (
    insert into public.countries (region_id, slug, name, summary, hero_image_url, visitor_priority, status)
    values
        ((select id from inserted_regions where slug = 'east-africa'), 'uganda', 'Uganda', 'Great for gorilla trekking, Murchison Falls, chimpanzee tracking, and longer overland safari circuits.', 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80', 1, 'published'),
        ((select id from inserted_regions where slug = 'east-africa'), 'kenya', 'Kenya', 'A first-time safari favorite with the Maasai Mara, Amboseli, private conservancies, and easy access from Nairobi.', 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1400&q=80', 2, 'published'),
        ((select id from inserted_regions where slug = 'east-africa'), 'tanzania', 'Tanzania', 'Legendary northern circuit landscapes anchored by Serengeti, Ngorongoro, and strong beach extensions.', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80', 3, 'published'),
        ((select id from inserted_regions where slug = 'east-africa'), 'rwanda', 'Rwanda', 'Compact, polished, and ideal for premium gorilla trekking and short high-value itineraries.', 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1400&q=80', 4, 'published')
    on conflict (slug) do update
    set region_id = excluded.region_id,
        name = excluded.name,
        summary = excluded.summary,
        hero_image_url = excluded.hero_image_url,
        visitor_priority = excluded.visitor_priority,
        status = excluded.status,
        updated_at = now()
    returning id, slug, region_id
)
insert into public.destinations (
    region_id,
    country_id,
    slug,
    name,
    summary,
    short_brief,
    how_to_get_there,
    best_time,
    hero_image_url,
    map_embed_url,
    price_band,
    travel_styles,
    visitor_priority,
    status,
    published_at,
    seo_title,
    seo_description
)
values
    (
        (select region_id from inserted_countries where slug = 'kenya'),
        (select id from inserted_countries where slug = 'kenya'),
        'maasai-mara',
        'Maasai Mara',
        'Kenya’s best-known safari landscape with migration drama, strong predator sightings, and reliable game viewing.',
        'A classic first safari choice with a strong mix of wildlife volume, guide quality, and flexible lodge styles.',
        'Fly from Nairobi into the Mara for speed, or travel overland via Narok for a fuller road-safari rhythm.',
        'Migration months are most famous, but shoulder seasons can be greener and less pressured.',
        'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1600&q=80',
        'https://www.openstreetmap.org/export/embed.html?bbox=34.6%2C-2.2%2C35.6%2C-0.8&layer=mapnik',
        'midrange',
        array['wildlife','photography','family'],
        1,
        'published',
        now(),
        'Maasai Mara Travel Guide | Trek Africa Guide',
        'Explore Maasai Mara safari ideas, where to stay, what to do, and affiliate booking options.'
    ),
    (
        (select region_id from inserted_countries where slug = 'uganda'),
        (select id from inserted_countries where slug = 'uganda'),
        'murchison-falls-national-park',
        'Murchison Falls National Park',
        'Uganda’s largest national park, combining game drives with a Nile boat trip to the foot of the falls.',
        'An easy Uganda launch destination for travelers who want wildlife, scenery, and a strong value-to-experience ratio.',
        'Drive from Kampala or Entebbe to the southern gates, or fly into Pakuba or Bugungu for shorter lodge transfers.',
        'Dry months usually make game viewing easiest, though the Nile and waterfall experience remain impressive year-round.',
        'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80',
        'https://www.openstreetmap.org/export/embed.html?bbox=31.4%2C2.0%2C32.4%2C2.7&layer=mapnik',
        'midrange',
        array['wildlife','adventure','family'],
        2,
        'published',
        now(),
        'Murchison Falls Travel Guide | Trek Africa Guide',
        'Plan Murchison Falls with safari ideas, boat trips, accommodation picks, and partner booking links.'
    ),
    (
        (select region_id from inserted_countries where slug = 'uganda'),
        (select id from inserted_countries where slug = 'uganda'),
        'bwindi-impenetrable-national-park',
        'Bwindi Impenetrable National Park',
        'A forested gorilla trekking destination built around permits, premium lodges, and deeply memorable wildlife encounters.',
        'Best for travelers prioritizing gorilla trekking and conservation-led travel over classic savannah safari pace.',
        'Reach southwestern Uganda by road or fly domestically to a nearby airstrip and transfer by vehicle to your lodge sector.',
        'Tracking runs year-round, but trail conditions are usually easier in the drier periods.',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
        'https://www.openstreetmap.org/export/embed.html?bbox=29.5%2C-1.2%2C29.9%2C-0.8&layer=mapnik',
        'luxury',
        array['wildlife','conservation','adventure'],
        3,
        'published',
        now(),
        'Bwindi Gorilla Trekking Guide | Trek Africa Guide',
        'See how to reach Bwindi, what to expect from gorilla trekking, and where to stay.'
    )
on conflict (slug) do update
set region_id = excluded.region_id,
    country_id = excluded.country_id,
    name = excluded.name,
    summary = excluded.summary,
    short_brief = excluded.short_brief,
    how_to_get_there = excluded.how_to_get_there,
    best_time = excluded.best_time,
    hero_image_url = excluded.hero_image_url,
    map_embed_url = excluded.map_embed_url,
    price_band = excluded.price_band,
    travel_styles = excluded.travel_styles,
    visitor_priority = excluded.visitor_priority,
    status = excluded.status,
    published_at = excluded.published_at,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    updated_at = now();
