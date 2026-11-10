const get = async u => await (await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
const t = await get('https://trekafricaguide.com/attractions/');
const a = [...new Set([...t.matchAll(/href="(\/attractions\/[^"#]+)"/g)].map(m => m[1]))];
console.log('--- attractions ---'); console.log(a.join('\n'));
const c = await get('https://trekafricaguide.com/countries/');
const cc = [...new Set([...c.matchAll(/href="(\/countries\/[^"#]+)"/g)].map(m => m[1]))];
console.log('--- countries ---'); console.log(cc.join('\n'));
