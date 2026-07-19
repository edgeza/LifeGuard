import { NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * GET /api/care/digest/[agent_id]
 *
 * Session-authenticated. Returns the latest weekly_digest row for the
 * given agent. 404 if none has been generated yet (digest only runs
 * on Sundays).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ agent_id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { agent_id: agentId } = await params;

  // Tenant guard: only return digests for agents in the caller's tenant.
  const agent = db
    .prepare('SELECT * FROM agents WHERE id = ? AND tenant_id = ?')
    .get(agentId, user.tenant_id) as { id: string; name: string; care_receiver_id: string } | undefined;
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const digest = db
    .prepare(
      `SELECT * FROM weekly_digests WHERE agent_id = ? ORDER BY week_start DESC LIMIT 1`,
    )
    .get(agentId) as { id: string; agent_id: string; week_start: number; body: string; sent_at: number } | undefined;

  if (!digest) {
    return NextResponse.json({ error: 'No digest yet for this agent' }, { status: 404 });
  }

  return NextResponse.json({
    id: digest.id,
    agentId: digest.agent_id,
    agentName: agent.name,
    weekStart: digest.week_start,
    body: digest.body,
    sentAt: digest.sent_at,
  });
}
