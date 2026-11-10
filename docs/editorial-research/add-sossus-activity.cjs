const fs = require('fs');

const root = 'C:/Users/FOSCOD/OpenBot/Agents/agent-7e66c7d5-768a-4689-89ab-be30d19745b6/trek-photo-site';
const SLUG = 'sossusvlei-guided-dune-excursion';
const IMG_DIR = '/images/editorial/sossusvlei-deadvlei-walk';
const CHECKED = '2026-11-10';

const fig = (file, alt, caption) => `<figure><img src="https://trekafricaguide.com${IMG_DIR}/${file}" alt="${alt}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;

const P = {
  hero: ['dead-vlei-camelthorn-2018-delso-dd-085.jpg',
    "A dead camelthorn tree stands on Deadvlei's white pan beneath a deep blue sky and a red dune.",
    "A dead camelthorn on the Deadvlei pan, 6 August 2018 (CC BY-SA 4.0, Diego Delso via Wikimedia Commons). The dead trees are what a first walk out here comes to see, and their scale sits opposite the dune wall behind them."],
  aerial: ['big-daddy-aerial-2019-kraasch.jpg',
    'Aerial view of the Big Daddy dune ridge beside pale salt-and-clay pans.',
    'Big Daddy from the air, 22 October 2019 (CC BY-SA 4.0, Reinhard Kraasch via Wikimedia Commons). From above the dune the choice on the ground reads clearly: climb the crest, or walk around it toward the vleis.'],
  oryx: ['oryx-big-daddy-2021-strassler.jpg',
    'An oryx stands in low scrub on pale ground in front of the red Big Daddy dune.',
    'An oryx in front of Big Daddy Dune, 20 September 2021 (CC BY-SA 2.0, Christoph Strässler via Wikimedia Commons). Desert wildlife keeps its distance here; watch from the path and give the animal room.'],
  dune45: ['dune-45-sunrise-2006-schaufele.jpg',
    'Sunrise from Dune 45 overlooks shadowed dunes and the dry Tsauchab valley.',
    'Sunrise from Dune 45, November 2006 (CC BY-SA 3.0, Philipp Schäufele via Wikimedia Commons). The gateway dune rewards an early start with the morning shadow line moving along the valley floor.'],
  canyon: ['sesriem-canyon-2018-delso-dd-186.jpg',
    'Sesriem Canyon walls rise above a gravel walking floor in shade.',
    'Sesriem Canyon interior, 6 August 2018 (CC BY-SA 4.0, Diego Delso via Wikimedia Commons). The canyon closes the outing at walking distance from the gate, a fitting quieter second stop.'],
  crest: ['view-from-big-daddy-2006-willis.jpg',
    "View west from Big Daddy's crest across layered dunes toward Sossusvlei.",
    'The view west from Big Daddy, 2 October 2006 (CC BY-SA 3.0, Greg Willis via Wikimedia Commons). Crest walkers get this wide angle, then descend toward Deadvlei through soft sand.'],
};

const intro = "<p>Sossusvlei from the ground is a guided morning, not a viewpoint: a gate-to-dune drive, the change of transport at the 2x4 parking, then walking on soft sand among red dunes, clay pans and dead camelthorn trees. This guide covers how that outing usually runs from Sesriem, what the shuttle and 4x4 rules mean for your plan, what guided options cost at the last check and who suits the flat-pan walk versus the dune climb. It complements the published <a href=\"/attractions/namib-desert\">Namib Desert</a> guide and the <a href=\"/countries/namibia/sesriem-sossusvlei\">Sesriem &amp; Sossusvlei</a> destination page.</p>".trim();

const body = `
${intro}
<h2>How the outing usually runs</h2>
<p>Sesriem holds the practical hinge. Namibia Wildlife Resorts describes the spot as the gateway to the globally renowned Sossusvlei inside the Namib, and its distance table places Sossusvlei about 60 km beyond the gate and Windhoek 334 km away. Park permits are issued at the gates on arrival, as Namibia's environment ministry answers in its entry-FAQ, so treat the gate as both checkpoint and source of the rules for the day. Most of the drive runs on paved road through the dune field with formally posted stops before the final sandy section, where ordinary vehicles stop and the shuttle or a registered 4x4 takes over. The last stage between the 2x4 parking and Sossusvlei and Deadvlei changed more than once during 2026: our destination page records the sequence honestly and asks you to confirm the current rule, eligibility and pickup terms with the park, NWR or your operator in the same week you travel.</p>
${fig(...P.dune45)}
<h2>Deadvlei on foot, or Big Daddy by the crest</h2>
<p>Once out on the ground, two walk styles share the same morning. The classic pan walk crosses Deadvlei's white clay among dead camelthorn trees (Vachellia erioloba) under the dune wall, board-flat, shadeless and mostly effortless underfoot, and it suits mixed-age groups. The climb adds a dune: walkers gain the Big Daddy ridge on sand that softens on the way up and slide down toward the vlei on the way back, which is more exertion and more view. Photographers should follow our Namib Desert guide's rule: balance a desired subject or light with the actual gate arrangements, permitted routes and safe transfer time, and choose exertion deliberately rather than assuming the tallest dune is essential. Midday heat is the real constraint on both; carry water beyond the margin you expect to need.</p>
${fig(...P.hero)}
${fig(...P.crest)}
<h2>What guided options cost, and the verified bookable product</h2>
<p>At the live check on 10 November 2026, NWR's Sesriem Campsite rate sheet advertised, for November 2026 to June 2027: shuttle (2x4 parking to the Deadvlei stage) N$180 per person, guided morning drive excluding breakfast N$600 or including breakfast N$700, sunset drive to Elim Dune N$300 and canyon drive N$200 per person. The ministry also lists Sossus Dune Lodge inside the park and notes Sossusvlei sunset drives, guided nature drives, stargazing and walks to the Sesriem Canyon among its offerings. Private operators sell the same landscape as packaged trips. One exact GetYourGuide product verified live on 10 November 2026 is the 2-Day Scenic Sossusvlei Adventure Tour from Sesriem (provider Desert Dunes and Dust Tours): report at the gate, drive some 60 km into the dunes, walk up a Sossusvlei dune, overnight at Moon Mountain Lodge, watch morning shadows on Dune 45 and finish with a Sesriem Canyon walk, from EUR 754 per person with park fees, accommodation, meals and local beverages included and a minimum of two travelers required. Sesriem Canyon itself, a narrow gorge roughly a kilometre long cut 30 to 40 m into rock with pools after good rains per our destination page, is the natural quieter second half.</p>
${fig(...P.canyon)}
<h2>Where to base the morning</h2>
<p>The overnight decision belongs to our destination page and the published sunrise insight, not to the outing itself. In short: a bed inside the park shortens the morning chain, a bed outside means the public gate sets your departure, and our stay guides cover both patterns (Sossusvlei Lodge beside the entrance and Desert Quiver Camp about five kilometres out). Whatever base you choose, plan arrival and orientation first, one full morning for the dunes and pans second, and canyon or Elim Dune as a second outing.</p>
${fig(...P.oryx)}
${fig(...P.aerial)}
`.trim();

const bestTime = "<p>Exposed desert walking is a morning activity in every season. The area is arid year-round, and at the last reported check on the ministry's park plan most rain falls January to March; cooler hours cover the pans and climb, and midday deserves shade and water. First light is the classic reward, but no gate hour is promised here: gates and the shuttle rules decide your earliest entry, and those changed during 2026. Confirm the current gate and transfer arrangements with your operator in the week of travel, then keep the plan loose enough for heat, wind and light.</p>".trim();

const practical = `
<h3>Confirm before you book</h3>
<ul>
<li>The current rule at the final sandy stage (shuttle, registered 4x4 or operator arrangement), with the park, NWR or your operator, in the same week you travel.</li>
<li>Whether your ticket includes the park permit, the shuttle leg and a guide; the verified GetYourGuide product advertises park fees included, but confirm line by line.</li>
<li>Operator minimums and pickups: the verified product requires a minimum of two travelers and pickup included, so check the pickup scope against your accommodation.</li>
<li>Guide, group size and languages for your date, and cancellation terms (the verified product advertises free cancellation up to 24 hours in advance and reserve-now-pay-later).</li>
<li>Weather calls on heat and wind, and how a hot or windy morning changes the route.</li>
</ul>
<h3>What to pack</h3>
<ul><li>Closed walking shoes that handle soft sand and canyon rock.</li>
<li>A warm layer for the pre-dawn start and a hat, sunscreen and sunglasses for the morning sun.</li>
<li>Water beyond the margin you expect to need, plus snacks for the drive in.</li>
<li>A dry pouch for camera and documents; blowing sand is a real hazard on the pans.</li></ul>
<p>Check Namibia's official entry guidance for your passport and nationality; the ministry's FAQ answers that park permits are issued on arrival at the gates and that fees differ at a few parks. Entry information checked 10 November 2026; a park permit is not a visa.</p>
`.trim();

const rec = {
  slug: SLUG,
  attraction_id: 60,
  name: 'Sossusvlei guided dune excursion',
  location_name: 'Sesriem, Namib-Naukluft Park, Namibia',
  listing_summary: "A guided morning out from Sesriem: the gated drive into the dune field, the change of transport at the 2x4 parking, then walking Deadvlei's white pan among dead camelthorn trees, with an optional dune climb on Big Daddy. Confirm the 2026 shuttle and 4x4 rules before you go.",
  detail_intro: "The dune-pans outing that gives a Namib Desert first visit its shape: gate to dune field, 2x4 parking to vlei floor, dead camelthorn in Deadvlei, and the choice between a flat pan walk and climbing Big Daddy, run from a Sesriem base.",
  full_description: body,
  highlights: [
    "Deadvlei's white clay pan and dead camelthorn trees under the Big Daddy dune wall",
    "Guided or self-driven access sequences through the Sesriem gate about 60 km from the pans on NWR's published distance table",
    "Choice of walking styles: the flat pan walk or the Big Daddy ridge climb",
    "Verified Sesriem-based bookable option with park fees and lodging included (checked 10 November 2026)"
  ],
  best_time: bestTime,
  practical_info: practical,
  hero_image_url: `https://trekafricaguide.com${IMG_DIR}/${P.hero[0]}`,
  hero_image_alt: P.hero[1],
  gallery: [],
  booking_url: 'https://www.getyourguide.com/sesriem-l143532/2-day-scenic-sossusvlei-adventure-tour-t1314104/',
  source_url: 'https://www.nwr.com.na/resorts/sesriem-campsite/',
  status: 'published',
  published_at: CHECKED,
  featured: false,
  sort_order: 96,
  last_researched: CHECKED,
  traveler_feedback: 'GetYourGuide listing "2-Day Scenic Sossusvlei Adventure Tour" (2 reviews, 5.0/5, checked 10 November 2026): Laure (Poland, 22 July 2026, verified booking) praised guide Stefan, whose explanation quality kept the days enjoyable, and called the lodge super; a GetYourGuide traveller (Malta, 20 September 2026, verified booking, product ID 1314104, review text not shown on the live page at the check). Published reviews of one product, not a park-wide guarantee.',
  research_sources: [
    {
      label: 'NWR Sesriem Campsite page (checked 10 November 2026): located by Sesriem Canyon, the operator text calls it the gateway to the globally renowned Sossusvlei inside the oldest desert; rate sheet Nov 2026 to Jun 2027: shuttle (2x4 to Deadvlei stage) N$180 pp, sunset drive to Elim Dune N$300, canyon drive N$200, guided morning drive N$600 excl / N$700 incl breakfast',
      url: 'https://www.nwr.com.na/resorts/sesriem-campsite/',
      checked_at: CHECKED
    },
    {
      label: 'MEFT Namib-Naukluft park overview (checked 10 November 2026): towering sand dunes at Sossusvlei, imposing canyon at Sesriem; Sesriem Camp and Sossus Dune Lodge as in-park accommodation; Sossusvlei sunset drives, guided nature drives, stargazing, walks to Sesriem Canyon',
      url: 'https://meft.gov.na/national-parks/namib-naukluft-park/224/',
      checked_at: CHECKED
    },
    {
      label: 'MEFT FAQ on park entry permits (checked 10 November 2026): all national parks issue permits on arrival at the park gates; fees and requirements differ at a few; no permit needed for the main road through Namib-Naukluft',
      url: 'https://www.meft.gov.na/frequently-asked-questions/what-are-the-entry-permit-requirements-for-the-various-parks-in-namibia-/136/',
      checked_at: CHECKED
    },
    {
      label: 'MEFT news, Clarification on the Shuttle Concession for Sossusvlei, Namib Naukluft Park (title verified live 10 November 2026; body not text-extractable at the check; relied on as existence evidence of a published clarification)',
      url: 'https://www.meft.gov.na/news/299/Clarification-on-the-Shuttle-Concession-for-Sossusvlei--Namib-Naukluft-Park/',
      checked_at: CHECKED
    },
    {
      label: 'Trek Africa Guide published Sesriem & Sossusvlei destination page (checked on the live page 10 November 2026): Sossusvlei about 60 km beyond the gate, Windhoek 334 km (NWR distance table); Sesriem Canyon a narrow gorge roughly 1 km long cut 30 to 40 m into rock with rain-fed pools; access sequence changed more than once in 2026; permits issued at gates; two-stay patterns Sossusvlei Lodge beside the entrance and Desert Quiver Camp 5 km out',
      url: 'https://trekafricaguide.com/countries/namibia/sesriem-sossusvlei/',
      checked_at: CHECKED
    },
    {
      label: 'GetYourGuide exact product t1314104 "2-Day Scenic Sossusvlei Adventure Tour" (checked 10 November 2026): provider Desert Dunes and Dust Tours; report at the gate, drive some 60 km through the dunes, walk up a Sossusvlei dune, afternoon shadows, overnight Moon Mountain Lodge, morning Dune 45 shadows, Sesriem Canyon walk; from EUR 754 per person; park fees, accommodation, meals and local beverages included; free cancellation up to 24 h; reserve now and pay later; live English/German guides; pickup included; minimum of 2 pax required; 5.0/5 from 2 reviews',
      url: 'https://www.getyourguide.com/sesriem-l143532/2-day-scenic-sossusvlei-adventure-tour-t1314104/',
      checked_at: CHECKED
    },
    {
      label: 'UNESCO World Heritage record Namib Sand Sea (checked 10 November 2026): inscribed 2013, criteria natural; the record describes the dune field landscape that the outing walks across',
      url: 'https://whc.unesco.org/en/list/1430/',
      checked_at: CHECKED
    },
    {
      label: 'Wikimedia Commons file pages for all six photographs (checked 10 November 2026): creators, capture dates and CC BY / CC BY-SA licenses recorded in photo-library entries and figure captions',
      url: 'https://commons.wikimedia.org/wiki/File:Dead_Vlei,_Sossusvlei,_Namibia,_2018-08-06,_DD_085.jpg',
      checked_at: CHECKED
    },
  ],
  meta_description: 'Plan a Sossusvlei guided dune excursion from Sesriem: gate access and shuttle rules, Deadvlei on foot, the Big Daddy climb, NWR drive rates and a verified bookable two-day option, checked November 2026.',
};

// ---- editorial-overrides activities ----
const ovPath = `${root}/content/editorial-overrides.json`;
const ov = JSON.parse(fs.readFileSync(ovPath, 'utf8'));
if (ov.activities.some(t => t.slug === SLUG)) throw new Error('activity exists');
ov.activities.push(rec);
fs.writeFileSync(ovPath, JSON.stringify(ov, null, 2).replace(/\[\n\s*\]/g, '[]'));
console.log('activity added:', SLUG, '| attractions resolved:', ov.activities.length);

// ---- booking-destinations activities entry ----
const bdPath = `${root}/content/booking-destinations.json`;
const bd = JSON.parse(fs.readFileSync(bdPath, 'utf8'));
if (bd.activities[SLUG]) throw new Error('booking destination exists');
bd.activities[SLUG] = {
  url: 'https://www.getyourguide.com/sesriem-l143532/2-day-scenic-sossusvlei-adventure-tour-t1314104/',
  provider: 'getyourguide',
  title: '2-Day Scenic Sossusvlei Adventure Tour',
  operator: 'Desert Dunes and Dust Tours',
  rating: 5.0,
  review_count: 2,
  notes: 'A two-day guided outing from Sesriem: gate report and the drive through the dunes, a Sossusvlei dune walk, overnight at Moon Mountain Lodge, Dune 45 in the morning and a Sesriem Canyon walk. Park fees, accommodation, meals and local beverages are included; the operator requires a minimum of two travelers. Two reviews only, so treat the 5.0 rating as a small sample. Confirm pickup scope and the current shuttle or 4x4 rule before booking.',
  checked_at: CHECKED,
  evidence: {
    review_check: 'Exact product page, provider, inclusions, exclusions and review aggregate retrieved live 10 November 2026; scores may change. Details in the 2026-11-10 sossusvlei-guided-dune-excursion research ledger and docs/editorial-progress.json.',
  },
};
fs.writeFileSync(bdPath, JSON.stringify(bd, null, 2));
console.log('booking destination added:', SLUG);
