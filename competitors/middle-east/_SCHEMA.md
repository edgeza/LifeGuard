# Middle East Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `middle-east/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** UAE (HQ) / GCC + wider MENA (operations) — adjust per profile
> **Primary segment:** senior PERS | medical-homeservice | telehealth-platform | emergency-response B2B | insurance-bundled health | government ambulance | lone-worker
> **Profile scope:** UAE | GCC (UAE/SAU/QAT/KWT/BHR/OMN) | Pan-MENA | Global
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, country (e.g. "Dubai, UAE") |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | Local-private / Family-owned / Public-company / State-owned / Government / Non-profit / Foreign-owned |
| `Parent group` | string | no | Empty if independent |
| `Subscribers / users` | string | no | E.g. "200,000+ patients/year" or "Not disclosed" |
| `Monitoring / dispatch centres` | string | yes | Owned/outsourced/partner-hospital; location(s); for platform plays "App-routed to ambulance partner" |
| `Coverage area` | string | yes | "UAE-only", "GCC", "Pan-MENA", "Global" |
| `Languages supported` | string | yes | "Arabic + English" is the baseline; "Arabic + English + Hindi + Urdu" common for expat-heavy markets |
| `Core products` | list | yes | Doctor-on-call, ambulance dispatch, home nursing, PERS pendant, mobile GPS, telehealth, wellness subscription, etc. |
| `Fall detection` | string | yes | "Yes (pendant)", "Optional +AED X/mo", "Included via Apple Watch", "Not a PERS product" |
| `GPS tracking` | bool | yes | Yes/No |
| `Cellular connectivity` | bool | yes | Required for mobile systems |
| `Caregiver / family app` | bool | yes | Yes/No |
| `Pricing (entry)` | string | yes | Lowest published monthly / per-visit / annual plan in AED or USD, or "Quote-only" / "Insurance-bundled" |
| `Pricing (top)` | string | no | Highest plan / per-incident cost |
| `Equipment cost` | string | yes | Included / one-time fee / device MSRP |
| `Activation / onboarding fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Pay-per-use, monthly, annual, corporate contract, none |
| `Distribution model` | string | yes | Direct-to-consumer, hospital/clinic referral, insurance-bundle, corporate HR, government, app-store |
| `Healthcare-network integration` | string | no | DHA/DOH/MOH licensing, hospital networks (NMC, Mediclinic, Saudi German, King's College, etc.), insurance partners (Daman, ADNIC, AXA, Bupa Global, Tawuniya) |
| `Regulatory / licensing` | string | no | DHA (Dubai Health Authority), DOH (Dept of Health Abu Dhabi), MOH (Saudi/MOHAP), QCHP, KDHH, etc. |
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
2. **Pricing in AED primary, USD secondary** — most UAE providers publish rates in AED; Saudi providers commonly publish in SAR; quote both when the source supports it. Date to visible website content.
3. **Quotes / counts** must have a source URL.
4. **Distinguish PERS vs. doctor-on-call vs. ambulance dispatch vs. telehealth.** The Middle East market is dominated by home-health and emergency-response companies that are NOT classical PERS providers. Flag accordingly and compare honestly.
5. **Licensing matters enormously.** DHA (Dubai), DOH (Abu Dhabi), MOH (Sharjah & northern emirates), MOH (Saudi), QCHP (Qatar), KDHH (Kuwait) are separate regulators. Multi-emirate companies must list each license.
6. **Government ambulance vs. private ambulance.** In the UAE and Saudi, the free emergency number (999 UAE, 997 KSA) dispatches government ambulances. Private companies (RP Medics, Life Guardian, etc.) operate fee-based non-emergency and inter-facility transport and compete with the government fleet on response time and care quality.
7. **Expat-heavy markets** mean multilingual support (Arabic + English + Hindi + Urdu + Filipino) is a competitive differentiator, not a baseline.
8. **Treat wellness apps (MobiHealth, Okadoc) as platform plays, not direct PERS competitors.** They provide telemedicine routing but lack 24/7 trained-care specialists that subscription PERS offers. Compare honestly.
9. **Avoid marketing tone** in Strengths/Weaknesses — keep them comparative.
10. **B2B plays (occupational health, oil & gas, aviation, government contracts)** are scored differently — they sell to corporate HR and government, not directly to consumers; competitive overlap with MyLifeLine (B2C-leaning) is partial.