// Inspect built Nairobi Serena page + Nairobi destination page.
const fs = require('fs');
function inspect(p, label) {
  const h = fs.readFileSync(p, 'utf8');
  const h2s = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  const stay = /stay22\.com|/i.test(h) && /t\d+/i.test(h);
  const links = [...new Set([...h.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(u => u.startsWith('/countries') || u.startsWith('/attractions') || u.startsWith('/activities') || u.startsWith('/accommodations')))];
  console.log('---', label, h.length, 'bytes');
  console.log('title:', title);
  console.log('h2:', JSON.stringify(h2s));
  if (label === 'detail') {
    console.log('booking dest key present:', /accommodations_nairobi_serena_hotel|nairobi-serena-hotel/.test(h));
    console.log('booking resolvers:', [...h.matchAll(/stay22[^"\s]*/gi)].length, 'stay22-like refs');
    console.log('links:', links.join(' , '));
   console.log('marrakech-style leak check <tags in visible text:', /[<]\w+ [a-z-]+="[^"]*"[>]/.test(h.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '')));
  }
}
inspect('dist/accommodations/nairobi-serena-hotel/index.html', 'detail');
inspect('dist/countries/kenya/nairobi/index.html', 'destination');
