/**
 * notify.ts — outbound message stubs.
 * Persists every send to the outbound_messages table so we have an
 * auditable trail. Real Twilio + ElevenLabs + Resend are 5-line
 * swaps later.
 */

import { db_outboundMessages } from './db';

export type OutboundChannel = 'sms' | 'voice' | 'email';

export type OutboundMessage = {
  agentId: string;
  channel: OutboundChannel;
  to: string;
  body: string;
};

export async function sendSms(agentId: string, to: string, body: string) {
  const msg = db_outboundMessages.create({
    agentId,
    channel: 'sms',
    toAddress: to,
    body,
  });
  console.log(`[notify:sms] to=${to} body=${body.slice(0, 80)}`);
  return msg;
}

export async function sendVoice(agentId: string, to: string, body: string) {
  const msg = db_outboundMessages.create({
    agentId,
    channel: 'voice',
    toAddress: to,
    body,
  });
  console.log(`[notify:voice] to=${to} body=${body.slice(0, 80)}`);
  return msg;
}

export async function sendEmail(agentId: string, to: string, body: string) {
  const msg = db_outboundMessages.create({
    agentId,
    channel: 'email',
    toAddress: to,
    body,
  });
  console.log(`[notify:email] to=${to} body=${body.slice(0, 80)}`);
  return msg;
}
