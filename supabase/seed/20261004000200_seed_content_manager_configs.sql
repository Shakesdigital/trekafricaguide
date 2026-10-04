-- Seed content manager AI task configurations (all disabled by default).
-- These extraction tasks transform raw source HTML into structured draft records.
-- An admin must enable and configure the model/provider via the admin API
-- after setting AI_PRIMARY_KEY and AI_SECONDARY_KEY in the deployment environment.
--
-- Key invariant: these tasks NEVER extract forbidden fields (prices, opening hours,
-- availability, permits, visa requirements, distances, travel times, facilities,
-- booking links) — the research module masks those before the AI sees them.

insert into public.ai_task_config (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
values
  ('extract_attraction', false, 'primary', 'REPLACE_WITH_MODEL', 20000, 1, 4096, 86400),
  ('extract_accommodation', false, 'primary', 'REPLACE_WITH_MODEL', 20000, 1, 4096, 86400),
  ('extract_activity', false, 'primary', 'REPLACE_WITH_MODEL', 20000, 1, 4096, 86400),
  ('extract_destination', false, 'primary', 'REPLACE_WITH_MODEL', 25000, 1, 8192, 86400),
  ('extract_travel_insight', false, 'primary', 'REPLACE_WITH_MODEL', 25000, 1, 8192, 86400)
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
