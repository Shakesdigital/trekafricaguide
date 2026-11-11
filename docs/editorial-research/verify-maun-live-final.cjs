// Final live checks for the Maun receipt: archive, country page, homepage search, plus page internals.
const base = 'https://trekafricaguide.com';
const get = async p => { const r = await fetch(base + p, { headers: { 'cache-control': 'no-cache' } }); return { s: r.status, h: await r.text() }; };
(async () => {
  const detail = await get('/countries/botswana/maun/');
  console.log('detail', detail.s, 'len', detail.h.length);
  for (const t of ['Explore Maun', 'Highlights', 'Getting there and around', 'Best time to visit', 'Planning your stay',
    'tourism capital', '1915', 'Thamalakane', 'Johannesburg and Gaborone', 'transit point',
    '/attractions/okavango-delta', '/activities/okavango-mokoro-safari', '/accommodations/camp-okavango']) {
    console.log(' ', t, detail.h.includes(t));
  }
  console.log('exposed markup:', /<<\w/.test(detail.h), 'html-escaped prose:', /&lt;p&gt;/.test(detail.h));
  const country = await get('/countries/botswana/');
  console.log('country page', country.s, 'Destinations in Botswana:', country.h.includes('Destinations in Botswana'), 'maun link:', country.h.includes('/countries/botswana/maun'));
  const archive = await get('/countries/');
  console.log('countries archive', archive.s, 'maun listed:', archive.h.includes('/countries/botswana/maun'));
  const home = await get('/');
  console.log('homepage', home.s, 'maun in search index:', home.h.includes('/countries/botswana/maun'));
  const insight = await get('/travel-insights/plan-okavango-trip/');
  console.log('okavango insight (other agent)', insight.s, 'links maun:', insight.h.includes('/countries/botswana/maun'));
})().catch(e => console.log('ERR', e.message));
setTimeout(() => {}, 1);
