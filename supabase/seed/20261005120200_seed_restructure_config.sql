-- Seed: ask_trek_restructure AI task config
-- Adds the restructure task type for trip board modifications.
-- Follows the same pattern as 20261005000300_seed_opportunity_engine_configs.sql

INSERT INTO ai_task_config (task_type, provider, model, is_enabled, config, description, created_at, updated_at)
VALUES
  ('ask_trek_restructure', 'openai', 'REPLACE_WITH_MODEL', false,
    '{"max_tokens": 4000, "temperature": 0.3, "response_format": "json_object"}'::jsonb,
    'Restructure an existing trip plan based on a constraint (budget, drive time, preferences).',
    NOW(), NOW())
ON CONFLICT (task_type) DO UPDATE
  SET provider = EXCLUDED.provider,
      is_enabled = EXCLUDED.is_enabled,
      config = EXCLUDED.config,
      description = EXCLUDED.description,
      updated_at = NOW();
