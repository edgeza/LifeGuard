import { NextResponse } from 'next/server';
import { requireUser, jsonError, HttpError } from '@/lib/auth';
import {
  db_careReceivers,
  db_agents,
  db_caregiverLinks,
  type CareReceiver,
  type Agent,
} from '@/lib/db';

export const runtime = 'nodejs';

/**
 * /api/care/onboarding/agent (POST)
 *
 * Body: {
 *   agentName: string,
 *   careReceiver: { name: string, conditions: string[], interests: string[], timezone?: string },
 *   personality: 'pragmatic' | 'friendly' | 'quiet'
 * }
 *
 * Creates the care_receiver + agent + caregiver_link for the current user.
 * One care_receiver per user for MVP (relax in v2).
 */

type Personality = 'pragmatic' | 'friendly' | 'quiet';

const VALID_PERSONALITIES: Personality[] = ['pragmatic', 'friendly', 'quiet'];

function personalityTemplate(personality: Personality, name: string): string {
  switch (personality) {
    case 'pragmatic':
      return `You are ${name}, a caring but pragmatic companion. You remind the care receiver about medications, confirm appointments, and escalate to the family if they don't respond. Keep responses short. Use plain language. Be direct but kind.`;
    case 'friendly':
      return `You are ${name}, a warm and friendly companion. You check in warmly, use gentle encouragement, and keep conversations light. When something needs attention you escalate to the family clearly. Always warm, never alarming.`;
    case 'quiet':
      return `You are ${name}, a calm and quiet companion. You only initiate contact at scheduled times and keep messages brief. You never push for conversation. You escalate only when an actionable event (missed dose, concerning symptom) is detected.`;
  }
}

function sanitizeName(input: string): string {
  const lower = String(input || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return (lower || 'agent').slice(0, 32);
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    const body = (await req.json().catch(() => ({}))) as {
      agentName?: unknown;
      careReceiver?: {
        name?: unknown;
        conditions?: unknown;
        interests?: unknown;
        timezone?: unknown;
      };
      personality?: unknown;
    };

    const agentName = String(body.agentName || '').trim();
    const careReceiverName = String(body.careReceiver?.name || '').trim();
    const personality = String(body.personality || '') as Personality;

    if (!agentName) throw new HttpError(400, 'agentName is required');
    if (!careReceiverName) throw new HttpError(400, 'careReceiver.name is required');
    if (!VALID_PERSONALITIES.includes(personality)) {
      throw new HttpError(400, `personality must be one of: ${VALID_PERSONALITIES.join(', ')}`);
    }

    const conditions = Array.isArray(body.careReceiver?.conditions)
      ? body.careReceiver.conditions.map((c) => String(c).trim()).filter(Boolean)
      : [];
    const interests = Array.isArray(body.careReceiver?.interests)
      ? body.careReceiver.interests.map((c) => String(c).trim()).filter(Boolean)
      : [];
    const timezone = typeof body.careReceiver?.timezone === 'string' && body.careReceiver.timezone
      ? body.careReceiver.timezone
      : 'Africa/Johannesburg';

    // Check user doesn't already have a care receiver (MVP: 1 per user)
    const existing = db_careReceivers.listForUser(user.id);
    if (existing.length > 0) {
      throw new HttpError(
        409,
        `A care receiver is already set up for this account (${existing[0].name}).`,
      );
    }

    // Create care_receiver
    const careReceiver: CareReceiver = db_careReceivers.create({
      tenantId: user.tenant_id,
      name: careReceiverName,
      conditions: JSON.stringify(conditions),
      interests: JSON.stringify(interests),
      timezone,
    });

    // Create agent
    const slug = sanitizeName(agentName);
    const email = `${slug}@care.life.guard`;
    const agent: Agent = db_agents.create({
      tenantId: user.tenant_id,
      careReceiverId: careReceiver.id,
      name: agentName,
      email,
      personality,
      systemPrompt: personalityTemplate(personality, agentName),
    });

    // Link caregiver
    db_caregiverLinks.link(user.id, careReceiver.id);

    return NextResponse.json({
      careReceiver: {
        id: careReceiver.id,
        name: careReceiver.name,
        conditions,
        interests,
        timezone: careReceiver.timezone,
      },
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        personality: agent.personality,
      },
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/care/onboarding/agent',
    methods: ['POST'],
    expects: {
      agentName: 'string',
      careReceiver: { name: 'string', conditions: 'string[]', interests: 'string[]', timezone: 'string?' },
      personality: 'pragmatic | friendly | quiet',
    },
  });
}
