(function () {
  const SUPABASE_URL = 'https://ssjllxxwbtvkgozkrrlj.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamxseHh3YnR2a2dvemtycmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2OTgzMjYsImV4cCI6MjA5NjI3NDMyNn0.-Yq3ZBcS3BekfTUnfpch2JkcpbrGrWrcABYgnm1bxW4';

  const tables = {};
  const main = document.querySelector('main');

  if (!main || !window.supabase) return;

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const lines = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch (error) {
        return value.split('\n').map((line) => line.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const bySlug = (items, slug) => items.find((item) => item.slug === slug);
  const setting = (key, fallback = '') => (tables.site_settings || []).find((item) => item.key === key)?.value || fallback;
  const section = (page, key) => (tables.page_sections || []).find((item) => item.page_key === page && item.section_key === key) || {};

  const route = (name, slug = '') => {
    const roots = {
      regions: '/regions',
      countries: '/countries',
      attractions: '/attractions',
      accommodations: '/accommodations',
      restaurants: '/restaurants',
    };
    return `${roots[name]}${slug ? `/${slug}` : ''}`;
  };

  const imageSlot = (image, alt, className = '') => {
    if (image) return `<img src="${esc(image)}" alt="${esc(alt)}">`;
    return `<div class="image-slot ${className}" role="img" aria-label="${esc(alt || 'Reserved image space')}"><span>Image slot</span><strong>${esc(alt || 'Reserved visual')}</strong></div>`;
  };

  const gallery = (images, fallback, alt, single = false) => {
    const galleryImages = lines(images);
    const items = galleryImages.length ? galleryImages : [fallback].filter(Boolean);
    if (!items.length) return '';
    return `<div class="gallery-grid ${single && items.length === 1 ? 'gallery-grid--single' : ''}">
      ${items.map((image) => imageSlot(image, alt, 'gallery-grid__slot')).join('')}
    </div>`;
  };

  const listingCard = ({ href, image, title, summary, eyebrow, rating, reviews, price, chips = [] }) => `
    <article class="listing-card">
      <a href="${esc(href)}" class="listing-card__image">${imageSlot(image, title, 'listing-card__slot')}</a>
      <div class="listing-card__body">
        ${eyebrow ? `<p class="listing-card__eyebrow">${esc(eyebrow)}</p>` : ''}
        <h3><a href="${esc(href)}">${esc(title)}</a></h3>
        <p>${esc(summary)}</p>
        <div class="listing-card__meta">
          ${rating ? `<span>&#9733; ${Number(rating).toFixed(1)}${reviews ? ` (${Number(reviews).toLocaleString()})` : ''}</span>` : ''}
          ${price ? `<span>${esc(price)}</span>` : ''}
        </div>
        <div class="listing-card__footer">
          ${chips.length ? `<div class="chip-row">${chips.filter(Boolean).map((chip) => `<span>${esc(chip)}</span>`).join('')}</div>` : ''}
          <a href="${esc(href)}" class="button button--ghost">View Details</a>
        </div>
      </div>
    </article>`;

  const pageHero = ({ eyebrow, title, body, image, alt }) => `
    <section class="page-hero">
      ${imageSlot(image, alt || title, 'page-hero__slot')}
      <div class="page-hero__overlay"></div>
      <div class="container page-hero__content">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1>${esc(title)}</h1>
        <p>${esc(body)}</p>
      </div>
    </section>`;

  const detailHero = ({ eyebrow, title, summary, rating, reviews, images, image, alt }) => `
    <section class="detail-hero">
      <div class="container">
        <div class="detail-hero__header">
          <div>
            <p class="eyebrow">${esc(eyebrow)}</p>
            <h1>${esc(title)}</h1>
            <p class="detail-hero__summary">${esc(summary)}</p>
            ${rating ? `<div class="detail-rating">&#9733; ${Number(rating).toFixed(1)} <span>${Number(reviews || 0).toLocaleString()} reviews</span></div>` : ''}
          </div>
        </div>
        ${gallery(images, image, alt || title, true)}
      </div>
    </section>`;

  const grid = (items) => `<div class="listing-grid">${items.join('')}</div>`;
  const getCountry = (id) => (tables.countries || []).find((item) => Number(item.id) === Number(id));
  const getRegion = (id) => (tables.regions || []).find((item) => Number(item.id) === Number(id));
  const getAttraction = (id) => (tables.attractions || []).find((item) => Number(item.id) === Number(id));

  function renderIndex(kind, title, body, items, cardBuilder) {
    main.innerHTML = `
      ${pageHero({ eyebrow: title, title, body, image: null })}
      <section class="section"><div class="container">${grid(items.map(cardBuilder))}</div></section>`;
  }

  function renderHome() {
    if (!(tables.regions || []).length && !(tables.attractions || []).length && !(tables.page_sections || []).length) return;
    const hero = section('home', 'hero');
    const intro = section('home', 'intro');
    const regions = (tables.regions || []).slice(0, 4);
    const attractions = (tables.attractions || []).filter((item) => item.featured).slice(0, 8);
    const stays = (tables.accommodations || []).filter((item) => item.featured).slice(0, 4);
    const restaurants = (tables.restaurants || []).filter((item) => item.featured).slice(0, 4);

    main.innerHTML = `
      <section class="hero">
        ${imageSlot(hero.image_url || regions[0]?.hero_image_url, hero.title || setting('site_name'), 'page-hero__slot')}
        <div class="hero__overlay"></div>
        <div class="container hero__content">
          <p class="eyebrow">${esc(hero.eyebrow || 'Discover Africa')}</p>
          <h1>${esc(hero.title || setting('site_name', 'Trek Africa Guide'))}</h1>
          <p class="hero__lead">${esc(hero.body || setting('site_tagline'))}</p>
          <div class="hero__actions"><a class="button" href="/regions">Explore regions</a><a class="button button--ghost-light" href="/attractions">Browse attractions</a></div>
        </div>
      </section>
      <section class="section"><div class="container two-column"><div><p class="eyebrow">${esc(intro.eyebrow || 'Overview')}</p><h2>${esc(intro.title || 'Africa travel planning')}</h2><p>${esc(intro.body || setting('default_meta_description'))}</p></div><div class="info-panel"><h3>How Trek Africa Guide works</h3><ul class="bullet-list"><li>Start with regions and destination countries.</li><li>Compare attractions, stays, restaurants, and booking paths.</li><li>Update content from the Supabase CMS dashboard.</li></ul></div></div></section>
      ${homeBlock('Featured Regions', regions.map((region) => listingCard({ href: route('regions', region.slug), image: region.hero_image_url, title: region.name, summary: region.overview, eyebrow: 'Region', chips: ['Regional guide'] })))}
      ${homeBlock('Featured Attractions', attractions.map(attractionCard))}
      ${homeBlock('Featured Accommodations', stays.map(accommodationCard))}
      ${homeBlock('Featured Restaurants', restaurants.map(restaurantCard))}`;
  }

  const homeBlock = (title, cards) => cards.length ? `<section class="section section--alt"><div class="container"><div class="section-heading"><p class="eyebrow">${esc(title)}</p><h2>${esc(title)}</h2></div>${grid(cards)}</div></section>` : '';

  function attractionCard(item) {
    const country = getCountry(item.country_id);
    return listingCard({ href: route('attractions', item.slug), image: item.hero_image_url, title: item.name, summary: item.listing_summary, eyebrow: country?.name, rating: item.rating, reviews: item.review_count, price: item.price_label, chips: [item.location_name] });
  }

  function accommodationCard(item) {
    const attraction = getAttraction(item.attraction_id);
    return listingCard({ href: route('accommodations', item.slug), image: item.hero_image_url, title: item.name, summary: item.listing_summary, eyebrow: item.property_type, rating: item.rating, reviews: item.review_count, price: item.price_label, chips: [item.location_name || attraction?.name] });
  }

  function restaurantCard(item) {
    return listingCard({ href: route('restaurants', item.slug), image: item.hero_image_url, title: item.name, summary: item.listing_summary, eyebrow: item.cuisine, rating: item.rating, reviews: item.review_count, price: item.price_label, chips: [item.signature_dish] });
  }

  function renderRegion(slug) {
    const region = bySlug(tables.regions || [], slug);
    if (!region) return;
    const countries = (tables.countries || []).filter((item) => Number(item.region_id) === Number(region.id));
    const attractions = (tables.attractions || []).filter((item) => Number(item.region_id) === Number(region.id)).slice(0, 6);
    main.innerHTML = `
      ${pageHero({ eyebrow: region.name, title: region.hero_title, body: region.hero_text, image: region.hero_image_url, alt: region.hero_image_alt })}
      ${lines(region.gallery).length ? `<section class="section section--alt"><div class="container"><div class="section-heading section-heading--compact"><p class="eyebrow">Hero Gallery</p><h2>More visuals from ${esc(region.name)}</h2></div>${gallery(region.gallery, null, region.name)}</div></section>` : ''}
      <section class="section"><div class="container two-column"><div><h2>Regional overview</h2><p>${esc(region.overview)}</p><p>${esc(region.countries_intro)}</p></div><div class="info-panel"><h3>Use this page to</h3><ul class="bullet-list"><li>Compare destination countries.</li><li>Understand regional strengths.</li><li>Move into attractions, stays, and restaurants.</li></ul></div></div></section>
      <section class="section section--alt"><div class="container"><div class="section-heading"><p class="eyebrow">Destinations</p><h2>Destination countries in ${esc(region.name)}</h2></div>${grid(countries.map((country) => listingCard({ href: route('countries', country.slug), image: country.hero_image_url, title: country.name, summary: country.overview, eyebrow: region.name, chips: ['Destination guide'] })))}</div></section>
      <section class="section"><div class="container"><div class="section-heading"><p class="eyebrow">Featured attractions</p><h2>High-interest attractions in ${esc(region.name)}</h2></div>${grid(attractions.map(attractionCard))}</div></section>`;
  }

  function renderCountry(slug) {
    const country = bySlug(tables.countries || [], slug);
    if (!country) return;
    const region = getRegion(country.region_id);
    const attractions = (tables.attractions || []).filter((item) => Number(item.country_id) === Number(country.id));
    const stays = (tables.accommodations || []).filter((item) => Number(item.country_id) === Number(country.id)).slice(0, 6);
    const restaurants = (tables.restaurants || []).filter((item) => Number(item.country_id) === Number(country.id)).slice(0, 6);
    const operators = (tables.tour_operators || []).filter((item) => Number(item.country_id) === Number(country.id));
    main.innerHTML = `
      ${pageHero({ eyebrow: region?.name || 'Destination', title: country.hero_title, body: country.hero_text, image: country.hero_image_url, alt: country.hero_image_alt })}
      ${lines(country.gallery).length ? `<section class="section section--alt"><div class="container"><div class="section-heading section-heading--compact"><p class="eyebrow">Hero Gallery</p><h2>More visuals from ${esc(country.name)}</h2></div>${gallery(country.gallery, null, country.name)}</div></section>` : ''}
      <section class="section"><div class="container detail-grid"><div class="detail-main"><h2>Destination guide to ${esc(country.name)}</h2><p>${esc(country.overview)}</p><div class="detail-section"><h3>Getting around</h3><p>${esc(country.access_summary)}</p></div><div class="detail-section"><h3>Best time to visit</h3><p>${esc(country.best_time)}</p></div><div class="detail-section"><h3>Planning notes</h3><p>${esc(country.planning_tips)}</p></div></div><aside class="detail-rail"><div class="booking-panel"><p class="booking-panel__eyebrow">Destination at a glance</p><h3>${esc(country.name)}</h3><ul class="bullet-list"><li>${attractions.length} attractions listed</li><li>${operators.length} tour operator profiles</li><li>${stays.length} accommodations nearby</li><li>${restaurants.length} recommended restaurants</li></ul></div></aside></div></section>
      <section class="section section--alt"><div class="container"><div class="section-heading"><p class="eyebrow">Attractions</p><h2>Tourist attractions in ${esc(country.name)}</h2></div>${grid(attractions.map(attractionCard))}</div></section>
      <section class="section"><div class="container two-column"><div><div class="section-heading section-heading--compact"><p class="eyebrow">Tour operators</p><h2>Operators that can help shape the route</h2></div><div class="stack-grid">${operators.map(operatorCard).join('')}</div></div><div><div class="section-heading section-heading--compact"><p class="eyebrow">Nearby stays</p><h2>Stays that keep you close to the experience</h2></div><div class="stack-grid">${stays.map(accommodationCard).join('')}</div></div></div></section>
      <section class="section section--alt"><div class="container"><div class="section-heading"><p class="eyebrow">Dining</p><h2>Dining ideas that add flavor to the journey</h2></div>${grid(restaurants.map(restaurantCard))}</div></section>`;
  }

  function operatorCard(operator) {
    return `<article class="mini-card"><h3>${esc(operator.name)}</h3><p>${esc(operator.summary)}</p><div class="chip-row">${lines(operator.specialties).map((item) => `<span>${esc(item)}</span>`).join('')}</div>${operator.booking_url ? `<a href="${esc(operator.booking_url)}" class="button button--ghost" target="_blank" rel="noopener">Visit operator</a>` : ''}</article>`;
  }

  function renderAttraction(slug) {
    const item = bySlug(tables.attractions || [], slug);
    if (!item) return;
    const country = getCountry(item.country_id);
    const region = getRegion(item.region_id);
    const stays = (tables.accommodations || []).filter((stay) => Number(stay.attraction_id) === Number(item.id)).slice(0, 4);
    const restaurants = (tables.restaurants || []).filter((restaurant) => Number(restaurant.attraction_id) === Number(item.id)).slice(0, 4);
    const operators = (tables.tour_operators || []).filter((operator) => Number(operator.attraction_id) === Number(item.id) || Number(operator.country_id) === Number(item.country_id)).slice(0, 6);
    main.innerHTML = `
      ${detailHero({ eyebrow: `${country?.name || ''} / ${region?.name || ''}`, title: item.name, summary: item.listing_summary, rating: item.rating, reviews: item.review_count, images: item.gallery, image: item.hero_image_url, alt: item.hero_image_alt })}
      <section class="section"><div class="container detail-grid"><div class="detail-main"><div class="detail-section"><h2>About this attraction</h2><p>${esc(item.detail_intro)}</p></div><div class="detail-section"><h3>How to get there</h3><p>${esc(item.getting_there)}</p></div><div class="detail-section"><h3>Best time to visit</h3><p>${esc(item.best_time)}</p></div><div class="detail-section"><h3>Highlights</h3><ul class="bullet-list">${lines(item.highlights).map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div><div class="detail-section"><h3>Practical information</h3><p>${esc(item.practical_info)}</p></div><div class="detail-section"><h3>Full description</h3><p>${esc(item.full_description)}</p></div><div class="detail-section"><h3>Tour operators active here</h3><div class="stack-grid">${operators.map(operatorCard).join('')}</div></div></div><aside class="detail-rail"><div class="booking-panel"><p class="booking-panel__eyebrow">Booking path</p><h3>${esc(item.price_label)}</h3><p>${esc(item.location_name)}</p>${item.booking_url ? `<a href="${esc(item.booking_url)}" class="button button--full" target="_blank" rel="noopener">Check partner options</a>` : ''}</div></aside></div></section>
      <section class="section section--alt"><div class="container"><div class="section-heading section-heading--compact"><p class="eyebrow">Nearby stays</p><h2>Accommodations near ${esc(item.name)}</h2></div>${grid(stays.map(accommodationCard))}</div></section>
      <section class="section"><div class="container"><div class="section-heading section-heading--compact"><p class="eyebrow">Nearby dining</p><h2>Restaurants near ${esc(item.name)}</h2></div>${grid(restaurants.map(restaurantCard))}</div></section>`;
  }

  function renderAccommodation(slug) {
    const item = bySlug(tables.accommodations || [], slug);
    if (!item) return;
    const country = getCountry(item.country_id);
    const attraction = getAttraction(item.attraction_id);
    const nearby = (tables.attractions || []).filter((a) => Number(a.country_id) === Number(item.country_id)).slice(0, 4);
    main.innerHTML = `
      ${detailHero({ eyebrow: `${country?.name || ''} / ${item.property_type || ''}`, title: item.name, summary: item.listing_summary, rating: item.rating, reviews: item.review_count, images: item.gallery, image: item.hero_image_url, alt: item.hero_image_alt })}
      <section class="section"><div class="container detail-grid"><div class="detail-main"><div class="detail-section"><h2>About this stay</h2><p>${esc(item.detail_intro)}</p></div><div class="detail-section"><h3>Why it works for this route</h3><p>${esc(item.practical_info)}</p></div><div class="detail-section"><h3>Amenities</h3><ul class="bullet-list">${lines(item.amenities).map((amenity) => `<li>${esc(amenity)}</li>`).join('')}</ul></div>${attraction ? `<div class="detail-section"><h3>Best nearby attraction</h3><p><a href="${route('attractions', attraction.slug)}">${esc(attraction.name)}</a> is the clearest anchor for this stay.</p></div>` : ''}</div><aside class="detail-rail"><div class="booking-panel"><p class="booking-panel__eyebrow">Booking path</p><h3>${esc(item.price_label)}</h3><p>${esc(item.location_name)}</p>${item.booking_url ? `<a href="${esc(item.booking_url)}" class="button button--full" target="_blank" rel="noopener">Check stay options</a>` : ''}</div></aside></div></section>
      <section class="section section--alt"><div class="container"><div class="section-heading section-heading--compact"><p class="eyebrow">Nearby attractions</p><h2>Continue planning around this stay</h2></div>${grid(nearby.map(attractionCard))}</div></section>`;
  }

  function renderRestaurant(slug) {
    const item = bySlug(tables.restaurants || [], slug);
    if (!item) return;
    const country = getCountry(item.country_id);
    const attraction = getAttraction(item.attraction_id);
    const stays = (tables.accommodations || []).filter((stay) => Number(stay.country_id) === Number(item.country_id)).slice(0, 4);
    main.innerHTML = `
      ${detailHero({ eyebrow: `${country?.name || ''} / ${item.cuisine || ''}`, title: item.name, summary: item.listing_summary, rating: item.rating, reviews: item.review_count, images: item.gallery, image: item.hero_image_url, alt: item.hero_image_alt })}
      <section class="section"><div class="container detail-grid"><div class="detail-main"><div class="detail-section"><h2>About this restaurant</h2><p>${esc(item.detail_intro)}</p></div><div class="detail-section"><h3>Signature dish</h3><p>${esc(item.signature_dish)}</p></div><div class="detail-section"><h3>Practical information</h3><p>${esc(item.practical_info)}</p></div>${attraction ? `<div class="detail-section"><h3>Nearby attraction</h3><p>This restaurant is recommended for travelers visiting <a href="${route('attractions', attraction.slug)}">${esc(attraction.name)}</a>.</p></div>` : ''}</div><aside class="detail-rail"><div class="booking-panel"><p class="booking-panel__eyebrow">Booking path</p><h3>${esc(item.price_label)}</h3><p>${esc(item.location_name)}</p>${item.booking_url ? `<a href="${esc(item.booking_url)}" class="button button--full" target="_blank" rel="noopener">Check dining details</a>` : ''}</div></aside></div></section>
      <section class="section section--alt"><div class="container"><div class="section-heading section-heading--compact"><p class="eyebrow">Nearby stays</p><h2>Accommodations that pair well</h2></div>${grid(stays.map(accommodationCard))}</div></section>`;
  }

  function renderContact() {
    if (!(tables.site_settings || []).length && !(tables.page_sections || []).some((item) => item.page_key === 'contact')) return;
    const hero = section('contact', 'hero');
    const body = section('contact', 'body');
    main.innerHTML = `
      ${pageHero({ eyebrow: hero.eyebrow || 'Contact', title: hero.title || 'Help keep Africa travel planning clear, useful, and current.', body: hero.body || 'Send listing updates, destination corrections, partnership notes, or practical feedback.', image: hero.image_url, alt: 'Contact hero' })}
      <section class="section"><div class="container detail-grid"><div class="detail-main"><div class="detail-section"><h2>${esc(body.title || 'Send a useful travel or listing note')}</h2><p>${esc(body.body || 'Include the country, attraction, stay, restaurant, or page URL you mean, plus the update or partnership detail you want reviewed.')}</p></div></div><aside class="detail-rail"><div class="booking-panel"><p class="booking-panel__eyebrow">Public contact</p><h3>${esc(setting('site_name', 'Trek Africa Guide'))}</h3><ul class="bullet-list"><li><a href="mailto:${esc(setting('contact_email', 'hello@trekafricaguide.com'))}">${esc(setting('contact_email', 'hello@trekafricaguide.com'))}</a></li><li>${esc(setting('contact_phone', '+256 700 000 000'))}</li><li>${esc(setting('contact_address', 'Kampala, Uganda'))}</li></ul><p>${esc(setting('contact_note', 'These contact details can be updated in the CMS settings.'))}</p></div></aside></div></section>`;
  }

  function updateBranding() {
    const siteName = setting('site_name', 'Trek Africa Guide');
    const logo = setting('logo_path', '/logo to edit.png');
    document.querySelectorAll('.brand strong, .site-footer h3').forEach((el) => { el.textContent = siteName; });
    document.querySelectorAll('.brand img').forEach((img) => { img.src = logo; img.alt = `${siteName} logo`; });
    document.documentElement.style.setProperty('--brand-primary', setting('primary_color', '#284932'));
    document.documentElement.style.setProperty('--brand-secondary', setting('secondary_color', '#c56b3d'));
    document.documentElement.style.setProperty('--brand-accent', setting('accent_color', '#c5b580'));
  }

  async function load() {
    const names = ['site_settings', 'page_sections', 'regions', 'countries', 'attractions', 'accommodations', 'restaurants', 'tour_operators'];
    const results = await Promise.all(names.map((name) => sb.from(name).select('*').order('id', { ascending: true })));
    results.forEach((result, index) => {
      if (!result.error) tables[names[index]] = result.data || [];
    });

    updateBranding();

    const parts = path.split('/').filter(Boolean);
    if (path === '/') return renderHome();
    if (path === '/contact') return renderContact();
    if (path === '/regions') return (tables.regions || []).length ? renderIndex('regions', 'Regions', 'Start with the major Africa travel regions.', tables.regions || [], (region) => listingCard({ href: route('regions', region.slug), image: region.hero_image_url, title: region.name, summary: region.overview, eyebrow: 'Region', chips: ['Regional guide'] })) : undefined;
    if (path === '/countries') return (tables.countries || []).length ? renderIndex('countries', 'Destinations', 'Compare destination country guides.', tables.countries || [], (country) => listingCard({ href: route('countries', country.slug), image: country.hero_image_url, title: country.name, summary: country.overview, eyebrow: getRegion(country.region_id)?.name, chips: ['Destination guide'] })) : undefined;
    if (path === '/attractions') return (tables.attractions || []).length ? renderIndex('attractions', 'Attractions', 'Browse tourist attractions and practical travel notes.', tables.attractions || [], attractionCard) : undefined;
    if (path === '/accommodations') return (tables.accommodations || []).length ? renderIndex('accommodations', 'Accommodations', 'Browse stays connected to destinations and attractions.', tables.accommodations || [], accommodationCard) : undefined;
    if (path === '/restaurants') return (tables.restaurants || []).length ? renderIndex('restaurants', 'Restaurants', 'Browse recommended restaurants near travel routes.', tables.restaurants || [], restaurantCard) : undefined;
    if (parts[0] === 'regions') return renderRegion(parts[1]);
    if (parts[0] === 'countries') return renderCountry(parts[1]);
    if (parts[0] === 'attractions') return renderAttraction(parts[1]);
    if (parts[0] === 'accommodations') return renderAccommodation(parts[1]);
    if (parts[0] === 'restaurants') return renderRestaurant(parts[1]);
  }

  load().catch((error) => {
    console.warn('CMS sync failed:', error);
  });
}());
