import { NextResponse } from "next/server";
import { loadData } from "@/lib/data";

export async function GET() {
  const data = await loadData();
  // Sort incidents: open first by ai_score desc, then acked, then resolved.
  const order: Record<string, number> = { open: 0, acknowledged: 1, on_scene: 2, resolved: 3 };
  const sorted = [...data.incidents].sort((a, b) => {
    const o = (order[a.status] ?? 9) - (order[b.status] ?? 9);
    if (o !== 0) return o;
    return b.ai_score - a.ai_score;
  });
  return NextResponse.json({ incidents: sorted, stats: data.stats });
}
