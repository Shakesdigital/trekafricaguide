// Read-only CMS mirror reconcile with the publishable key (public tables only; no writes anywhere).
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8') + fs.readFileSync('.env.netlify', 'utf8');
const key = (env.match(/SUPABASE_PUBLISHABLE_KEY=(.+)/) || [])[1].trim();
const base = 'https://rftoaaehhenhnziukgpl.supabase.co/rest/v1/';
const headers = { apikey: key, Authorization: 'Bearer ' + key };
(async () => {
  for (const t of ['travel_articles', 'local_destinations', 'editorial_documents']) {
    const r = await fetch(base + t + '?select=id&limit=1000', { headers });
    let body = '';
    try { body = await r.text(); } catch {}
    let n = body ? body.split('},{').length : 0;
    console.log(t, r.status, 'rows~' + (r.ok ? n : ''));
    if (r.ok) {
      const rows = JSON.parse(body);
      console.log('  exact rows:', rows.length, 'ids:', rows.slice(0, 8).map(x => x.id).join(','));
    }
  }
})();
