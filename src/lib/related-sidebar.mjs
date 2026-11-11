const words = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function relatedSidebar(model, record, type) {
  const stories = model.travelArticles || [];
  const country = type === 'country' ? record : record.country;
  const destinations = type === 'destination' ? [record] : (model.localDestinations || []).filter((place) => {
    if (type === 'country') return place.country.slug === record.slug;
    const field = { attraction: 'attractions', activity: 'activities', accommodation: 'accommodations' }[type];
    return field && place[field]?.some((item) => item.id === record.id);
  });
  const explicit = destinations.flatMap((place) => place.travelArticles || []);
  const matched = new Map(explicit.map((story) => [story.slug, story]));
  const subject = words(record.name || record.title);
  for (const story of stories) {
    if (matched.has(story.slug) || story.slug === record.slug && type === 'insight') continue;
    const title = words(story.title);
    const countryMatch = country && words(story.country).includes(words(country.name));
    const insightMatch = type === 'insight' && words(story.country) === words(record.country) && words(record.country) !== 'multi country';
    if (type === 'country' && countryMatch || insightMatch || subject.length > 5 && title.includes(subject)) matched.set(story.slug, story);
  }
  const related = [...matched.values()].filter((story) => story.slug !== record.slug || type !== 'insight').slice(0, 4);
  const videoStory = [record, ...related].find((story) => /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(story.video_url || ''));
  return { stories: related, video: videoStory && { url: videoStory.video_url, title: videoStory.title } };
}
