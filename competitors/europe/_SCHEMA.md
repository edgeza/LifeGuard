# Europe Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `europe/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** <HQ country> / <operating scope, e.g. DACH, EU-wide, Nordics, Benelux>
> **Primary segment:** senior PERS | lone worker | GPS wearable | integrated PERS+wearable | B2G/B2B ARC platform | OEM hardware | telco-integrated | smart-home enabled
> **Profile scope:** Country-only | EU-wide | DACH | Nordic | Benelux | Southern Europe | Global
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, country |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | EU-owned / Public-company-owned / Foreign-owned / Non-profit / Co-operative / PE-owned |
| `Parent group` | string | no | Empty if independent |
| `Subscribers / users` | string | no | E.g. "200,000+", "5m+ lives supported" |
| `Monitoring centres` | string | yes | "Owned/EN 50518-certified" plus location(s); for platform plays, "Partner-routed to local ARC" |
| `Coverage area` | string | yes | "Germany", "DACH", "Nordics", "EU-27", "Global" |
| `Languages supported` | string | yes | Native language + English, "Multi-language via interpreter", etc. |
| `Core products` | list | yes | In-home, mobile GPS, smartwatch, lone-worker device, voice assistant, smart-home hub, OEM module, etc. |
| `Fall detection` | string | yes | "Yes (pendant)", "Optional", "Included", "Not a PERS product" |
| `GPS tracking` | bool | yes | Yes/No |
| `Cellular connectivity` | bool | yes | Required for mobile systems |
| `Caregiver app` | bool | yes | Yes/No |
| `Pricing (entry)` | string | yes | Lowest monthly plan in EUR or local currency; "B2G/B2B pricing on request" |
| `Pricing (top)` | string | no | Highest monthly plan or equipment-only price |
| `Equipment cost` | string | yes | Included / one-time fee / device MSRP |
| `Activation fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Month-to-month, 1-year, 2-year, none |
| `Distribution model` | string | yes | Direct-to-consumer, retailer, telecom (DT/Proximus/Telefónica), B2B/healthcare-network, LA/municipality |
| `Healthcare-network integration` | string | no | Krankenkassen, NHS-equivalent, regional health authorities, hospitals |
| `Differentiation` | short paragraph | yes | One-sentence differentiator |
| `Strengths` | bullet list | yes | 3–6 bullets |
| `Weaknesses / gaps` | bullet list | yes | 2–5 bullets |
| `MyLifeLine opportunity` | bullet list | yes | 2–4 specific gaps a different entrant could exploit |
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
2. **Pricing is in EUR** unless otherwise noted (CHF/SEK/NOK/DKK where native); date the visible website content (most providers publish updated rates through 2026).
3. **Quotes / counts** must have a source URL.
4. **Country of HQ matters.** "EU-owned" / "Foreign-owned" must be supported — many iconic EU PERS brands are owned by US/UK parents (e.g. Lifeline NL = Connect America historically; Tunstall Group is PE-owned by Spanish-based C Capital).
5. **Monitor location matters.** A Germany-based hub with EN 50518 certification is different from monitoring routed through a smartphone / public PSAP (e.g. some smartwatch plays). Flag honestly.
6. **OEM hardware plays (Chiptech, Essence, TeleAlarm) are scored differently** — they sell to telecare service providers and operators, not directly to consumers; competitive overlap with MyLifeLine is partial but real (white-label SaaS is adjacent).
7. **Telco-integrated plays (DT, Proximus) are scored differently** — they bundle telecare into broadband/mobile contracts; competitive overlap is partial.
8. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative.