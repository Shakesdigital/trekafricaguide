import fs from 'fs';
const ov = JSON.parse(fs.readFileSync('content/editorial-overrides.json', 'utf8'));
const a = ov.activities.find(x => x.slug === 'sossusvlei-guided-dune-excursion');
// Does the raw template's fig helper output match? reconstruct what script wrote:
const ng = fs.readFileSync('dist/activities/sossusvlei-guided-dune-excursion/index.html', 'utf8');
for (const f of ['dune-45-sunrise', 'sesriem-canyon-2018', 'view-from-big-daddy', 'oryx-big-daddy', 'big-daddy-aerial']) console.log('dist has', f, ng.includes(f));
const lm = require(fs.realpathSync('src/lib/editorial-links.mjs'));
const model = { attractions: ov.attractions.map(x => ({ slug: x.slug, id: x.id, name: 'Namib Desert' })) };
const out = lm.linkAttractionMentions(a.full_description, [{ id: 60, slug: 'namib-desert', name: 'Namib Desert' }]);
console.log('after linkAttractionMentions figures:', (out.match(/<figure>/g) || []).length);
