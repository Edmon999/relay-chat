import { Client } from "pg";
import { config } from "./config.ts";
import { runMigrations } from "./migration.ts";

const client = new Client({ connectionString: config.DATABASE_URL });
await client.connect();

try {
  const applied = await runMigrations(client);
  console.log(applied.length === 0 ? "Database is up to date" : `Applied: ${applied.join(", ")}`);
} finally {
  await client.end();
}
