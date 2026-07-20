import { randomUUID } from 'node:crypto';
import { db } from '../../db';

export interface Tenant { id: string; name: string; created_at: number; }
export interface User { id: string; tenant_id: string; email: string; password_hash: string; name: string; role: 'caregiver' | 'operator' | 'admin'; created_at: number; }
export interface CareReceiver { id: string; tenant_id: string; name: string; conditions: string | null; interests: string | null; timezone: string; created_at: number; }
export interface Agent { id: string; tenant_id: string; care_receiver_id: string; name: string; email: string; personality: string; system_prompt: string | null; created_at: number; }
export interface Medication { id: string; care_receiver_id: string; name: string; dosage: string; schedule: string; start_date: number | null; end_date: number | null; refills_remaining: number; active: number; }
export interface Appointment { id: string; care_receiver_id: string; title: string; scheduled_for: number; location: string | null; transport: string | null; state: 'scheduled' | 'confirmed' | 'completed' | 'missed'; }
export interface ChatMessage { id: string; agent_id: string; sender_type: 'caregiver' | 'care_receiver' | 'bot'; sender_id: string | null; content: string; skill_calls: string | null; created_at: number; }
export interface AdherenceEvent { id: string; medication_id: string; scheduled_for: number; confirmed_at: number | null; confirmation_source: string | null; status: 'pending' | 'confirmed' | 'missed' | 'late'; }
export interface Escalation { id: string; agent_id: string; triggered_at: number; reason: string; state: 'open' | 'acknowledged' | 'resolved'; acknowledged_by: string | null; resolved_at: number | null; }
export interface Vital { id: number; care_receiver_id: string; metric: string; value: number; recorded_at: number; }
export interface OutboundMessage { id: string; agent_id: string; channel: 'sms' | 'voice' | 'email'; to_address: string; body: string; sent_at: number; }
export interface WeeklyDigest { id: string; agent_id: string; week_start: number; body: string; sent_at: number; }

export type Role = User['role'];

type AppointmentPatch = Partial<Pick<Appointment, 'title' | 'scheduled_for' | 'location' | 'transport' | 'state'>>;
type AdherencePatch = Partial<Pick<AdherenceEvent, 'scheduled_for' | 'confirmed_at' | 'confirmation_source' | 'status'>>;
type EscalationPatch = Partial<Pick<Escalation, 'reason' | 'state' | 'acknowledged_by' | 'resolved_at'>>;

let activeTenantId: string | null = null;

db.function('current_tenant', () => activeTenantId);

/**
 * Runs a synchronous query callback inside a tenant scope. Tenant-owned
 * helpers use SQLite's current_tenant() function in every read/write join,
 * so an ID from another family cannot escape its tenant boundary.
 */
export function withTenant<T>(query: (tenantId: string) => T, tenantId: string): T {
  if (!tenantId || !db.prepare('SELECT 1 FROM tenants WHERE id = ?').get(tenantId)) {
    throw new Error('Invalid tenant');
  }
  if (activeTenantId && activeTenantId !== tenantId) {
    throw new Error('Cannot switch tenant inside an active tenant scope');
  }
  const previousTenantId = activeTenantId;
  activeTenantId = tenantId;
  try {
    return query(tenantId);
  } finally {
    activeTenantId = previousTenantId;
  }
}

/**
 * Sets the active tenant for the current synchronous call frame.
 * Call this from API routes BEFORE running any tenant-scoped queries.
 * Returns a restore function to put the previous tenant back.
 */
export function setActiveTenant(tenantId: string | null): () => void {
  const previous = activeTenantId;
  activeTenantId = tenantId;
  return () => { activeTenantId = previous; };
}

/**
 * Returns the currently active tenant id, or null if none is active.
 */
export function getActiveTenant(): string | null {
  return activeTenantId;
}

function one<T>(sql: string, ...params: unknown[]): T | undefined {
  return db.prepare(sql).get(...params) as T | undefined;
}

function all<T>(sql: string, ...params: unknown[]): T[] {
  return db.prepare(sql).all(...params) as T[];
}

function assertTenantResource(table: 'care_receivers' | 'agents', id: string, tenantId: string): void {
  const row = one<{ id: string }>(`SELECT id FROM ${table} WHERE id = ? AND tenant_id = ?`, id, tenantId);
  if (!row) throw new Error(`${table === 'care_receivers' ? 'Care receiver' : 'Agent'} not found for tenant`);
}

export const db_users = {
  findByEmail: (email: string): User | undefined =>
    one<User>('SELECT * FROM users WHERE email = ?', email.trim().toLowerCase()),

  findById: (id: string): User | undefined =>
    one<User>('SELECT * FROM users WHERE id = ?', id),

  create: (input: { tenantId: string; email: string; passwordHash: string; name: string; role: Role }): User => {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO users (id, tenant_id, email, password_hash, name, role)
      SELECT ?, id, ?, ?, ?, ? FROM tenants WHERE id = ?
    `).run(id, input.email.trim().toLowerCase(), input.passwordHash, input.name, input.role, input.tenantId);
    const user = one<User>('SELECT * FROM users WHERE id = ? AND tenant_id = ?', id, input.tenantId);
    if (!user) throw new Error('Unable to create user for tenant');
    return user;
  },
};

export const db_tenants = {
  findById: (id: string): Tenant | undefined => one<Tenant>('SELECT * FROM tenants WHERE id = ?', id),

  create: (input: { id?: string; name: string }): Tenant => {
    const id = input.id ?? randomUUID();
    db.prepare('INSERT INTO tenants (id, name) VALUES (?, ?)').run(id, input.name);
    return one<Tenant>('SELECT * FROM tenants WHERE id = ?', id)!;
  },
};

export const db_careReceivers = {
  findById: (id: string): CareReceiver | undefined =>
    one<CareReceiver>('SELECT * FROM care_receivers WHERE id = ?', id),

  listForUser: (userId: string): CareReceiver[] => all<CareReceiver>(`
    SELECT cr.*
    FROM care_receivers cr
    JOIN caregiver_links cl ON cl.care_receiver_id = cr.id
    JOIN users u ON u.id = cl.user_id AND u.tenant_id = cr.tenant_id
    WHERE cl.user_id = ? AND cr.tenant_id = u.tenant_id
    ORDER BY cr.created_at, cr.name
  `, userId),

  create: (input: { id?: string; tenantId: string; name: string; conditions?: string | null; interests?: string | null; timezone?: string }): CareReceiver => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO care_receivers (id, tenant_id, name, conditions, interests, timezone)
      SELECT ?, id, ?, ?, ?, ? FROM tenants WHERE id = ?
    `).run(id, input.name, input.conditions ?? null, input.interests ?? null, input.timezone ?? 'Africa/Johannesburg', input.tenantId);
    const receiver = one<CareReceiver>('SELECT * FROM care_receivers WHERE id = ? AND tenant_id = ?', id, input.tenantId);
    if (!receiver) throw new Error('Unable to create care receiver for tenant');
    return receiver;
  },
};

export const db_agents = {
  findById: (id: string): Agent | undefined => one<Agent>('SELECT * FROM agents WHERE id = ?', id),

  findByCareReceiver: (careReceiverId: string): Agent | undefined => one<Agent>(`
    SELECT a.* FROM agents a
    JOIN care_receivers cr ON cr.id = a.care_receiver_id AND cr.tenant_id = a.tenant_id
    WHERE a.care_receiver_id = ? AND a.tenant_id = cr.tenant_id
  `, careReceiverId),

  create: (input: { id?: string; tenantId: string; careReceiverId: string; name: string; email: string; personality?: string; systemPrompt?: string | null }): Agent => {
    assertTenantResource('care_receivers', input.careReceiverId, input.tenantId);
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO agents (id, tenant_id, care_receiver_id, name, email, personality, system_prompt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, input.tenantId, input.careReceiverId, input.name, input.email.trim().toLowerCase(), input.personality ?? 'pragmatic', input.systemPrompt ?? null);
    return one<Agent>('SELECT * FROM agents WHERE id = ? AND tenant_id = ?', id, input.tenantId)!;
  },
};

export const db_caregiverLinks = {
  link: (userId: string, careReceiverId: string): void => {
    const result = db.prepare(`
      INSERT OR IGNORE INTO caregiver_links (user_id, care_receiver_id)
      SELECT u.id, cr.id FROM users u
      JOIN care_receivers cr ON cr.id = ? AND cr.tenant_id = u.tenant_id
      WHERE u.id = ? AND u.tenant_id = cr.tenant_id
    `).run(careReceiverId, userId);
    if (result.changes === 0 && !one('SELECT 1 FROM caregiver_links WHERE user_id = ? AND care_receiver_id = ?', userId, careReceiverId)) {
      throw new Error('User and care receiver must belong to the same tenant');
    }
  },

  unlink: (userId: string, careReceiverId: string): void => {
    db.prepare(`
      DELETE FROM caregiver_links
      WHERE user_id = ? AND care_receiver_id = ?
        AND EXISTS (
          SELECT 1 FROM users u JOIN care_receivers cr ON cr.id = caregiver_links.care_receiver_id
          WHERE u.id = caregiver_links.user_id AND u.tenant_id = cr.tenant_id
        )
    `).run(userId, careReceiverId);
  },
};

export const db_medications = {
  listForCareReceiver: (careReceiverId: string): Medication[] => all<Medication>(`
    SELECT m.* FROM medications m
    JOIN care_receivers cr ON cr.id = m.care_receiver_id
    WHERE m.care_receiver_id = ? AND cr.tenant_id = current_tenant()
    ORDER BY m.active DESC, m.name
  `, careReceiverId),

  findById: (id: string): Medication | undefined => one<Medication>(`
    SELECT m.* FROM medications m JOIN care_receivers cr ON cr.id = m.care_receiver_id
    WHERE m.id = ? AND cr.tenant_id = current_tenant()
  `, id),

  create: (input: { id?: string; careReceiverId: string; name: string; dosage: string; schedule: string; startDate?: number | null; endDate?: number | null; refillsRemaining?: number; active?: number }): Medication => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO medications (id, care_receiver_id, name, dosage, schedule, start_date, end_date, refills_remaining, active)
      SELECT ?, cr.id, ?, ?, ?, ?, ?, ?, ? FROM care_receivers cr WHERE cr.id = ? AND cr.tenant_id = current_tenant()
    `).run(id, input.name, input.dosage, input.schedule, input.startDate ?? null, input.endDate ?? null, input.refillsRemaining ?? 0, input.active ?? 1, input.careReceiverId);
    const medication = db_medications.findById(id);
    if (!medication) throw new Error('Care receiver not found');
    return medication;
  },
};

export const db_appointments = {
  listForCareReceiver: (careReceiverId: string, opts: { from?: number; to?: number } = {}): Appointment[] => {
    const conditions = ['a.care_receiver_id = ?', 'cr.tenant_id = current_tenant()'];
    const params: unknown[] = [careReceiverId];
    if (opts.from !== undefined) { conditions.push('a.scheduled_for >= ?'); params.push(opts.from); }
    if (opts.to !== undefined) { conditions.push('a.scheduled_for <= ?'); params.push(opts.to); }
    return all<Appointment>(`
      SELECT a.* FROM appointments a JOIN care_receivers cr ON cr.id = a.care_receiver_id
      WHERE ${conditions.join(' AND ')} ORDER BY a.scheduled_for
    `, ...params);
  },

  findById: (id: string): Appointment | undefined => one<Appointment>(`
    SELECT a.* FROM appointments a JOIN care_receivers cr ON cr.id = a.care_receiver_id
    WHERE a.id = ? AND cr.tenant_id = current_tenant()
  `, id),

  update: (id: string, patch: AppointmentPatch): Appointment => {
    const fields: string[] = [];
    const params: unknown[] = [];
    const columns: Record<keyof AppointmentPatch, string> = { title: 'title', scheduled_for: 'scheduled_for', location: 'location', transport: 'transport', state: 'state' };
    for (const [key, column] of Object.entries(columns) as [keyof AppointmentPatch, string][]) {
      if (patch[key] !== undefined) { fields.push(`${column} = ?`); params.push(patch[key]); }
    }
    if (fields.length) db.prepare(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ? AND EXISTS (SELECT 1 FROM care_receivers cr WHERE cr.id = appointments.care_receiver_id AND cr.tenant_id = current_tenant())`).run(...params, id);
    const appointment = db_appointments.findById(id);
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  },

  create: (input: { id?: string; careReceiverId: string; title: string; scheduledFor: number; location?: string | null; transport?: string | null; state?: Appointment['state'] }): Appointment => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO appointments (id, care_receiver_id, title, scheduled_for, location, transport, state)
      SELECT ?, cr.id, ?, ?, ?, ?, ? FROM care_receivers cr WHERE cr.id = ? AND cr.tenant_id = current_tenant()
    `).run(id, input.title, input.scheduledFor, input.location ?? null, input.transport ?? null, input.state ?? 'scheduled', input.careReceiverId);
    const appointment = db_appointments.findById(id);
    if (!appointment) throw new Error('Care receiver not found');
    return appointment;
  },
};

export const db_chatMessages = {
  listForAgent: (agentId: string, opts: { limit?: number; before?: number } = {}): ChatMessage[] => {
    const params: unknown[] = [agentId];
    let before = '';
    if (opts.before !== undefined) { before = 'AND cm.created_at < ?'; params.push(opts.before); }
    params.push(Math.min(Math.max(opts.limit ?? 50, 1), 200));
    return all<ChatMessage>(`
      SELECT cm.* FROM chat_messages cm JOIN agents a ON a.id = cm.agent_id
      WHERE cm.agent_id = ? AND a.tenant_id = current_tenant() ${before}
      ORDER BY cm.created_at DESC LIMIT ?
    `, ...params).reverse();
  },

  create: (input: { id?: string; agentId: string; senderType: ChatMessage['sender_type']; senderId?: string | null; content: string; skillCalls?: string | null }): ChatMessage => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO chat_messages (id, agent_id, sender_type, sender_id, content, skill_calls)
      SELECT ?, a.id, ?, ?, ?, ? FROM agents a WHERE a.id = ? AND a.tenant_id = current_tenant()
    `).run(id, input.senderType, input.senderId ?? null, input.content, input.skillCalls ?? null, input.agentId);
    const message = one<ChatMessage>('SELECT * FROM chat_messages WHERE id = ?', id);
    if (!message) throw new Error('Agent not found');
    return message;
  },
};

export const db_adherence = {
  listForCareReceiver: (careReceiverId: string, opts: { from?: number; to?: number } = {}): AdherenceEvent[] => {
    const conditions = ['m.care_receiver_id = ?', 'cr.tenant_id = current_tenant()'];
    const params: unknown[] = [careReceiverId];
    if (opts.from !== undefined) { conditions.push('ae.scheduled_for >= ?'); params.push(opts.from); }
    if (opts.to !== undefined) { conditions.push('ae.scheduled_for <= ?'); params.push(opts.to); }
    return all<AdherenceEvent>(`
      SELECT ae.* FROM adherence_events ae
      JOIN medications m ON m.id = ae.medication_id
      JOIN care_receivers cr ON cr.id = m.care_receiver_id
      WHERE ${conditions.join(' AND ')} ORDER BY ae.scheduled_for DESC
    `, ...params);
  },

  listPending: (cutoffEpochMs: number): AdherenceEvent[] => all<AdherenceEvent>(`
    SELECT ae.* FROM adherence_events ae
    JOIN medications m ON m.id = ae.medication_id
    JOIN care_receivers cr ON cr.id = m.care_receiver_id
    WHERE ae.status = 'pending' AND ae.scheduled_for <= ? AND cr.tenant_id = current_tenant()
    ORDER BY ae.scheduled_for
  `, cutoffEpochMs),

  findById: (id: string): AdherenceEvent | undefined => one<AdherenceEvent>(`
    SELECT ae.* FROM adherence_events ae JOIN medications m ON m.id = ae.medication_id
    JOIN care_receivers cr ON cr.id = m.care_receiver_id
    WHERE ae.id = ? AND cr.tenant_id = current_tenant()
  `, id),

  create: (input: { id?: string; medicationId: string; scheduledFor: number; confirmedAt?: number | null; confirmationSource?: string | null; status: AdherenceEvent['status'] }): AdherenceEvent => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO adherence_events (id, medication_id, scheduled_for, confirmed_at, confirmation_source, status)
      SELECT ?, m.id, ?, ?, ?, ? FROM medications m
      JOIN care_receivers cr ON cr.id = m.care_receiver_id
      WHERE m.id = ? AND cr.tenant_id = current_tenant()
    `).run(id, input.scheduledFor, input.confirmedAt ?? null, input.confirmationSource ?? null, input.status, input.medicationId);
    const event = db_adherence.findById(id);
    if (!event) throw new Error('Medication not found');
    return event;
  },

  update: (id: string, patch: AdherencePatch): AdherenceEvent => {
    const columns: Record<keyof AdherencePatch, string> = { scheduled_for: 'scheduled_for', confirmed_at: 'confirmed_at', confirmation_source: 'confirmation_source', status: 'status' };
    const fields: string[] = [];
    const params: unknown[] = [];
    for (const [key, column] of Object.entries(columns) as [keyof AdherencePatch, string][]) {
      if (patch[key] !== undefined) { fields.push(`${column} = ?`); params.push(patch[key]); }
    }
    if (fields.length) db.prepare(`UPDATE adherence_events SET ${fields.join(', ')} WHERE id = ? AND EXISTS (SELECT 1 FROM medications m JOIN care_receivers cr ON cr.id = m.care_receiver_id WHERE m.id = adherence_events.medication_id AND cr.tenant_id = current_tenant())`).run(...params, id);
    const event = db_adherence.findById(id);
    if (!event) throw new Error('Adherence event not found');
    return event;
  },
};

export const db_escalations = {
  listForAgent: (agentId: string, opts: { limit?: number } = {}): Escalation[] => all<Escalation>(`
    SELECT e.* FROM escalations e JOIN agents a ON a.id = e.agent_id
    WHERE e.agent_id = ? AND a.tenant_id = current_tenant()
    ORDER BY e.triggered_at DESC LIMIT ?
  `, agentId, Math.min(Math.max(opts.limit ?? 50, 1), 200)),

  findById: (id: string): Escalation | undefined => one<Escalation>(`
    SELECT e.* FROM escalations e JOIN agents a ON a.id = e.agent_id
    WHERE e.id = ? AND a.tenant_id = current_tenant()
  `, id),

  create: (input: { id?: string; agentId: string; triggeredAt?: number; reason: string; state?: Escalation['state']; acknowledgedBy?: string | null; resolvedAt?: number | null }): Escalation => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO escalations (id, agent_id, triggered_at, reason, state, acknowledged_by, resolved_at)
      SELECT ?, a.id, ?, ?, ?, ?, ? FROM agents a WHERE a.id = ? AND a.tenant_id = current_tenant()
    `).run(id, input.triggeredAt ?? Math.floor(Date.now() / 1000), input.reason, input.state ?? 'open', input.acknowledgedBy ?? null, input.resolvedAt ?? null, input.agentId);
    const escalation = db_escalations.findById(id);
    if (!escalation) throw new Error('Agent not found');
    return escalation;
  },

  update: (id: string, patch: EscalationPatch): Escalation => {
    const columns: Record<keyof EscalationPatch, string> = { reason: 'reason', state: 'state', acknowledged_by: 'acknowledged_by', resolved_at: 'resolved_at' };
    const fields: string[] = [];
    const params: unknown[] = [];
    for (const [key, column] of Object.entries(columns) as [keyof EscalationPatch, string][]) {
      if (patch[key] !== undefined) { fields.push(`${column} = ?`); params.push(patch[key]); }
    }
    if (fields.length) db.prepare(`UPDATE escalations SET ${fields.join(', ')} WHERE id = ? AND EXISTS (SELECT 1 FROM agents a WHERE a.id = escalations.agent_id AND a.tenant_id = current_tenant())`).run(...params, id);
    const escalation = db_escalations.findById(id);
    if (!escalation) throw new Error('Escalation not found');
    return escalation;
  },
};

export const db_vitals = {
  listForCareReceiver: (careReceiverId: string, opts: { from?: number; to?: number; metric?: string } = {}): Vital[] => {
    const conditions = ['v.care_receiver_id = ?', 'cr.tenant_id = current_tenant()'];
    const params: unknown[] = [careReceiverId];
    if (opts.from !== undefined) { conditions.push('v.recorded_at >= ?'); params.push(opts.from); }
    if (opts.to !== undefined) { conditions.push('v.recorded_at <= ?'); params.push(opts.to); }
    if (opts.metric !== undefined) { conditions.push('v.metric = ?'); params.push(opts.metric); }
    return all<Vital>(`
      SELECT v.* FROM vitals v JOIN care_receivers cr ON cr.id = v.care_receiver_id
      WHERE ${conditions.join(' AND ')} ORDER BY v.recorded_at DESC
    `, ...params);
  },

  create: (input: { careReceiverId: string; metric: string; value: number; recordedAt: number }): Vital => {
    const result = db.prepare(`
      INSERT INTO vitals (care_receiver_id, metric, value, recorded_at)
      SELECT cr.id, ?, ?, ? FROM care_receivers cr WHERE cr.id = ? AND cr.tenant_id = current_tenant()
    `).run(input.metric, input.value, input.recordedAt, input.careReceiverId);
    const vital = one<Vital>('SELECT * FROM vitals WHERE id = ?', Number(result.lastInsertRowid));
    if (!vital) throw new Error('Care receiver not found');
    return vital;
  },
};

export const db_outboundMessages = {
  listForAgent: (agentId: string, opts: { limit?: number } = {}): OutboundMessage[] => all<OutboundMessage>(`
    SELECT om.* FROM outbound_messages om JOIN agents a ON a.id = om.agent_id
    WHERE om.agent_id = ? AND a.tenant_id = current_tenant()
    ORDER BY om.sent_at DESC LIMIT ?
  `, agentId, Math.min(Math.max(opts.limit ?? 50, 1), 200)),

  create: (input: { id?: string; agentId: string; channel: OutboundMessage['channel']; toAddress: string; body: string; sentAt?: number }): OutboundMessage => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO outbound_messages (id, agent_id, channel, to_address, body, sent_at)
      SELECT ?, a.id, ?, ?, ?, ? FROM agents a WHERE a.id = ? AND a.tenant_id = current_tenant()
    `).run(id, input.channel, input.toAddress, input.body, input.sentAt ?? Math.floor(Date.now() / 1000), input.agentId);
    const message = one<OutboundMessage>('SELECT * FROM outbound_messages WHERE id = ?', id);
    if (!message) throw new Error('Agent not found');
    return message;
  },
};

export const db_weeklyDigests = {
  findForWeek: (agentId: string, weekStart: number): WeeklyDigest | undefined => one<WeeklyDigest>(`
    SELECT wd.* FROM weekly_digests wd JOIN agents a ON a.id = wd.agent_id
    WHERE wd.agent_id = ? AND wd.week_start = ? AND a.tenant_id = current_tenant()
  `, agentId, weekStart),

  create: (input: { id?: string; agentId: string; weekStart: number; body: string; sentAt?: number }): WeeklyDigest => {
    const id = input.id ?? randomUUID();
    db.prepare(`
      INSERT INTO weekly_digests (id, agent_id, week_start, body, sent_at)
      SELECT ?, a.id, ?, ?, ? FROM agents a WHERE a.id = ? AND a.tenant_id = current_tenant()
    `).run(id, input.weekStart, input.body, input.sentAt ?? Math.floor(Date.now() / 1000), input.agentId);
    const digest = one<WeeklyDigest>('SELECT * FROM weekly_digests WHERE id = ?', id);
    if (!digest) throw new Error('Agent not found');
    return digest;
  },
};

/**
 * Returns true if the SQLite database is available. On Vercel serverless
 * runtimes, better-sqlite3's native binding can't load, so the db stub
 * throws NO_DB_ON_VERCEL from every method. The auth + dashboard routes
 * check this flag and serve built-in demo data instead.
 */
export function isDbAvailable(): boolean {
  try {
    // The stub's prepare() throws. The real DB's prepare() returns an object.
    (db as unknown as { prepare: (s: string) => unknown }).prepare('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
