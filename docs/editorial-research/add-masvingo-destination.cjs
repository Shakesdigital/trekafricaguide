// Add Masvingo local destination under Zimbabwe. Run from repo root.
const fs = require("fs");
const path = "content/local-destinations.json";
const raw = fs.readFileSync(path, "utf8");
const data = JSON.parse(raw);
const arr = Array.isArray(data) ? data : data.local_destinations || data.destinations;
if (!Array.isArray(arr)) throw new Error("unknown local-destinations shape");
if (arr.some((x) => x.slug === "masvingo")) throw new Error("masvingo already present");

const record = {
  slug: "masvingo",
  country_slug: "zimbabwe",
  name: "Masvingo",
  category: "City",
  hero_title: "Masvingo: the province capital that plans the Great Zimbabwe day",
  listing_summary:
    "Southeastern Zimbabwe's provincial capital, about 27-30 km from the UNESCO-listed Great Zimbabwe National Monument and close to Lake Mutirikwi and its recreational park — the practical base behind the monument visit the country is named for.",
  overview:
    "Masvingo is the working capital of Masvingo Province in southeastern Zimbabwe, and the nearest real town to Great Zimbabwe National Monument, the Shona-built city that gave the country its name. The Great Zimbabwe World Heritage guide describes a town founded in 1890 — the oldest surviving colonial settlement in Zimbabwe — that has carried four names: Fort Victoria, then Victoria from 1929, briefly Nyanda in 1982, and finally Masvingo, a Karanga word meaning 'fortifications'.\n\nIts practical claim on travellers is proximity. UNESCO places the monument approximately 30 km away in the lowveld at around 1,100 m altitude; the Masvingo Publicity Association puts the ancient city 27 km from town and describes it as the remains of a city of almost 20,000 Shona-speaking people that prospered between the 12th and 15th centuries, developed over roughly 600 years across some 720 hectares. UNESCO's own record — inscribed 1986 under criteria (i)(iii)(vi) — identifies a 14th-century principal city of a major state with more than 10,000 inhabitants, abandoned around 1450 when the hinterland could no longer feed it, and notes the steatite Zimbabwe Birds found within the ruins were adopted as the national emblem.\n\nThe monument day is not the only outing. Lake Mutirikwi, formed in 1961 by the damming of the Mutirikwi and Mushagashe rivers, lies about 25 km from town — the association calls it the largest inland lake in Zimbabwe, while the World Heritage site's guide calls it second largest after Kariba — with bass fishing, boating, yachting and game viewing by boat. Zimbabwe Parks and Wildlife Management Authority (ZimParks) describes the adjacent Lake Kyle Recreational Park as a 169-square-kilometre park about 30 km east of Masvingo, home to more than 25 mammal species including white rhino, buffalo and leopard, and over 35 bird species, with the Beza Range rising to 1,455 m on its northern boundary. The Masvingo Publicity Association also lists Chesvingo Karanga Village, a community tourism project about 40 km along Great Zimbabwe Road toward the Kyle dam wall, where visitors experience Karanga music, dances, foods, ancient granaries, caves and rock paintings.",
  access_summary:
    "Masvingo sits on the main Harare-Beitbridge corridor; the Great Zimbabwe travel guide describes the A4 route through Masvingo as tarred and fairly busy because it is a main international freight route, and places the monument about a 4-hour drive from Harare or Bulawayo and around 8 hours from Victoria Falls — treat those as planning figures and confirm timings with your provider. From town, the association's routing runs about 27 km out toward the monument; the same guide notes there is no reliable scheduled public transport to the ruins and points to hotel-arranged shuttles or minibuses instead. Masvingo's airport handles charter flights only per the travel guide, so most visitors arrive by road. ZimParks does not publish the recreational park's fees online — confirm current entry terms, road conditions and any lodge bookings with ZimParks or your operator before setting out.",
  best_time:
    "The monument is walkable year-round, but the lowveld days are hot and the Hill Complex involves uneven paths and a steep hill section, so start early. The regional rains fall mainly November to March; ZimParks warns that roads inside the Lake Kyle Recreational Park need high clearance and 4WD in the rainy season. Boat and game activities on Lake Mutirikwi run in daylight hours year-round — confirm what is operating for your dates with the provider rather than trusting a static list.",
  planning_tips:
    "Give the monument its own unhurried half-day: UNESCO records a property of 722 hectares divided into the Hill Ruins, Great Enclosure and Valley Ruins, and the site is a living sacred heritage site still used by contemporary communities — follow the monument's rules and its staff guidance. Combine the visit with the lake and park days rather than treating Masvingo as an overnight stop only, and buy permits or activity time directly from the operators: park fees are not published online and prices at the monument gate change. Carry cash from town before heading out, and if you are continuing to Beitbridge or Harare, do not schedule a tight connection on the same day as a long monument walk.",
  attraction_slugs: ["great-zimbabwe-national-monument"],
  activity_slugs: ["great-zimbabwe-guided-monument-visit"],
  accommodation_slugs: ["great-zimbabwe-hotel"],
  travel_insight_slugs: [],
  highlights: [
    "About 27-30 km from Great Zimbabwe National Monument, the UNESCO World Heritage site the country is named for",
    "Lake Mutirikwi and the Kyle Recreational Park: boating, bass fishing and white-rhino game viewing about 25-30 km east of town",
    "Chesvingo Karanga Village community tourism: Karanga music, food, granaries, caves and rock paintings",
    "The oldest surviving colonial town in Zimbabwe, on the main Harare-Beitbridge corridor"
  ],
  sort_order: 2,
  status: "published",
  last_researched: "2026-11-11",
  research_sources: [
    {
      label:
        "UNESCO World Heritage Centre: Great Zimbabwe National Monument (ID 364) — inscribed 1986, criteria (i)(iii)(vi), property 722 ha, approximately 30 km from Masvingo, lowveld ~1,100 m, Shona city 11th-15th centuries, 14th-century population over 10,000, abandoned ~1450, Hill Ruins/Great Enclosure/Valley Ruins, Zimbabwe Birds adopted as national emblem, protected since 1893, NMMZ management, living sacred site; checked 11 November 2026",
      url: "https://whc.unesco.org/en/list/364/",
      checked_at: "2026-11-11"
    },
    {
      label:
        "Zimbabwe Parks and Wildlife Management Authority (ZimParks): Lake Kyle Recreational Park page — 169 sq km park about 30 km east of Masvingo, Great Zimbabwe Ruins to its south, Beza Range 1,455 m on the northern boundary, 25+ wild mammal species including white rhino/buffalo/leopard, 35+ bird species, miombo woodland and rocky hills; checked 11 November 2026",
      url: "https://www.zimparks.org.zw/lake-kyle-recreational-park/",
      checked_at: "2026-11-11"
    },
    {
      label:
        "Masvingo Publicity Association: attractions pages — Great Zimbabwe 27 km from Masvingo, city of almost 20,000 Shona people 12th-15th centuries, ~600 years of development, ~720 ha complex; Lake Mutirikwi largest inland lake claim, formed by the Mutirikwi and Mushagashe rivers, built 1961, ~25 km from the city, bass fishing/skiing/boating/yachting/game viewing by boat; Chesvingo Karanga Village community project 40 km along Great Zimbabwe Road toward Kyle Dam Wall (music, dances, foods, granaries, caves, rock paintings); checked 11 November 2026",
      url: "https://www.masvingopublicity.com/attractions/",
      checked_at: "2026-11-11"
    },
    {
      label:
        "Great Zimbabwe World Heritage Site guide (greatzimbabwewhs.com): Masvingo founded 1890, oldest surviving colonial town, name sequence Fort Victoria / Victoria 1929 / Nyanda 1982 / Masvingo meaning 'fortifications'; Lake Mutirikwi second-largest inland lake after Kariba claim; checked 11 November 2026",
      url: "https://www.greatzimbabwewhs.com/local-attractions/",
      checked_at: "2026-11-11"
    },
    {
      label:
        "Great Zimbabwe Monument travel guide (greatzimbabweguide.com): A4 through Masvingo tarred and busy (main international freight route), ~4 h from Harare or Bulawayo, ~8 h from Victoria Falls, no reliable scheduled public transport to the monument (hotel shuttles or minibuses), Masvingo Airport charter flights only; checked 11 November 2026",
      url: "https://www.greatzimbabweguide.com/great-zimbabwe-monument-travel-guide/",
      checked_at: "2026-11-11"
    },
    {
      label:
        "Published on-site guides re-read 11 November 2026 for continuity: live Great Zimbabwe National Monument attraction guide ('Plan the visit from Masvingo...'), live Great Zimbabwe Hotel accommodation guide (700 m from the monument, operator-stated rooms/facilities/tours) and the live great-zimbabwe-guided-monument-visit activity guide",
      url: "https://trekafricaguide.com/attractions/great-zimbabwe-national-monument/",
      checked_at: "2026-11-11"
    }
  ]
};

arr.push(record);
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("added masvingo; total", arr.length);
