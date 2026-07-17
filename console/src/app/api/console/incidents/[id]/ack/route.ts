import { NextResponse } from "next/server";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return NextResponse.json({
    ok: true,
    incident_id: id,
    acked_at: new Date().toISOString(),
    acked_by: "Operator (current session)",
    message: "Incident acknowledged. Voice session ready to open.",
  });
}
