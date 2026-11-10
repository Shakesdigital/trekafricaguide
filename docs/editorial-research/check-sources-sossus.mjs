const urls = [
  'https://www.meft.gov.na/news/299/Clarification-on-the-Shuttle-Concession-for-Sossusvlei--Namib-Naukluft-Park/',
  'https://meft.gov.na/national-parks/namib-naukluft-park/224/',
  'https://www.nwr.com.na/resorts/sesriem-campsite/',
  'https://www.meft.gov.na/frequently-asked-questions/what-are-the-entry-permit-requirements-for-the-various-parks-in-namibia-/136/',
  'https://informante.web.na/?p=394001',
  'https://whc.unesco.org/en/list/1430/',
];
const strip = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, ' ').replace(/\s+/g, ' ');
for (const u of urls) {
  try {
    const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; editorial check)' }, redirect: 'follow' });
    const t = strip(await r.text());
    console.log('=====', r.status, u, 'len', t.length);
    for (const kw of ['shuttle', 'sunrise', 'sunset', 'gate', 'permit', 'park fee', 'Sossusvlei', '4x4', '4x4s', 'concession', 'inscribed', 'world heritage']) {
      const i = t.toLowerCase().indexOf(kw.toLowerCase());
      if (i >= 0) console.log('  [' + kw + ']', t.slice(Math.max(0, i - 140), i + 240));
    }
  } catch (e) { console.log('=====', 'ERR', u, e.message); }
  await new Promise(res => setTimeout(res, 1500));
}
