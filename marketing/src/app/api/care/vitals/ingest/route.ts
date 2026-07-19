import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '../../../../../../db';
import { db_vitals, db_agents, db_escalations, db_outboundMessages, withTenant } from '@/lib/db';

export const runtime = 'nodejs';

const WEBHOOK_SECRET = process.env.DEVICE_WEBHOOK_SECRET || 'dev-webhook-secret';

const ALLOWED_METRICS = ['hr', 'spo2', 'hrv', 'temp'] as const;
type Metric = (typeof ALLOWED_METRICS)[number];

const RANGE: Record<Metric, [number, number]> = {
  hr: [30, 200],
  spo2: [70, 100],
  hrv: [10, 200],
  temp: [34, 42],
};

// HR threshold above which we open an escalation. Slightly higher than
// the validity ceiling so we only escalate when meaningfully elevated.
const HR_ESCALATION_THRESHOLD = 120;

interface IngestBody {
  careReceiverId?: unknown;
  metric?: unknown;
  value?: unknown;
  recordedAt?: unknown;
}

function verifySignature(rawBody: string, header: string | null): boolean {
  if (!header) return false;
  const provided = header.startsWith('sha256=') ? header.slice('sha256='.length) : header;
  if (!/^[0-9a-f]+$/i.test(provided)) return false;
  const expected = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(provided.toLowerCase(), 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Look up the contact channels we have on file for every caregiver
 * linked to this care_receiver. Phase 1's typed helpers don't expose
 * this reverse lookup, so we read directly through the shared db
 * instance. For SMS/voice we synthesise a placeholder phone from the
 * user id (no real phone numbers in seed); email goes to the user's
 * actual email.
 */
function lookupCaregivers(careReceiverId: string): { email: string; phone: string; userId: string }[] {
  type Row = { id: string; email: string };
  const rows = db
    .prepare(
      `SELECT u.id, u.email FROM users u
       JOIN caregiver_links cl ON cl.user_id = u.id
       WHERE cl.care_receiver_id = ?`,
    )
    .all(careReceiverId) as Row[];
  return rows.map((r) => ({
    userId: r.id,
    email: r.email,
    // Stable synthetic phone derived from user id. Real product would
    // store a phone column on users.
    phone: `+27-${r.id.replace(/[^a-z0-9]/gi, '').slice(0, 9).padEnd(9, '0')}`,
  }));
}

export async function POST(req: Request) {
  // CRITICAL: read raw body as text. The HMAC is computed over the
  // exact bytes the device sent; any re-serialisation via JSON.stringify
  // will produce a different digest.
  const rawBody = await req.text();
  const signatureHeader = req.headers.get('x-lg-signature');

  if (!verifySignature(rawBody, signatureHeader)) {
    return Response.json({ error: 'Invalid or missing signature' }, { status: 401 });
  }

  let parsed: IngestBody;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const careReceiverId = typeof parsed.careReceiverId === 'string' ? parsed.careReceiverId : null;
  const metric = typeof parsed.metric === 'string' ? parsed.metric : null;
  const value = typeof parsed.value === 'number' ? parsed.value : null;
  const recordedAt =
    typeof parsed.recordedAt === 'number'
      ? parsed.recordedAt
      : Math.floor(Date.now() / 1000);

  if (!careReceiverId || !metric || value === null) {
    return Response.json(
      { error: 'careReceiverId, metric, value required' },
      { status: 400 },
    );
  }

  if (!ALLOWED_METRICS.includes(metric as Metric)) {
    return Response.json(
      { error: `metric must be one of ${ALLOWED_METRICS.join(', ')}` },
      { status: 400 },
    );
  }

  const [lo, hi] = RANGE[metric as Metric];
  if (value < lo || value > hi) {
    return Response.json(
      { error: `value ${value} out of range for ${metric} (${lo}-${hi})` },
      { status: 400 },
    );
  }

  // Care receiver must exist. db_vitals.create requires the current
  // tenant to be set; look it up first and run the insert inside a
  // withTenant scope. db_vitals.create will throw if not.
  const crRow = db
    .prepare('SELECT tenant_id FROM care_receivers WHERE id = ?')
    .get(careReceiverId) as { tenant_id: string } | undefined;
  if (!crRow) {
    return Response.json({ error: 'Care receiver not found' }, { status: 404 });
  }

  let vital;
  try {
    vital = withTenant(() => db_vitals.create({
      careReceiverId,
      metric: metric as string,
      value,
      recordedAt,
    }), crRow.tenant_id);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 404 },
    );
  }

  // Threshold escalation: HR above 120 → open escalation + SMS to all
  // linked caregivers.
  if (metric === 'hr' && value > HR_ESCALATION_THRESHOLD) {
    const agent = withTenant(() => db_agents.findByCareReceiver(careReceiverId), crRow.tenant_id);
    if (agent) {
      const escalation = withTenant(() => db_escalations.create({
        agentId: agent.id,
        reason: `Heart rate spike: ${value} bpm`,
        state: 'open',
      }), crRow.tenant_id);
      const caregivers = lookupCaregivers(careReceiverId);
      for (const cg of caregivers) {
        withTenant(() => db_outboundMessages.create({
          agentId: agent.id,
          channel: 'sms',
          toAddress: cg.phone,
          body: `LifeGuard alert: ${agent.name}'s heart rate just hit ${value} bpm. Please check in.`,
        }), crRow.tenant_id);
      }
      return Response.json({ id: vital.id, accepted: true, escalationId: escalation.id });
    }
  }

  return Response.json({ id: vital.id, accepted: true });
}

export async function GET() {
  return Response.json({
    endpoint: '/api/care/vitals/ingest',
    method: 'POST',
    auth: 'X-LG-Signature: sha256=<hmac-hex-of-raw-body>',
    body: {
      careReceiverId: 'string',
      metric: 'hr | spo2 | hrv | temp',
      value: 'number',
      recordedAt: 'number (unix seconds, optional)',
    },
  });
}
