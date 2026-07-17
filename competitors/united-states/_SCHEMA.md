# United States Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `united-states/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** United States (HQ) / North America (operations)
> **Primary segment:** senior PERS | smartwatch-EOS | lone worker | senior-living B2B | consumer-electronics platform
> **Profile scope:** US-only | North America | Global
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, state |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | US-owned / Public-company-owned / Foreign-owned / Non-profit / Co-operative |
| `Parent group` | string | no | Empty if independent |
| `Subscribers / users` | string | no | E.g. "300,000+", Apple Watch installed base not given |
| `Monitoring centres` | string | yes | "Owned/UL-listed/TMA-Five-Diamond" plus location(s); for platform plays, "Apple-routed to PSAP" |
| `Coverage area` | string | yes | "US-only", "All 50 states", "North America", "Global" |
| `Languages supported` | string | yes | "English", "English + Spanish", "200+ via interpreter", etc. |
| `Core products` | list | yes | In-home, mobile GPS, smartwatch, lone-worker device, voice assistant, etc. |
| `Fall detection` | string | yes | "Yes (pendant)", "Optional +$10/mo", "Included via Apple Watch SE/Series 4+", "Not a PERS product" |
| `GPS tracking` | bool | yes | Yes/No |
| `Cellular connectivity` | bool | yes | Required for mobile systems |
| `Caregiver app` | bool | yes | Yes/No |
| `Pricing (entry)` | string | yes | Lowest monthly plan in USD, including "Free with Apple Watch" or "Not applicable" |
| `Pricing (top)` | string | no | Highest monthly or equipment-only price in USD |
| `Equipment cost` | string | yes | Included / one-time fee / device MSRP |
| `Activation fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Month-to-month, 1-year, 2-year, none, Apple Care+ optional |
| `Distribution model` | string | yes | Direct-to-consumer, retailer (Best Buy), telecom, app-store, B2B/healthcare-network |
| `Healthcare-network integration` | string | no | Hospitals, VA, Medicare Advantage plans, senior-living operators |
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
2. **Pricing is in USD** and dated to the visible website content (most providers publish updated rates through 2026).
3. **Quotes / counts** must have a source URL.
4. **"US-owned" / "Foreign-owned"** must be supported — many iconic US PERS brands are now owned by Connect America (Philadelphia), Best Buy (Lively), or Royal Philips-invested Connect America.
5. **Monitor location matters.** "US-based monitoring centre" is different from "monitoring routed through a smartphone / PSAP" (Apple / Samsung fall into the latter category and must be flagged).
6. **Treat smartwatches (Apple, Samsung) as platform plays, not direct PERS competitors.** They provide the underlying hardware + emergency-call routing but lack 24/7 trained-care specialists that subscription PERS offers. Compare honestly.
7. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative.
8. **B2B plays (Vayyar, Inspiren) are scored differently** — they sell to senior-living operators and Medicare Advantage plans, not directly to consumers; competitive overlap with MyLifeLine (B2C-leaning) is partial.
