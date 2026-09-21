// src/lib/env.m — Build environment validation.
// Only public Supabase values and site-level config may reach the build.
// A service-role key or secret must never be read here.

import { z } from 'zod';

const EnvSchema = z.object({
  SUPABASE_URL: z
    .string()
    .url('SUPABASE_URL must be a valid URL')
    .refine((val) => val.startsWith('https://'), 'SUPABASE_URL must use https'),
  SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(10, 'SUPABASE_PUBLISHABLE_KEY must not be empty'),
    STAY22_AFFILIATE_ID: z
    .string()
    .min(1, 'STAY22_AFFILIATE_ID must not be empty'),
  SITE_URL: z
    .string()
    .url('SITE_URL must be a valid URL')
    .refine((val) => val.startsWith('https://'), 'SITE_URL must use https'),
  NETLIFY_SITE_ID: z
    .string()
    .optional(),
});

/**
 * @typedef {Object} BuildEnv
 * @property {string} supabaseUrl
 * @property {string} supabasePublishableKey
 * @property {string} stay22AffiliateId
 * @property {string} siteUrl
 */

/**
 * Validate and normalize build environment variables.
 * @param {Record<string,string>} [source=process.env]
 * @returns {BuildEnv}
 */
export function readBuildEnv(source = process.env) {
  const parsed = EnvSchema.safeParse({
    SUPABASE_URL: source.SUPABASE_URL || source.NEXT_PUBLIC_SUPABASE_URL,
    // backward compatibility: fallback to SUPABASE_ANON_KEY if
    // SUPABASE_PUBLISHABLE_KEY is not set (legacy Netlify env naming)
    SUPABASE_PUBLISHABLE_KEY: source.SUPABASE_PUBLISHABLE_KEY || source.SUPABASE_ANON_KEY,
    SITE_URL: source.SITE_URL || 'https://trekafricaguide.com',
    STAY22_AFFILIATE_ID: source.STAY22_AFFILIATE_ID,
    NETLIFY_SITE_ID: source.NETLIFY_SITE_ID,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Build environment validation failed: ${issues}`);
  }

  return {
    supabaseUrl: parsed.data.SUPABASE_URL,
    supabasePublishableKey: parsed.data.SUPABASE_PUBLISHABLE_KEY,
    stay22AffiliateId: parsed.data.STAY22_AFFILIATE_ID,
    siteUrl: parsed.data.SITE_URL,
    netlifySiteId: parsed.data.NETLIFY_SITE_ID,
  };
}
