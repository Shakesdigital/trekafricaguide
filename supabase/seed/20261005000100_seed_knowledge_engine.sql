-- Seed knowledge engine AI task configuration (disabled by default).
-- The classify_entity task classifies arbitrary travel content into one of
-- the ENTITY_TYPES and extracts name/slug/confidence.
-- An admin must enable and configure the model/provider via the admin API
-- after setting AI_PRIMARY_KEY and AI_SECONDARY_KEY in the deployment environment.

insert into public.ai_task_config (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
values
  ('classify_entity', false, 'primary', 'REPLACE_WITH_MODEL', 15000, 1, 4096, 3600)
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
