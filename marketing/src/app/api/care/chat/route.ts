import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { requireUser, jsonError, HttpError } from '@/lib/auth';
import {
  db_agents,
  db_careReceivers,
  db_chatMessages,
} from '@/lib/db';
import { runAgent, buildAgentContext } from '@/lib/agent';

export const runtime = 'nodejs';

/**
 * /api/care/chat (POST) — caregiver ↔ agent conversation.
 *
 * Body: { message: string, agentId?: string, senderType?: 'caregiver'|'care_receiver' }
 *
 * Loads the agent + care_receiver for the current user, persists the
 * incoming message, runs the agent loop, persists the reply, and
 * dispatches any outbound SMS/voice/email the agent produced.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();

    const body = (await req.json().catch(() => ({}))) as {
      message?: unknown;
      agentId?: unknown;
      senderType?: unknown;
    };
    const message = String(body.message || '').trim();
    if (!message) throw new HttpError(400, 'message is required');

    const senderType =
      body.senderType === 'care_receiver' ? 'care_receiver' : 'caregiver';

    // Resolve the agent: explicit agentId wins; otherwise the user's
    // primary care_receiver's agent.
    let agent;
    if (body.agentId) {
      agent = db_agents.findById(String(body.agentId));
    } else {
      const careReceivers = db_careReceivers.listForUser(user.id);
      if (careReceivers.length === 0) {
        throw new HttpError(404, 'No care receiver linked to this user');
      }
      agent = db_agents.findByCareReceiver(careReceivers[0].id);
    }
    if (!agent) throw new HttpError(404, 'Agent not found');

    const careReceiver = db_careReceivers.findById(agent.care_receiver_id);
    if (!careReceiver) throw new HttpError(404, 'Care receiver not found');

    // Persist the incoming message
    const incomingId = randomUUID();
    db_chatMessages.create({
      id: incomingId,
      agentId: agent.id,
      senderType,
      senderId: user.id,
      content: message,
    });

    // Run the agent
    const ctx = buildAgentContext(user, agent, careReceiver);
    const result = await runAgent(message, ctx);

    // Persist the agent reply
    const replyId = randomUUID();
    db_chatMessages.create({
      id: replyId,
      agentId: agent.id,
      senderType: 'bot',
      senderId: null,
      content: result.reply,
      skillCalls: JSON.stringify(result.skillCalls),
    });

    return NextResponse.json({
      reply: result.reply,
      skillCalls: result.skillCalls,
      meta: {
        agent: agent.id,
        care_receiver: careReceiver.id,
        caregiver: user.id,
        skills_used: result.skillCalls.map((s) => s.name),
        tokens_in: Math.ceil(message.length / 4),
        messageId: incomingId,
        replyId,
      },
    });
  } catch (err) {
    return jsonError(err);
  }
}

/**
 * /api/care/chat (GET) — recent chat history for the user's primary agent.
 */
export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const agentId = url.searchParams.get('agentId');

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

    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 50), 1), 200);
    const messages = db_chatMessages.listForAgent(agent.id, { limit });
    return NextResponse.json({ messages });
  } catch (err) {
    return jsonError(err);
  }
}
