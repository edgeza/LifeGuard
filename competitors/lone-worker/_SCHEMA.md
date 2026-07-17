# Lone-Worker / Enterprise Safety Competitor Schema

Each individual competitor profile uses this schema. Profiles are stored as `NN-<slug>.md` (zero-padded index) inside this `lone-worker/` directory. All data points marked ⚠️ indicate estimates or partial verification and should be re-checked before quoting in client-facing material.

The lone-worker / enterprise-safety segment is B2B-leaning (employer pays, employee wears). Where the PERS/united-states schema was senior-consumer-centric, this schema is **operator-centric**: it covers devices, monitoring centres, alert-management platforms, and mass-notification systems used by organisations to protect field employees, utility crews, healthcare home-workers, social workers, security guards, hotel staff, drivers, and similar at-risk populations.

## File header (frontmatter-style block)

```
# <Competitor Name>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial data
> **Last updated:** 2026-07-17
> **Country:** <HQ country> / <operating region>
> **Primary segment:** lone-worker device | lone-worker SaaS/app | mass-notification + employee safety | campus/area monitoring | gas detection + safety | duress/PERS-for-workers
> **Profile scope:** Global | UK | North America | Europe | APAC | AU/NZ | Country-specific
```

## Schema fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `Headquarters` | string | yes | City, country |
| `Founded` | year | yes | Company-wide founding year |
| `Ownership` | enum | yes | Independent / Public / Private equity / Subsidiary of <parent> / Government |
| `Parent group` | string | no | Empty if independent |
| `Active deployments / users` | string | no | Number of devices, seats, or customers (where disclosed) |
| `Monitoring centre` | string | yes | "Owned UL-listed/TMA-Five-Diamond", "EN 50518 Alarm Receiving Centre (ARC)", "Customer self-monitors", "In-house 24/7 SOC", or "App + 999/911" |
| `Coverage area` | string | yes | Country list or "Global" |
| `Languages supported` | string | yes | "English", "EN/FR/DE/ES", etc. |
| `Core products` | list | yes | Lone-worker device, smartphone app, mass-notification, gas detector, area monitor, panic-button hardware, body-worn camera, etc. |
| `Form factors` | list | yes | Discrete pendant, ID badge, smartphone app, body-worn camera, smartphone + Bluetooth button, gas-detector + safety, etc. |
| `Fall / impact detection` | string | yes | "Yes (IMU)", "Yes via smartphone only", "No (panic button only)" |
| `GPS tracking` | bool | yes | Yes/No |
| `Indoor location` | string | yes | "Beacons", "Wi-Fi fingerprinting", "Cell-tower triangulation", "No indoor", "Bluetooth" |
| `Satellite / off-grid` | bool | no | Yes (Iridium/Garmin inReach) / No |
| `Cellular / network connectivity` | string | yes | 4G LTE, 5G, Wi-Fi + SMS, app-only, etc. |
| `Gas detection` | bool | no | Yes/No (Blackline, Honeywell, Dräger style) |
| `Two-way voice` | bool | yes | Yes/No (panic button with voice to operator) |
| `Push-to-talk (walkie-talkie)` | bool | no | Yes/No (Blackline, Sonim) |
| `Mass-notification module` | bool | no | Yes/No (AlertMedia, Everbridge, Singlewire) |
| `Manager / dispatcher console` | bool | yes | Yes/No (web console for safety managers) |
| `API & integrations` | string | yes | "REST API, SSO (SAML/OIDC), Microsoft Teams, Slack, ServiceNow, Zapier" — many B2B buyers require this |
| `Pricing (entry)` | string | yes | Lowest per-device or per-user monthly plan in local currency; "Quote-only" if not posted |
| `Pricing (top)` | string | no | Highest tier monthly / per-device / enterprise |
| `Equipment cost` | string | yes | Included / lease / outright purchase price range |
| `Activation / setup fee` | string | yes | Yes/No + amount |
| `Contract length` | enum | yes | Month-to-month / 1-year / 2-year / 3-year / 4-year (Blackline AWS IoT) |
| `Distribution model` | string | yes | Direct-to-employer / reseller / OEM / white-label / marketplace (AWS IoT) |
| `White-label / partner programme` | string | no | Critical for MyLifeLine opportunity — "Yes via ___" or "No" |
| `Regulatory / certifications` | string | yes | BS 8484, EN 50518, UL 827, TMA Five-Diamond, Cyber Essentials Plus, ISO 27001, SOC 2 Type II, BS 5972 (alarm receiving centre) |
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
2. **Pricing in original currency + USD where possible** — most UK/AU vendors quote in £/AUD. Note the conversion date.
3. **Monitor location matters.** UK BS 8484 / EN 50518 ARC accreditation is a procurement requirement for UK police response — flag whether the vendor self-monitors or uses a partner ARC.
4. **"Lone-worker app" vs "dedicated device"** are different products — SoloProtect, StaySafe, and Ok Alone sell both. Be explicit which is which.
5. **Mass-notification platforms (AlertMedia, Everbridge, Singlewire, Alertus)** are not pure lone-worker plays but compete for the same enterprise safety budget. Treat as partial overlap with MyLifeLine.
6. **Gas-detection vendors (Blackline, Industrial Scientific, Honeywell)** play in adjacent segments; flag when the lone-worker product is a secondary SKU.
7. **Avoid marketing tone** in the Strengths/Weaknesses sections — keep them comparative and procurement-relevant.
8. **White-label is the central MyLifeLine angle** — for every vendor, note whether their product can be resold or re-branded by a third party, since that is the dominant B2B distribution model in this segment.