# Repository editorial overrides

Edit [`content/editorial-overrides.json`](../content/editorial-overrides.json) to maintain countries, attractions, accommodations, activities, and travel insights through Git. The build still loads its required Supabase content first; these rows are then merged before normal publication filtering. Supabase connection or query errors still fail the build.

Each top-level key is one supported table and its value is an array of records. Match an existing record by its stable `id` or `slug`; supplied fields replace those values while omitted fields stay as they are. Existing Supabase IDs are preserved. New records need a unique lowercase `slug`, the required fields for their type, and `status: "published"` to appear publicly. Unpublished or future-dated records remain hidden under the usual publication rules. New records get a build-only ID of `repo:<table>:<slug>`.

For example, an existing insight can be updated with a small patch:

```json
{
  "travel_articles": [
    {
      "slug": "existing-article-slug",
      "excerpt": "Updated short summary."
    }
  ]
}
```

Supported authoring fields follow the corresponding content-table columns. Countries need `region_id`, `name`, `hero_title`, `hero_text`, and `overview` when new; attractions and accommodations need `region_id`, `country_id`, `name`, `listing_summary`, and `detail_intro`; activities need `attraction_id`, `name`, and `listing_summary`; travel insights need `title`, `excerpt`, and `body`. Relation fields must refer to records in the site model. A new record ID is `repo:<table>:<slug>`, which can be used as a child record's relation ID when adding related content in the same file.

Only those five editorial tables are accepted. Site settings, page sections, users, offers, and other configuration remain managed by their existing sources. Keep editorial copy and verified image URLs in the records; the existing templates and photo defaults continue to handle presentation.
