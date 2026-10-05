-- Seed AI task configuration for Ask Trek assistant.
-- All three tasks are disabled by default — admins must enable + configure
-- the model after setting AI_PRIMARY_KEY in the deployment environment.
insert into public.ai_task_config (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
values
  ('ask_trek_plan', false, 'primary', 'REPLACE_WITH_MODEL', 30000, 1, 4096, 3600),
  ('ask_trek_compare', false, 'primary', 'REPLACE_WITH_MODEL', 30000, 1, 4096, 3600),
  ('ask_trek_recommend', false, 'primary', 'REPLACE_WITH_MODEL', 30000, 1, 4096, 3600)
on conflict (task_type) do update
  set enabled = excluded.enabled,
      provider = excluded.provider,
      model = excluded.model,
      timeout_ms = excluded.timeout_ms,
      max_retries = excluded.max_retries,
      max_output_tokens = excluded.max_output_tokens,
      cache_ttl_seconds = excluded.cache_ttl_seconds,
      updated_at = now();

-- No updated_by set — system defaults. Admins must enable + configure after
-- setting AI_PRIMARY_KEY in the deployment environment.
