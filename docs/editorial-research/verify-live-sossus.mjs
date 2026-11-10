const u = 'https://trekafricaguide.com/activities/sossusvlei-guided-dune-excursion/';
for (let i = 0; i < 20; i++) {
  try {
    const r = await fetch(u + '?nocache=' + i, { headers: { 'user-agent': 'Mozilla/5.0' } });
    console.log(new Date().toISOString().slice(11, 19), i, r.status);
    if (r.status === 200) {
      const t = await r.text();
      console.log('bytes', t.length, '| gallery paths', new Set([...t.matchAll(/sossusvlei-deadvlei-walk\/[^"]+/g)].map(m => m[0])).size, '| CTA', t.includes('stay22.com/allez/getyourguide'), '| operates', /Desert Dunes and Dust Tours/.test(t), '| leak h3', (t.match(/<h3/g) || []).length);
      break;
    }
  } catch (e) { console.log('err', e.message); }
  await new Promise(res => setTimeout(res, 25000));
}
