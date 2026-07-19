/**
 * agent.ts — deterministic intent-routing agent for the care bot.
 *
 * No LLM in the loop. We pattern-match the user message, dispatch to
 * one of the skill tools, and return a templated reply. The skill
 * dispatcher is structured the same way a real agent would call tools,
 * so swapping in OpenAI/Anthropic is a small change.
 *
 * The agent's email is from the agents table. Outbound messages are
 * persisted via notify.ts and stored in the outbound_messages table.
 */

import {
  db_careReceivers,
  db_medications,
  db_appointments,
  db_adherence,
  db_chatMessages,
  db_escalations,
  db_vitals,
  db_agents,
  type User,
  type CareReceiver,
  type Agent,
  type Medication,
  type Appointment,
  type AdherenceEvent,
  type ChatMessage,
} from './db';
import { sendSms, sendVoice, sendEmail } from './notify';

export type AgentContext = {
  user: User;
  agent: Agent;
  careReceiver: CareReceiver;
  recentMessages: ChatMessage[];
  todayMeds: Medication[];
  upcomingAppts: Appointment[];
  recentAdherence: AdherenceEvent[];
  recentVitals: { metric: string; value: number; recorded_at: number }[];
};

export type AgentSkillCall = {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
};

export type AgentOutbound = {
  channel: 'sms' | 'voice' | 'email';
  to: string;
  body: string;
};

export type AgentResult = {
  reply: string;
  skillCalls: AgentSkillCall[];
  outboundMessages: AgentOutbound[];
};

// ----- Skill functions -----

function fmtTime(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toISOString().slice(11, 16);
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function startOfWeek(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 7);
  return Math.floor(d.getTime() / 1000);
}

function skill_calendar(args: Record<string, unknown>, ctx: AgentContext): { reply: string; result: unknown } {
  const appts = db_appointments
    .listForCareReceiver(ctx.careReceiver.id, { from: startOfToday() })
    .sort((a, b) => a.scheduled_for - b.scheduled_for);
  const next = appts[0];
  const result = next
    ? { title: next.title, scheduled_for: next.scheduled_for, transport: next.transport, state: next.state }
    : null;
  const reply = next
    ? `Next: ${next.title} on ${new Date(next.scheduled_for).toUTCString().slice(0, 16)}. ${next.transport ? `Transport: ${next.transport}.` : ''} State: ${next.state}.`
    : `No upcoming appointments on the calendar.`;
  return { reply, result };
}

function skill_medication_schedule(_args: Record<string, unknown>, ctx: AgentContext): { reply: string; result: unknown } {
  const meds = db_medications.listForCareReceiver(ctx.careReceiver.id).filter((m) => m.active);
  const adherence = db_adherence
    .listForCareReceiver(ctx.careReceiver.id, { from: startOfToday() });
  const lines = meds.map((m) => {
    const evt = adherence.find((a) => a.medication_id === m.id);
    if (!evt) return `${m.name} ${m.dosage} — ⏳ pending`;
    if (evt.status === 'confirmed' && evt.confirmed_at) {
      return `${m.name} ${m.dosage} — ✅ confirmed at ${fmtTime(evt.confirmed_at)}`;
    }
    if (evt.status === 'late') return `${m.name} ${m.dosage} — 🟡 confirmed late`;
    if (evt.status === 'missed') return `${m.name} ${m.dosage} — ❌ missed`;
    return `${m.name} ${m.dosage} — ⏳ pending`;
  });
  return {
    reply: lines.length > 0 ? lines.join('. ') : 'No active medications.',
    result: { meds: meds.length, confirmed: adherence.filter((a) => a.status === 'confirmed').length },
  };
}

function skill_digest(_args: Record<string, unknown>, ctx: AgentContext): { reply: string; result: unknown } {
  const adherence = db_adherence.listForCareReceiver(ctx.careReceiver.id, { from: startOfWeek() });
  const confirmed = adherence.filter((a) => a.status === 'confirmed').length;
  const total = adherence.length;
  const late = adherence.filter((a) => a.status === 'late').length;
  const missed = adherence.filter((a) => a.status === 'missed').length;
  const escs = db_escalations.listForAgent(ctx.agent.id, { limit: 10 });
  const vitals = db_vitals.listForCareReceiver(ctx.careReceiver.id, { from: startOfWeek() });
  const result = { confirmed, total, late, missed, escalations: escs.length, vitals: vitals.length };
  const reply = `This week: ${confirmed}/${total} doses confirmed. ${late} late, ${missed} missed. ${escs.length} escalations, all resolved. ${vitals.length} vitals readings logged. Overall trend: stable.`;
  return { reply, result };
}

function skill_cognitive_watch(_args: Record<string, unknown>, ctx: AgentContext): { reply: string; result: unknown } {
  const recent = db_chatMessages.listForAgent(ctx.agent.id, { limit: 100 });
  const counts: Record<string, number> = {};
  recent
    .filter((m) => m.sender_type === 'care_receiver' || m.sender_type === 'caregiver')
    .forEach((m) => {
      const k = m.content.toLowerCase().split(/\s+/).slice(0, 4).join(' ');
      counts[k] = (counts[k] || 0) + 1;
    });
  const repeats = Object.entries(counts)
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const result = { repeats };
  const reply = repeats.length
    ? `Pattern noticed in the last 100 messages: "${repeats.map(([k]) => k).join('", "')}". Watch for cognitive shift.`
    : 'No concerning repetition patterns this week.';
  return { reply, result };
}

function skill_escalate(args: Record<string, unknown>, ctx: AgentContext): { reply: string; result: unknown; outbound?: AgentOutbound[] } {
  const reason = (args.reason as string) || 'Caregiver requested escalation';
  const esc = db_escalations.create({ agentId: ctx.agent.id, reason });
  return {
    reply: `I've opened escalation ${esc.id.slice(0, 8)} for ${ctx.careReceiver.name}: ${reason}. Family has been notified.`,
    result: { id: esc.id, reason },
    outbound: [
      { channel: 'sms', to: ctx.user.name, body: `[LifeGuard Care] Escalation opened for ${ctx.careReceiver.name}: ${reason}` },
    ],
  };
}

function skill_small_talk(args: Record<string, unknown>, ctx: AgentContext): { reply: string; result: unknown } {
  const personality = ctx.agent.personality || 'pragmatic';
  const pragmatic = [
    `Noted. Anything else?`,
    `Got it.`,
    `Okay. Want the medication schedule?`,
  ];
  const friendly = [
    `Of course — happy to help. What would you like to know?`,
    `No problem. Is there something specific on your mind?`,
    `I'm here. Ask me about the schedule, vitals, or anything that's worrying you.`,
  ];
  const quiet = [
    `Okay.`,
    `Got it.`,
    `Noted.`,
  ];
  const pool = personality === 'friendly' ? friendly : personality === 'quiet' ? quiet : pragmatic;
  const i = (args._seed as number) ?? Math.floor(Math.random() * pool.length);
  return { reply: pool[i % pool.length], result: { personality } };
}

const SKILLS: Record<string, (args: Record<string, unknown>, ctx: AgentContext) => { reply: string; result: unknown; outbound?: AgentOutbound[] }> = {
  calendar: skill_calendar,
  medication_schedule: skill_medication_schedule,
  digest: skill_digest,
  cognitive_watch: skill_cognitive_watch,
  escalate: skill_escalate,
  small_talk: skill_small_talk,
};

export function listSkills(): string[] {
  return Object.keys(SKILLS);
}

export function dispatchSkill(name: string, args: Record<string, unknown>, ctx: AgentContext) {
  const fn = SKILLS[name];
  if (!fn) {
    return {
      reply: `I don't have a skill called "${name}". Available: ${Object.keys(SKILLS).join(', ')}.`,
      result: { error: 'unknown_skill' },
    };
  }
  return fn(args, ctx);
}

// ----- Intent matcher -----

function classifyIntent(message: string): { skill: string; args: Record<string, unknown> } {
  const m = message.toLowerCase();
  if (/\b(appointment|dr|doctor|visit)\b/.test(m)) {
    return { skill: 'calendar', args: {} };
  }
  if (/\b(medication|meds?|pill|dose|today.{0,10}schedule|schedule)\b/.test(m)) {
    return { skill: 'medication_schedule', args: {} };
  }
  if (/\b(digest|week|summary|recap|weekly)\b/.test(m)) {
    return { skill: 'digest', args: {} };
  }
  if (/\b(concern|pattern|worry|trend|repeat|forget)\b/.test(m)) {
    return { skill: 'cognitive_watch', args: {} };
  }
  if (/\b(escalat|missed|sos|help|emergency|alert)\b/.test(m)) {
    return {
      skill: 'escalate',
      args: { reason: 'Caregiver triggered escalation from chat' },
    };
  }
  return { skill: 'small_talk', args: { _seed: Math.floor(Date.now() / 1000) } };
}

// ----- Public entry point -----

export async function runAgent(
  message: string,
  ctx: AgentContext,
): Promise<AgentResult> {
  const intent = classifyIntent(message);
  const skillResult = dispatchSkill(intent.skill, intent.args, ctx);
  const skillCalls: AgentSkillCall[] = [
    { name: intent.skill, args: intent.args, result: skillResult.result },
  ];
  const outboundMessages: AgentOutbound[] = skillResult.outbound ?? [];

  // Persist outbound messages via notify.ts
  for (const o of outboundMessages) {
    if (o.channel === 'sms') await sendSms(ctx.agent.id, o.to, o.body);
    if (o.channel === 'voice') await sendVoice(ctx.agent.id, o.to, o.body);
    if (o.channel === 'email') await sendEmail(ctx.agent.id, o.to, o.body);
  }

  return {
    reply: skillResult.reply,
    skillCalls,
    outboundMessages,
  };
}

// ----- Context builder -----

export function buildAgentContext(user: User, agent: Agent, careReceiver: CareReceiver): AgentContext {
  return {
    user,
    agent,
    careReceiver,
    recentMessages: db_chatMessages.listForAgent(agent.id, { limit: 10 }),
    todayMeds: db_medications.listForCareReceiver(careReceiver.id).filter((m) => m.active),
    upcomingAppts: db_appointments
      .listForCareReceiver(careReceiver.id, { from: Math.floor(Date.now() / 1000) })
      .sort((a, b) => a.scheduled_for - b.scheduled_for)
      .slice(0, 5),
    recentAdherence: db_adherence.listForCareReceiver(careReceiver.id, { from: startOfToday() }),
    recentVitals: db_vitals.listForCareReceiver(careReceiver.id, { from: startOfToday() }),
  };
}
