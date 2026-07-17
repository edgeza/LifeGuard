# Latin America Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `latin-america/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** Mexico | Brazil | Argentina | Chile | Colombia | (other LATAM)
> **Primary segment:** senior PERS | lone worker | GPS wearable | integrated PERS+wearable | emergency response | telemedicine + panic button
> **Profile scope:** Country-only | Multi-country LATAM
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, state/province |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | Local-owned / Public-company-owned / Foreign-owned / Non-profit / Government / Co-operative |
| `Parent group` | string | no | Empty if independent |
| `Subscribers / users` | string | no | E.g. "200,000+" |
| `Monitoring centres` | string | yes | "Owned/ULC-certified/Five-Diamond" plus location(s) |
| `Coverage area` | string | yes | "Country-wide", specific regions, "rural + remote", etc. |
| `Languages supported` | string | yes | "Spanish, Portuguese", etc. |
| `Core products` | list | yes | In-home, mobile GPS, smartwatch, lone-worker device, etc. |
| `Fall detection` | string | yes | "Yes (pendant)", "Optional", "Included" |
| `GPS tracking` | bool | yes | Yes/No |
| `Cellular connectivity` | bool | yes | Required for mobile systems |
| `Caregiver app` | bool | yes | Yes/No |
| `Pricing (entry)` | string | yes | Lowest monthly plan in local currency (MXN/BRL/ARS/CLP/COP) |
| `Pricing (top)` | string | no | Highest monthly plan in local currency |
| `Equipment cost` | string | yes | Included / one-time fee / financed |
| `Activation fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Month-to-month, 1-year, 2-year, none |
| `Distribution model` | string | yes | Direct-to-consumer, retailer, healthcare-network, dealer, insurance-bundled |
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
2. **Pricing is in local currency** (MXN, BRL, ARS, CLP, COP) unless otherwise noted, and dated to the visible website content (most providers publish updated rates through 2026).
3. **Quotes / counts** must have a source URL.
4. **Monitor location matters.** Country-local monitoring ≠ monitoring that is "done anywhere" — call out the distinction explicitly.
5. **Currency notes:** Argentina pricing often quoted in USD due to inflation ("precio en dólares") — call out explicitly. Brazil uses BRL and PIX-payment compatibility is a major factor. Mexico uses MXN.
6. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative.

## Regional context notes

- **Government emergency numbers** (911 Mexico, 192 SAMU Brazil, 107 SAME Argentina, 131 Chile, 125 Colombia) are not direct competitors but provide a baseline of free emergency response that paid services must differentiate against.
- **Insurance bundling** is significant in Brazil (Operadoras de saúde) and Argentina (Prepagas). Many personal-emergency services are sold as add-ons to health-insurance plans.
- **Multi-language support** is generally not a differentiator in LATAM (Spanish or Portuguese dominance) but is critical for the cross-border / expat retiree segment in Mexico.
