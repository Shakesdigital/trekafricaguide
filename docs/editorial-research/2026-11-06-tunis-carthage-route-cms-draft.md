# Tunis and Sidi Bou Said: a focused two-stop Carthage route (CMS draft)

Status: prepared for CMS entry; not saved or published. The current authenticated
CMS session is unavailable in this tool context.

## Target and save instructions

- Production page: https://trekafricaguide.com/attractions/tunis-and-sidi-bou-said/
- CMS document: `attractions / tunis-and-sidi-bou-said`
- Observed CMS revision: 2; source commit: `33f2c76a990f31e9b0b28609f35bfb9275d02346`; status: published; conflicts: none.
- Proposed field: append the text below to the existing `full_description`, after its current second paragraph. Preserve all existing content and fields. Save from the authenticated `/cms-editorial.html` workspace at the observed revision, then publish the website. On a stale revision, reload and compare before saving.

## Proposed copy

### A focused two-stop Carthage visit

For a shorter archaeological visit, pair the Antonine Baths with the Magon Quarter. Begin at the baths, the large Roman complex on Carthage’s waterfront, then arrange a separate transfer to the Magon Quarter. The contrast helps make a broad archaeological landscape more legible: one stop focuses on Roman public architecture; the other preserves a Punic residential quarter, with houses and streets that offer a different view of life in ancient Carthage. This is a practical sample, not a claim to cover every monument.

Treat the stops as separate places in a modern town rather than assuming a continuous walk. The heritage agency lists a grouped ticket, but confirm at the first ticket office whether the current ticket covers both places and whether either site has an access restriction that day. Posted hours vary by season and Ramadan, so check the current schedule before setting out. Start during the cooler part of the day, carry water, and leave Sidi Bou Said as a slower separate stop if heat, transfers or walking make the archaeological visit feel full.

## Evidence and editorial notes

Checked 6 November 2026. The Agency for the Development of Heritage and Cultural Promotion (AMVPPC), under Tunisia’s Ministry of Cultural Affairs, identifies the Antonine Baths as a waterfront complex in Tunis/Carthage, lists the Magon Quarter among the Carthage monuments, and describes seasonal opening hours and grouped tickets. Its Magon Quarter page describes Punic domestic architecture and successive residential development. The route order and pacing above are editorial suggestions; no transfer duration, walkability between sites, ticket coverage, or guaranteed access is asserted.

- AMVPPC, [The Antoninian Baths](https://www.patrimoinedetunisie.com.tn/en/monuments/the-antoninian-baths/overview/)
- AMVPPC, [The Magon Quarter](https://www.patrimoinedetunisie.com.tn/en/monuments/the-magon-quarter/overview/)
- AMVPPC, [The Park of the Roman Villas](https://www.patrimoinedetunisie.com.tn/en/monuments/the-park-of-the-roman-villas/overview/) (cross-reference checked; not included in this two-stop suggestion)

## CMS-first blocker

Supabase SQL tool context returned `auth.uid() = null`, `auth.role() = null`, and `private.has_cms_role(['editor','admin','super_admin']) = false`. The CMS save RPC requires an authenticated staff session and an exact current revision. No CMS write, Git override, publication, or deployment was attempted. Next step: open the production CMS with the owner’s authenticated session, reload revision 2, apply the proposed append, and save/publish through the CMS. Then mirror the saved field into Git and verify the public page.

## Owner report receipt

Sent 6 November 2026, 06:43 Africa/Kampala, to the configured owner recipient. Gmail SENT ID: `1a1aef5a4a2eb5f3`. The report states the draft is not published, identifies the CMS authentication blocker, lists the official sources, and gives the authenticated CMS save/publish next step.
