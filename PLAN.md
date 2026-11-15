# Learning Plan: E2EE Chat App with On-Device Smart Replies

> This file is the roadmap for a learning project. It is written for both me (the developer)
> and Claude Code (the AI assistant in my terminal). Claude: read this file at the start of
> a session, check which phase/task is current, and follow the "How we work" rules below.

---

## 1. Who I am and why this project exists

- Frontend engineer, ~5 years, React + TypeScript, Next.js. Strong on frontend architecture,
  performance, design-system migrations.
- **Goal:** become a strong full-stack engineer (TypeScript backend + DevOps/AWS) while also
  deepening frontend architecture, testing and performance — and end up with a portfolio
  project I can talk about in interviews.
- **Not a goal:** shipping a product fast. Understanding > speed.

## 2. What we are building

A real-time chat application where **messages live on users' devices, not on the server**
(end-to-end encrypted, local-first), plus **on-device smart-reply suggestions** powered by a
small ML model that also personalizes itself to the user.

Later add-ons: an Expo mobile client, a small multiplayer game inside chats.

### Core architecture (target state)

```
[Web client (React)]  [Mobile client (Expo)]
   |  local DB: IndexedDB / SQLite (messages, keys)
   |  crypto: libsodium (keys + encryption on device)
   |  ML: smart-reply model running on device (onnxruntime-web / transformers.js)
   |
   |  WebSocket + REST (only encrypted blobs + metadata)
   v
[API servers (Node, TypeScript)] x N  <-- Redis pub/sub between instances
   |-- PostgreSQL  (users, devices, public keys, rooms, undelivered encrypted messages)
   |-- Redis       (presence, pub/sub, rate limits, queues)
   |-- S3          (encrypted attachments)
   v
[AWS: ECS Fargate, RDS, ElastiCache, S3, CloudFront]  provisioned with Terraform/CDK
```

**Key principle:** the server is a *relay*. It stores an encrypted message only until the
recipient device acknowledges it, then deletes it. The server can never read message content.

## 3. Tech stack (decided — change only with a written reason in `docs/adr/`)
~
| Area | Choice |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Language | TypeScript everywhere (strict mode); Python only for ML training |
| Frontend | React + Vite, TanStack Query, Zustand (or similar), React Router |
| Backend | Node.js + Fastify (learn the fundamentals; NestJS optional later) |
| Validation / shared types | Zod schemas in `packages/shared` |
| Database | PostgreSQL — raw SQL first, then Drizzle |
| Cache / pub-sub / queues | Redis + BullMQ |
| Real-time | WebSockets (`ws` or Fastify websocket plugin) |
| Crypto | libsodium (`libsodium-wrappers`) — never hand-rolled crypto |
| Local storage | IndexedDB (Dexie) on web, SQLite on mobile |
| Unit/integration tests | Vitest, Testcontainers (real Postgres/Redis in Docker) |
| E2E tests | Playwright |
| Load tests | k6 |
| CI/CD | GitHub Actions |
| Infra | Docker, AWS, Terraform (or AWS CDK in TypeScript) |
| Observability | OpenTelemetry, structured logs (pino), CloudWatch |
| ML | PyTorch for training → export ONNX → run in browser |

## 4. Repo structure

```
/apps
  /web        React client
  /api        Fastify server
  /mobile     Expo client (Phase 7)
/packages
  /shared     Zod schemas, types, protocol definitions
  /crypto     wrapper around libsodium used by web + mobile
  /ml         on-device inference + personalization code (TS)
/ml           Python training code, notebooks, datasets (gitignored data)
/infra        Terraform / CDK
/docs
  /adr        Architecture Decision Records (one short .md per decision)
  /learning   my notes, written by me, per phase
  /case-studies  write-ups for portfolio/interviews
PLAN.md       this file
```

## 5. How we work (rules for Claude)

This is a **learning** project. Follow these rules:

1. **First time a concept appears, I write it.** When a task introduces a new concept
   (first route, first SQL query, first WebSocket handler, auth, first queue job, first
   encryption call, first Terraform resource), do NOT write the implementation. Instead:
   explain the concept briefly, point me to docs, give me a task description and hints,
   then review my code when I'm done.
   Tasks marked ✍️ below are "I write it" tasks.
2. **Repetitions can be delegated.** Tasks marked 🤖 are fine for Claude to implement,
   once the ✍️ version exists. Follow the patterns I established.
3. **Explain trade-offs before implementing** anything non-trivial. Offer 2–3 options with
   pros/cons, then wait for my decision.
4. **Review like a senior engineer.** When reviewing my code: point out bugs, security
   issues, missing tests, naming, and what a production version would do differently.
   Be direct; don't just praise.
5. **Every feature needs tests.** No task is done without unit tests; user-facing flows
   need a Playwright test.
6. **Record decisions.** When we pick something non-obvious, create a short ADR in
   `docs/adr/NNNN-title.md` (context, decision, consequences).
7. **Never hand-roll cryptography.** Use libsodium primitives. Ask before any crypto change.
8. **Keep me in the loop on cost.** Before creating any AWS resource, say what it costs
   roughly per month and whether it is free-tier.
9. **Update this file.** When a task is finished, tick its checkbox and add a one-line note
   if something changed.

## 6. Phases

Rough timing assumes part-time work. Each phase ends with a **Definition of Done** and a
short write-up in `docs/learning/phase-N.md` (written by me).

---

### Phase 0 — Foundation (week 1)

- [ ] ✍️ Create monorepo (pnpm + Turborepo), `apps/web`, `apps/api`, `packages/shared`
- [ ] ✍️ Write `CLAUDE.md` myself (project overview, commands, conventions, link to PLAN.md)
- [ ] ✍️ Create 2 project skills in `.claude/skills/`:
      `add-endpoint` (how we add an API route + schema + tests) and
      `write-e2e-test` (how we write Playwright tests here)
- [ ] 🤖 ESLint, Prettier, strict tsconfig, Husky/lint-staged
- [ ] ✍️ First GitHub Actions workflow: install → lint → typecheck → test
- [ ] 🤖 `docker-compose.yml` for local Postgres + Redis
- [ ] ✍️ ADR 0001: why this stack

**Done when:** `pnpm dev` runs web + api, CI is green on a PR, CLAUDE.md and 2 skills exist.

---

### Phase 1 — Basic chat, server-stored (weeks 2–4)

Plain (non-encrypted) chat first, so I learn backend fundamentals without crypto complexity.

**Backend**
- [ ] ✍️ Fastify server, health route, config via env + Zod validation
- [ ] ✍️ Postgres schema with raw SQL migrations: `users`, `rooms`, `room_members`, `messages`
- [ ] ✍️ Auth from scratch: register/login, argon2 password hashing, session cookies
      (httpOnly, secure, sameSite), logout, session expiry
- [ ] ✍️ REST: create room, list rooms, invite user, paginated message history (cursor-based)
- [ ] 🤖 Remaining CRUD endpoints following my patterns
- [ ] ✍️ WebSocket: authenticate the connection, join rooms, broadcast messages
- [ ] ✍️ Centralized error handling + request logging (pino, request IDs)
- [ ] 🤖 Switch raw SQL to Drizzle *after* I've written the raw version (compare both)

**Frontend**
- [ ] ✍️ App architecture: feature folders, API client layer, query/cache strategy,
      WebSocket connection manager (reconnect with backoff)
- [ ] ✍️ Optimistic message sending with pending/failed states
- [ ] 🤖 UI: login, room list, chat view
- [ ] ✍️ Virtualized message list (thousands of messages, scroll anchoring)

**Testing**
- [ ] ✍️ Integration tests with Testcontainers (auth + messages)
- [ ] ✍️ First Playwright test: two users chat in real time (two browser contexts)

**Done when:** two users can register, create a room and chat live; tests in CI.

---

### Phase 2 — Production-like backend (weeks 5–6)

- [ ] ✍️ Run 2+ API instances locally behind a proxy (nginx/Caddy); fix what breaks
- [ ] ✍️ Redis pub/sub so messages reach users connected to other instances
- [ ] ✍️ Presence (online/offline), typing indicators (with TTLs in Redis)
- [ ] ✍️ Delivery + read receipts (sent → delivered → read)
- [ ] ✍️ Rate limiting (per user, per IP) with Redis
- [ ] ✍️ Background jobs with BullMQ (e.g. cleanup of expired sessions, notification fan-out)
- [ ] ✍️ File upload: presigned S3 URLs (LocalStack or MinIO locally)
- [ ] 🤖 OpenAPI docs generated from Zod schemas
- [ ] ✍️ Security pass: OWASP Top 10 checklist against my API (CSRF, input validation,
      authz on every room route, headers)

**Done when:** chat works across multiple instances; I can explain why each piece exists.

---

### Phase 3 — End-to-end encryption & local-first (weeks 7–9)

- [ ] ✍️ Read & summarize in `docs/learning/`: how the Signal protocol works at a high level
      (identity keys, prekeys, X3DH, Double Ratchet) — understand, don't implement it fully
- [ ] ✍️ `packages/crypto`: per-device key pair generation (libsodium), public key upload
- [ ] ✍️ 1:1 encryption with `crypto_box` (sender encrypts for each recipient device)
- [ ] ✍️ Server becomes a relay: store encrypted blob until device ACKs, then delete
- [ ] ✍️ Local message store in IndexedDB (Dexie); UI reads from local DB, not server
- [ ] ✍️ Offline support: queue outgoing messages, sync on reconnect, dedupe by message ID
- [ ] ✍️ Multi-device: each device has its own keys; sender encrypts per device
- [ ] ✍️ Group chats: decide approach (per-member encryption vs sender keys) → write ADR
- [ ] ✍️ Key backup / new-device story → write ADR (this is the hard part; trade-offs only)
- [ ] 🤖 Safety-number / key fingerprint UI
- [ ] ✍️ Playwright: user goes offline, receives messages after reconnect; verify the DB
      on the server never contains plaintext

**Done when:** server DB contains zero plaintext; messages survive reload and offline periods.

---

### Phase 4 — DevOps, CI/CD, AWS (weeks 10–11)

- [ ] ✍️ Set up AWS account security: MFA, IAM user/roles, **billing alarms first**
- [ ] ✍️ Multi-stage Dockerfiles for api and web (small images, non-root user)
- [ ] ✍️ Terraform (or CDK): VPC, ECS Fargate service, RDS Postgres, ElastiCache Redis,
      S3 + CloudFront for web, ALB with WebSocket support, Secrets Manager
- [ ] ✍️ GitHub Actions CD: build → test → push image to ECR → deploy to ECS
      (use OIDC, no long-lived AWS keys in GitHub)
- [ ] 🤖 Preview environments per PR (or at least a staging env)
- [ ] ✍️ Database migrations in the deploy pipeline (safe, backwards-compatible)
- [ ] ✍️ Observability: OpenTelemetry traces, structured logs, CloudWatch dashboards + alarms
- [ ] ✍️ Write `docs/runbook.md`: deploy, rollback, rotate secrets, what to do if Redis dies
- [ ] ✍️ Tear-down command so I can destroy everything when not using it (cost control)

**Done when:** merge to main deploys automatically; I can rebuild the whole infra from code.

---

### Phase 5 — Performance (week 12)

- [ ] ✍️ k6 load test: how many concurrent WebSocket connections per instance? Where's the
      bottleneck (CPU, memory, Redis, Postgres)? Write findings.
- [ ] ✍️ Postgres: EXPLAIN ANALYZE on hot queries, add right indexes
- [ ] ✍️ Frontend: Lighthouse CI budget in GitHub Actions, bundle analysis, code splitting
- [ ] ✍️ Memory profiling: long-running chat tab, check for leaks (listeners, sockets)
- [ ] ✍️ Web Worker for crypto + ML so the main thread stays smooth
- [ ] ✍️ Case study: `docs/case-studies/performance.md` with before/after numbers

**Done when:** numbers documented, performance budgets enforced in CI.

---

### Phase 6 — On-device smart replies (weeks 13–16)

Because messages are encrypted, the server can't see them, so **the AI must run on the
device**. This is the main AI part of the project.

**6a. Baseline with a pre-trained model**
- [ ] ✍️ Research small models that run in the browser (transformers.js / onnxruntime-web);
      measure model size, load time, inference latency → ADR
- [ ] ✍️ Run inference in a Web Worker: given last N messages → 3 suggested replies
- [ ] ✍️ UX: suggestion chips, never auto-send, easy to disable

**6b. Train my own model (Python)**
- [ ] ✍️ Learn basics: tokenization, embeddings, train/validation split, overfitting
      (fast.ai or a PyTorch tutorial first)
- [ ] ✍️ Dataset: public conversational dataset (check licence) — NOT real users' messages
- [ ] ✍️ Approach (simplest that works): a **response-ranking** model — encode the context,
      score a fixed set of candidate replies (like Gmail's original Smart Reply)
- [ ] ✍️ Train, evaluate (top-3 accuracy), export to ONNX, quantize, load in browser
- [ ] ✍️ Compare my model vs the pre-trained baseline on size/latency/quality

**6c. A model that learns by itself (on-device personalization)**
- [ ] ✍️ Log locally (never sent anywhere) which suggestion the user picked or ignored
- [ ] ✍️ Train a small personalization layer on device (e.g. online logistic regression
      or a contextual bandit re-ranking the candidates) — written in TypeScript
- [ ] ✍️ Measure: does pick-rate improve over time? Write a case study.
- [ ] Stretch: read about federated learning (how models improve across users without
      sharing data) — write notes, maybe a toy simulation

**Done when:** suggestions appear in < 200 ms on a laptop, model runs fully on device,
personalization measurably changes ranking.

---

### Phase 7 — Extras (after week 16, pick any)

- [ ] Expo mobile client sharing `packages/shared`, `packages/crypto`, `packages/ml`
      (SQLite local store, push notifications with encrypted payloads)
- [ ] Multiplayer mini-game inside a chat (tic-tac-toe / drawing game) over the same
      WebSocket infra; then a reinforcement-learning bot that learns the game by self-play
- [ ] Toy browser engine (HTML parser + layout) following *Web Browser Engineering*
      (browser.engineering) — pure frontend-internals learning

---

## 7. Portfolio output (do as I go, not at the end)

- [ ] README with architecture diagram, demo GIF, how to run
- [ ] Case studies: E2EE design, scaling WebSockets, performance, on-device ML
- [ ] Short blog posts / LinkedIn posts after each phase
- [ ] CV bullet points updated after Phases 2, 4 and 6

## 8. Progress log

| Date | Phase | Note |
|---|---|---|
| | | |
