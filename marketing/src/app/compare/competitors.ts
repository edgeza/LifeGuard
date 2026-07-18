/**
 * Shared comparison data. Used by /compare/[slug]/page.tsx.
 * Same data shape for every competitor — make a new file in /compare/<slug>/page.tsx
 * that imports this and renders the shared layout.
 */

export type Competitor = {
  slug: string;            // "bay-alarm-medical"
  name: string;
  shortName: string;       // "Bay Alarm"
  category: "Medical alert" | "Lone-worker" | "EU telecare" | "Smartwatch" | "Security-app";
  hq: string;
  founded: number;
  pricing: string;          // human-readable summary
  devices: { sku: string; type: string; msrp: string }[];
  connectivity: string[];
  api: "none" | "gated" | "open";
  openApi: boolean;
  fallback: "cellular" | "landline" | "phone-only";
  fanout: string;
  console: "web" | "windows" | "ios-only" | "none";
  whiteLabel: boolean;
  cellData: "included" | "extra";
  compliance: string[];
  sourceLinks: { label: string; href: string }[];
};

export const lifeguard = {
  name: "LifeGuard",
  pricing: "From $9.99/device/month retail · $2.50 wholesale at 10k+",
  devices: [
    { sku: "LifeBand G2",    type: "Wristband",       msrp: "$39" },
    { sku: "LifePendant P2", type: "Pendant / lanyard", msrp: "$59" },
    { sku: "LifeClip CG2",   type: "Clip",            msrp: "$44" },
  ],
  connectivity: ["4G LTE-M", "NB-IoT", "GPS", "Wi-Fi 5", "Bluetooth 5.3 indoor"],
  api: "open" as const,
  openApi: true,
  fanout: "Target: 3 s · 5 phones in parallel",
  console: "web" as const,
  whiteLabel: true,
  cellData: "included" as const,
  compliance: ["ISO 27001", "SOC 2 (in audit)", "GDPR", "POPIA"],
  monthlyIncludes: [
    ["Cellular data",        "Included"],
    ["SMS fanout",            "5 contacts"],
    ["Two-way voice",         "On every device"],
    ["Operator console",      "Browser-based, no install"],
    ["Public REST API",       "100k events/month included"],
    ["Webhooks",              "Unlimited, signed"],
    ["White-label",           "Yes — domain, console, app"],
    ["Source code",           "Open SDKs in 6 languages"],
  ],
};

export const competitors: Competitor[] = [
  {
    slug: "bay-alarm-medical",
    name: "Bay Alarm Medical",
    shortName: "Bay Alarm",
    category: "Medical alert",
    hq: "Pacheco, CA, USA",
    founded: 1947,
    pricing: "$27.95/month + $99 device (per their public page)",
    devices: [
      { sku: "SOS Mobile + GPS", type: "Pendant with cellular", msrp: "$99" },
      { sku: "SOS Home",         type: "In-home base station",   msrp: "$99" },
    ],
    connectivity: ["AT&T 4G LTE (US)", "GPS"],
    api: "none",
    openApi: false,
    fallback: "phone-only",
    fanout: "Phone tree — no parallel fanout; GPS pin delivered as SMS",
    console: "none",
    whiteLabel: false,
    cellData: "extra",
    compliance: ["FCC Part 15", "UL 1637"],
    sourceLinks: [
      { label: "Bay Alarm pricing page", href: "https://www.bayalarmmedical.com/" },
    ],
  },
  {
    slug: "tunstall-telecare",
    name: "Tunstall Healthcare",
    shortName: "Tunstall",
    category: "EU telecare",
    hq: "Whitley Bridge, UK",
    founded: 1957,
    pricing: "Per-ARC licensing, gated sales channel",
    devices: [
      { sku: "MyAmie pendant",     type: "Pendant (433 MHz UK band)",   msrp: "£99" },
      { sku: "Lifeline Vi+",        type: "In-home hub",                  msrp: "£149" },
    ],
    connectivity: ["433 MHz UK short-range", "2G cellular (UK)", "Landline"],
    api: "gated",
    openApi: false,
    fallback: "landline",
    fanout: "Single-digit-second to one monitoring centre; no public API",
    console: "windows",
    whiteLabel: false,
    cellData: "extra",
    compliance: ["CE", "UKCA"],
    sourceLinks: [
      { label: "Tunstall product range", href: "https://www.tunstall.co.uk/" },
    ],
  },
  {
    slug: "aura-security",
    name: "AURA",
    shortName: "AURA",
    category: "Security-app",
    hq: "Johannesburg, ZA",
    founded: 2015,
    pricing: "R150/month B2B · consumer app R99/month",
    devices: [
      { sku: "AURA mobile app",     type: "Phone-only (no hardware)",   msrp: "—" },
      { sku: "AURA Bluetooth panic", type: "BT button (paired to phone)", msrp: "R499" },
    ],
    connectivity: ["Phone (iOS/Android)", "BT 5 to paired phone"],
    api: "gated",
    openApi: false,
    fallback: "phone-only",
    fanout: "Reportedly 30 s to the call-centre",
    console: "ios-only",
    whiteLabel: false,
    cellData: "extra",
    compliance: ["POPIA"],
    sourceLinks: [
      { label: "AURA Holdings investor site", href: "https://auraholdings.co.za/" },
    ],
  },
  {
    slug: "apple-watch-caregivers",
    name: "Apple Watch · Caregiver flow",
    shortName: "Apple Watch",
    category: "Smartwatch",
    hq: "Cupertino, CA, USA",
    founded: 2015,
    pricing: "$249+ hardware · $10/month carrier · optional cellular",
    devices: [
      { sku: "Apple Watch Series 10", type: "Smartwatch", msrp: "$399" },
    ],
    connectivity: ["Cellular (carrier)", "Wi-Fi", "BT"],
    api: "none",
    openApi: false,
    fallback: "phone-only",
    fanout: "Fall detection → 911 (PSAP) only · no family fanout, no operator console",
    console: "ios-only",
    whiteLabel: false,
    cellData: "extra",
    compliance: ["FCC", "FDA Class II (ECG only)"],
    sourceLinks: [
      { label: "Apple Watch fall detection docs", href: "https://support.apple.com/guide/watch/apd4e4eb79b3/web" },
    ],
  },
];

export function competitorBySlug(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}
