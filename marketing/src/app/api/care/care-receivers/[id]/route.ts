import { NextResponse } from 'next/server';
import { requireUser, jsonError, HttpError } from '@/lib/auth';
import {
  db_careReceivers,
  db_medications,
  db_appointments,
  db_adherence,
  db_escalations,
  db_vitals,
  db_chatMessages,
  db_agents,
  withTenant,
} from '@/lib/db';
import { db } from '../../../../../../db';

export const runtime = 'nodejs';

/**
 * /api/care/care-receivers/[id] (GET)
 *
 * Full detail: care_receiver + medications + upcoming appointments +
 * adherence (last 7d) + escalations (last 10) + vitals (last 24h, latest
 * per metric) + chat_messages (last 50) + family caregivers.
 *
 * Auth: user must have a caregiver_link to this care_receiver (same tenant).
 *
 * We touch the raw `db` connection only for the family-roster query —
 * Phase 1's lib/db.ts exposes listForUser on care_receivers but not on
 * caregiver_links, and we're not allowed to modify lib/db.ts. The raw
 * JOIN is tenant-safe because caregiver_links only references rows that
 * already had tenant_id propagated via FK.
 */

function parseJsonArray(s: string | null): unknown[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await ctx.params;

    return withTenant(() => {
      const cr = db_careReceivers.findById(id);
      if (!cr) throw new HttpError(404, 'Care receiver not found');
      // Tenant safety: cr.tenant_id must match the caller's tenant_id.
      if (cr.tenant_id !== user.tenant_id) throw new HttpError(404, 'Care receiver not found');

      // Authorize: must appear in the user's list of linked care receivers.
      const authorized = db_careReceivers.listForUser(user.id).some((row) => row.id === id);
      if (!authorized) throw new HttpError(403, 'Not authorized for this care receiver');

      // Medications
      const medications = db_medications.listForCareReceiver(id);

      // Upcoming appointments (next 30 days)
      const nowSec = Math.floor(Date.now() / 1000);
      const toSec = nowSec + 30 * 24 * 60 * 60;
      const appointments = db_appointments.listForCareReceiver(id, { from: nowSec, to: toSec });

      // Adherence: last 7 days
      const fromSec = nowSec - 7 * 24 * 60 * 60;
      const adherence = db_adherence.listForCareReceiver(id, { from: fromSec, to: nowSec });

      // Escalations: last 10 (via the agent)
      const agent = db_agents.findByCareReceiver(id);
      const escalations = agent ? db_escalations.listForAgent(agent.id, { limit: 10 }) : [];

      // Vitals: last 24h, latest per metric
      const vitalsLast24h = db_vitals.listForCareReceiver(id, {
        from: nowSec - 24 * 60 * 60,
        to: nowSec,
      });
      const latestByMetric: Record<string, { value: number; recorded_at: number }> = {};
      for (const v of vitalsLast24h) {
        const existing = latestByMetric[v.metric];
        if (!existing || v.recorded_at > existing.recorded_at) {
          latestByMetric[v.metric] = { value: v.value, recorded_at: v.recorded_at };
        }
      }

      // Chat: last 50 messages for the agent
      const chat = agent ? db_chatMessages.listForAgent(agent.id, { limit: 50 }) : [];

      // Family roster: users linked to this care_receiver (same tenant guaranteed by FK).
      interface FamilyRow {
        id: string;
        name: string;
        role: string;
      }
      const familyRows = db
        .prepare(
          `SELECT u.id, u.name, u.role
           FROM users u
           JOIN caregiver_links cl ON cl.user_id = u.id
           WHERE cl.care_receiver_id = ?
           ORDER BY u.name`,
        )
        .all(id) as FamilyRow[];

      return NextResponse.json({
        careReceiver: {
          id: cr.id,
          name: cr.name,
          conditions: parseJsonArray(cr.conditions),
          interests: parseJsonArray(cr.interests),
          timezone: cr.timezone,
          created_at: cr.created_at,
        },
        agent: agent
          ? {
              id: agent.id,
              name: agent.name,
              email: agent.email,
              personality: agent.personality,
            }
          : null,
        medications: medications.map((m) => ({
          id: m.id,
          name: m.name,
          dosage: m.dosage,
          schedule: m.schedule,
          refills_remaining: m.refills_remaining,
          active: m.active,
        })),
        appointments: appointments.map((a) => ({
          id: a.id,
          title: a.title,
          scheduled_for: a.scheduled_for,
          location: a.location,
          transport: a.transport,
          state: a.state,
        })),
        adherence: adherence.map((ae) => ({
          id: ae.id,
          medication_id: ae.medication_id,
          scheduled_for: ae.scheduled_for,
          confirmed_at: ae.confirmed_at,
          confirmation_source: ae.confirmation_source,
          status: ae.status,
        })),
        escalations: escalations.map((e) => ({
          id: e.id,
          triggered_at: e.triggered_at,
          reason: e.reason,
          state: e.state,
          acknowledged_by: e.acknowledged_by,
          resolved_at: e.resolved_at,
        })),
        vitals: {
          latest: latestByMetric,
          raw: vitalsLast24h.map((v) => ({
            id: v.id,
            metric: v.metric,
            value: v.value,
            recorded_at: v.recorded_at,
          })),
        },
        chat: chat.map((c) => ({
          id: c.id,
          sender_type: c.sender_type,
          sender_id: c.sender_id,
          content: c.content,
          created_at: c.created_at,
        })),
        family: familyRows.map((r) => ({ id: r.id, name: r.name, role: r.role })),
      });
    }, user.tenant_id);
  } catch (err) {
    return jsonError(err);
  }
}
