import { NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { db_adherence, db_medications, db_escalations, db_outboundMessages, db_agents } from '@/lib/db';

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

interface CaregiverRow {
  id: string;
  email: string;
  agent_id: string | null;
}

function lookupCaregivers(careReceiverId: string): CaregiverRow[] {
  return db
    .prepare(
      `SELECT u.id, u.email, a.id AS agent_id
       FROM users u
       JOIN caregiver_links cl ON cl.user_id = u.id
       LEFT JOIN agents a ON a.care_receiver_id = cl.care_receiver_id
       WHERE cl.care_receiver_id = ?`,
    )
    .all(careReceiverId) as CaregiverRow[];
}

export async function GET(req: Request) {
  if (!checkCronSecret(req)) return unauthorized();

  const now = Math.floor(Date.now() / 1000);
  const fifteenMinAgo = now - 15 * 60;

  // Find pending adherence events whose scheduled time was more than
  // 15 min ago → these are missed doses.
  const stale = db_adherence.listPending(fifteenMinAgo);

  let escalationsOpened = 0;
  let smsSent = 0;

  for (const ev of stale) {
    const medRow = db
      .prepare(
        `SELECT m.id, m.name, m.care_receiver_id FROM medications m WHERE m.id = ?`,
      )
      .get(ev.medication_id) as { id: string; name: string; care_receiver_id: string } | undefined;
    if (!medRow) continue;

    // Mark missed
    db_adherence.update(ev.id, { status: 'missed' });

    const agent = db_agents.findByCareReceiver(medRow.care_receiver_id);
    if (!agent) continue;

    const escalation = db_escalations.create({
      agentId: agent.id,
      reason: `Missed dose: ${medRow.name}`,
      state: 'open',
    });
    escalationsOpened += 1;

    const caregivers = lookupCaregivers(medRow.care_receiver_id);
    for (const cg of caregivers) {
      db_outboundMessages.create({
        agentId: agent.id,
        channel: 'sms',
        toAddress: cg.email, // stub: real product would use phone
        body: `LifeGuard alert: ${medRow.name} dose was missed at ${new Date(ev.scheduled_for * 1000).toISOString()}. Please follow up.`,
      });
      smsSent += 1;
    }
  }

  return NextResponse.json({
    escalationsOpened,
    smsSent,
    cutoff: fifteenMinAgo,
    now,
  });
}
