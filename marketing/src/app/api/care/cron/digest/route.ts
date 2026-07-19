import { NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { db_weeklyDigests, db_agents, db_outboundMessages } from '@/lib/db';

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

/**
 * Sunday 00:00 UTC of the current week (the Sunday that just started,
 * or is about to end depending on time of day). If today is Sunday,
 * week_start is *today* at 00:00 UTC. We use this as the digest key
 * so the same week never gets two digests.
 */
function sundayWeekStartUtc(): number {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday
  const sunday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dayOfWeek, 0, 0, 0),
  );
  return Math.floor(sunday.getTime() / 1000);
}

interface AdherenceCountRow { confirmed: number; late: number; missed: number; total: number; }
interface EscalationCountRow { n: number; }
interface VitalsCountRow { n: number; avg_hr: number | null; }

interface CaregiverRow { id: string; email: string; }

function lookupCaregivers(careReceiverId: string): CaregiverRow[] {
  return db
    .prepare(
      `SELECT u.id, u.email FROM users u
       JOIN caregiver_links cl ON cl.user_id = u.id
       WHERE cl.care_receiver_id = ?`,
    )
    .all(careReceiverId) as CaregiverRow[];
}

function buildDigestBody(agentName: string, weekStart: number, adherence: AdherenceCountRow, escalations: number, vitalsCount: number, avgHr: number | null): string {
  const adherenceLine = `${adherence.confirmed}/${adherence.total} confirmed (${adherence.late} late, ${adherence.missed} missed)`;
  const vitalsLine = vitalsCount > 0
    ? `${vitalsCount} vitals readings logged${avgHr !== null ? ` (avg HR ${avgHr.toFixed(0)} bpm)` : ''}`
    : 'No vitals readings this week';
  const escLine = escalations === 0 ? 'No escalations triggered.' : `${escalations} escalation${escalations === 1 ? '' : 's'} triggered and resolved.`;
  return [
    `Weekly digest for ${agentName}`,
    `Week starting ${new Date(weekStart * 1000).toISOString().slice(0, 10)}`,
    '',
    `Adherence: ${adherenceLine}`,
    vitalsLine,
    escLine,
    '',
    'This digest is generated automatically. Real product wires this into the cognitive-watch + digest skills.',
  ].join('\n');
}

export async function GET(req: Request) {
  if (!checkCronSecret(req)) return unauthorized();

  const today = new Date();
  if (today.getUTCDay() !== 0) {
    return NextResponse.json({
      skipped: 'not sunday',
      today: today.toISOString().slice(0, 10),
    });
  }

  const weekStart = sundayWeekStartUtc();
  const weekEnd = weekStart + 7 * 24 * 60 * 60;
  const agents = db
    .prepare('SELECT id, name, care_receiver_id FROM agents')
    .all() as { id: string; name: string; care_receiver_id: string }[];

  let digestsSent = 0;
  const sent: { agentId: string; caregiverCount: number; weekStart: number }[] = [];

  for (const agent of agents) {
    if (db_weeklyDigests.findForWeek(agent.id, weekStart)) continue;

    // Pull stats via raw SQL
    const adherence = db.prepare(
      `SELECT
         SUM(CASE WHEN ae.status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
         SUM(CASE WHEN ae.status = 'late' THEN 1 ELSE 0 END) AS late,
         SUM(CASE WHEN ae.status = 'missed' THEN 1 ELSE 0 END) AS missed,
         COUNT(*) AS total
       FROM adherence_events ae
       JOIN medications m ON m.id = ae.medication_id
       WHERE m.care_receiver_id = ? AND ae.scheduled_for >= ? AND ae.scheduled_for < ?`,
    ).get(agent.care_receiver_id, weekStart, weekEnd) as AdherenceCountRow;

    const escRow = db.prepare(
      `SELECT COUNT(*) AS n FROM escalations WHERE agent_id = ? AND triggered_at >= ? AND triggered_at < ?`,
    ).get(agent.id, weekStart, weekEnd) as EscalationCountRow;

    const vitalsRow = db.prepare(
      `SELECT COUNT(*) AS n, AVG(CASE WHEN metric = 'hr' THEN value END) AS avg_hr
       FROM vitals WHERE care_receiver_id = ? AND recorded_at >= ? AND recorded_at < ?`,
    ).get(agent.care_receiver_id, weekStart, weekEnd) as VitalsCountRow;

    const body = buildDigestBody(
      agent.name,
      weekStart,
      adherence ?? { confirmed: 0, late: 0, missed: 0, total: 0 },
      escRow?.n ?? 0,
      vitalsRow?.n ?? 0,
      vitalsRow?.avg_hr ?? null,
    );

    db_weeklyDigests.create({
      agentId: agent.id,
      weekStart,
      body,
    });

    const caregivers = lookupCaregivers(agent.care_receiver_id);
    for (const cg of caregivers) {
      db_outboundMessages.create({
        agentId: agent.id,
        channel: 'email',
        toAddress: cg.email,
        body,
      });
    }

    digestsSent += 1;
    sent.push({ agentId: agent.id, caregiverCount: caregivers.length, weekStart });
  }

  return NextResponse.json({ digestsSent, sent, weekStart });
}
