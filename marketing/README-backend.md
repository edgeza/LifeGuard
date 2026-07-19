# LifeGuard — Backend API

Next.js 15 marketing app powering the LifeGuard family-caregiver demo.
All backend logic lives under `marketing/src/app/api/care/*` and runs on
the same Next.js server as the marketing site.

## Stack

| Layer        | Choice                              |
|--------------|-------------------------------------|
| Runtime      | Node.js + Next.js 15.5.20           |
| Database     | SQLite (better-sqlite3) at `db/lifeguard.sqlite` |
| Auth         | JWT session cookie (`lg_session`), bcrypt hashes |
| Webhook auth | HMAC-SHA256 (`X-LG-Signature`)      |
| Cron auth    | Shared secret header (`X-Cron-Secret`) |
| Demo LLM     | Deterministic mock (no LLM dependency) |

The schema is auto-applied on every db import — see `db/index.ts`. No
migration step is required beyond running the seed once.

## Quick start

```bash
cd marketing
npm install
npm run build
npx tsx db/seed.ts          # one-time: populates demo data
PORT=3010 npx next start -p 3010
```

Then in another shell:

```bash
cd marketing
npx tsx scripts/seed-vitals.ts   # populates 7 days of vitals
npx tsx scripts/run-cron.ts        # runs all 3 crons
bash scripts/curl-demo.sh          # end-to-end demo flow
```

## Demo credentials

| Email                      | Password   | Role      |
|----------------------------|------------|-----------|
| lerato@demo.lifeguard      | demo1234   | caregiver |
| marlene@demo.lifeguard     | demo1234   | caregiver |
| julian@demo.lifeguard      | demo1234   | caregiver |
| sandra@demo.lifeguard      | demo1234   | caregiver |

All four users belong to tenant `demo-family-001` and are linked to a
single care_receiver (`marlene`) whose agent is `esther`.

## Configuration

| Env var                  | Default               | Used by                  |
|--------------------------|-----------------------|--------------------------|
| `SESSION_SECRET`         | (hard-coded dev key)  | `lib/auth.ts`            |
| `DEVICE_WEBHOOK_SECRET`  | `dev-webhook-secret`  | `vitals/ingest`          |
| `CRON_SECRET`            | `dev-cron-secret`     | all 3 cron routes        |
| `PORT`                   | `3000`                | `next start`             |
| `BASE_URL`               | `http://127.0.0.1:3010` | `scripts/run-cron.ts`  |

## API surface

### Session auth

| Method | Path                       | Auth     | Body                                  |
|--------|----------------------------|----------|---------------------------------------|
| POST   | `/api/care/auth/signup`    | none     | `{ email, password, name, tenantName? }` |
| POST   | `/api/care/auth/login`     | none     | `{ email, password }`                 |
| POST   | `/api/care/auth/logout`    | session  | —                                     |
| GET    | `/api/care/auth/me`        | session  | —                                     |

Session cookie: `lg_session`, HTTP-only, 7-day TTL, signed JWT (HS256).

### Onboarding & data

| Method | Path                                      | Auth    |
|--------|-------------------------------------------|---------|
| GET    | `/api/care/care-receivers`                | session |
| POST   | `/api/care/care-receivers`                | session |
| GET    | `/api/care/care-receivers/:id`            | session |
| POST   | `/api/care/onboarding`                    | session |
| POST   | `/api/care/adherence/confirm`             | session |
| POST   | `/api/care/chat`                          | session |

### Vitals webhook (HMAC)

`POST /api/care/vitals/ingest` — device webhook, NOT session-auth.

**Auth**: header `X-LG-Signature: sha256=<hex>` where `<hex>` is
`HMAC-SHA256(rawRequestBody, DEVICE_WEBHOOK_SECRET)` in lowercase hex.

**Body** (raw bytes — must match the bytes signed):

```json
{
  "careReceiverId": "<uuid>",
  "metric": "hr" | "spo2" | "hrv" | "temp",
  "value": 75,
  "recordedAt": 1752864000   // optional, unix seconds
}
```

**Valid ranges**: hr 30-200, spo2 70-100, hrv 10-200, temp 34-42.

**Response**: `{ "id": <vital.id>, "accepted": true }` or, when HR >
120, `{ "id": <vital.id>, "accepted": true, "escalationId": "<uuid>" }`
plus an SMS queued to all linked caregivers.

**Reference signature** (bash):

```bash
BODY='{"careReceiverId":"<id>","metric":"hr","value":125}'
SIG="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac dev-webhook-secret | awk '{print $NF}')"
```

### Cron endpoints (shared secret)

All three endpoints:

- Require header `X-Cron-Secret: <CRON_SECRET>` (default `dev-cron-secret`).
- Are NOT session-authenticated — they run from a scheduler with no user.
- Are idempotent: safe to call multiple times per day.

| Method | Path                          | What it does                                                                                                  |
|--------|-------------------------------|---------------------------------------------------------------------------------------------------------------|
| GET    | `/api/care/cron/reminders`    | Creates pending adherence_events for today's medication slots and SMS-es pending slots in the last 60 min.     |
| GET    | `/api/care/cron/escalations`  | Marks any pending adherence_event more than 15 min past `scheduled_for` as `missed`, opens escalations, SMS-es all linked caregivers. |
| GET    | `/api/care/cron/digest`       | On Sundays only (UTC), generates a `weekly_digest` row and emails it to all linked caregivers for each agent. Returns `{ skipped: "not sunday" }` on other days. |

Response shapes:

```json
{ "pendingCreated": 4, "remindersSent": 1, "now": ..., "window": {...} }
{ "escalationsOpened": 2, "smsSent": 4, "cutoff": ..., "now": ... }
{ "skipped": "not sunday", "today": "2026-07-19" }
{ "digestsSent": 1, "sent": [...], "weekStart": ... }
```

### Digests

`GET /api/care/digest/[agent_id]` — session-authenticated. Returns the
latest weekly digest row for an agent in the caller's tenant, or 404.

## Scripts

| Script                  | What it does                                            |
|-------------------------|---------------------------------------------------------|
| `db/seed.ts`            | One-time seed of the demo tenant, users, meds, etc.     |
| `scripts/seed-vitals.ts`| Generates 7 days × 24 hours × 4 metrics of vitals per care_receiver. Idempotent. |
| `scripts/run-cron.ts`   | Hits `/api/care/cron/{reminders,escalations,digest}` in sequence with the cron secret. |
| `scripts/curl-demo.sh`  | Full end-to-end bash demo: login → list → chat → confirm → vitals (HMAC) → crons → digest fetch. |

All scripts run via `npx tsx <path>` (tsx is a TypeScript executor).

## Known limits (Phase 2)

- One agent per care_receiver; one care_receiver per tenant in the demo.
- SMS / voice / email all write to `outbound_messages` only — no real
  provider integration. `to_address` is the user's email address for
  SMS/voice (stub) and the user's email for email channels.
- The chat route is a deterministic templated reply rotator — no LLM.
- The vitals seed uses naive uniform RNG. Acceptable for demo only.
- Weekly digest generation is a stub (no LLM call to the cognitive-watch
  or digest skills — the contract leaves the wiring for a future phase).
- HMAC timingSafeEqual requires both buffers to be the same length; if
  the supplied signature is the wrong length we return 401 immediately
  rather than leaking length info.

## File layout

```
marketing/
├── db/                          schema + seed + better-sqlite3 handle
├── src/lib/                     auth, db, helpers (Phase 1)
├── src/middleware.ts            page-level auth gate (login redirect)
├── src/app/api/care/
│   ├── auth/                    Phase 1: signup / login / logout / me
│   ├── chat/                    Phase 2B: caregiver → bot
│   ├── onboarding/              Phase 2C
│   ├── care-receivers/          Phase 2C
│   ├── adherence/               Phase 2C
│   ├── vitals/ingest/           Phase 2D ← HMAC-verified device webhook
│   ├── cron/{reminders,escalations,digest}/
│   │                            Phase 2D ← shared-secret cron endpoints
│   └── digest/[agent_id]/       Phase 2D ← session-auth digest lookup
├── scripts/
│   ├── seed-vitals.ts           Phase 2D
│   ├── run-cron.ts              Phase 2D
│   └── curl-demo.sh             Phase 2D
├── README-backend.md            this file
└── package.json
```
