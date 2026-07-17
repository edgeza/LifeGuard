// Reseller Dashboard seed — Lorem-marked metrics (anti-slop §8).
// Numbers below are explicitly lorem; real dashboards bind to live queries.

export const org = {
  name: "CityWatch Cape Town",
  domain: "controlroom.citywatch.co.za",
  plan: "Reseller · Scale",
  region: "South Africa",
  seats: 12,
  created: "2025-11-04",
  apiKey: "sk_live_••••••••••••3f2c",
};

// Lorem-marked: replace with live query in production.
export const kpis = {
  mrr:        { value: 184_320, currency: "ZAR", deltaPct:  8.4 },
  devices:    { value: 1_412,   deltaPct: 3.1 },
  signups:    { value: 92,      deltaPct: -2.7, note: "this month" },
  churn:      { value: 1.8,     unit: "%", deltaPct: -0.3 },
  alerts:     { value: 7_204,   note: "last 30 days" },
  arr:        { value: 2_211_840, currency: "ZAR" },
};

export const signupSeries = [
  12, 14, 11, 18, 22, 19, 24, 27, 25, 28, 31, 29, 33, 35, 31, 38, 41, 39, 44, 47, 42, 46, 49, 51, 48, 53, 57, 55, 60, 64, 62, 67, 71, 74, 78, 82, 86, 89, 92,
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: "Consumer Direct" | "Solo Pro" | "Operator";
  devices: number;
  mrr: number;
  region: string;
  status: "active" | "past_due" | "trialing" | "churned";
  started: string;
  alerts30d: number;
}

export const customers: Customer[] = [
  { id: "cus_001", name: "Sarah Nkosi",      email: "sarah@example.com",     plan: "Consumer Direct", devices: 4,  mrr:  349, region: "ZA · WC", status: "active",    started: "2025-12-04", alerts30d: 1 },
  { id: "cus_002", name: "Pieter van Wyk",   email: "pieter@example.com",    plan: "Consumer Direct", devices: 2,  mrr:  349, region: "ZA · WC", status: "active",    started: "2026-01-18", alerts30d: 0 },
  { id: "cus_003", name: "Marlene Adams",    email: "marlene@example.com",   plan: "Consumer Direct", devices: 1,  mrr:  349, region: "ZA · WC", status: "active",    started: "2025-09-12", alerts30d: 2 },
  { id: "cus_004", name: "V&A Waterfront",   email: "ops@vawaterfront.co.za",plan: "Operator",        devices: 86, mrr: 1499, region: "ZA · WC", status: "active",    started: "2025-08-01", alerts30d: 31 },
  { id: "cus_005", name: "Sea Point NW",     email: "control@spnw.co.za",    plan: "Operator",        devices: 142,mrr: 2499, region: "ZA · WC", status: "active",    started: "2025-06-22", alerts30d: 47 },
  { id: "cus_006", name: "Estate Agents SA", email: "ops@easa.co.za",        plan: "Solo Pro",        devices: 24, mrr:  699, region: "ZA · WC", status: "trialing",  started: "2026-07-04", alerts30d: 0 },
  { id: "cus_007", name: "Greenpoint Mews",  email: "admin@gpmews.co.za",    plan: "Operator",        devices: 38, mrr:  899, region: "ZA · WC", status: "active",    started: "2025-11-29", alerts30d: 9 },
  { id: "cus_008", name: "Camps Bay Watch",  email: "watch@cbwatch.co.za",   plan: "Operator",        devices: 51, mrr:  999, region: "ZA · WC", status: "past_due",  started: "2025-07-10", alerts30d: 12 },
  { id: "cus_009", name: "Bishopscourt Vill",email: "ops@bvill.co.za",       plan: "Operator",        devices: 19, mrr:  699, region: "ZA · WC", status: "active",    started: "2026-02-14", alerts30d: 4 },
  { id: "cus_010", name: "Liesbeek Lodge",   email: "admin@liesbeek.co.za",  plan: "Consumer Direct", devices: 6,  mrr:  599, region: "ZA · WC", status: "churned",   started: "2025-04-08", alerts30d: 0 },
  { id: "cus_011", name: "Cape Union Mart",  email: "safety@cum.co.za",      plan: "Solo Pro",        devices: 64, mrr: 1899, region: "ZA · WC", status: "active",    started: "2025-10-19", alerts30d: 8 },
  { id: "cus_012", name: "Hout Bay Harbour", email: "ops@hbh.co.za",         plan: "Operator",        devices: 28, mrr:  799, region: "ZA · WC", status: "active",    started: "2025-12-30", alerts30d: 11 },
];

export const topCustomers = [...customers]
  .filter((c) => c.status === "active")
  .sort((a, b) => b.mrr - a.mrr)
  .slice(0, 5);

export interface FleetDevice {
  id: string;
  customerId: string;
  customer: string;
  model: "LifeBand G2" | "LifePendant P2" | "LifeCard C2" | "LifeClip CG2";
  firmware: string;
  battery: number;
  signal: "strong" | "fair" | "weak" | "offline";
  lastSeen: string;
  alerts7d: number;
  region: string;
}

export const fleet: FleetDevice[] = [
  { id: "dev_0001", customerId: "cus_004", customer: "V&A Waterfront",   model: "LifeBand G2",  firmware: "3.4.1", battery: 71, signal: "strong", lastSeen: "live",       alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0002", customerId: "cus_004", customer: "V&A Waterfront",   model: "LifePendant P2",firmware: "3.4.1",battery: 88, signal: "strong", lastSeen: "12 sec ago",  alerts7d: 1, region: "ZA · WC" },
  { id: "dev_0003", customerId: "cus_005", customer: "Sea Point NW",     model: "LifeBand G2",  firmware: "3.4.1", battery: 23, signal: "fair",   lastSeen: "2 min ago",   alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0004", customerId: "cus_005", customer: "Sea Point NW",     model: "LifeCard C2",  firmware: "3.4.0", battery: 14, signal: "weak",   lastSeen: "8 min ago",   alerts7d: 3, region: "ZA · WC" },
  { id: "dev_0005", customerId: "cus_005", customer: "Sea Point NW",     model: "LifeClip CG2", firmware: "3.4.1", battery: 92, signal: "strong", lastSeen: "live",       alerts7d: 2, region: "ZA · WC" },
  { id: "dev_0006", customerId: "cus_007", customer: "Greenpoint Mews",  model: "LifePendant P2",firmware: "3.4.1",battery: 64, signal: "strong", lastSeen: "live",       alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0007", customerId: "cus_011", customer: "Cape Union Mart",  model: "LifeBand G2",  firmware: "3.4.1", battery: 0,  signal: "offline",lastSeen: "26 hr ago",   alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0008", customerId: "cus_012", customer: "Hout Bay Harbour", model: "LifeBand G2",  firmware: "3.4.0", battery: 48, signal: "fair",   lastSeen: "live",       alerts7d: 1, region: "ZA · WC" },
  { id: "dev_0009", customerId: "cus_008", customer: "Camps Bay Watch",  model: "LifePendant P2",firmware: "3.3.9",battery: 38, signal: "fair",   lastSeen: "5 min ago",   alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0010", customerId: "cus_001", customer: "Sarah Nkosi",      model: "LifeBand G2",  firmware: "3.4.1", battery: 72, signal: "strong", lastSeen: "live",       alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0011", customerId: "cus_002", customer: "Pieter van Wyk",   model: "LifePendant P2",firmware: "3.4.1",battery: 84, signal: "strong", lastSeen: "live",       alerts7d: 0, region: "ZA · WC" },
  { id: "dev_0012", customerId: "cus_003", customer: "Marlene Adams",    model: "LifeBand G2",  firmware: "3.4.1", battery: 41, signal: "fair",   lastSeen: "2 min ago",   alerts7d: 2, region: "ZA · WC" },
];

export interface Plan {
  id: string;
  name: string;
  retail: number;
  wholesale: number;
  margin: number; // %
  active: number;
}

export const plans: Plan[] = [
  { id: "pl_consumer",  name: "Consumer Direct", retail: 349, wholesale: 199, margin: 43, active: 412 },
  { id: "pl_consumer_pro", name: "Consumer Direct · Pro", retail: 449, wholesale: 249, margin: 45, active: 188 },
  { id: "pl_solo_pro",  name: "Solo Pro",        retail: 599, wholesale: 399, margin: 33, active: 64 },
  { id: "pl_operator",  name: "Operator",        retail: 999, wholesale: 599, margin: 40, active: 9  },
];

export const bundles = [
  { sku: "LIFEBAND-G2",  name: "LifeBand G2",  wholesale: 432, retail: 699, moq: 100 },
  { sku: "LIFEPENDANT-P2", name: "LifePendant P2", wholesale: 575, retail: 1099, moq: 100 },
  { sku: "LIFECARD-C2", name: "LifeCard C2",  wholesale: 252, retail: 525, moq: 250 },
  { sku: "LIFECLIP-CG2", name: "LifeClip CG2", wholesale: 396, retail: 799, moq: 250 },
];

export const payouts = {
  balance:      { value: 184_320, currency: "ZAR" },
  pending:      { value: 12_840,  currency: "ZAR" },
  nextPayout:   { date: "2026-07-22", value: 84_120, currency: "ZAR" },
  bank:         { name: "First National Bank", account: "••••4421", branch: "Sea Point" },
  schedule:     "Weekly · Friday",
};

export const payoutHistory = [
  { id: "po_001", date: "2026-07-15", value: 84_120, currency: "ZAR", status: "Paid",     ref: "FNB-2026-0715-118" },
  { id: "po_002", date: "2026-07-08", value: 76_310, currency: "ZAR", status: "Paid",     ref: "FNB-2026-0708-094" },
  { id: "po_003", date: "2026-07-01", value: 82_902, currency: "ZAR", status: "Paid",     ref: "FNB-2026-0701-077" },
  { id: "po_004", date: "2026-06-24", value: 79_011, currency: "ZAR", status: "Paid",     ref: "FNB-2026-0624-061" },
  { id: "po_005", date: "2026-06-17", value: 71_488, currency: "ZAR", status: "Paid",     ref: "FNB-2026-0617-044" },
  { id: "po_006", date: "2026-06-10", value: 68_122, currency: "ZAR", status: "Paid",     ref: "FNB-2026-0610-029" },
];

export const team = [
  { id: "u1", name: "Lerato Khumalo",  email: "lerato@citywatch.co.za",   role: "Owner",          lastActive: "live" },
  { id: "u2", name: "Sipho Dlamini",   email: "sipho@citywatch.co.za",    role: "Admin",          lastActive: "2 min ago" },
  { id: "u3", name: "Anika Pillay",    email: "anika@citywatch.co.za",    role: "Dispatcher",     lastActive: "live" },
  { id: "u4", name: "Johan Botha",     email: "johan@citywatch.co.za",    role: "Dispatcher",     lastActive: "12 min ago" },
  { id: "u5", name: "Thandi Maseko",   email: "thandi@citywatch.co.za",   role: "Billing",        lastActive: "1 hr ago" },
  { id: "u6", name: "Wesley Adams",    email: "wesley@citywatch.co.za",   role: "Read-only",      lastActive: "yesterday" },
];

export const auditLog = [
  { ts: "2026-07-17 09:14", actor: "lerato@", action: "Updated retail price on Consumer Direct · Pro", target: "plan:pl_consumer_pro" },
  { ts: "2026-07-17 08:42", actor: "sipho@",  action: "Bulk-acked 14 alerts in queue",                  target: "queue:incidents" },
  { ts: "2026-07-16 22:08", actor: "anika@",  action: "Added new responder Sea Point NW",                target: "fleet:dev_0005" },
  { ts: "2026-07-16 14:31", actor: "system",  action: "Payout scheduled · ZAR 84,120",                  target: "payouts:po_001" },
  { ts: "2026-07-16 11:02", actor: "thandi@", action: "Sent broadcast notice to 412 devices",           target: "broadcast:b_2026-0716-11" },
  { ts: "2026-07-15 09:00", actor: "system",  action: "Weekly summary email sent to all customers",      target: "email:weekly" },
];

export const apiEndpoints = [
  { method: "GET",  path: "/v1/devices",                summary: "List all devices on your reseller account" },
  { method: "GET",  path: "/v1/devices/{device_id}",    summary: "Retrieve a single device" },
  { method: "POST", path: "/v1/devices",                summary: "Provision a new device" },
  { method: "POST", path: "/v1/devices/{device_id}/ota",summary: "Push an OTA firmware update" },
  { method: "GET",  path: "/v1/customers",              summary: "List customers (paginated)" },
  { method: "POST", path: "/v1/customers",              summary: "Create a customer" },
  { method: "GET",  path: "/v1/incidents",              summary: "List incidents in the last 30 days" },
  { method: "POST", path: "/v1/incidents/{id}/ack",     summary: "Acknowledge an incident" },
  { method: "GET",  path: "/v1/vitals/{device_id}",     summary: "Stream vitals (HR, HRV, SpO₂) from TimescaleDB" },
  { method: "POST", path: "/v1/broadcasts",             summary: "Push a notice to a geofence" },
  { method: "GET",  path: "/v1/payouts",                summary: "List payouts and balance" },
  { method: "POST", path: "/v1/webhooks",               summary: "Register a webhook for incident events" },
];
