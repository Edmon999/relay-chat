# ADR 0001: Project stack and monorepo setup

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

This project is an end-to-end encrypted, local-first chat app with on-device smart replies. It
has to work as a realistic full-stack system and as a way to learn backend, DevOps and ML in
depth. A web client, an API and later a mobile client need to share contracts and crypto code.

## Decision

- **Monorepo:** pnpm workspaces link the packages; Turborepo runs and caches tasks. pnpm's strict
  `node_modules` prevents packages from importing dependencies they did not declare.
- **Language:** strict TypeScript 7 everywhere; Python only for ML training.
- **Contracts:** Zod schemas in `packages/shared`, with types derived through `z.infer`.
- **Shared code:** `packages/shared` is consumed as TypeScript source, with no build step.
- **API runtime:** Node 24 runs `.ts` directly through type stripping. This requires erasable
  syntax only and explicit file extensions on relative imports.
- **Web:** React and Vite.
- **Backend:** Fastify, PostgreSQL (raw SQL first, then Drizzle), Redis and BullMQ.
- **Security:** libsodium for all cryptography; no hand-written primitives.
- **Infrastructure:** Docker locally; AWS provisioned as code in production.

Linting and formatting are covered by [ADR 0002](0002-oxlint-and-oxfmt.md).

## Consequences

**Gains**

- One type-safe contract is shared by the client and server.
- Editing shared code takes effect immediately, without a watch process.
- The API has no compile step or TypeScript runner in development.
- Fastify and raw SQL keep backend fundamentals visible while learning.

**Costs / risks accepted**

- No `enum`, `namespace` or constructor parameter properties.
- Every consumer of `packages/shared` must be able to load TypeScript source.
- Tasks that depend on shared source must declare `dependsOn: ["^<task>"]`, or Turborepo can
  replay stale results.
- TypeScript 7 is new, so some tools that use its programmatic API may lag behind it.

**Revisit if:** production images need compiled output, `packages/shared` must be published, or a
required tool cannot support TypeScript 7.
