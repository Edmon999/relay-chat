import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runMigrations } from "./migration.ts";

let container: StartedPostgreSqlContainer;
let client: Client;

beforeAll(async () => {
  // Same image as docker-compose.yml, so tests run on the Postgres version we develop on.
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  client = new Client({ connectionString: container.getConnectionUri() });
  await client.connect();
}, 60_000);

afterAll(async () => {
  await client?.end();
  await container?.stop();
});

describe("database schema", () => {
  it("applies every migration once, then nothing", async () => {
    expect(await runMigrations(client)).toEqual([
      "001_create_users.sql",
      "002_create_rooms.sql",
      "003_create_room_members.sql",
      "004_create_messages.sql",
    ]);
    expect(await runMigrations(client)).toEqual([]);
  });

  it("rejects a username that differs only in case", async () => {
    await client.query("INSERT INTO users (username, password_hash) VALUES ('Edmon', 'x')");

    await expect(
      client.query("INSERT INTO users (username, password_hash) VALUES ('edmon', 'y')"),
    ).rejects.toThrow(/users_username_lower_key/);
  });

  it("rejects a membership for a room that does not exist", async () => {
    await expect(
      client.query("INSERT INTO room_members (room_id, user_id) VALUES (999, 1)"),
    ).rejects.toThrow(/room_members_room_id_fkey/);
  });
});
