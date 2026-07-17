import { NextResponse } from "next/server";
import { loadData } from "@/lib/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() ?? "";
  const limit = Number(url.searchParams.get("limit") ?? "200");
  const data = await loadData();
  const events = data.audit
    .filter((e) =>
      q ? e.actor.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q) : true
    )
    .slice(0, limit);
  return NextResponse.json({ events, total: data.audit.length });
}
