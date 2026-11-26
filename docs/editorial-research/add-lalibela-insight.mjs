import fs from 'node:fs';
const p = 'content/editorial-overrides.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));

if (o.travel_articles.some(a => a.slug === 'decide-lalibela-under-do-not-travel-advice')) {
  console.log('already present');
  process.exit(0);
}

const record = {
  slug: 'decide-lalibela-under-do-not-travel-advice',
  title: 'Lalibela under a do-not-travel advisory: how to decide, and how to wait well',
  category: 'Trip planning',
  region: 'East Africa',
  country: 'Ethiopia',
  excerpt: 'Three published pages defer one decision to you — whether a Lalibela visit is appropriate at all. Read what the advisories actually say, what the paperwork still requires, and how to keep a future plan reversible.',
  read_time: '8 min read',
  hero_image_url: '',
  hero_image_alt: '',
  status: 'published',
  published_at: '2026-11-16',
  featured: false,
  sort_order: 99,
  last_researched: '2026-11-16',
  source_url: 'https://www.gov.uk/foreign-travel-advice/ethiopia',
  meta_title: 'Lalibela under a do-not-travel advisory: how to decide',
  meta_description: 'Ethiopia travel advice puts Amhara under do-not-travel. What the advisories say, what the entry paperwork still requires, and how to keep a future Lalibela plan reversible.',
  research_sources: [
    {
      label: 'UK FCDO Ethiopia travel advice: Amhara under do-not-travel, updated 30 October 2026, still current 16 November 2026',
      url: 'https://www.gov.uk/foreign-travel-advice/ethiopia',
      checked_at: '2026-11-16'
    },
    {
      label: 'UK FCDO Ethiopia entry requirements: e-visa, passport validity, yellow fever, currency and customs rules',
      url: 'https://www.gov.uk/foreign-travel-advice/ethiopia/entry-requirements',
      checked_at: '2026-11-16'
    },
    {
      label: 'UNESCO World Heritage Centre: Rock-Hewn Churches, Lalibela (inscribed 1978) — description, integrity and management text',
      url: 'https://whc.unesco.org/en/list/18/',
      checked_at: '2026-11-16'
    },
    {
      label: 'Trek Africa Guide internal cluster (live HTTP 200, 16 November 2026) — /countries/ethiopia/, /countries/ethiopia/lalibela/, /attractions/lalibela/, /accommodations/maribela-hotel/; the destination record carries the Smartraveller check dated 13 November 2026',
      url: 'https://trekafricaguide.com/countries/ethiopia/lalibela/',
      checked_at: '2026-11-16'
    }
  ],
  body: `<p><em>Research checked 16 November 2026. The FCDO Ethiopia page was marked "still current" on that date. Advisories change with little notice — recheck every source on this page shortly before you act on any part of it.</em></p>

<p>Three pages on this guide say the same thing about Lalibela. The <a href="/attractions/lalibela/">attraction guide</a> puts it plainly: "the first planning decision is whether travel is appropriate at all, assessed against current official advice and the limitations of transport and assistance". The <a href="/countries/ethiopia/lalibela/">destination guide</a> and the country guide say versions of the same sentence. None of them answers the question, because none of them should — that decision belongs to you, your own government's advice and your own risk judgement. What this page can do is put the evidence in one place: what the advisories actually say, what the entry paperwork still requires even while the advisory stands, how to keep any future plan reversible, and what a future visit would actually involve on the ground.</p>

<p>Ethiopia appears on this guide as a complete cluster — the <a href="/countries/ethiopia/">Ethiopia country guide</a>, the <a href="/countries/ethiopia/lalibela/">Lalibela destination</a>, the <a href="/attractions/lalibela/">Lalibela attraction</a> and the <a href="/accommodations/maribela-hotel/">Maribela Hotel</a> stay card, retained for reference — while the travel-insights shelf carried zero Ethiopia stories. This is that story.</p>

<h2>What the advisories actually say</h2>

<p>The UK Foreign, Commonwealth &amp; Development Office (FCDO) advises against <strong>all travel to Amhara region</strong> — the region that contains Lalibela. Its Ethiopia advice, updated 30 October 2026 and still marked current on 16 November 2026, also advises against all travel to Tigray, Gambela and several border zones, and against all but essential travel to others. Two statements on that page matter more than the map:</p>

<ul>
<li><strong>Consular help has limits.</strong> "Staff at the British Embassy in Addis Ababa cannot offer support in person in areas of Ethiopia where FCDO advises against travel." If something goes wrong in Amhara, in-person help from the embassy is not part of the plan.</li>
<li><strong>Northern transport is fragile.</strong> FCDO describes ongoing fighting between federal forces and forces opposed to them in northern Ethiopia, and notes that "some flights are suspended and flights across northern Ethiopia may also be suspended or cancelled at short notice". A booked seat is not a booked arrival.</li>
</ul>

<p>Australia's Smartraveller is the second advisory our destination record cites; that record checked it on 13 November 2026 and found the same all-travel warning for Amhara. We could not re-fetch Smartraveller directly on 16 November, so treat that claim as current as of 13 November and recheck it yourself — <a href="https://www.smartraveller.gov.au/destinations/africa/ethiopia">smartraveller.gov.au</a> is the source of record. The site's own attraction record carries the same advisory conclusion from a check on 11 October 2026. If your government is neither the UK nor Australia, your list is your own foreign-ministry page, read today, not this summary.</p>

<p>One more implication deserves its own sentence: many travel-insurance policies exclude or limit cover in destinations under do-not-travel advice. Our destination guide says this directly. Check the policy wording, not the marketing page, and confirm medical-evacuation cover — in a remote highland region under an active advisory, evacuation may be the only realistic response to a serious medical problem.</p>

<h2>The paperwork still exists — and still binds you</h2>

<p>Even with the advisory standing, the entry rules keep applying, and understanding them keeps any future plan grounded in reality rather than in marketing. From the FCDO entry-requirements page, checked 16 November 2026:</p>

<ul>
<li><strong>Passport:</strong> valid for at least six months after your arrival date, and machine-readable.</li>
<li><strong>Visa:</strong> required for tourism. The FCDO recommends applying online before arrival — a 30-day single-entry tourist visa through the official platform at <a href="https://www.evisa.gov.et/">evisa.gov.et</a>, which asks for a scanned colour passport copy and a colour passport photo. Extensions of 30 or 90 days are arranged in person at the Immigration and Citizenship Service head office in Addis Ababa, before the current visa expires.</li>
<li><strong>Overstays are expensive and enforced:</strong> US$30 per day, and departure is not permitted until the penalty is paid in full.</li>
<li><strong>Yellow fever:</strong> a vaccination certificate is required if you arrive from a country on the transmission-risk list — and a yellow fever certificate may also be demanded for onward travel to some other countries.</li>
<li><strong>Money rules:</strong> no more than 3,000 birr may be carried into or out of Ethiopia; cash over US$10,000 (or equivalent) must be declared on entry and exit, and land-border entries must declare cash worth over US$500. Keep your currency-exchange receipts — without one you are unlikely to change leftover birr back.</li>
<li><strong>Equipment:</strong> satellite phones, binoculars and drones may not be imported or exported without prior approval. Antiques need an export certificate.</li>
</ul>

<p>A caution that belongs next to this list: the existence of a bookable visa, a bookable flight or a bookable hotel room is not evidence that travel is advisable. Our attraction guide says exactly that, and it is worth repeating, because booking platforms do not read FCDO pages on your behalf.</p>

<h2>A booking posture for the advisory period</h2>

<p>Our destination guide's position is simple and we carry it unchanged: avoid nonrefundable leisure arrangements while the relevant official advice remains against travel. In practice that means every future-plan booking, if you make one at all, should be free-cancellation; the <a href="/accommodations/maribela-hotel/">Maribela Hotel</a> card on our pages is retained for reference on exactly that basis. Do not prepay a domestic flight into the region — FCDO's note about suspensions at short notice is precisely why. And do not build a plan around an operator's willingness to accept your money; a reservation confirmation is a commercial fact, not a safety assessment.</p>

<p>If you want the trip to exist someday, the useful work now is research and reversibility: follow the advisory feeds (FCDO offers email updates), watch the UNESCO news flow on the site's condition, and keep every booking you make cancelable. The money you do not lose to a forfeited deposit is the money available for the trip when conditions change.</p>

<h2>What a future visit would actually involve</h2>

<p>Assume the advisory lifts and a responsible visit becomes possible. The UNESCO record, checked 16 November 2026, gives the honest shape of the site. Lalibela sits about 645 km from Addis Ababa, and its eleven medieval monolithic churches — hewn in the 12th and 13th centuries as a 'New Jerusalem', inscribed in 1978 — split into two main groups north and south of the seasonal river Jordan, plus the isolated, cruciform Biete Ghiorgis connected by trenches. Biete Medhani Alem is believed to be the largest monolithic church in the world, and the nearby village's Lasta Tukuls — two-storey circular houses of local red stone — are part of the inscribed landscape.</p>

<p>UNESCO's integrity text is not decorative here: most of the monuments are considered to be in critical condition, structural problems have been identified in Biete Amanuel, temporary lightweight shelters stand over several churches, and the property is still without an established management plan. That is part of what a visitor walks into, and part of why our guides insist on local interpretation, modest behaviour and asking before photographing. The churches are living places of worship — the great feasts of the Ethiopian calendar, Timkat in January and Meskel in September, reshape access and crowds, as our destination guide notes.</p>

<p>The practical planning list our attraction guide already sets out is what a future itinerary must absorb: uneven routes and trenches, time for each church group rather than a rushed circuit, footwear and clothing conventions at active churches, and photography etiquette confirmed on site. None of it can be compressed into a single day, and none of it works without a local guide.</p>

<h2>Three questions travellers actually ask</h2>

<p><strong>Can I just go anyway if I accept the risk?</strong> Only you can decide what risk to accept, but the decision should include the two hard limits FCDO states: no in-person consular help inside advised-against regions, and flight connections that can be suspended at short notice. Weigh those against any plan, and read your government's advice in full — not this summary — before deciding.</p>

<p><strong>Is the paperwork worth sorting out now?</strong> Yes, but for knowledge rather than action: understanding the e-visa process, the six-month passport rule and the currency limits tells you how long a real trip would take to arrange, and nothing on that list expires by being understood. Apply for the visa only when a real trip is proceeding.</p>

<p><strong>What should I watch for signs that the picture has changed?</strong> Three feeds cover it: your own foreign-ministry advice for Ethiopia and specifically Amhara; the FCDO email-update subscription on its Ethiopia page; and UNESCO's news on the site, which reported as recently as July 2026 on conservation diplomacy around Lalibela. When the advisories change, this page's premises change — recheck everything before acting.</p>

<h2>Continue planning</h2>

<p>When the decision does turn positive, our published pages carry the detail: the <a href="/countries/ethiopia/lalibela/">Lalibela destination guide</a> for the town and its access, the <a href="/attractions/lalibela/">Lalibela attraction guide</a> for the churches themselves, and the wider <a href="/countries/ethiopia/">Ethiopia country guide</a> for the route around them. Until then, the most useful planning tool is patience with the paperwork read, not the trip booked.</p>

<h2>Sources and scope</h2>

<p>All advisory and entry facts on this page come from the FCDO Ethiopia travel advice and entry-requirements pages (checked 16 November 2026, advice updated 30 October 2026); the site-description, condition and management facts come from the UNESCO World Heritage Centre record for the Rock-Hewn Churches, Lalibela (checked 16 November 2026). The Smartraveller statement is carried from our destination record's own check dated 13 November 2026 and was not re-verified directly on 16 November. No entry fees, flight schedules, hotel rates, tour prices or reviews are quoted: none were verified this run, and none are needed for the decision this page serves. No booking link is attached; this page sells nothing and defers every commitment to a day when the official advice and your own judgement align.</p>`
};

o.travel_articles.push(record);
fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('appended', o.travel_articles.length);
