const fs = require('fs');

const root = 'C:/Users/FOSCOD/OpenBot/Agents/agent-7e66c7d5-768a-4689-89ab-be30d19745b6/trek-photo-site';
const SLUG = 'sossusvlei-guided-dune-excursion';
const IMG_DIR = '/images/editorial/sossusvlei-deadvlei-walk';
const ovPath = `${root}/content/editorial-overrides.json`;
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
const rec = ov.activities.find(a => a.slug === SLUG);
if (!rec) throw new Error('record missing');

const bodyIntro = rec.full_description;
const fixedBody = bodyIntro
  .replace(/<h2>/g, '<h3>')
  .replace(/<figure>[\s\S]*?<\/figure>/g, '')
  .replace(/\n\s*\n/g, '\n')
  .trim();

rec.full_description = fixedBody;
rec.gallery = [
  'https://trekafricaguide.com' + IMG_DIR + '/dead-vlei-camelthorn-2018-delso-dd-085.jpg',
  'https://trekafricaguide.com' + IMG_DIR + '/big-daddy-aerial-2019-kraasch.jpg',
  'https://trekafricaguide.com' + IMG_DIR + '/oryx-big-daddy-2021-strassler.jpg',
  'https://trekafricaguide.com' + IMG_DIR + '/dune-45-sunrise-2006-schaufele.jpg',
  'https://trekafricaguide.com' + IMG_DIR + '/sesriem-canyon-2018-delso-dd-186.jpg',
  'https://trekafricaguide.com' + IMG_DIR + '/view-from-big-daddy-2006-willis.jpg',
];
rec.hero_image_url = rec.gallery[0];
rec.hero_image_alt = "A dead camelthorn tree stands on Deadvlei's white pan beneath a deep blue sky and a red dune.";

// destination cluster link
const ldPath = `${root}/content/local-destinations.json`;
const ld = JSON.parse(fs.readFileSync(ldPath, 'utf8'));
const arr = Array.isArray(ld) ? ld : (ld.destinations || []);
const d = arr.find(x => x.slug === 'sesriem-sossusvlei');
if (!d) throw new Error('destination missing');
if (!d.activity_slugs.includes(SLUG)) d.activity_slugs.push(SLUG);
d.last_researched = '2026-11-10';
fs.writeFileSync(ldPath, JSON.stringify(ld, null, 2).replace(/\[\n\s*\]/g, '[]'));
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2).replace(/\[\n\s*\]/g, '[]'));
console.log('updated record + destination link; dest host=Array?', Array.isArray(ld), arr.length);
