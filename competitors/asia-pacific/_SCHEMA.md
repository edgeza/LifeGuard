# Asia-Pacific Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `asia-pacific/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** <HQ country> / <operating scope, e.g. APAC-wide, ASEAN, ANZ, East Asia, South Asia>
> **Primary segment:** senior PERS | lone worker | GPS wearable | integrated PERS+wearable | security-company PERS | hospital/health-insurer PERS | OEM hardware | government/community PERS
> **Profile scope:** Country-only | APAC | ASEAN | ANZ | East Asia | South Asia | Global
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, country |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | Locally-owned / Public-company-owned / Foreign-owned / Non-profit / Government-linked / Co-operative / KEIRETSU-affiliated |
| `Parent group` | string | no | Empty if independent |
| `Subscribers / users` | string | no | E.g. "200,000+", "10m+ contracts" |
| `Monitoring centres` | string | yes | "Owned/TS-/-certified" plus location(s); for platform plays "Partner-routed to local ARC"; for security companies "Owned GSOC/control room" |
| `Coverage area` | string | yes | "Australia-wide", "Pan-India", "APAC", etc. |
| `Languages supported` | string | yes | "English, Mandarin, Cantonese", "200+ via interpreter", etc. |
| `Core products` | list | yes | In-home, mobile GPS, smartwatch, lone-worker device, smartphone-panic, hospital/insurer plan, security-panic, concierge service, etc. |
| `Fall detection` | string | yes | "Yes (pendant)", "Optional", "Included", "Not a PERS product" |
| `GPS tracking` | bool | yes | Yes/No |
| `Cellular connectivity` | bool | yes | Required for mobile systems |
| `Caregiver app` | bool | yes | Yes/No |
| `Pricing (entry)` | string | yes | Lowest monthly plan in local currency; "Bundled with insurance/security contract"; "B2B pricing on request" |
| `Pricing (top)` | string | no | Highest monthly plan or equipment-only price |
| `Equipment cost` | string | yes | Included / one-time fee / device MSRP / leased |
| `Activation fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Month-to-month, 1-year, 2-year, none |
| `Distribution model` | string | yes | Direct-to-consumer, retailer, telecom (Singtel/SoftBank/Jio), security-company subscription, hospital/insurer bundled, government programme, B2B SaaS |
| `Healthcare-network integration` | string | no | Hospitals, community programmes, insurers, government health schemes |
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
2. **Pricing is in local currency** (AUD/NZD/SGD/JPY/INR/CNY/MYR/IDR/PHP/THB/VND) unless otherwise noted; date the visible website content (most providers publish updated rates through 2026).
3. **Quotes / counts** must have a source URL.
4. **Local vs foreign-owned claim must be supported** — many iconic APAC PERS brands are owned by global parents (e.g. Philips Lifeline SG = Connect America; MePACS is a non-profit public health service; SECOM/ALSOK are keiretsu security conglomerates).
5. **Monitor location matters.** In APAC, many D2C operators route monitoring to a single metropolitan centre (Tokyo, Singapore, Sydney, Melbourne); flag honestly if the response centre is in a different country.
6. **Security-company plays (SECOM, ALSOK, ADT-Australia) are scored differently** — they bundle PERS into a 5-year home-security contract; competitive overlap with pure-play PERS is partial but real.
7. **Hospital/government/non-profit plays (MePACS, St John NZ, NHGP-SG, Silver Chain/RDNS AU) are scored differently** — they are subsidised by public health funding or charity; D2C cross-sell is harder.
8. **Smartphone-only / OEM app plays (Mi SOS, OPPO SOS, Apple Watch Asia) are scored differently** — they route to 911/112 or smartphone contacts, not a trained-care specialist centre.
9. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative.
