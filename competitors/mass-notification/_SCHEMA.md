# Mass Notification / Critical Event Management (CEM) Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `mass-notification/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** <HQ country>
> **Primary segment:** mass-notification enterprise | CEM platform | K-12/higher-ed safety | lone-worker alerting | campus / public-safety alerting | govt / fed / DoD
> **Profile scope:** Global | North America | US-only
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, state / country |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | US-owned / Public-company-owned / Foreign-owned / Private-equity-owned / Subsidiary |
| `Parent group` | string | no | Empty if independent (e.g., Everbridge is NASDAQ: EVBG; Motorola Solutions owns several) |
| `Customers / orgs` | string | yes | Org-count claim, e.g. "7,000+ global organizations", "50M+ users" |
| `Channels (multi-modal)` | list | yes | SMS, voice, email, push, desktop, sirens, digital signage, PA, IPAWS/WEA, Slack/Teams, IoT sensors, panic-button hardware |
| `Coverage area` | string | yes | "Global", "North America + EU", "US Federal + State" |
| `Languages supported` | string | yes | "100+", "English + Spanish", etc. |
| `Core products` | list | yes | Mass notification, CEM, risk intelligence, travel risk, incident management, panic buttons, lock-down, etc. |
| `IPAWS/WEA / federal integration` | string | yes | IPAWS-OPEN, WEA, FEMA-integrated, None |
| `Two-way comms / confirm-ack` | bool | yes | Yes/No — recipient must acknowledge receipt |
| `Threat intelligence / situational awareness` | bool | yes | Yes/No — Dataminr-style risk feed integration |
| `Mobile panic-button hardware` | bool | yes | Yes/No — branded wearables/pendants |
| `Pricing model` | string | yes | Per-seat, per-user, per-message, enterprise license, SaaS subscription tier |
| `Pricing (entry)` | string | no | Lowest published tier (USD) or "Enterprise quote-only" |
| `Pricing (top)` | string | no | Top tier or "Enterprise (six-figure+ ACV)" |
| `Contract length` | enum | yes | Annual, multi-year, perpetual licence, SaaS month-to-month |
| `Distribution model` | string | yes | Direct enterprise sales, channel partners, GSA Schedule, education resellers |
| `Key verticals` | list | yes | Higher-ed, K-12, Fortune 500, healthcare, federal/state/local govt, manufacturing, energy |
| `Differentiation` | short paragraph | yes | One-sentence differentiator |
| `Strengths` | bullet list | yes | 3–6 bullets |
| `Weaknesses / gaps` | bullet list | yes | 2–5 bullets |
| `MyLifeLine opportunity` | bullet list | yes | 2–4 specific gaps a personal-safety entrant could exploit |
| `Sources` | URL list | yes | All web sources used to populate fields |

## File footer (required on every competitor file)

```
---
*Research compiled for the MyLifeLine competitor dossier.*
*Last refreshed: 2026-07-17 · Sources reviewed against public web materials.*
*Fields marked ⚠️ are single-source and require re-verification before citing.*
```

## Quality rules

1. **No fabricated data.** If a field is unknown, write "Unknown (no public source)" instead of inventing.
2. **Pricing is in USD** where stated and dated to the visible website content (most providers are quote-only; "enterprise quote-only" is acceptable).
3. **Quotes / org counts** must have a source URL.
4. **Acquisitions matter.** Motorola Solutions acquired Rave Mobile Safety (2023), BlackBerry AtHoc folded into Crisis24 (2022), Singlewire spun out of JAMF (2024 sale), etc. — flag ownership carefully.
5. **CEM ≠ mass-notification alone.** Modern CEM combines mass-notification + risk intelligence + travel risk + incident management + collaboration (Slack/Teams). Some vendors are pure mass-notification (Alertus, Singlewire) and should be flagged as such.
6. **Government / federal vs commercial** posture differs — IPAWS/WEA integration is a hard enterprise requirement for many state/local govt buyers; flag this clearly.
7. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative.
8. **MyLifeLine relevance is the lens.** Mass-notification CEM is *adjacent* to MyLifeLine's personal-safety positioning; many of these vendors target enterprise safety teams, not individuals. Where there is overlap (panic-button hardware, lone-worker alerts, family/employee safety apps) flag the opportunity.