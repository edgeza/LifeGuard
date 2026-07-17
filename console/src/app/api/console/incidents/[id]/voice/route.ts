import { NextResponse } from "next/server";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return NextResponse.json({
    ok: true,
    incident_id: id,
    session_id: `vs_${id}_${Date.now()}`,
    opened_at: new Date().toISOString(),
    channels: ["device_mic", "device_speaker"],
    message: "Two-way voice session opened with device.",
  });
}
