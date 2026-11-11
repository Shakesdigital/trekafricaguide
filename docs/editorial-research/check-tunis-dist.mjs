// Dist render check for the new Tunis destination page.
import fs from "node:fs";

const p = "dist/countries/tunisia/tunis/index.html";
if (!fs.existsSync(p)) throw new Error("dist page missing: " + p);
const html = fs.readFileSync(p, "utf8");
const checks = [];
const t = (name, ok) => checks.push(`${ok ? "PASS" : "FAIL"} ${name}`);

t("title", html.includes("<title>Tunis, Tunisia | Trek Africa Guide</title>"));
for (const h2 of ["Explore Tunis","Highlights","Getting there and around","Best time to visit","Planning your stay","Attractions to explore","Where to stay","Travel insights"]) {
  t(`h2 ${h2}`, html.includes(`>${h2}</h2>`) || html.includes(`>${h2}<`));
}
for (const fact of ["296.41","698","1979","700 monuments","88 historic monuments","over one million","212 square kilometres","Creative City of Crafts and Folk Art","90 days","duration of the stay","Ramadan","Tunis Marine"]) {
  t(`fact ${fact}`, html.includes(fact));
}
t("attraction card", html.includes("/attractions/tunis-and-sidi-bou-said"));
t("stay card", html.includes("/accommodations/dar-said"));
t("insight card", html.includes("/travel-insights/choose-first-night-tunis-medina-or-coast"));
t("country link", html.includes("/countries/tunisia"));
t("no booking CTA anchors", !/<a[^>]+href="[^"]*(stay22|allez|booking\.com|getyourguide)/i.test(html));
t("no markup leak", !/<\{\{|\{\{/.test(html) && !html.includes("&lt;p&gt;") && !html.includes("reach-"));

const country = fs.readFileSync("dist/countries/tunisia/index.html", "utf8");
t("country rail", country.includes("Destinations in Tunisia"));
t("country rail links slug", country.includes("/countries/tunisia/tunis"));

const home = fs.readFileSync("dist/index.html", "utf8");
t("homepage search lists slug", home.includes("/countries/tunisia/tunis"));

console.log(checks.join("\n"));
if (checks.some(c => c.startsWith("FAIL"))) { console.error("DIST CHECK FAILED"); process.exit(1); }
console.log("ALL PASS");
