# Review schedule

Spaced repetition for concepts learned in this project, so earlier phases are not forgotten.

**How it works**

- At the start of a working session, Claude asks 2–3 short questions on topics that are due,
  before starting new work. Answers come from memory: no docs, no peeking at the code.
- A good answer moves the topic to the next interval: 1 day → 1 week → 1 month → 3 months.
  A weak answer resets it to 1 day, and Claude re-explains the gap.
- New topics are added here when a task that introduces them is finished.

| Topic                                                                    | Learned    | Interval | Next due   |
| ------------------------------------------------------------------------ | ---------- | -------- | ---------- |
| pnpm workspaces, lockfile, strict `node_modules`                         | 2026-11-16 | 1 day    | 2026-11-20 |
| tsconfig inheritance, strict flags, `module` + `moduleResolution`        | 2026-11-16 | 1 day    | 2026-11-20 |
| Zod: schema vs type, `parse` at boundaries                               | 2026-11-17 | 1 day    | 2026-11-21 |
| Turborepo: task graph, caching, `dependsOn: ["^task"]`                   | 2026-11-17 | 1 day    | 2026-11-25 |
| oxlint, oxfmt, Husky + lint-staged                                       | 2026-11-17 | 1 day    | 2026-11-20 |
| GitHub Actions: workflow, `uses` vs `run`, permissions, lockfile         | 2026-11-18 | 1 day    | 2026-11-20 |
| Docker: image vs container, volumes, ports, containers vs VMs            | 2026-11-19 | 1 day    | 2026-11-25 |
| Compose: services, healthchecks, `POSTGRES_*` only on first start        | 2026-11-19 | 1 week   | 2026-11-27 |
| PostgreSQL basics: tables, SQL, transactions, why relational             | 2026-11-19 | 1 week   | 2026-12-01 |
| Redis: data types, TTLs, AOF persistence, Redis vs Postgres              | 2026-11-20 | 1 day    | 2026-11-21 |
| Redis rate limiting: `INCR` + `EXPIRE NX`, `MULTI`/`EXEC`                | 2026-11-20 | 1 day    | 2026-11-21 |
| Host vs port, `127.0.0.1` vs `0.0.0.0`, what "server is up" means        | 2026-11-24 | 1 day    | 2026-11-25 |
| Env config: `--env-file`, `z.coerce`, `safeParse`, fail fast             | 2026-11-24 | 1 day    | 2026-11-25 |
| Fastify: `buildApp` vs `listen` split, routes, logger                    | 2026-11-24 | 1 day    | 2026-11-25 |
| Vitest + `app.inject`, types (compile time) vs Zod (runtime)             | 2026-11-24 | 1 day    | 2026-11-25 |
| Migrations: ordered files, `schema_migrations`, one transaction each     | 2026-11-25 | 1 day    | 2026-11-26 |
| Schema design: PK, composite PK, FK + `ON DELETE`, join tables, `CHECK`  | 2026-11-25 | 1 day    | 2026-11-26 |
| Indexes: B-tree, column order, index for real queries, cursor pagination | 2026-11-25 | 1 day    | 2026-11-26 |
