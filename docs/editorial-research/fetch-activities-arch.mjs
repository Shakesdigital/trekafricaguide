const t = await (await fetch('https://trekafricaguide.com/activities/', { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
const links = [...t.matchAll(/href="(\/activities\/[^"#]+)"/g)].map(m => m[1]);
console.log([...new Set(links)].join('\n'));
