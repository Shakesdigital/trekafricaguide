-- Seed initial AI task configurations (all disabled by default).
-- These are placeholders to be configured via the admin API (netlify/functions/ai-config.mjs).
-- No API keys or provider endpoints are seeded — those are deployment admin configuration.

insert into public.ai_task_config (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
values
  ('attraction_summary', false, 'primary', 'REPLACE_WITH_MODEL', 15000, 1, 1024, 3600),
  ('travel_article_outline', false, 'primary', 'REPLACE_WITH_MODEL', 20000, 1, 2048, 3600),
  ('meta_description', false, 'primary', 'REPLACE_WITH_MODEL', 10000, 1, 512, 3600),
  ('itinerary_suggestion', false, 'primary', 'REPLACE_WITH_MODEL', 20000, 1, 2048, 7200),
  ('destination_summary', false, 'primary', 'REPLACE_WITH_MODEL', 15000, 1, 1024, 3600)
on conflict (task_type) do update
  set enabled = excluded.enabled,
      provider = excluded.provider,
      model = excluded.model,
      timeout_ms = excluded.timeout_ms,
      max_retries = excluded.max_retries,
      max_output_tokens = excluded.max_output_tokens,
      cache_ttl_seconds = excluded.cache_ttl_seconds,
      updated_at = now();

-- No updated_by set — these are system defaults, not attributed to a user.
-- An admin must enable and configure the model/provider via the admin API
-- after setting AI_PRIMARY_KEY and AI_SECONDARY_KEY in the deployment environment.
