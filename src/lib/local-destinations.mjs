// Places within a country, with explicit editorial relationships rather than proximity guesses.
import { visibleAt } from './content-repository.mjs';

export function buildLocalDestinations(records, collections, now = new Date()) {
  if (!Array.isArray(records)) throw new Error('Local destinations must be an array');
  const countries = new Map(collections.countries.map((item) => [item.slug, item]));
  const seen = new Set();
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return records.filter((record) => visibleAt(record, now)).map((record) => {
    for (const field of ['slug', 'country_slug']) {
      if (typeof record[field] !== 'string' || !slugPattern.test(record[field])) throw new Error(`Invalid local destination ${field}: ${record[field]}`);
    }
    const key = `${record.country_slug}/${record.slug}`;
    if (seen.has(key)) throw new Error(`Duplicate local destination: ${key}`);
    seen.add(key);
    const country = countries.get(record.country_slug);
    if (!country || !visibleAt(country, now)) throw new Error(`Local destination ${key} needs a published country`);
    for (const field of ['name', 'category', 'listing_summary', 'overview', 'access_summary', 'best_time', 'planning_tips']) {
      if (typeof record[field] !== 'string' || !record[field].trim()) throw new Error(`Local destination ${key} needs ${field}`);
    }
    const related = (field, collection, belongsToCountry = true) => {
      const slugs = record[field] || [];
      if (!Array.isArray(slugs) || new Set(slugs).size !== slugs.length) throw new Error(`Local destination ${key} has invalid ${field}`);
      const bySlug = new Map(collection.map((item) => [item.slug, item]));
      return slugs.map((slug) => {
        const item = bySlug.get(slug);
        if (!item || !visibleAt(item, now)) throw new Error(`Local destination ${key} references missing or unpublished ${field}: ${slug}`);
        if (belongsToCountry && item.country?.slug !== country.slug) throw new Error(`Local destination ${key} references ${field} in another country: ${slug}`);
        return item;
      });
    };
    return {
      ...record, country, region: country.region, country_id: country.id,
      internalUrl: `/countries/${country.slug}/${record.slug}`, routeFamily: 'local-destinations',
      attractions: related('attraction_slugs', collections.attractions),
      accommodations: related('accommodation_slugs', collections.accommodations),
      activities: related('activity_slugs', collections.activities),
      travelArticles: related('travel_insight_slugs', collections.travelArticles, false),
    };
  }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.name.localeCompare(b.name));
}
