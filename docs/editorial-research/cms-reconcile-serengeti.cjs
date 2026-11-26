const fs = require('fs');
const env = {};
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const base = env.SUPABASE_URL;
const key = env.SUPABASE_PUBLISHABLE_KEY;
const run = async (path) => {
  try {
    const r = await fetch(base + path, { headers: { apikey: key, Authorization: 'Bearer ' + key } });
    const body = (await r.text()).slice(0, 120);
    console.log(path, r.status, body);
  } catch (e) {
    console.log(path, 'ERR', String(e).slice(0, 100));
  }
};
(async () => {
  await run('/rest/v1/travel_articles?select=id,slug&limit=3');
  await run('/rest/v1/local_destinations?select=id,slug&limit=3');
  await run('/rest/v1/editorial_documents?select=id&limit=1');
})();
