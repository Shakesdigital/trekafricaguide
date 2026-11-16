import fs from 'node:fs';
const p = 'docs/editorial-progress.json';
const o = JSON.parse(fs.readFileSync(p, 'utf8'));
o.owner_email_draft_2026_11_16_lalibela = {
  to: 'fsddanmugisa@gmail.com',
  subject: 'Trek editorial run 16 Nov: Lalibela decision insight shipped and live',
  body: [
    'Hi Foscod,',
    "Today's editorial run shipped the first Ethiopia travel insight: \"Lalibela under a do-not-travel advisory: how to decide, and how to wait well\" (travel insights rotation).",
    "Why this one: the live Lalibela cluster is fully published (Ethiopia country guide, Lalibela destination, attraction, Maribela Hotel) but the travel-insights shelf had zero Ethiopia stories, and three of those pages explicitly defer one decision to the reader - whether a visit is appropriate at all - with no page behind it. The new story puts the evidence in one place: what FCDO actually says (all travel to Amhara; no in-person embassy support inside advised-against regions; northern flights can suspend at short notice), the entry paperwork that still binds (30-day e-visa, six-month passport, yellow fever, currency and equipment rules), a refundable-only booking posture, and what a future visit would involve from the UNESCO record.",
    'Live receipt: https://trekafricaguide.com/travel-insights/decide-lalibela-under-do-not-travel-advice/ - HTTP 200, full section flow, clean rendered copy, no markup leak, listed in the travel-insights archive. Pushed to main 45d16ec..1515479; commit 1515479.',
    'Photos: honest zero-photo publish; six licensed Lalibela subjects logged for the backlog. Booking: no CTA by design - the page sells nothing during a do-not-travel advisory.',
    'Blockers: owner Gmail is still signed out in the OpenBot browser (accounts.google.com sign-in tab re-checked today), so this is another pending draft - one sign-in ships it along with the earlier drafts. CMS mirror: travel_articles table readable (200); editorial_documents still service-role-only (400, by design) - an owner-side CMS check that travel_articles/decide-lalibela-under-do-not-travel-advice imported would confirm the mirror.',
    'Next rotation: activities - the Ouidah-Ganvie heritage excursion ledger from 15 Nov is ready.',
    '- Trek editorial automation'
  ].join('\n\n'),
  prepared_at: '2026-11-16T12:30:00Z',
  status: 'pending_gmail_signin'
};
fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
console.log('ok');
