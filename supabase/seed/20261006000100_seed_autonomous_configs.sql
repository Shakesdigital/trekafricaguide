-- Seed AI task configuration for Autonomous Trek Operations.
-- The autonomous cycle task uses the primary provider for discovery, classification,
-- and extraction. Disabled by default — admins must enable + configure the model
-- after setting AI_PRIMARY_KEY in the deployment environment.

insert into public.ai_task_config (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
values
  ('autonomous_cycle', false, 'primary', 'REPLACE_WITH_MODEL', 120000, 1, 8192, 0)
on conflict (task_type) do update
  set enabled = excluded.enabled,
      provider = excluded.provider,
      model = excluded.model,
      timeout_ms = excluded.timeout_ms,
      max_retries = excluded.max_retries,
      max_output_tokens = excluded.max_output_tokens,
      cache_ttl_seconds = excluded.cache_ttl_seconds,
      updated_at = now();

-- No updated_by set — system defaults. Admins must enable and configure the model
-- after setting AI_PRIMARY_KEY and AI_SECONDARY_KEY in the deployment environment.
