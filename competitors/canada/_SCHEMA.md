# Canada Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `canada/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** Canada
> **Primary segment:** senior PERS | lone worker | GPS wearable | integrated PERS+wearable
> **Profile scope:** Canada-only | North America
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, province |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | Canadian-owned / Public-company-owned / Foreign-owned / Non-profit / Co-operative |
| `Parent group` | string | no | Empty if independent |
| `Subscribers / users` | string | no | E.g. "200,000+" |
| `Monitoring centres` | string | yes | "Owned/ULC-certified/Five-Diamond" plus location(s) |
| `Coverage area` | string | yes | "Canada-wide", specific provinces, "rural + remote", etc. |
| `Languages supported` | string | yes | "English, French", "200+ languages", etc. |
| `Core products` | list | yes | In-home, mobile GPS, smartwatch, lone-worker device, etc. |
| `Fall detection` | string | yes | "Yes (pendant)", "Optional", "Included" |
| `GPS tracking` | bool | yes | Yes/No |
| `Cellular connectivity` | bool | yes | Required for mobile systems |
| `Caregiver app` | bool | yes | Yes/No |
| `Pricing (entry)` | string | yes | Lowest monthly plan in CAD |
| `Pricing (top)` | string | no | Highest monthly plan in CAD |
| `Equipment cost` | string | yes | Included / one-time fee / financed |
| `Activation fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Month-to-month, 1-year, 2-year, none |
| `Distribution model` | string | yes | Direct-to-consumer, retailer, healthcare-network, dealer |
| `Healthcare-network integration` | string | no | Hospitals or community programs that refer/fulfil |
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
2. **Pricing is in CAD unless otherwise noted**, and dated to the visible website content (most providers publish updated rates through 2026).
3. **Quotes / counts** must have a source URL.
4. **"Canadian-owned"** claim must be supported — many providers on the first SERP are US-owned (e.g. Lifeline = Connect America; SureSafe = UK).
5. **Monitor location matters.** Canadian monitoring ≠ monitoring that is "done anywhere" — call out the distinction explicitly.
6. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative.
