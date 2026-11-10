import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const base = env.SUPABASE_URL, key = env.SUPABASE_PUBLISHABLE_KEY;
const h = { apikey: key, Authorization: 'Bearer ' + key };
for (const t of ['travel_articles', 'local_destinations', 'editorial_documents']) {
  try {
    const r = await fetch(`${base}/rest/v1/${t}?select=*&limit=2`, { headers: h });
    const body = await r.text();
    let note = '';
    try { const j = JSON.parse(body); note = j.message || j.hint || (Array.isArray(j) ? 'rows:' + j.length : ''); } catch {}
    console.log(t, 'HTTP', r.status, note.slice(0, 160));
  } catch (e) { console.log(t, 'ERR', e.message); }
}
// check whether the new insight/activity slug appears in any readable table
for (const t of ['travel_articles']) {
  const r = await fetch(`${base}/rest/v1/${t}?select=*`, { headers: h });
  if (r.ok) {
    const rows = await r.json();
    const hits = rows.filter(x => JSON.stringify(x).includes('sossusvlei'));
    console.log(t, 'sossusvlei rows:', hits.length);
  }
}
