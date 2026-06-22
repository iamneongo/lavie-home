import 'server-only';

import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __laviePgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export const pool = globalThis.__laviePgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__laviePgPool = pool;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
) {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
) {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
