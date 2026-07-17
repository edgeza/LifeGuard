// Family App seed data — dev-only mock content for the wearer/caregiver UI.
// Anti-slop note: numbers here are seed/placeholder content for development.
// They are NOT shown on any marketing-visible surface.

export type DeviceStatus = "ok" | "alert" | "warn" | "offline";
export type Relation = "self" | "mother" | "father" | "child" | "pet";

export interface Device {
  id: string;
  name: string;
  relation: Relation;
  age: number | null;
  device: string;
  deviceModel: "LifeBand G2" | "LifePendant P2" | "LifeCard C2" | "LifeClip CG2";
  battery: number;
  signal: "strong" | "fair" | "weak";
  status: DeviceStatus;
  city: string;
  lastSeen: string;
  hr: number;
  hrv: number;
  spo2: number;
  steps: number;
  sleepHrs: number;
  /** Trailing 30d HRV values (lower = more fall risk per brief §5.2.7). */
  hrvTrend: number[];
  /** Trailing 30d resting HR. */
  hrTrend: number[];
  /** Trailing 30d SpO2 %. */
  spo2Trend: number[];
  /** Trailing 7d steps. */
  stepsTrend: number[];
  /** Trailing 30d risk index 0-100. */
  fallRisk: number;
  fallRiskLabel: "Low" | "Moderate" | "Elevated";
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  primary: boolean;
}

export interface TimelineEvent {
  id: string;
  deviceId: string;
  ts: string;
  type: "fall" | "sos" | "low-battery" | "geofence" | "vitals" | "check-in" | "voice";
  title: string;
  detail: string;
  severity: "info" | "warn" | "alert";
}

export interface AlertReceipt {
  id: string;
  deviceId: string;
  triggeredAt: string;
  resolvedAt: string | null;
  type: "Fall detected" | "SOS press" | "Sustained HR > 130";
  triageScore: number; // 0-100
  locationLabel: string;
  contactsNotified: number;
  contactsAcked: number;
  responder: string;
  actions: { ts: string; actor: string; action: string }[];
}

export const devices: Device[] = [
  {
    id: "dev_self",
    name: "You",
    relation: "self",
    age: 41,
    device: "LifeBand G2",
    deviceModel: "LifeBand G2",
    battery: 72,
    signal: "strong",
    status: "ok",
    city: "Cape Town, ZA",
    lastSeen: "live",
    hr: 68,
    hrv: 54,
    spo2: 98,
    steps: 8420,
    sleepHrs: 7.4,
    hrvTrend: [50,52,49,53,55,54,52,53,55,54,53,54,55,54,53,54,55,54,53,54,55,54,53,54,55,54,53,54,55,54],
    hrTrend: [70,69,71,70,68,69,70,71,69,68,69,70,71,70,69,68,69,70,71,70,69,68,69,70,71,70,69,68,69,68],
    spo2Trend: [97,98,98,98,97,98,98,98,97,98,98,98,97,98,98,98,97,98,98,98,97,98,98,98,97,98,98,98,98,98],
    stepsTrend: [7100,8200,9000,6500,7800,9200,7100],
    fallRisk: 14,
    fallRiskLabel: "Low",
  },
  {
    id: "dev_mom",
    name: "Margaret",
    relation: "mother",
    age: 78,
    device: "LifeBand G2",
    deviceModel: "LifeBand G2",
    battery: 41,
    signal: "fair",
    status: "warn",
    city: "Cape Town, ZA · Sea Point",
    lastSeen: "2 min ago",
    hr: 74,
    hrv: 38,
    spo2: 96,
    steps: 2140,
    sleepHrs: 6.8,
    hrvTrend: [44,42,41,40,39,38,37,38,39,38,37,36,35,36,37,38,37,36,35,34,35,36,37,38,37,36,35,36,37,38],
    hrTrend: [70,71,72,73,72,73,74,75,74,73,74,75,76,75,74,73,74,75,76,75,74,73,74,75,76,75,74,73,74,74],
    spo2Trend: [97,97,96,96,97,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96,96],
    stepsTrend: [2800,2400,1900,2100,2200,2000,2140],
    fallRisk: 62,
    fallRiskLabel: "Elevated",
  },
  {
    id: "dev_dad",
    name: "Pieter",
    relation: "father",
    age: 82,
    device: "LifePendant P2",
    deviceModel: "LifePendant P2",
    battery: 84,
    signal: "strong",
    status: "ok",
    city: "Stellenbosch, ZA",
    lastSeen: "live",
    hr: 71,
    hrv: 44,
    spo2: 97,
    steps: 3120,
    sleepHrs: 7.1,
    hrvTrend: [42,43,42,44,45,44,43,44,45,44,43,44,45,44,43,44,45,44,43,44,45,44,43,44,45,44,43,44,45,44],
    hrTrend: [72,71,72,71,70,71,72,71,70,71,72,71,70,71,72,71,70,71,72,71,70,71,72,71,70,71,72,71,70,71],
    spo2Trend: [97,97,97,98,97,97,97,97,98,97,97,97,97,97,98,97,97,97,97,97,97,97,98,97,97,97,97,97,97,97],
    stepsTrend: [3000,2900,3300,3500,2800,3200,3120],
    fallRisk: 38,
    fallRiskLabel: "Moderate",
  },
  {
    id: "dev_child",
    name: "Lena",
    relation: "child",
    age: 9,
    device: "LifeClip CG2",
    deviceModel: "LifeClip CG2",
    battery: 88,
    signal: "strong",
    status: "ok",
    city: "Hout Bay · school",
    lastSeen: "live",
    hr: 92,
    hrv: 0, // not measured on CG2
    spo2: 0,
    steps: 11420,
    sleepHrs: 9.2,
    hrvTrend: Array(30).fill(0),
    hrTrend: Array(30).fill(92),
    spo2Trend: Array(30).fill(0),
    stepsTrend: [10200,12100,9800,11500,12300,11000,11420],
    fallRisk: 5,
    fallRiskLabel: "Low",
  },
];

export function getDevice(id: string): Device | undefined {
  return devices.find((d) => d.id === id);
}

export const contacts: EmergencyContact[] = [
  { id: "c1", name: "Sarah Nkosi",   relation: "Daughter",   phone: "+27 82 555 0181", primary: true  },
  { id: "c2", name: "Tom van Wyk",   relation: "Son",        phone: "+27 83 555 0144", primary: false },
  { id: "c3", name: "Dr. Mokoena",   relation: "Physician",  phone: "+27 21 555 0922", primary: false },
  { id: "c4", name: "ER24",          relation: "Ambulance",  phone: "084 124",         primary: false },
  { id: "c5", name: "Netcare 911",   relation: "Ambulance",  phone: "082 911",         primary: false },
];

export const timeline: TimelineEvent[] = [
  { id: "t1",  deviceId: "dev_mom", ts: "2026-07-17 08:42", type: "fall",      title: "Fall detected — auto-resolved",     detail: "Brief impact at bathroom; device resumed standing within 4s. No SOS pressed.",     severity: "warn"  },
  { id: "t2",  deviceId: "dev_mom", ts: "2026-07-17 07:10", type: "check-in",  title: "Morning check-in",                  detail: "Margaret tapped 'I'm OK' on the device. Heart rate 72 bpm.",                          severity: "info"  },
  { id: "t3",  deviceId: "dev_dad", ts: "2026-07-16 22:14", type: "vitals",    title: "HRV trend shift",                    detail: "7-day HRV dropped 8% vs. baseline. Fall risk badge updated to Moderate.",            severity: "info"  },
  { id: "t4",  deviceId: "dev_child", ts: "2026-07-16 14:05", type: "geofence", title: "Arrived · school",                 detail: "Lena entered Hout Bay International school geofence.",                              severity: "info"  },
  { id: "t5",  deviceId: "dev_mom", ts: "2026-07-16 09:21", type: "low-battery", title: "Battery below 50%",               detail: "LifeBand G2 at 41%. Drop on charger tonight.",                                       severity: "info"  },
  { id: "t6",  deviceId: "dev_dad", ts: "2026-07-15 18:30", type: "sos",       title: "SOS pressed — cancelled",          detail: "Pieter pressed the pendant; cancelled after 6s. No contact notified.",                severity: "warn"  },
  { id: "t7",  deviceId: "dev_self", ts: "2026-07-15 12:00", type: "voice",     title: "Voice line opened",                detail: "Quick test call to device; round-trip latency 2.1s.",                                severity: "info"  },
  { id: "t8",  deviceId: "dev_mom", ts: "2026-07-14 03:18", type: "vitals",    title: "Resting HR elevated overnight",    detail: "Sustained HR 88-92 bpm for 47 min while asleep. Worth a conversation with Dr. Mokoena.", severity: "warn" },
];

export const alerts: AlertReceipt[] = [
  {
    id: "a1",
    deviceId: "dev_mom",
    triggeredAt: "2026-07-17 08:42:14 SAST",
    resolvedAt: "2026-07-17 08:46:02 SAST",
    type: "Fall detected",
    triageScore: 41,
    locationLabel: "12 Marine Drive, Sea Point, Cape Town",
    contactsNotified: 5,
    contactsAcked: 2,
    responder: "Sea Point Neighbourhood Watch · en route",
    actions: [
      { ts: "08:42:14", actor: "device",     action: "Fall detected (G-force 0.85g, no recovery)" },
      { ts: "08:42:16", actor: "platform",   action: "AI triage score 41/100 (low-confidence fall, not a press)" },
      { ts: "08:42:17", actor: "platform",   action: "Voice line auto-opened to device" },
      { ts: "08:42:18", actor: "platform",   action: "Fanout → 5 emergency contacts (parallel SMS + WhatsApp)" },
      { ts: "08:42:24", actor: "Sarah",      action: "Acknowledged — driving to location" },
      { ts: "08:42:38", actor: "Netcare 911",action: "Acknowledged — ambulance dispatched (ETA 9 min)" },
      { ts: "08:44:50", actor: "device",     action: "Subject resumed standing; HR returned to 74 bpm" },
      { ts: "08:46:02", actor: "platform",   action: "Incident auto-resolved. Audit log saved." },
    ],
  },
];

export const user = {
  name: "Sarah Nkosi",
  email: "sarah@example.com",
  plan: "Consumer Direct · Pro",
  renewal: "2026-08-12",
  price: "$24.99 / mo",
  devices: 4,
  region: "South Africa",
};
