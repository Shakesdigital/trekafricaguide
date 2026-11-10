// Fetch internal pages for the Marrakech riad-vs-Gueliz insight (2026-11-15:00 run)
import fs from 'node:fs';

const pages = [
  ['morocco-country', 'https://trekafricaguide.com/countries/morocco/'],
  ['riad-rosemary', 'https://trekafricaguide.com/accommodations/riad-rosemary/'],
  ['marrakech-atlas-attraction', 'https://trekafricaguide.com/attractions/marrakech-and-atlas/'],
  ['medina-food-tour', 'https://trekafricaguide.com/activities/marrakech-medina-street-food-tour/'],
  ['insights-archive', 'https://trekafricaguide.com/travel-insights/'],
];

for (const [name, url] of pages) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'trek-editorial-bot/1.0' } });
    const txt = await res.text();
    fs.writeFileSync(`docs/editorial-research/${name}.latest.html`, txt);
    // render text approximation: strip tags
    const text = txt.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ');
    fs.writeFileSync(`docs/editorial-research/${name}.latest.txt`, text.slice(0, 30000));
    console.log(name, res.status, txt.length);
  } catch (e) {
    console.log(name, 'ERROR', e.message);
  }
}
