import { NextResponse } from 'next/server';
import { requireUser, jsonError, HttpError } from '@/lib/auth';
import { db_agents, db_careReceivers, db_chatMessages } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * /api/care/chat/history (GET)
 *
 * Query: ?agentId=X&limit=50&before=timestamp
 *
 * Returns the chat history for an agent, oldest first. Used by the
 * dashboard to render the segmented chat log.
 */
export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const agentId = url.searchParams.get('agentId');
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 50), 1), 200);

    let agent;
    if (agentId) {
      agent = db_agents.findById(agentId);
    } else {
      const careReceivers = db_careReceivers.listForUser(user.id);
      if (careReceivers.length === 0) {
        return NextResponse.json({ messages: [] });
      }
      agent = db_agents.findByCareReceiver(careReceivers[0].id);
    }
    if (!agent) {
      return NextResponse.json({ messages: [] });
    }

    const messages = db_chatMessages.listForAgent(agent.id, { limit });
    return NextResponse.json({
      agentId: agent.id,
      messages,
    });
  } catch (err) {
    return jsonError(err);
  }
}
