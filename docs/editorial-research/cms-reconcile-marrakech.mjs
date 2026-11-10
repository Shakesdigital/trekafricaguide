// CMS mirror reconcile (read-only, publishable key) for the Marrakech insight run
import fs from 'node:fs';

for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}

const url = 'https://rftoaaehhenhnziukgpl.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!key) { console.log('KEY MISSING'); process.exit(1); }
const hdr = { apikey: key, Authorization: `Bearer ${key}` };

for (const table of ['editorial_documents', 'travel_articles', 'local_destinations']) {
  try {
    const r = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { headers: hdr });
    console.log(table, r.status);
    if (r.ok) {
      const j = await r.json();
      console.log(' rows:', JSON.stringify(j).slice(0, 150));
    }
  } catch (e) {
    console.log(table, 'ERR', e.message);
  }
}
console.log('reconcile done (read-only, no writes attempted)');
