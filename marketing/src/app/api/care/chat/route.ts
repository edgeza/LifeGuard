import { NextResponse } from "next/server";

/**
 * /api/care/chat — mock caregiver-to-bot chat endpoint.
 *
 * In production: tool-using agent loop, conversation memory, skill dispatch.
 * Here: deterministic templated responses so the UI works end-to-end
 * without an LLM dependency.
 *
 * The bot on the elder's side is a different endpoint (/api/care/reminder),
 * because it's a scripted reminder agent. This endpoint powers the
 * caregiver's chat window, which has access to the full LLM.
 */

const replies = [
  "Marlene confirmed her metformin at 08:03 and her aspirin at 08:11. She also asked about Dr Patel — confirmed for Thursday at 10:15, Lerato driving.",
  "Adherence this week: 12 of 14 doses logged. Two missed confirmations on Sunday evening — both followed up within 20 minutes, she took them late.",
  "She asked me about Dr Patel this morning. I told her Thursday at 10:15. No medication concerns since the 13:42 follow-up cleared at 14:03.",
  "I logged the conversation. She mentioned the garden, the cats, and her grandchildren today. No signs of cognitive shift in the rolling signals.",
  "Yesterday she asked twice about the same appointment. Pattern delta is +1.2 from the 7-day baseline — within noise but worth a glance on the trend chart.",
];

let counter = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message || "").trim();

    // Echo guard for empty
    if (!message) {
      return NextResponse.json({ reply: "Send something to Esther and she’ll respond." });
    }

    // Tiny artificial latency so the "drafting…" state is visible
    await new Promise((r) => setTimeout(r, 350 + Math.floor(Math.random() * 350)));

    // Deterministic-ish reply rotation
    const reply = replies[counter % replies.length];
    counter += 1;

    return NextResponse.json({
      reply,
      meta: {
        agent: String(body?.agent || "esther"),
        care_receiver: String(body?.care_receiver || "marlene"),
        caregiver: String(body?.caregiver || "lerato"),
        skills_used: ["chat", "memory", "summary"],
        tokens_in: message.split(/\s+/).length,
      },
    });
  } catch {
    return NextResponse.json({ reply: "Couldn't reach the bot. Try again." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/care/chat",
    methods: ["POST"],
    expects: { agent: "string", care_receiver: "string", caregiver: "string", message: "string" },
  });
}