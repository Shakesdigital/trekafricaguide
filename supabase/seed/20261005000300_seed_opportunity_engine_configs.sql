-- Seed AI task configuration for content opportunity scanning.
-- The scan_content_gaps task provides AI-assisted analysis of content
-- completeness to identify sparse listings and coverage gaps.
insert into public.ai_task_config (task_type, enabled, provider, model, timeout_ms, max_retries, max_output_tokens, cache_ttl_seconds)
values
  ('scan_content_gaps', false, 'primary', 'REPLACE_WITH_MODEL', 20000, 1, 4096, 0)
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
