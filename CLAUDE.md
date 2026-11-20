# CLAUDE.md

E2EE local-first chat app with on-device smart replies. **This is a learning project**: the
developer is a senior frontend engineer learning backend, DevOps and ML. Understanding > speed.

- Roadmap, current phase and task checkboxes: `PLAN.md` — read the current phase before starting
  any task, and tick the checkbox + add a progress-log row when a task is done.
- Decisions and their reasons: `docs/adr/`. Don't contradict an ADR; propose a new one instead.

## How we work

- **✍️ tasks (in PLAN.md): the developer writes the code.** Explain the concept, link docs, give
  a task description and hints, then review. Do not write the implementation unless asked.
- **🤖 tasks: Claude may implement**, following patterns the developer already established.
- Exception: **ADRs and docs** — Claude drafts them, the developer reviews.
- **Spaced review:** at session start, ask 2–3 questions on topics due in
  `docs/learning/review.md` (from memory, no peeking), then update their interval and due date.
  Add a row when a task introduces a new concept.
- Non-trivial change → present 2–3 options with trade-offs and **wait for a decision**.
- Reviews: direct, senior-level. Bugs, security, missing tests, naming, what production would do.
- Never hand-roll crypto (libsodium only); ask before any crypto change.
- Before creating any AWS resource: state rough monthly cost and free-tier status.
- Don't commit unless asked. Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).

## Commands (run from repo root)

```sh
pnpm dev             # api + web together (Turborepo)
pnpm typecheck       # tsc in every package, cached
pnpm build           # production build (web only for now)
pnpm lint            # oxlint, type-aware, whole repo
pnpm lint:fix
pnpm format          # oxfmt, whole repo
pnpm format:check
pnpm services:up     # local Postgres + Redis, waits until healthy
pnpm services:down
pnpm services:logs
pnpm --filter @super/api <script>   # run one package's script
```

Before calling any task done: `pnpm typecheck && pnpm lint && pnpm format:check` must pass.

## Layout

- `apps/api` — Node server. Runs `.ts` directly via Node 24 type stripping (no build step).
- `apps/web` — React 19 + Vite 8.
- `packages/shared` — Zod schemas + derived types, the contract between web and api.
  Consumed **as source** (`exports` → `./src/index.ts`), never built.
- Code that only one app uses stays in that app. Create a package only for a second consumer.

## TypeScript rules (TS 7, strict)

- No package emits JS (`noEmit` in base). Never add `outDir`/build steps without an ADR.
- **`erasableSyntaxOnly`: no `enum`, `namespace`, or constructor parameter properties.**
  Use `as const` objects / union types instead of enums.
- **Relative imports always include the extension** (`./config.ts`), in every package.
  Node runs api/shared directly and does not guess extensions.
- Use `import type` for type-only imports (`verbatimModuleSyntax`).
- Package tsconfigs `extends` `tsconfig.base.json`. Gotcha: overriding `module` without also
  overriding `moduleResolution` inherits the base's `Bundler` → TS5109. Override both.
- `types` is `[]` in the base; each package opts in (`node` for api, `vite/client` for web).

## Data & validation

- Every API/WebSocket payload shape is a Zod schema in `packages/shared`; the TS type is
  `z.infer<typeof Schema>` with the same name. Never hand-write a parallel interface.
- **Parse at boundaries** (request bodies, WS messages, fetch responses, storage); trust types
  inside. Zod 4's `z.object` shape is loosely typed — a wrong field can typecheck, so test schemas.

## Dependencies & tooling

- Add deps to the package that uses them: `pnpm add <pkg> --filter @super/<name>`.
  Workspace deps: `--workspace`. Shared tooling (typescript, turbo, oxlint, oxfmt) lives at root (`-w`).
- pnpm 11 blocks versions < 1 day old. **Never add `minimumReleaseAgeExclude`**; pick an older version.
- oxfmt is pre-1.0 and pinned exactly. Upgrade only in its own commit.
- Turbo: a task whose result depends on other packages' source needs `dependsOn: ["^<task>"]`,
  otherwise the cache replays stale results.
- Don't disable a lint rule without a one-line reason in the config.

## Environment

- Developer is on Windows (PowerShell). Repo uses LF line endings (`.gitattributes`).
  Write files as UTF-8 without BOM; never create files with PowerShell `>` / `Out-File`.
