/**
 * cms-schema.js — Resource definitions for all editable CMS fields.
 *
 * Each resource maps to a database table. Fields are declared with:
 *   - name: the canonical column/field name
 *   - label: human-readable admin label
 *   - type: one of 'text', 'textarea', 'rich', 'number', 'select', 'boolean', 'array', 'image', 'url', 'date'
 *   - required: boolean
 *   - group: the form section this field belongs to
 *   - options: (for select) list of {value, label}
 *   - relate: (for foreign keys) target table name
 *
 * This file is consumed by CmsFieldParityTest (PHP) to assert that every
 * model fillable field has a corresponding CMS schema entry.
 */

(function (globalThis) {
  'use strict';

  var CMS_SCHEMA = {
    regions: {
      table: 'regions',
      label: 'Regions',
      routeRoot: '/regions',
      fields: [
        { name: 'name', label: 'Region name', type: 'text', required: true, group: 'Page Identity' },
        { name: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Page Identity' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Page Identity' },
        { name: 'hero_title', label: 'Hero headline', type: 'text', required: true, group: 'Hero Section' },
        { name: 'hero_text', label: 'Hero supporting text', type: 'textarea', required: false, group: 'Hero Section' },
        { name: 'hero_image_url', label: 'Hero image URL', type: 'url', required: false, group: 'Hero Section' },
        { name: 'hero_image_alt', label: 'Hero image alt text', type: 'text', required: false, group: 'Hero Section' },
        { name: 'gallery', label: 'Hero Gallery', type: 'array', required: false, group: 'Hero Section' },
        { name: 'overview', label: 'Region overview', type: 'rich', required: false, group: 'Landing Page Content' },
        { name: 'countries_intro', label: 'Countries introduction', type: 'rich', required: false, group: 'Landing Page Content' },
        { name: 'status', label: 'Status', type: 'select', required: true, group: 'Page Identity', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'published_at', label: 'Published at', type: 'date', required: false, group: 'Page Identity' },
        { name: 'meta_title', label: 'Meta title', type: 'text', required: false, group: 'SEO' },
        { name: 'meta_description', label: 'Meta description', type: 'textarea', required: false, group: 'SEO' },
        { name: 'meta_image_url', label: 'Meta image URL', type: 'url', required: false, group: 'SEO' },
      ],
    },

    countries: {
      table: 'countries',
      label: 'Destination Countries',
      routeRoot: '/countries',
      fields: [
        { name: 'region_id', label: 'Region', type: 'select', required: true, group: 'Page Identity', relate: 'regions' },
        { name: 'name', label: 'Country name', type: 'text', required: true, group: 'Page Identity' },
        { name: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Page Identity' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Page Identity' },
        { name: 'hero_title', label: 'Hero headline', type: 'text', required: true, group: 'Hero Section' },
        { name: 'hero_text', label: 'Hero supporting text', type: 'textarea', required: false, group: 'Hero Section' },
        { name: 'hero_image_url', label: 'Hero image URL', type: 'url', required: false, group: 'Hero Section' },
        { name: 'hero_image_alt', label: 'Hero image alt text', type: 'text', required: false, group: 'Hero Section' },
        { name: 'gallery', label: 'Hero Gallery', type: 'array', required: false, group: 'Hero Section' },
        { name: 'overview', label: 'Country overview', type: 'rich', required: false, group: 'Destination Landing Page Content' },
        { name: 'access_summary', label: 'Access summary', type: 'rich', required: false, group: 'Destination Landing Page Content' },
        { name: 'best_time', label: 'Best time to visit', type: 'rich', required: false, group: 'Destination Landing Page Content' },
        { name: 'planning_tips', label: 'Planning tips', type: 'rich', required: false, group: 'Destination Landing Page Content' },
        { name: 'status', label: 'Status', type: 'select', required: true, group: 'Page Identity', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'published_at', label: 'Published at', type: 'date', required: false, group: 'Page Identity' },
        { name: 'meta_title', label: 'Meta title', type: 'text', required: false, group: 'SEO' },
        { name: 'meta_description', label: 'Meta description', type: 'textarea', required: false, group: 'SEO' },
        { name: 'meta_image_url', label: 'Meta image URL', type: 'url', required: false, group: 'SEO' },
      ],
    },

    attractions: {
      table: 'attractions',
      label: 'Attractions',
      routeRoot: '/attractions',
      fields: [
        { name: 'region_id', label: 'Region', type: 'select', required: true, group: 'Page Identity', relate: 'regions' },
        { name: 'country_id', label: 'Country / Destination', type: 'select', required: true, group: 'Page Identity', relate: 'countries' },
        { name: 'district_id', label: 'District', type: 'select', required: false, group: 'Page Identity', relate: 'districts' },
        { name: 'name', label: 'Attraction name', type: 'text', required: true, group: 'Page Identity' },
        { name: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Page Identity' },
        { name: 'location_name', label: 'Location label', type: 'text', required: false, group: 'Page Identity' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Page Identity' },
        { name: 'listing_summary', label: 'Listing summary', type: 'textarea', required: false, group: 'Listing Card' },
        { name: 'rating', label: 'Rating (1–5)', type: 'number', required: false, group: 'Listing Card' },
        { name: 'review_count', label: 'Review count', type: 'number', required: false, group: 'Listing Card' },
        { name: 'price_label', label: 'Typical cost', type: 'text', required: false, group: 'Listing Card' },
        { name: 'featured', label: 'Featured', type: 'boolean', required: false, group: 'Listing Card' },
        { name: 'hero_image_url', label: 'Main image URL', type: 'url', required: false, group: 'Hero and Gallery' },
        { name: 'hero_image_alt', label: 'Main image alt text', type: 'text', required: false, group: 'Hero and Gallery' },
        { name: 'gallery', label: 'Gallery images', type: 'array', required: false, group: 'Hero and Gallery' },
        { name: 'detail_intro', label: 'About this attraction', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'getting_there', label: 'How to get there', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'best_time', label: 'Best time to visit', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'practical_info', label: 'Practical information', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'full_description', label: 'Full description', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'highlights', label: 'Highlights (one per line)', type: 'array', required: false, group: 'Detail Page Content' },
        { name: 'booking_url', label: 'External booking URL', type: 'url', required: false, group: 'Booking Panel' },
        { name: 'status', label: 'Status', type: 'select', required: true, group: 'Page Identity', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'published_at', label: 'Published at', type: 'date', required: false, group: 'Page Identity' },
        { name: 'meta_title', label: 'Meta title', type: 'text', required: false, group: 'SEO' },
        { name: 'meta_description', label: 'Meta description', type: 'textarea', required: false, group: 'SEO' },
        { name: 'meta_image_url', label: 'Meta image URL', type: 'url', required: false, group: 'SEO' },
      ],
    },

    accommodations: {
      table: 'accommodations',
      label: 'Accommodations',
      routeRoot: '/accommodations',
      fields: [
        { name: 'region_id', label: 'Region', type: 'select', required: true, group: 'Page Identity', relate: 'regions' },
        { name: 'country_id', label: 'Country / Destination', type: 'select', required: true, group: 'Page Identity', relate: 'countries' },
        { name: 'district_id', label: 'District', type: 'select', required: false, group: 'Page Identity', relate: 'districts' },
        { name: 'attraction_id', label: 'Linked attraction (optional)', type: 'select', required: false, group: 'Page Identity', relate: 'attractions' },
        { name: 'name', label: 'Accommodation name', type: 'text', required: true, group: 'Page Identity' },
        { name: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Page Identity' },
        { name: 'property_type', label: 'Property type', type: 'text', required: false, group: 'Page Identity' },
        { name: 'location_name', label: 'Location label', type: 'text', required: false, group: 'Page Identity' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Page Identity' },
        { name: 'listing_summary', label: 'Listing summary', type: 'textarea', required: false, group: 'Listing Card' },
        { name: 'rating', label: 'Rating (1–5)', type: 'number', required: false, group: 'Listing Card' },
        { name: 'review_count', label: 'Review count', type: 'number', required: false, group: 'Listing Card' },
        { name: 'price_label', label: 'Price / booking label', type: 'text', required: false, group: 'Listing Card' },
        { name: 'featured', label: 'Featured', type: 'boolean', required: false, group: 'Listing Card' },
        { name: 'hero_image_url', label: 'Main image URL', type: 'url', required: false, group: 'Hero / Main Image' },
        { name: 'hero_image_alt', label: 'Main image alt text', type: 'text', required: false, group: 'Hero / Main Image' },
        { name: 'gallery', label: 'Gallery images', type: 'array', required: false, group: 'Hero / Main Image' },
        { name: 'detail_intro', label: 'About this stay', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'practical_info', label: 'Why it works for this route', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'amenities', label: 'Amenities list (one per line)', type: 'array', required: false, group: 'Detail Page Content' },
        { name: 'booking_url', label: 'External booking URL', type: 'url', required: false, group: 'Booking Panel' },
        { name: 'status', label: 'Status', type: 'select', required: true, group: 'Page Identity', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'published_at', label: 'Published at', type: 'date', required: false, group: 'Page Identity' },
        { name: 'meta_title', label: 'Meta title', type: 'text', required: false, group: 'SEO' },
        { name: 'meta_description', label: 'Meta description', type: 'textarea', required: false, group: 'SEO' },
        { name: 'meta_image_url', label: 'Meta image URL', type: 'url', required: false, group: 'SEO' },
      ],
    },

    restaurants: {
      table: 'restaurants',
      label: 'Restaurants',
      routeRoot: '/restaurants',
      fields: [
        { name: 'region_id', label: 'Region', type: 'select', required: true, group: 'Page Identity', relate: 'regions' },
        { name: 'country_id', label: 'Country / Destination', type: 'select', required: true, group: 'Page Identity', relate: 'countries' },
        { name: 'district_id', label: 'District', type: 'select', required: false, group: 'Page Identity', relate: 'districts' },
        { name: 'attraction_id', label: 'Linked attraction (optional)', type: 'select', required: false, group: 'Page Identity', relate: 'attractions' },
        { name: 'name', label: 'Restaurant name', type: 'text', required: true, group: 'Page Identity' },
        { name: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Page Identity' },
        { name: 'cuisine', label: 'Cuisine label', type: 'text', required: false, group: 'Page Identity' },
        { name: 'location_name', label: 'Location label', type: 'text', required: false, group: 'Page Identity' },
        { name: 'signature_dish', label: 'Signature dish', type: 'text', required: false, group: 'Page Identity' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Page Identity' },
        { name: 'listing_summary', label: 'Listing summary', type: 'textarea', required: false, group: 'Listing Card' },
        { name: 'rating', label: 'Rating (1–5)', type: 'number', required: false, group: 'Listing Card' },
        { name: 'review_count', label: 'Review count', type: 'number', required: false, group: 'Listing Card' },
        { name: 'price_label', label: 'Price label', type: 'text', required: false, group: 'Listing Card' },
        { name: 'featured', label: 'Featured', type: 'boolean', required: false, group: 'Listing Card' },
        { name: 'hero_image_url', label: 'Main image URL', type: 'url', required: false, group: 'Hero / Main Image' },
        { name: 'hero_image_alt', label: 'Main image alt text', type: 'text', required: false, group: 'Hero / Main Image' },
        { name: 'gallery', label: 'Gallery images', type: 'array', required: false, group: 'Hero / Main Image' },
        { name: 'detail_intro', label: 'About this restaurant', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'practical_info', label: 'Practical information', type: 'rich', required: false, group: 'Detail Page Content' },
        { name: 'booking_url', label: 'External booking or information URL', type: 'url', required: false, group: 'Booking Panel' },
        { name: 'status', label: 'Status', type: 'select', required: true, group: 'Page Identity', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'published_at', label: 'Published at', type: 'date', required: false, group: 'Page Identity' },
        { name: 'meta_title', label: 'Meta title', type: 'text', required: false, group: 'SEO' },
        { name: 'meta_description', label: 'Meta description', type: 'textarea', required: false, group: 'SEO' },
        { name: 'meta_image_url', label: 'Meta image URL', type: 'url', required: false, group: 'SEO' },
      ],
    },

    tour_operators: {
      table: 'tour_operators',
      label: 'Tour Operators',
      routeRoot: '/tour_operators',
      fields: [
        { name: 'region_id', label: 'Region', type: 'select', required: true, group: 'Operator Identity', relate: 'regions' },
        { name: 'country_id', label: 'Country / Destination', type: 'select', required: true, group: 'Operator Identity', relate: 'countries' },
        { name: 'attraction_id', label: 'Linked attraction (optional)', type: 'select', required: false, group: 'Operator Identity', relate: 'attractions' },
        { name: 'name', label: 'Operator name', type: 'text', required: true, group: 'Operator Identity' },
        { name: 'slug', label: 'URL slug', type: 'text', required: true, group: 'Operator Identity' },
        { name: 'summary', label: 'Operator summary', type: 'rich', required: false, group: 'Operator Card Content' },
        { name: 'hero_image_url', label: 'Logo / image URL', type: 'url', required: false, group: 'Operator Card Content' },
        { name: 'hero_image_alt', label: 'Hero image alt text', type: 'text', required: false, group: 'Operator Card Content' },
        { name: 'specialties', label: 'Specialties (one per line)', type: 'array', required: false, group: 'Operator Card Content' },
        { name: 'website_url', label: 'Website URL', type: 'url', required: false, group: 'External Links' },
        { name: 'booking_url', label: 'Booking URL', type: 'url', required: false, group: 'External Links' },
        { name: 'status', label: 'Status', type: 'select', required: true, group: 'Operator Identity', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
        { name: 'published_at', label: 'Published at', type: 'date', required: false, group: 'Operator Identity' },
        { name: 'meta_title', label: 'Meta title', type: 'text', required: false, group: 'SEO' },
        { name: 'meta_description', label: 'Meta description', type: 'textarea', required: false, group: 'SEO' },
        { name: 'meta_image_url', label: 'Meta image URL', type: 'url', required: false, group: 'SEO' },
      ],
    },

    page_sections: {
      table: 'page_sections',
      label: 'Homepage Sections',
      routeRoot: null,
      fields: [
        { name: 'page_key', label: 'Page key', type: 'text', required: true, group: 'Section Identity', options: [{ value: 'home', label: 'Home' }, { value: 'contact', label: 'Contact' }] },
        { name: 'section_key', label: 'Section key', type: 'text', required: true, group: 'Section Identity' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Section Identity' },
        { name: 'eyebrow', label: 'Eyebrow text', type: 'text', required: false, group: 'Section Content' },
        { name: 'title', label: 'Section title', type: 'text', required: false, group: 'Section Content' },
        { name: 'body', label: 'Body text', type: 'rich', required: false, group: 'Section Content' },
        { name: 'image_url', label: 'Image URL', type: 'url', required: false, group: 'Section Content' },
        { name: 'meta', label: 'Meta JSON (advanced)', type: 'textarea', required: false, group: 'Section Content' },
      ],
    },

    site_settings: {
      table: 'site_settings',
      label: 'Site Settings',
      routeRoot: null,
      fields: [
        { name: 'group_name', label: 'Group name', type: 'text', required: true, group: 'Setting Identity', options: [{ value: 'general', label: 'General' }, { value: 'branding', label: 'Branding' }, { value: 'contact', label: 'Contact' }, { value: 'integrations', label: 'Integrations' }] },
        { name: 'key', label: 'Key', type: 'text', required: true, group: 'Setting Identity' },
        { name: 'value', label: 'Value', type: 'textarea', required: false, group: 'Value' },
      ],
    },

    booking_offers: {
      table: 'booking_offers',
      label: 'Booking Offers',
      routeRoot: null,
      fields: [
        { name: 'provider', label: 'Provider', type: 'text', required: false, group: 'Offer Details' },
        { name: 'label', label: 'Label', type: 'text', required: false, group: 'Offer Details' },
        { name: 'source_url', label: 'Source URL', type: 'url', required: false, group: 'Offer Details' },
        { name: 'stay22_provider', label: 'Stay22 provider', type: 'select', required: false, group: 'Offer Details', options: [
          { value: 'booking', label: 'Booking.com' },
          { value: 'expedia', label: 'Expedia' },
          { value: 'hotelscom', label: 'Hotels.com' },
          { value: 'vrbo', label: 'VRBO' },
          { value: 'agoda', label: 'Agoda' },
          { value: 'tripadvisor', label: 'TripAdvisor' },
          { value: 'kayak', label: 'Kayak' },
          { value: 'getyourguide', label: 'GetYourGuide' },
          { value: 'roam', label: 'Roam' },
          { value: 'searchbar', label: 'Searchbar' },
        ] },
        { name: 'affiliate_supported', label: 'Affiliate supported', type: 'boolean', required: false, group: 'Offer Details' },
        { name: 'price_amount', label: 'Price amount', type: 'number', required: false, group: 'Offer Details' },
        { name: 'price_currency', label: 'Price currency', type: 'text', required: false, group: 'Offer Details', options: [
          { value: 'USD', label: 'USD ($)' },
          { value: 'EUR', label: 'EUR (€)' },
          { value: 'GBP', label: 'GBP (£)' },
          { value: 'ZAR', label: 'ZAR (R)' },
          { value: 'UGX', label: 'UGX' },
        ] },
        { name: 'price_unit', label: 'Price unit', type: 'text', required: false, group: 'Offer Details', options: [{ value: 'night', label: 'per night' }, { value: 'person', label: 'per person' }, { value: 'room', label: 'per room' }] },
        { name: 'price_basis', label: 'Price basis', type: 'text', required: false, group: 'Offer Details' },
        { name: 'price_checked_at', label: 'Price checked at', type: 'date', required: false, group: 'Offer Details' },
        { name: 'active', label: 'Active', type: 'boolean', required: false, group: 'Offer Details' },
        { name: 'sort_order', label: 'Sort order', type: 'number', required: false, group: 'Offer Details' },
      ],
    },
  };

  // Helper to extract all field names for a resource.
  function fieldNames(resourceKey) {
    var resource = CMS_SCHEMA[resourceKey];
    if (!resource) return [];
    return resource.fields.map(function (f) { return f.name; });
  }

  // Helper to extract fields by group.
  function fieldsByGroup(resourceKey) {
    var resource = CMS_SCHEMA[resourceKey];
    if (!resource) return {};
    var groups = {};
    resource.fields.forEach(function (f) {
      if (!groups[f.group]) groups[f.group] = [];
      groups[f.group].push(f);
    });
    return groups;
  }

  var CmsSchema = {
    schema: CMS_SCHEMA,
    fieldNames: fieldNames,
    fieldsByGroup: fieldsByGroup,
    // Field sets expected on each listing type, derived from schema for parity tests.
    listingFieldSets: {
      regions: ['name', 'slug', 'sort_order', 'hero_title', 'hero_text', 'hero_image_url', 'hero_image_alt', 'gallery', 'overview', 'countries_intro', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'],
      countries: ['region_id', 'name', 'slug', 'sort_order', 'hero_title', 'hero_text', 'hero_image_url', 'hero_image_alt', 'gallery', 'overview', 'access_summary', 'best_time', 'planning_tips', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'],
      attractions: ['region_id', 'country_id', 'district_id', 'name', 'slug', 'location_name', 'sort_order', 'listing_summary', 'rating', 'review_count', 'price_label', 'featured', 'hero_image_url', 'hero_image_alt', 'gallery', 'detail_intro', 'getting_there', 'best_time', 'practical_info', 'full_description', 'highlights', 'booking_url', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'],
      accommodations: ['region_id', 'country_id', 'district_id', 'attraction_id', 'name', 'slug', 'property_type', 'location_name', 'sort_order', 'listing_summary', 'rating', 'review_count', 'price_label', 'featured', 'hero_image_url', 'hero_image_alt', 'gallery', 'detail_intro', 'practical_info', 'amenities', 'booking_url', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'],
      restaurants: ['region_id', 'country_id', 'district_id', 'attraction_id', 'name', 'slug', 'cuisine', 'location_name', 'signature_dish', 'sort_order', 'listing_summary', 'rating', 'review_count', 'price_label', 'featured', 'hero_image_url', 'hero_image_alt', 'gallery', 'detail_intro', 'practical_info', 'booking_url', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'],
      tour_operators: ['region_id', 'country_id', 'attraction_id', 'name', 'slug', 'summary', 'hero_image_url', 'hero_image_alt', 'specialties', 'website_url', 'booking_url', 'status', 'published_at', 'meta_title', 'meta_description', 'meta_image_url'],
    },
  };

  if (typeof globalThis !== 'undefined') {
    globalThis.CmsSchema = CmsSchema;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CmsSchema;
  }
  if (typeof define === 'function' && define.amd) {
    define(CmsSchema);
  }
})((typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this));
