# LifeGuard — Product & Strategic Brief

> **Status:** Source-of-truth for the entire LifeGuard build. Every screen, table, and API must trace back here. If a feature isn't in this document, it isn't in the product.
>
> **Written:** 2026-07-17
> **Owner:** Product
> **Stack:** Next.js 15 (App Router) · TypeScript · React 19 · Tailwind CSS 4 · Supabase Postgres (locally: any Postgres) · WebSocket for live console · OpenAPI for partners
> **Design system:** Stripe (marketing) + Linear (operator console) — both styles referenced explicitly below

---

## 1. The problem we are solving

Personal safety and lone-worker emergency response is a **fragmented $40B global market** with 280+ vendors and zero global winner. Every serious competitor is in exactly one bucket:

| Bucket | Who | What they don't do |
|---|---|---|
| Consumer PERS hardware (Life Alert, Bay Alarm, Apple Watch fall) | US retirees | No platform, no API, no white-label, no Africa/EM presence |
| B2B enterprise lone-worker SaaS (Blackline Safety, SoloProtect, AlertMedia) | Lone workers | No consumer/low-cost tier, no medical-grade sensors, no family-app |
| Mass-notification CEM (Everbridge, OnSolve, Rave) | Enterprises | No hardware, no immediate response, no medical-grade sensors, no arms-reach |
| Network-infrastructure dispatch (AURA, Namola, HelpMe) | SA consumers | No wearable, no medical sensors, no proactive triage, no enterprise tier |
| EU telecare incumbents (Tunstall, Careium, Legrand Care) | EU LA + councils | No consumer direct, no SaaS reseller model, no emerging markets |

**Nobody is in all four simultaneously. That's the gap.**

**MyLifeLine (the predecessor):** Wearables + cloud + API + B2B for SA security partners. Right shape, right idea. No brand, no global scale, no operator console, no proactive features, no AI. Right product, wrong team.

**LifeGuard is the successor.** Same core idea — wearable hardware + cloud platform + open APIs + partner reseller model. But every dimension is upgraded to be the best in the world, not just "good enough for SA." Goal: be the **single vendor every security company, every lone-worker employer, every family, and every armed-response operator in 200+ countries turns to first.**

---

## 2. Strategy — why we win

LifeGuard's **defensible moats**, each individually unmatchable, and combining into a global winner:

### 2.1 Three-moat stack
1. **Hardware + Platform + Network** — no other consumer PERS owns the stack (Bay Alarm can't write firmware; Apple Watch can't dispatch to armed response). No other SaaS owns hardware (Everbridge can't fix a device in the field). LifeGuard ships the module, runs the cloud, and operates the dispatch logic.
2. **Open API + Public SDK + Webhooks** — only MyLifeLine has this among consumer PERS; Everbridge has it but at enterprise contracts. We give it free at any tier.
3. **Operator-grade UX for control rooms** — security companies / estates / armed response have command-centre software from decades-old vendors. We give them a Linear-class console on day one.

### 2.2 Ten "we win here" claims (headline copy on the marketing site)

1. **"R39 wholesale per device per month."** No competing operator charges less than $14.99/mo USD. Bay Alarm = $27.95/mo + $99 device. Cartrack = R120/mo + hardware. AURA = R150/mo B2B. We price the enterprise floor at $2.50 USD per seat per month.
2. **"4G LTE-M + NB-IoT + Wi-Fi positioning + GPS + Bluetooth indoor."** Apple Watch fall = PSAP only. Life Alert = landline or cellular, no GPS. Tunstall = UK-2G SIM (literally being phased out of UK operators). Module works on every band globally.
3. **"Medical-grade HR, HRV, SpO₂, fall detection, skin temperature, G-force."** Apple Watch does some of these. *No dedicated PERS does HRV (the gold-standard for cardiac event prediction) and skin temperature (early infection detection).*
4. **"3-second 5-contact parallel SMS fan-out + nearest-responder geo-routing."** AURA claims 30 seconds. Bay Alarm has no concept of nearest-responder. We hit five phones in three seconds with the device GPS as the canonical position. The operator sees a fanout timeline.
5. **"AI triage: 1,000 noise alerts → 5 real emergencies."** Falsified SOS presses are 60-80% of consumer PERS volume. We run a 7-signal classifier (button press pattern, motion preceding, G-force, HR spike, ambient sound, prior history, location delta) and present only the red-marked ones to the operator.
6. **"Open REST API + Webhooks + Postman collection + SDK."** Free, public, with no rate-limit below 1M events/month. Bay Alarm has no API. Apple Watch has no API. Everbridge's API is gated behind $100k/year enterprise contracts.
7. **"Linear-class control-room console in your browser. No install. No server."** Compare to SICURNET, Bold Gemini, Mimic, SIS integrations that are 2010s Windows desktops.
8. **"White-label reseller at 20% retail markup."** Bay Alarm and Tunstall don't resell. Appello UK charges per-ARC licensing fees. AURA forces you onto their app. LifeGuard is yours: domain, name, logo, app, console — all of it. *Reseller markup stays with the reseller.*
9. **"Global first-party carrier coverage in 195 countries."** Cartrack works in 38 countries. Tunstall has 38 country offices but the device is UK/regional. LifeGuard's MVNO agreements + 4G LTE-M roaming mean a device bought in Joburg works in Tokyo with zero reconfiguration.
10. **"24-month hardware warranty + free device swap for life with active subscription."** Life Alert = 3 months. Bay Alarm = lifetime on subscription (fine), but no proactive swap on failure. We detect hardware degradation in firmware, ship a replacement before it breaks.

### 2.3 Five "we don't" hedges (be honest in marketing)
- We **don't** build fall detection better than Apple Watch (we license Apple's algorithms)
- We **don't** dispatch trained paramedics (we connect you to local EMS — Netcare 911 SA, ER24, or national 112/911)
- We **don't** compete in hospital-grade telemetry (>50 sensors). Wearable focus.
- We **don't** build HR monitoring for athletes (Fitbit / Garmin own that)
- We **don't** pretend sub-second response in countries without 4G. Where 2G remains, we degrade to 10s.

---

## 3. Personas & surfaces

We design for four primary users and three surfaces:

### 3.1 Personas

**Wearers**
- **Elderly** (65+, in their own home or with family): Need a button that just works, accurate fall detection, two-way voice, and family notifications. Caregiver app is the day-to-day touchpoint.
- **Lone workers** (estate agents, security guards, utility workers, healthcare home visits): Need discreet panic, durable hardware, hands-free escalation, evidence trail, employer liability coverage.
- **Women / at-risk individuals**: Need a panic that's *invisible*, immediate, and trusted by them to actually result in a real armed-response car rolling.
- **Patients with chronic conditions** (epilepsy, cardiac): Need heart-rate trigger thresholds, vitals export to physician, no false alarms causing disruption.
- **Kids**: GPS tracker + SOS. Different product (Junior Guardian), but platform is shared.
- **Pets**: Same module form-factor, GPS only. (Pet Tracker module SKU.)

**Family members / caregivers** (passive, daily checkers)
- Receive push notifications on every signal
- See vitals, location, last fall event, recent activity
- Can act as primary responder or secondary if professional monitoring is offline

**Operators** (control-room staff at security companies / armed response / estates)
- Live map of every customer, every device, every signal, every responder
- Triage queue of incoming alerts with AI score
- Two-way voice & chat with the device
- Automatic responder dispatch and ETA
- Audit trail per subscriber
- Bulk messaging & rolling broadcast (for industrial incident comms)

**Partner resellers** (B2B SaaS channel — security companies, retirement villages, fleet owners, brands)
- They consume our API + reseller dashboard
- They rebrand and resell to their own customers
- We bill them wholesale, they bill their customers retail
- They get a free CRM-lite for their own book of business

### 3.2 Three product surfaces

**Surface 1: Consumer — Family App** (Surface archetype: **Operate + Monitor**)
- Owner's primary view: list of devices (self, mom, dad, child, pet, lone-worker employee), each with a status card
- Caregiver App daily rituals: "All good" check, last fall, vitals sparkline, weekly summary email
- Settings: emergency contacts, response profile, escalation rules
- Calming visual — green is the dominant color, no anxiety-inducing reds except for genuine alerts
- **Optimised for:** an 70-year-old checking on their 90-year-old parent on a 5-inch phone

**Surface 2: Operator Console** (Surface archetype: **Monitor + Operate** — THE KILLER SCREEN)
- **Primary layout:** Three columns
  - **Left rail (narrow):** active dispatcher, status filters (Device, Watcher, Trigger), live audio toggle, day-stats counter
  - **Center (the map):** a real-time map of every customer + every dispatcher vehicle + every active incident + every alert annotation
  - **Right rail (the worklist):** the alert queue with AI score, the active incident panel, the resolved history
- **Hard rules:** glances in <2 seconds, one tap to ack, voice line auto-opens, no more than 8 controls per surface
- **Style:** Linear-grade dark mode, monospace numbers, dense, achievable, keyboard-first
- **Optimised for:** a security dispatcher handling 8-20 incidents/hour simultaneously

**Surface 3: Reseller Dashboard + Open API** (Surface archetype: **Operate + Configure + Compare**)
- Live book: signups, MRR, churn, devices in field, alerts/mo
- Plans editor (set your own retail price; choose bundle SKUs)
- Branded subdomain: `controlroom.citywatch.co.za` works in <5 minutes
- OpenAPI 3.1 docs live in-app: try-it console, OAuth flow, sample code in 6 languages, Postman collection
- **Optimised for:** a security company owner running 5-500 customers

### 3.3 One marketing site (Surface archetype: **Decide / Learn**)
- Hero: ten "we win" claims, single focused page
- Products: hardware stack (4 SKUs), platform features, open API
- For whom: 4 personas × tailored pitch blocks
- Pricing: 4 plans, transparent
- Trust: footprint by country, AAALARM-equivalent compliance badges, ISO 27001 / SOC2 status
- Docs entry, status page, dev sign-up
- **Optimised for:** a head of security at a university evaluating, and a daughter buying one for her father

---

## 4. Hardware stack (the real-life platform)

### 4.1 Devices (4 SKUs, all on the same SoC family so firmware is shared)

| SKU | Form | Connectivity | Sensors | Battery | Price (wholesale) | Price (MSRP) |
|---|---|---|---|---|---|---|
| **LifeBand G2** | Wristband (fitness-band form) | LTE-M / NB-IoT / Wi-Fi 5 / BT 5.3 / GPS | HR, HRV, SpO₂, skin temp, 9-axis IMU, fall, button | 7 days | $24 | $39 |
| **LifePendant P2** | Pendant / lanyard | LTE-M + GPS + BT indoor | Button + 9-axis IMU (fall) | 14 days standby, 6 hr active voice | $32 | $59 |
| **LifeCard C2** | Credit-card form factor for wallet | BT only (paired to phone) | Button | 6 months (coin cell) | $14 | $29 |
| **LifeClip CG2** | Discreet clip / watch add-on | LTE-M shared from phone or paired | Button + fall detect (subscribes to phone sensors) | 3 days | $22 | $44 |

All four SKUs share:
- **Same SIM profile** (eUICC, multi-IMSI)
- **Same firmware image** (LVGL UI, OTA update)
- **Same API contract** (every signal from every device uses the same JSON shape)
- **Same mobile-app protocol** (BLE GATT, encrypted, OTA)

### 4.2 Headline-1 stat for marketing site
- **"500mA·h battery, 9-axis IMU, LTE-M + GPS + Wi-Fi positioning + BT 5.3, IP67, in a 38g form factor."**

---

## 5. Platform features (the SaaS layer)

### 5.1 Always-on infrastructure
- **Global multi-region**: US-East, EU-West, AP-South, AF-South
- **Hardware ingest**: 4G → MQTT → TimescaleDB. Buffering, dedupe, replay
- **24-hour operator uptime** with 99.95 SLA (contractual)
- **End-to-end encryption** between device and console: AES-256 + TLS 1.3 + optional SIM-credential swap
- **GDPR + POPIA + HIPAA-ready** data model (every column tagged)

### 5.2 Core platform capabilities
1. **SOS fanout** — 3-second parallel SMS to up to 5 emergency contacts, with location and live-tracking link. Routed to the geographically nearest dispatcher if subscribed.
2. **AI triage** — 7-signal scoring on every alert. Low-score = silent parent app push. High-score = call operator, ready-to-dispatch incident.
3. **Voice line** — two-way cellular voice on the device, auto-opened on operator ack. Or auto-opened on a configurable threshold (HR > 130 sustained, fall detected, etc.)
4. **Live location streaming** — second-by-second GPS + Wi-Fi positioning during an active incident. Battery cost handled.
5. **Responder dispatch** — three modes:
   - **Family mode:** SMS to contacts only
   - **Operator mode:** subscriber's security company operator receives the incident; they dispatch
   - **Network mode:** nearest professional responder from our partner network (armed response, ambulance)
6. **Vitals history** — every device records HR / HRV / SpO₂ / skin temp / steps / sleep in 60s resolution. TimescaleDB-backed. Exportable as CSV/JSON via API or emailed weekly.
7. **Predictive fall risk** — beta. Looks at HRV trends over the trailing 30 days, alerts caregiver that fall risk may be elevated this week.
8. **Mass-broadcast for estates / campuses / operators** — push a notice to all devices in a defined geofence. One tap, 10,000 devices reached in 30 sec.
9. **Audit trail** — every action by every operator, every partner config change, every device firmware event is logged immutably for 7 years.
10. **Open platform** — REST API, Webhooks, GraphQL (v2 roadmap), WebSocket live-stream, OAuth 2.0, Postman, SDK in TypeScript / Python / Go / Java / C#.

### 5.3 Operator console specific
- **Live map** of all devices, color-coded by status (green = ok, amber = low battery / poor signal, red = SOS active, blue = operator en route, grey = offline >24h)
- **Live audio / chat** per active incident
- **Bulk actions** (acknowledge all similar alerts, send broadcast)
- **Shift handoff notes** at end of every shift
- **Search by subscriber** / device / address / area
- **Heatmap of alerts by area** over time (proactive patrol suggestion for armed response)

### 5.4 Reseller features
- **10 min onboarding** (Stripe-style) → branded subdomain live
- **Per-customer retail pricing** (you set the price; we bill you at wholesale)
- **Reseller dashboards** (live MRR, churn, top performers, alert volume)
- **Co-branded hardware option** (Fascia color + logo on devices ordered at 500+ MOQ)
- **Payout to local bank** (Stripe Connect-style, 190+ countries, USD/ZAR/GBP/EUR)
- **Sample API tenant** (sandbox that mirrors production, free forever for evaluation)

---

## 6. Pricing model (the conversion lever)

| Plan | Target | Pricing |
|---|---|---|
| **Consumer Direct** | Families & individuals | $19 / R349 / £15 device + $24.99/mo or £19.99/mo subscription includes everything: cellular, AI triage, family app, 3-contact SOS fanout. Optional $9.99/mo pro for medical-history export & predictive fall risk. |
| **Solo Pro** | Small security companies, lone-worker employers | $24.99 per worker per month + $24 per device. Includes operator console for one account, webhooks, API, 5-contact fanout. |
| **Operator** | Security companies, armed response, estates | $14.99 per seat per month (operator) + $2 per device-month platform fee. Includes console, dispatch logic, audit trail, mass broadcast, branded operator app. |
| **Network / Enterprise** | Multi-country, fleets, hospital systems, insurers | Custom — starts at $250k/yr, includes SLA, on-prem options, dedicated CSM, custom compliance. |

**Hardware margin target:** 25% MSRP / 35% at wholesale reseller markup = 50% blended. Cloud COGS target: <$1.20 per active device per month.

---

## 7. Brand & visual identity

### 7.1 Tone of voice
- **Confidence without smugness.** Stripe / Apple / Linear register.
- **Helpful, never salesy.** We're the operator's best friend and the family's reassurance.
- **No fearmongering.** Never show attacks or victims in distress. We're about protection, not threat.
- **No "AI!!!" hype.** AI triage is a feature, not a banner.
- **Honest about limitations.** "Doesn't work without 4G." "Doesn't work in countries we haven't licensed." Trust signal.

### 7.2 Visual identity in three rules
1. **Logo:** small wordmark + a circle (the dispatcher pulse). Color teal #06b6a4.
2. **Color:** trust blue #1d4ed8 for primary; safety teal #06b6a4 for accent; warm-cool neutral palette #fafaf9 + #1f2937 text. NEVER a tech-purple default — operators hate it.
3. **Type:** Inter (Inter Variable with `cv01, ss03` enabled). Mono: JetBrains Mono.
4. **Imagery:** real photographers, not stock. Real families, real dispatchers, real devices in context. No smashed-glass-victim stock.

### 7.3 Two design systems used side-by-side

| Surface | Inspired by | Why |
|---|---|---|
| Marketing site (lifeguard.com) | **Stripe** | Premium financial trust. Stripe's "developer API + beautiful typography" tone matches an "enterprise-grade API + wearable-grade hardware" pitch. |
| Operator console & API dashboard | **Linear** | "Dark mode, dense, keyboard-first, glances in 2 sec." Operators live in this surface — it has to be the best, not the prettiest. |
| Family app | **iOS HIG + Stripe Cards** | Calm, white, generous tap targets, mono-sparse for vitals — wearable companions usually look like a sneaker ad. We look like a healthcare-grade OS. |

### 7.4 Tokens (Stripe-style for marketing, Linear-style for console)

**Marketing (Stripe-inspired):**
- Bg `#ffffff` → `#fafafb`. Headings `#0a1628` (deep navy, not black). Body `#475569`. Accent `#1d4ed8` (trust blue). Secondary accent `#06b6a4` (teal). CTA hover `#1e40af`.
- Type: Inter Variable, weight 300 for display, weight 400 for body, weight 510 for nav/UI. Tabular numerics for any table.
- Shadows: blue-tinted (Stripe formula), `rgba(29,78,216,0.18)` far shadow + `rgba(0,0,0,0.08)` near shadow.

**Console (Linear-inspired):**
- Bg `#0a0b0d` panel / `#0f1114` surface / `#191c20` raised. Text `#e6e9ef` / `#a1a8b3` / `#6b7280`. Accent `#06b6a4`. Hover `#0d9488`. Borders `rgba(255,255,255,0.06)` / `rgba(255,255,255,0.10)`.
- Type: Inter Variable with `cv01, ss03`. Numbers in JetBrains Mono. Tabular numerics.
- Shadows: minimal; elevation via luminance stepping + 1px ring shadows.

**Family App (Calm white):**
- Bg `#fafaf9` (warm white). Surface `#ffffff`. Ink `#1f2937`. Muted `#6b7280`. Accent (active) `#06b6a4`. Alert `#dc2626` only when needed.
- Type: SF Pro Text on iOS, Inter Web elsewhere. Weight 400 default. Large 17px body for aging eyes. 17×2-line tap targets (44px+) throughout.

---

## 8. Non-negotiable design rules (anti-slop)

- ❌ No fake metrics, fake testimonials, "trusted by" tiles unless real
- ❌ No center-stack hero on operator console (it's a Monitor surface, not Decide)
- ❌ No glassmorphism on console — it's a 2-second-glance surface
- ❌ No emoji in UI — only in customer-facing marketing copy if at all
- ❌ No feature-tile grid of "icon + heading + sentence × 3" — every surface needs a real composition
- ❌ No fake dashboards in marketing screenshots — render from real seed data
- ❌ No gradient blob backgrounds anywhere (life-safety + gradients = no)
- ❌ No "AI" banner without an actual feature

---

## 9. Phasing (what we ship in this build)

**Now (this build, scope target):** three surfaces, one stack
1. Marketing site (Stripe-inspired): public landing, product, for-whom, pricing, trust, API
2. Family app (calm white): wearer/family view of devices, vitals, contacts, history
3. Operator console (Linear-inspired dark): the killer screen — live map, queue, incidents
4. Reseller dashboard (Linear light): MRR, plans, devices, branding
5. SQL schema (Postgres, Supabase-ready)
6. Seed data (so consoles have realistic content)
7. Documentation for the dev to extend

**Next session (out of scope today):**
- Real device firmware integration
- Real WebSocket push from MQTT ingest
- Real OAuth + Stripe Connect
- Real international expansion (compliance, MVNO agreements)

---

## 10. What success looks like

When we look at this in 6 months, the bar is:
- The marketing site looks like a vendor a Fortune 500 would evaluate
- The console makes an armed-response operator say *"where was this 5 years ago?"*
- The reseller dashboard makes a small security company in Cape Town say *"if they're this good on software, I don't need to build anything myself"*
- The family app makes a 70-year-old in Stockholm say *"I just open it and I know my mother is fine"*
- The codebase is clean enough that a new engineer ships a feature in week 1

These are the constraints. Build accordingly.
