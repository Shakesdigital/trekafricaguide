import { loadContent } from '../lib/content-repository.mjs';
import { readBuildEnv } from '../lib/env.mjs';

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function validDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toUTCString();
}

export async function GET() {
  const env = readBuildEnv();
  const content = await loadContent({ env });
  const siteUrl = env.siteUrl.replace(/\/$/, '');
  const articles = [...(content.travel_articles || [])]
    .filter((article) => article.status === 'published' && article.slug)
    .sort((a, b) => {
      const aDate = Date.parse(a.updated_at || a.published_at || '') || 0;
      const bDate = Date.parse(b.updated_at || b.published_at || '') || 0;
      return bDate - aDate;
    });

  const items = articles.map((article) => {
    const url = `${siteUrl}/travel-insights/${article.slug}`;
    const pubDate = validDate(article.updated_at || article.published_at);
    return [
      '<item>',
      `<title>${escapeXml(article.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<description>${escapeXml(article.excerpt || '')}</description>`,
      pubDate ? `<pubDate>${pubDate}</pubDate>` : '',
      '</item>',
    ].join('');
  }).join('');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    '<title>Trek Africa Guide — Travel Insights</title>',
    `<link>${escapeXml(siteUrl)}</link>`,
    '<description>Practical, sourced travel insights for planning a trip across Africa.</description>',
    '<language>en-GB</language>',
    items,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}