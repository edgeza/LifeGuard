import { NextResponse } from "next/server";
import { loadData } from "@/lib/data";

export async function GET() {
  const data = await loadData();
  return NextResponse.json({
    devices: data.devices,
    responders: data.responders,
    stats: data.stats,
    meta: data.meta,
  });
}
