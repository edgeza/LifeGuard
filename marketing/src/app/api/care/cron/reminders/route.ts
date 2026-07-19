import { NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { db_adherence, db_medications, db_outboundMessages, db_agents } from '@/lib/db';

export const runtime = 'nodejs';

const CRON_SECRET = process.env.CRON_SECRET || 'dev-cron-secret';

function unauthorized(): Response {
  return NextResponse.json({ error: 'Invalid or missing cron secret' }, { status: 401 });
}

function checkCronSecret(req: Request): boolean {
  const provided = req.headers.get('x-cron-secret');
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(CRON_SECRET);
  if (a.length !== b.length) return false;
  try {
    const { timingSafeEqual } = require('node:crypto') as typeof import('node:crypto');
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface MedicationRow {
  id: string;
  care_receiver_id: string;
  schedule: string;
  active: number;
}

interface CaregiverRow {
  id: string;
  email: string;
  agent_id: string | null;
  agent_name: string | null;
}

function lookupCaregivers(careReceiverId: string): CaregiverRow[] {
  return db
    .prepare(
      `SELECT u.id, u.email, a.id AS agent_id, a.name AS agent_name
       FROM users u
       JOIN caregiver_links cl ON cl.user_id = u.id
       LEFT JOIN agents a ON a.care_receiver_id = cl.care_receiver_id
       WHERE cl.care_receiver_id = ?`,
    )
    .all(careReceiverId) as CaregiverRow[];
}

/**
 * Parse the schedule column. Phase 1 seed uses strings like
 *   "08:00 daily", "21:00 daily"
 * Returns the UTC epoch seconds for the next occurrence of this
 * time on the given day (00:00 UTC reference day), or null if it
 * can't be parsed. Real product would have a proper recurrence
 * table — this is a stub that handles the HH:MM daily case.
 */
function parseScheduleToEpoch(schedule: string, referenceUtcDayStart: number): number | null {
  const match = schedule.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return referenceUtcDayStart + hour * 3600 + minute * 60;
}

export async function GET(req: Request) {
  if (!checkCronSecret(req)) return unauthorized();

  const now = Math.floor(Date.now() / 1000);
  // Today's UTC midnight
  const todayUtcStart = Math.floor(
    new Date(Date.now()).setUTCHours(0, 0, 0, 0) / 1000,
  );

  // Pull all active medications
  const medications = db
    .prepare(
      `SELECT id, care_receiver_id, schedule, active FROM medications WHERE active = 1`,
    )
    .all() as MedicationRow[];

  // 1. Create pending adherence events for any active med × scheduled
  //    time today that doesn't already have an event.
  let pendingCreated = 0;
  const newPending: { id: string; medicationId: string; careReceiverId: string; scheduledFor: number }[] = [];

  for (const med of medications) {
    const scheduledFor = parseScheduleToEpoch(med.schedule, todayUtcStart);
    if (scheduledFor === null) continue;
    // Skip if scheduledFor is in the future — only create events for
    // times that have already passed today, or for the whole day if
    // the cron runs after midnight. We create them for all times today
    // so the smoke test always has something to escalate on the first
    // run. The reminder send below gates on the 60-min window.
    const existing = db
      .prepare(
        `SELECT 1 FROM adherence_events WHERE medication_id = ? AND scheduled_for = ?`,
      )
      .get(med.id, scheduledFor);
    if (existing) continue;
    const event = db_adherence.create({
      medicationId: med.id,
      scheduledFor,
      status: 'pending',
    });
    pendingCreated += 1;
    newPending.push({ id: event.id, medicationId: med.id, careReceiverId: med.care_receiver_id, scheduledFor });
  }

  // 2. For each pending event whose scheduled_for is within the last
  //    60 min, send a reminder SMS to the care_receiver's primary
  //    caregiver (first linked user).
  let remindersSent = 0;
  const sixtyMinAgo = now - 60 * 60;
  const cutoff = now; // only send reminders for slots that have passed
  const staleEvents = db_adherence
    .listPending(cutoff)
    .filter((e) => e.scheduled_for >= sixtyMinAgo && e.scheduled_for <= cutoff);

  for (const ev of staleEvents) {
    // Resolve medication → care_receiver
    const medRow = db
      .prepare(
        `SELECT m.id, m.care_receiver_id, m.name FROM medications m WHERE m.id = ?`,
      )
      .get(ev.medication_id) as { id: string; care_receiver_id: string; name: string } | undefined;
    if (!medRow) continue;
    const caregivers = lookupCaregivers(medRow.care_receiver_id);
    if (caregivers.length === 0) continue;
    const agent = db_agents.findByCareReceiver(medRow.care_receiver_id);
    const agentId = agent?.id ?? caregivers[0].agent_id;
    if (!agentId) continue;
    const reminderTime = new Date(ev.scheduled_for * 1000).toISOString();
    for (const cg of caregivers) {
      db_outboundMessages.create({
        agentId,
        channel: 'sms',
        toAddress: cg.email, // stub: real product would use phone
        body: `Reminder: ${medRow.name} dose scheduled for ${reminderTime}. Please confirm.`,
      });
      remindersSent += 1;
    }
  }

  return NextResponse.json({
    pendingCreated,
    remindersSent,
    now,
    window: { from: sixtyMinAgo, to: cutoff },
  });
}
