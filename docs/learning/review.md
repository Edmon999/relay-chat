# Review schedule

Spaced repetition for concepts learned in this project, so earlier phases are not forgotten.

**How it works**

- At the start of a working session, Claude asks 2–3 short questions on topics that are due,
  before starting new work. Answers come from memory: no docs, no peeking at the code.
- A good answer moves the topic to the next interval: 1 day → 1 week → 1 month → 3 months.
  A weak answer resets it to 1 day, and Claude re-explains the gap.
- New topics are added here when a task that introduces them is finished.

| Topic                                                             | Learned    | Interval | Next due   |
| ----------------------------------------------------------------- | ---------- | -------- | ---------- |
| pnpm workspaces, lockfile, strict `node_modules`                  | 2026-11-16 | 1 day    | 2026-11-20 |
| tsconfig inheritance, strict flags, `module` + `moduleResolution` | 2026-11-16 | 1 day    | 2026-11-20 |
| Zod: schema vs type, `parse` at boundaries                        | 2026-11-17 | 1 day    | 2026-11-21 |
| Turborepo: task graph, caching, `dependsOn: ["^task"]`            | 2026-11-17 | 1 day    | 2026-11-21 |
| oxlint, oxfmt, Husky + lint-staged                                | 2026-11-17 | 1 day    | 2026-11-20 |
| GitHub Actions: workflow, `uses` vs `run`, permissions, lockfile  | 2026-11-18 | 1 day    | 2026-11-20 |
| Docker: image vs container, volumes, ports, containers vs VMs     | 2026-11-19 | 1 day    | 2026-11-20 |
| Compose: services, healthchecks, `POSTGRES_*` only on first start | 2026-11-19 | 1 week   | 2026-11-27 |
| PostgreSQL basics: tables, SQL, transactions, why relational      | 2026-11-19 | 1 day    | 2026-11-20 |
| Redis: data types, TTLs, AOF persistence, Redis vs Postgres       | 2026-11-20 | 1 day    | 2026-11-21 |
| Redis rate limiting: fixed window, `INCR` + `EXPIRE NX`           | 2026-11-20 | 1 day    | 2026-11-21 |
