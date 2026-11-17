# ADR 0002: oxlint + oxfmt instead of ESLint + Prettier

- **Status:** Accepted
- **Date:** 2026-11-17

## Context

PLAN.md originally listed ESLint + Prettier for linting and formatting. Since then:

- The repo uses **TypeScript 7** (the Go-native compiler). Type-aware ESLint rules come from
  typescript-eslint, which depends on TypeScript's JS API and may lag behind TS 7.
- The Vite 8 `react-ts` template already ships with **oxlint**, not ESLint.
- Vite 8 itself transforms code with **Oxc** (via Rolldown), so the Oxc toolchain is already in
  the repo.

## Decision

- **Linter:** oxlint, one root `.oxlintrc.json`, run once over the whole repo (`pnpm lint`).
  Type-aware rules enabled via `oxlint-tsgolint`, which is built on the TS 7 compiler.
  Categories: `correctness` = error, `suspicious` = warn; React rules only for `apps/web`.
- **Formatter:** oxfmt, **pinned to an exact version** (`0.78.0`) because it is pre-1.0.
- **Hooks:** Husky + lint-staged run `oxlint --fix` and `oxfmt` on staged files.
- **Line endings:** `.gitattributes` forces LF so Windows checkouts match Linux CI.

## Consequences

**Gains**

- Lint + format of the whole repo takes milliseconds, so it can run on every commit.
- Type-aware rules (`no-floating-promises`, `no-misused-promises`) work with TS 7 today.
- One toolchain (Oxc) for transform, lint and format.

**Costs / risks accepted**

- Smaller plugin ecosystem than ESLint; a niche ESLint plugin may not exist for oxlint.
- oxfmt is pre-1.0: upgrading it may reformat files. Upgrade deliberately, in its own commit.
- Output is designed to match Prettier, so switching to Prettier later is cheap if needed.

**Revisit if:** a needed rule/plugin only exists for ESLint, or oxfmt stalls before 1.0.
