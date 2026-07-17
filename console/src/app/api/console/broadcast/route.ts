import { NextResponse } from "next/server";

interface BroadcastBody {
  geofence?: string;
  audience?: string;
  channels?: string[];
  subject?: string;
  body?: string;
}

export async function POST(req: Request) {
  const json = (await req.json().catch(() => ({}))) as BroadcastBody;
  if (!json.subject || !json.body || !json.geofence || !json.audience) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    id: `bc_${Date.now()}`,
    queued_at: new Date().toISOString(),
    estimated_reach: 1200,
    channels: json.channels,
    message: "Broadcast queued. Fan-out will complete within 30 seconds.",
  });
}
