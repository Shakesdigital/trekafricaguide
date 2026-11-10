// Dist check for the Marrakech riad-or-Gueliz insight (pre-push)
import fs from 'node:fs';

const page = 'dist/travel-insights/where-to-sleep-in-marrakech-riad-or-gueliz/index.html';
const html = fs.readFileSync(page, 'utf8');

const checks = [];
const ck = (name, ok) => { checks.push([name, ok]); };

ck('title', html.includes('Where to sleep in Marrakech: a medina riad or a Gueliz hotel'));
ck('h3 rhythm', html.includes('Choose the rhythm before the district'));
ck('h3 riad', html.includes('What a riad actually buys you'));
ck('h3 new town', html.includes('What the new town answers'));
ck('h3 access', html.includes('The access test that shapes the arrival day'));
ck('h3 noise', html.includes('Noise, stairs and shared space'));
ck('h3 checklist', html.includes('The checklist before you pay'));
ck('quote riads ONMT', html.includes('small oriental palaces overlooking a beautiful patio'));
ck('quote ramparts', html.includes('you just have to leave the ramparts to be immersed in modern Morocco'));
ck('quote vehicle room', html.includes('a vehicle may not reach the door'));
ck('quote comparison', html.includes('Compare stays by walking access, noise, stairs and room facilities'));
ck('quote named room', html.includes('request the named room'));
for (const f of ['jamaa-el-fna-dusk-2025', 'riad-courtyard-pool-2007', 'souk-haddadine-lanterns-2024', 'bahia-palace-court-2016', 'koutoubia-rooftops-2016', 'gueliz-avenue-2006']) {
  ck('img ' + f, html.includes(`/images/editorial/marrakech-riad-or-gueliz/${f}.jpg`));
}
ck('figure count 7..', (html.match(/<figure>/g) || []).length >= 6);
for (const credit of ['Jakub Ha\u0142un', 'L. Antoine', 'Petar Milo\u0161evi\u0107', 'Val Traveler', 'Schorle', 'mwanasimba']) {
  ck('credit ' + credit, html.includes(credit));
}
ck('internal riad link', html.includes('href="/accommodations/riad-rosemary"'));
ck('internal destination link', html.includes('href="/countries/morocco/marrakech"'));
ck('internal attraction link', html.includes('href="/attractions/marrakech-and-atlas"'));
ck('internal food tour link', html.includes('href="/activities/marrakech-medina-street-food-tour"'));
ck('internal atlas link', html.includes('href="/activities/atlas-mountains-day-trip"'));
ck('internal country link', html.includes('href="/countries/morocco/"') || html.includes('href="/countries/morocco"'));
ck('no exposed JSON', !html.includes('"local_path"') && !html.includes('"sha256"'));
ck('no booking CTA by design', !html.includes('Booking option'));
ck('no stray escapes', !html.includes('\\u') && !html.includes('undefined'));

const archive = fs.readFileSync('dist/travel-insights/index.html', 'utf8');
ck('archive lists slug', archive.includes('where-to-sleep-in-marrakech-riad-or-gueliz'));
const home = fs.readFileSync('dist/index.html', 'utf8');
ck('home lists slug', home.includes('where-to-sleep-in-marrakech-riad-or-gueliz'));

let bad = 0;
for (const [name, ok] of checks) { if (!ok) { console.log('FAIL', name); bad++; } }
console.log(`checks: ${checks.length - bad}/${checks.length} passed`);
// photos exist in dist/images
for (const f of fs.readdirSync('public/images/editorial/marrakech-riad-or-gueliz')) {
  if (!fs.existsSync('dist/images/editorial/marrakech-riad-or-gueliz/' + f)) console.log('MISSING DIST IMG', f);
}
console.log('dist images OK');
