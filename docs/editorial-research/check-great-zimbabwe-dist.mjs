import fs from 'node:fs';
const h = fs.readFileSync('dist/travel-insights/plan-great-zimbabwe-monument-days-from-masvingo/index.html', 'utf8');
const text = h.replace(/<[^>]+>/g, ' ');
const checks = {
  title: h.includes('Plan Great Zimbabwe monument days'),
  h2count: (h.match(/<h2/g) || []).length,
  figures: (h.match(/<figure/g) || []).length,
  images: (h.match(/<img/g) || []).length,
  A4_freight: text.includes('freight'),
  Murray_McDougall: text.includes('Murray McDougall'),
  fee15: text.includes('US$15'),
  kyle169: text.includes('169'),
  Chesvingo: text.includes('Chesvingo'),
  white_rhino: text.includes('white rhino'),
  no_leak: !h.includes('reuse_note') && !h.includes('exact_subject_evidence'),
  research_line: text.includes('Research checked 11 November 2026'),
  link_masvingo: h.includes('/countries/zimbabwe/masvingo'),
  link_monument: h.includes('/attractions/great-zimbabwe-national-monument'),
  link_activity: h.includes('/activities/great-zimbabwe-guided-monument-visit'),
  link_hotel: h.includes('/accommodations/great-zimbabwe-hotel'),
  link_vicfalls: h.includes('/travel-insights/plan-your-victoria-falls-visit'),
};
console.log(JSON.stringify(checks, null, 1));
const m = fs.readFileSync('dist/countries/zimbabwe/masvingo/index.html', 'utf8');
console.log('masvingo page insight card:', m.includes('plan-great-zimbabwe-monument-days-from-masvingo'));
const a = fs.readFileSync('dist/travel-insights/index.html', 'utf8');
console.log('archive lists insight:', a.includes('plan-great-zimbabwe-monument-days-from-masvingo'));
const home = fs.readFileSync('dist/index.html', 'utf8');
console.log('home search lists insight:', home.includes('plan-great-zimbabwe-monument-days-from-masvingo'));
// image asset existence
for (const f of ['great-enclosure-wall-2015-schertzer.jpg','sacred-enclosure-2015-schertzer.jpg','site-aerial-looking-west-2015-bell.jpg','western-entrance-2019-moore.jpg','masvingo-city-centre-2020-realtino.jpg','lake-kyle-2011-maitynoe.jpg']) {
  console.log(f, fs.existsSync('dist/images/editorial/plan-great-zimbabwe-monument-days-from-masvingo/' + f));
}
