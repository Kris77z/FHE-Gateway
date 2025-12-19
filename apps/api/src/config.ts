import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';

const ENV_CANDIDATES = ['.env', '../.env', '../../.env'];

for (const candidate of ENV_CANDIDATES) {
  const absolute = resolve(process.cwd(), candidate);
  if (existsSync(absolute)) {
    loadEnv({ path: absolute, override: false });
  }
}

const schema = z.object({
  API_PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FACILITATOR_URL: z.string().url().default('https://facilitator.payai.network'),
  MERCHANT_EVM_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  EVM_NETWORK: z.enum(['base-sepolia', 'base', 'polygon']).default('base-sepolia'),
  EVM_RPC_URL: z.string().url().optional(),
  COMMISSION_BPS: z.coerce.number().int().min(0).max(10_000).default(500),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().optional(),
});

export type ApiConfig = z.infer<typeof schema>;

let cached: ApiConfig | null = null;

export function getConfig(): ApiConfig {
  if (cached) {
    return cached;
  }

  const result = schema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.format();
    throw new Error(`Invalid API environment configuration: ${JSON.stringify(formatted, null, 2)}`);
  }

  cached = result.data;
  return cached;
}

