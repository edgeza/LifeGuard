# GPS Wearables & Panic Jewellery Competitor Schema

Each individual competitor profile in this directory uses the same category-specific schema. Profiles are stored as `NN-<slug>.md` (zero-padded index). Data marked ⚠️ is single-source, estimated, price-sensitive, or otherwise requires re-verification before external citation.

## File header

```markdown
# <Competitor / Product>

> **Verification flag:** ✅ verified across multiple sources | ⚠️ single-source or estimated | 🟡 partial / legacy product
> **Last updated:** 2026-07-17
> **Country:** <company/product origin>
> **Primary segment:** panic jewellery | GPS tracker | safety button | smartwatch SOS | kids/senior wearable
> **Profile scope:** <markets covered>
> **Product status:** Active | Legacy/discontinued | Status unclear
```

## Required sections and fields

### Company snapshot

| Field | Notes |
| --- | --- |
| Headquarters | Company city/country; use `Not publicly confirmed` if unavailable |
| Founded | Year, if verifiable |
| Ownership | Public/private and parent where relevant |
| Target users | Primary buyer and wearer |
| Core products | Main wearable/tracker relevant to this dossier |
| Coverage area | Market availability and/or service territory |
| Monitoring model | 24/7 professional monitoring, personal contacts, emergency services, or tracking-only |

### Product / commercial snapshot

| Field | Normalized values / notes |
| --- | --- |
| Form factor | Jewellery, clip, key fob, watch, pendant, portable tracker, vehicle tracker |
| SOS trigger | Button pattern, voice, app, automatic event |
| Location technology | GPS/GNSS, Wi-Fi positioning, cellular, Bluetooth only, phone-assisted |
| Cellular / phone dependency | Standalone cellular; phone-tethered; no cellular |
| Fall detection | Yes; optional; no / not advertised |
| Two-way voice | Yes; no; model-dependent |
| Caregiver / responder app | App or portal name and role |
| Hardware price | Public list price and currency; dated; `Not publicly listed` where absent |
| Subscription | Public monthly/annual plan; carrier plan where relevant |
| Battery | Claimed typical runtime where publicly documented |
| Water resistance | Rating/claim, or `Not publicly confirmed` |
| Contract / cancellation | Term if public; otherwise `Not publicly confirmed` |
| Distribution | D2C, retail, carrier, institutional, crowdfunding/legacy |

## Required analysis sections

1. **Differentiation** — one concise paragraph.
2. **Strengths** — 3–6 evidence-led bullets.
3. **Weaknesses / gaps** — 2–5 bullets, including phone/network constraints and product-status risk.
4. **MyLifeLine opportunity** — 2–4 concrete positioning or product implications.
5. **Sources** — durable primary URLs first, then independent/secondary verification.

## Status and evidence rules

- **Active** means the official company currently markets or supports the product.
- **Legacy/discontinued** means the official product/service has ended or reliable sources identify it as discontinued. Historical crowdfunding pages do not establish current availability.
- **Status unclear** is used where an official page is stale, sales availability cannot be confirmed, or a product appears only through resellers.
- A Bluetooth panic button that relies on a phone is **not** described as a GPS tracker; it may transmit the phone's location through its app.
- A consumer smartwatch feature that calls emergency services is **not** described as professional monitoring.
- Pricing must include currency and distinguish hardware, subscription, carrier service, and optional monitoring.
- Unknown fields remain explicitly unknown; do not infer them from category norms.

## Required footer

```markdown
---
*Research compiled for the MyLifeLine GPS wearables & panic jewellery competitor dossier.*
*Last refreshed: 2026-07-17 · Sources reviewed against public web materials.*
*Fields marked ⚠️ are single-source, volatile, or estimated — verify before citing.*
```
