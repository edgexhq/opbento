import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql;
}

/**
 * Ensures the bento_images table exists.
 * Call once at the start of the bento route handler.
 */
export async function ensureBentoTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS bento_images (
      id         SERIAL PRIMARY KEY,
      username   TEXT NOT NULL,
      unique_id  TEXT NOT NULL,
      image_data TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (username, unique_id)
    )
  `;
}
