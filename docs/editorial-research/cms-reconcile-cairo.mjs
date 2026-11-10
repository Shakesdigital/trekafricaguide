import fs from 'node:fs';
const env = {};
for (const l of fs.readFileSync('C:/Users/FOSCOD/.codex/artifacts/trek-photo-site/.env.netlify', 'utf8').split('\n')) {
  const m = l.match(/^([^=]+)=(.*)$/); if (m) env[m[1]] = m[2].trim();
}
const url = env.SUPABASE_URL, key = env.SUPABASE_PUBLISHABLE_KEY;
console.log('key prefix', key.slice(0, 8));
const H = { apikey: key, Authorization: 'Bearer ' + key };
for (const table of ['local_destinations', 'editorial_documents', 'travel_articles']) {
  for (const qs of [`?slug=eq.cairo&select=*`, `?select=slug&limit=3`]) {
    try {
      const r = await fetch(url + '/rest/v1/' + table + qs, { headers: H });
      const body = await r.text();
      console.log(table, qs, r.status, body.slice(0, 260));
    } catch (e) { console.log(table, 'ERR', e.message); }
    await new Promise(res => setTimeout(res, 800));
  }
}
