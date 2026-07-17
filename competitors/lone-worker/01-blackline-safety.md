# Blackline Safety

> **Verification flag:** ✅ verified across multiple sources
> **Last updated:** 2026-07-17
> **Country:** Canada (HQ Calgary, AB) / Global
> **Primary segment:** Connected lone-worker device + gas detection (vertical integrator)
> **Profile scope:** Global — North America, UK, EU, Australia, NZ

## Company snapshot

| Field | Value |
| --- | --- |
| Headquarters | 1215 13th Street SE, Calgary, Alberta, Canada |
| Founded | 2004 (Cody Slater + team) |
| Ownership | Public company on TSX: BLN (formerly TSX Venture) |
| Parent group | None — independent |
| Active deployments / users | Not publicly disclosed; thousands of enterprise customers across oil & gas, utilities, construction, hospitality; G7 device volumes estimated in the high-tens-of-thousands ⚠️ single-source |
| Monitoring centre | Owned, in-house Safety Operations Center (SOC) at Calgary HQ — Five-Diamond CSAA-certified operators; <60-second answer time on live alerts; 99% answered in <60 seconds |
| Coverage area | Global (cellular + Iridium satellite uplink via G7x; data-centres on AWS) |
| Languages supported | English (primary); French, German, Spanish support via partner operations |
| Regulatory / certifications | SOC 2 Type II, ISO 27001, UL 913 Class I Div 1 (intrinsically safe for hazardous locations), IECEx/ATEX on selected devices, Five-Diamond CSAA |

## Product lineup

- **G7c Lone Worker** — wearable with integrated 4G/5G cellular, GPS, fall detection, no-motion, SOS latch, two-way voice (optional), push-to-talk (optional). Up to 20 swappable gas-sensor cartridges (single-gas → multi-gas → pump). Price ~$33/mo USD entry, scaling with monitoring + voice + PTT add-ons.
- **G7x Lone Worker** — adds Iridium satellite uplink via the G7 Bridge portable unit for remote/offshore work.
- **G8 Lone Worker** — launched January 2026 as the next-generation wearable, replacing G7 for new deployments.
- **EXO Area Monitor** — drop-and-go cloud-connected area gas monitor with 2G/3G/4G + satellite; gamma-radiation variant EXO Gamma; ~$180/mo USD list.
- **Blackline Live** — SaaS portal + analytics for fleet, zones, compliance reporting.
- **Blackline Live Monitoring** — optional 24/7 live-agent monitoring add-on to any G7 plan.

## Commercial terms

| Field | Value |
| --- | --- |
| Fall / impact detection | Yes — IMU-based on all G7/G8 wearables |
| GPS tracking | Yes |
| Indoor location | GPS + Wi-Fi fingerprinting; EXO provides automatic zone awareness |
| Satellite / off-grid | Yes — Iridium on G7x + G7 Bridge |
| Cellular connectivity | 4G LTE (5G on G8); multi-carrier SIMs; unlimited data included in subscription |
| Gas detection | Yes — up to 20 sensor types across single-gas, multi-gas, multi-gas pump |
| Two-way voice | Yes (optional add-on, $396 over 36 months via AWS Marketplace listing) |
| Push-to-talk | Yes (optional add-on) |
| Mass-notification module | Limited — Blackline Live supports targeted team alerts but not enterprise-wide mass notification |
| Manager / dispatcher console | Yes — Blackline Live (web + iOS/Android responder apps) |
| API & integrations | REST API; SCADA/PLC integrations via partners; AWS IoT listing for procurement |
| Pricing (entry) | ~$33/mo USD per device, lone-worker SaaS only (no live monitoring); AWS IoT listing shows $1,512 / 36-month term (~$42/mo) for the SaaS licence plus the wearable |
| Pricing (top) | ~$213/mo CAD per device for G7 + live monitoring + voice + PTT; ~$180/mo USD for EXO area monitor; enterprise SKUs quoted |
| Equipment cost | Wearable included free in subscription terms longer than 36 months; hardware outright ~£738-£810 GBP for G7c + multi-gas cartridge (UK reseller price) |
| Activation / setup fee | No setup fee published; minimum 36-month contract on AWS listing |
| Contract length | 36 months (AWS Marketplace), 48 months (custom offers), multi-year for enterprise |
| Distribution model | Direct enterprise sales; AWS Marketplace IoT listing; reseller network (Gas Monitor Point UK) |
| White-label / partner programme | No public white-label programme; AWS IoT re-sell is the closest equivalent |

## Differentiation

Blackline Safety is the only vendor in this dossier that combines a certified **lone-worker wearable** with **integrated multi-gas detection** under one cloud platform — every other player here is either a pure lone-worker vendor or a pure gas-detection vendor. The result is the strongest single SKU in the segment for hazardous-environment industries (oil & gas, mining, utilities, telecom tower crews), and the Five-Diamond in-house SOC is rare in this category.

## Strengths

- ✅ **Vertical integration.** Same device, same portal, same SOC covers lone worker + gas + area monitoring + radiation — no third-party ARC required.
- ✅ **Five-Diamond CSAA monitoring centre.** SOC agents are empowered to escalate to local emergency services, bypassing 999/911 queues where jurisdictions allow.
- ✅ **Hardware futureproof.** Swappable gas cartridges and firmware updates let a G7 evolve from no-gas to multi-gas pump without buying new devices.
- ✅ **Iridium satellite option.** G7x + G7 Bridge is the most credible off-grid solution short of a dedicated satellite messenger.
- ✅ **Public-company transparency.** TSX-listed financials, audited SOC 2 Type II + ISO 27001.
- ✅ **AWS Marketplace listing.** Reduces procurement friction for cloud-first enterprises and government buyers.

## Weaknesses / gaps

- ❌ **Premium pricing.** $33-$213/device/month is 3-10× a pure app like The Sentry or Ok Alone; price-sensitive SMB and charity segments are priced out.
- ❌ **Hardware-led sales cycle.** Minimum 36-month commitment on the AWS IoT listing; not a fit for short-term contractors or seasonal workforces.
- ❌ **Not a true mass-notification platform.** Lacks SMS/voice blast to non-device users, so customers still buy AlertMedia/Everbridge for enterprise-wide alerts.
- ❌ **No hospitality/retail play.** TraknProtect (panic buttons + room-level location) and SHEQSY (mobile-only app) are better fits for indoor high-turnover workforces.
- ❌ **Gas-detection overhead.** For organisations without hazardous-atmosphere exposure, paying for swappable gas sensors is overkill.

## MyLifeLine opportunity

- **Multi-tenant white-label ARC.** MyLifeLine can wrap Blackline-grade monitoring (Five-Diamond equivalent) for SMB customers that Blackline's pricing excludes — keep Blackline as the upper anchor and undercut on 1-50-seat deals.
- **App-first parity for low-risk roles.** Blackline cannot economically protect office-based lone workers (HR caseworkers, reception) at <$10/mo; MyLifeLine's app-first product can own that adjacent seat pool.
- **Cross-sell mass notification.** Blackline customers frequently ask "and how do I alert everyone in the building?" — bundle MyLifeLine mass-notification module as the integrated answer.

## Sources

- https://www.blacklinesafety.com/solutions/services/pricing-plans
- https://www.blacklinesafety.com/solutions/lone-worker/g7-lone-worker
- https://aws.amazon.com/marketplace/pp/prodview-wc7ixanpjyw3g
- https://gasmonitor-point.co.uk/portable-gas-detectors/connected-gas-detectors/blackline-g7-exo-area-monitor-lel-o2-co-h2s/
- https://www.blacklinesafety.com/solutions/personal-gas-detection/g7-single-gas

---
*Research compiled for the MyLifeLine competitor dossier.*
*Last refreshed: 2026-07-17 · Sources reviewed against public web materials.*
*Fields marked ⚠️ are single-source and require re-verification before citing.*