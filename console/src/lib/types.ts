export type DeviceStatus = "ok" | "sos" | "fall_detected" | "low_battery" | "en_route" | "offline";
export type Watcher = "family" | "operator" | "family+operator";
export type DeviceKind = "LifeBand G2" | "LifePendant P2" | "LifeCard C2" | "LifeClip CG2";

export interface Device {
  id: string;
  kind: DeviceKind;
  wearer: string;
  age: number;
  address: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
  battery: number | null;
  signal: number;
  last_seen_min: number;
  watcher: Watcher;
}

export type ResponderStatus = "available" | "dispatched" | "on_scene" | "returning";

export interface Responder {
  id: string;
  callsign: string;
  crew: string[];
  vehicle: string;
  zone: string;
  lat: number;
  lng: number;
  status: ResponderStatus;
  eta_min: number | null;
  incidents_handled_today: number;
}

export type IncidentStatus = "open" | "acknowledged" | "on_scene" | "resolved";

export interface TimelineEvent {
  t: string;
  type: "signal" | "triage" | "fanout" | "ack" | "voice" | "dispatch" | "scene" | "resolve";
  text: string;
}

export interface ContactNotified {
  name: string;
  channel: "sms" | "voice" | "push";
  ack: boolean;
}

export interface Incident {
  id: string;
  opened_at: string;
  device_id: string;
  wearer: string;
  address: string;
  trigger: string;
  ai_score: number;
  ai_signals: string[];
  status: IncidentStatus;
  acked_by: string | null;
  acked_at: string | null;
  voice_session: "voice_active" | "voice_standby" | null;
  responder_dispatched: string | null;
  responder_eta_min: number | null;
  contacts_notified: ContactNotified[];
  timeline: TimelineEvent[];
}

export interface Subscriber {
  id: string;
  name: string;
  age: number;
  address: string;
  lat: number;
  lng: number;
  plan: string;
  since: string;
  devices: number;
  open_incidents: number;
  primary_contact: string;
  vitals: { hr: number | null; hrv: number | null; spo2: number | null; skin_temp_c: number | null };
}

export interface ShiftStaff {
  name: string;
  role: string;
  callsign: string;
  on_call_min: number;
  incidents_handled: number;
}

export interface Shift {
  id: string;
  kind: "day" | "night";
  starts: string;
  ends: string;
  active_staff: ShiftStaff[];
}

export interface HandoffNote {
  id: string;
  from_shift: string;
  to_shift: string;
  from: string;
  to: string;
  at: string;
  body: string;
}

export interface AuditEvent {
  id: string;
  ts: string;
  actor: string;
  action: string;
  subject: string;
  ip: string;
  hash: string;
}

export interface Broadcast {
  id: string;
  queued_at: string;
  queued_by: string;
  geofence: string;
  audience: string;
  channels: string[];
  subject: string;
  body: string;
  delivered: number;
  read: number;
  ack_required: boolean;
  status: "queued" | "delivered" | "failed";
}

export interface Stats {
  subscribers_total: number;
  subscribers_online: number;
  open_incidents: number;
  incidents_today: number;
  incidents_acked_in_30s_pct: number;
  responders_available: number;
  responders_dispatched: number;
  responders_on_scene: number;
  avg_response_min: number;
}

export interface ConsoleData {
  meta: { generated_at: string; region: string; operator: string; shift: string };
  devices: Device[];
  responders: Responder[];
  incidents: Incident[];
  subscribers: Subscriber[];
  shifts: Shift[];
  handoff_notes: HandoffNote[];
  audit: AuditEvent[];
  broadcasts: Broadcast[];
  stats: Stats;
}
