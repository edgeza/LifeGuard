import { NextResponse } from 'next/server';
import { requireUser, jsonError, HttpError } from '@/lib/auth';
import {
  db_medications,
  db_adherence,
  db_careReceivers,
  db_chatMessages,
  db_agents,
  type AdherenceEvent,
} from '@/lib/db';

export const runtime = 'nodejs';

/**
 * /api/care/adherence/confirm (POST)
 *
 * Body: {
 *   medicationId: string,
 *   confirmationSource: 'care_receiver' | 'caregiver' | 'timeout'
 * }
 *
 * Finds-or-creates today's adherence_event for the medication, marks it
 * confirmed, and appends a chat message to the agent.
 */

function medicationDueTime(scheduledString?: string): { hour: number; minute: number } {
  // accept "08:00 daily" or "21:00 daily" or "08:00 · Mon, Thu". Just pick the first HH:MM.
  if (!scheduledString) return { hour: 9, minute: 0 };
  const m = scheduledString.match(/(\d{1,2}):(\d{2})/);
  if (!m) return { hour: 9, minute: 0 };
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function startOfTodayEpoch(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function endOfTodayEpoch(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return Math.floor(d.getTime() / 1000);
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    const body = (await req.json().catch(() => ({}))) as {
      medicationId?: unknown;
      confirmationSource?: unknown;
    };

    const medicationId = String(body.medicationId || '').trim();
    const rawSource = String(body.confirmationSource || 'caregiver').trim();
    const confirmationSource: 'care_receiver' | 'caregiver' | 'timeout' =
      rawSource === 'care_receiver' || rawSource === 'timeout' || rawSource === 'caregiver'
        ? rawSource
        : 'caregiver';

    if (!medicationId) throw new HttpError(400, 'medicationId is required');

    const medication = db_medications.findById(medicationId);
    if (!medication) throw new HttpError(404, 'Medication not found');

    // Authorize: caller is a caregiver linked to this med's care_receiver.
    const linked = db_careReceivers.listForUser(user.id);
    const authorized = linked.some((cr) => cr.id === medication.care_receiver_id);
    if (!authorized) throw new HttpError(403, 'Not authorized for this medication');

    // Find-or-create today's adherence event for this med.
    const startToday = startOfTodayEpoch();
    const endToday = endOfTodayEpoch();
    const existing = db_adherence
      .listForCareReceiver(medication.care_receiver_id, { from: startToday, to: endToday })
      .filter((e) => e.medication_id === medication.id)
      .sort((a, b) => b.scheduled_for - a.scheduled_for);

    let event: AdherenceEvent;
    const now = Math.floor(Date.now() / 1000);
    if (existing.length > 0) {
      const target = existing[0];
      event = db_adherence.update(target.id, {
        confirmed_at: now,
        confirmation_source: confirmationSource,
        status: 'confirmed',
      });
    } else {
      // No event seeded for today — synthesize one with scheduled_for = today at dose time.
      const { hour, minute } = medicationDueTime(medication.schedule);
      const scheduled = new Date();
      scheduled.setHours(hour, minute, 0, 0);
      const scheduled_for = Math.floor(scheduled.getTime() / 1000);
      event = db_adherence.create({
        medicationId: medication.id,
        scheduledFor: scheduled_for,
        confirmedAt: now,
        confirmationSource,
        status: 'confirmed',
      });
    }

    // Append a chat message so the caregiver window shows it.
    const agent = db_agents.findByCareReceiver(medication.care_receiver_id);
    if (agent) {
      const time = new Date(now * 1000);
      const hh = String(time.getHours()).padStart(2, '0');
      const mm = String(time.getMinutes()).padStart(2, '0');
      const senderType: 'care_receiver' | 'caregiver' = confirmationSource === 'care_receiver' ? 'care_receiver' : 'caregiver';
      db_chatMessages.create({
        agentId: agent.id,
        senderType,
        senderId: confirmationSource === 'care_receiver' ? medication.care_receiver_id : user.id,
        content: `✅ ${medication.name} (${medication.dosage}) confirmed at ${hh}:${mm}`,
      });
    }

    return NextResponse.json({
      ok: true,
      event: {
        id: event.id,
        medication_id: event.medication_id,
        scheduled_for: event.scheduled_for,
        confirmed_at: event.confirmed_at,
        confirmation_source: event.confirmation_source,
        status: event.status,
      },
    });
  } catch (err) {
    return jsonError(err);
  }
}
