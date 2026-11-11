import fs from "node:fs";
const h = fs.readFileSync("dist/countries/zimbabwe/masvingo/index.html", "utf8");
const h2s = [...h.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1]);
console.log("H2s:", h2s.join(" | "));
console.log("title:", (h.match(/<title>([^<]*)<\/title>/) || [])[1]);
for (const k of ["Masvingo", "fortifications", "Lake Mutirikwi", "Chesvingo", "Beza Range", "ZimParks", "1986", "722 hectares", "white rhino", "10,000"]) {
  console.log(k + ":", h.includes(k));
}
console.log("stay card:", h.includes("/accommodations/great-zimbabwe-hotel"));
console.log("activity card:", h.includes("/activities/great-zimbabwe-guided-monument-visit"));
console.log("attraction card:", h.includes("/attractions/great-zimbabwe-national-monument"));
console.log("leak slug field:", h.includes('"slug"'), "| leak listing_summary:", h.includes("listing_summary"));
const c = fs.readFileSync("dist/countries/zimbabwe/index.html", "utf8");
console.log("country rail Destinations:", c.includes("Destinations in Zimbabwe"), "| masvingo card:", c.includes("/countries/zimbabwe/masvingo"));
const i = fs.readFileSync("dist/index.html", "utf8");
console.log("home search masvingo:", i.includes("/countries/zimbabwe/masvingo"));
const g = fs.readFileSync("dist/attractions/great-zimbabwe-national-monument/index.html", "utf8");
console.log("attraction dest card:", g.includes("/countries/zimbabwe/masvingo"));
