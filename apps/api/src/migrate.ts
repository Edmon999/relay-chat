import { readdir, readFile } from "node:fs/promises";
import { Client } from "pg";
import { config } from "./config.ts";

const migrationsDir = new URL("../migrations/", import.meta.url);

const client = new Client({ connectionString: config.DATABASE_URL });
await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await client.query<{ name: string }>("SELECT name FROM schema_migrations");
  const applied = new Set(rows.map((row) => row.name));

  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql"));

  const badName = files.find((file) => !/^\d+_[a-z0-9_]+\.sql$/.test(file));
  if (badName) {
    throw new Error(`Migration file name must look like 001_create_users.sql, got: ${badName}`);
  }

  // Sort by the number prefix, not as text: as text, "1000_x" would come before "101_x".
  const ordered = files.toSorted((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

  // Sequential on purpose: each migration may depend on the one before it.
  for (const file of ordered) {
    if (applied.has(file)) continue;

    const sql = await readFile(new URL(file, migrationsDir), "utf8");
    if (sql.trim() === "") {
      // Recording an empty file as applied would skip it forever, even after it is filled in.
      throw new Error(`Migration file is empty: ${file}`);
    }

    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`applied ${file}`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  }
} finally {
  await client.end();
}
