import Link from "next/link";
import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { statusColor, aiScoreColor, formatTime, formatDateShort } from "@/lib/format";
import { ExportButton } from "@/components/ExportButton";

export const dynamic = "force-dynamic";

export default async function IncidentsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; score?: string }> }) {
  const data = await loadData();
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const status = sp.status ?? "all";
  const score = sp.score ?? "all";

  const incidents = data.incidents.filter((i) => {
    if (q && !(`${i.wearer} ${i.address} ${i.id} ${i.trigger}`.toLowerCase().includes(q))) return false;
    if (status !== "all" && i.status !== status) return false;
    if (score === "high" && i.ai_score < 0.8) return false;
    if (score === "med" && (i.ai_score < 0.5 || i.ai_score >= 0.8)) return false;
    if (score === "low" && i.ai_score >= 0.5) return false;
    return true;
  });

  const order: Record<string, number> = { open: 0, acknowledged: 1, on_scene: 2, resolved: 3 };
  incidents.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || b.ai_score - a.ai_score);

  const counts = {
    open: data.incidents.filter((i) => i.status === "open").length,
    ack: data.incidents.filter((i) => i.status === "acknowledged").length,
    scene: data.incidents.filter((i) => i.status === "on_scene").length,
    resolved: data.incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    <AppShell
      title="Incidents"
      subtitle={`${incidents.length} of ${data.incidents.length} · open ${counts.open} · ack ${counts.ack} · on-scene ${counts.scene} · resolved ${counts.resolved}`}
      right={<ExportButton data={data.incidents} filename="incidents.csv" />}
    >
      <div className="grid grid-cols-[260px_minmax(0,1fr)] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <aside className="p-4 space-y-5 text-[13px]">
          <form className="space-y-2" action="/incidents" method="get">
            <div className="flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6b7280]"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input name="q" defaultValue={q} placeholder="Search wearer, address, ID…" className="flex-1 bg-transparent text-[12px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" />
            </div>
            <select name="status" defaultValue={status} className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0f1114] px-2 py-1.5 text-[12px] text-[#e6e9ef]">
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="on_scene">On scene</option>
              <option value="resolved">Resolved</option>
            </select>
            <select name="score" defaultValue={score} className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0f1114] px-2 py-1.5 text-[12px] text-[#e6e9ef]">
              <option value="all">All AI scores</option>
              <option value="high">≥ 0.80 (high)</option>
              <option value="med">0.50–0.79 (med)</option>
              <option value="low">&lt; 0.50 (low)</option>
            </select>
            <button type="submit" className="w-full rounded-md bg-[#06b6a4] px-3 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488]">Apply filters</button>
          </form>

          <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3 text-[11px] text-[#a1a8b3] space-y-1">
            <div className="font-medium text-[#e6e9ef] text-[12px]">Today's KPIs</div>
            <div className="flex justify-between"><span>Open</span><span className="mono tabular">{data.stats.open_incidents}</span></div>
            <div className="flex justify-between"><span>Incidents today</span><span className="mono tabular">{data.stats.incidents_today}</span></div>
            <div className="flex justify-between"><span>Acked &lt; 30s</span><span className="mono tabular">{data.stats.incidents_acked_in_30s_pct}%</span></div>
            <div className="flex justify-between"><span>Avg response</span><span className="mono tabular">{data.stats.avg_response_min} min</span></div>
          </div>
        </aside>

        <section className="overflow-y-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-[#0a0b0d] z-10">
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-left text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                <th className="px-4 py-2 w-28">Opened</th>
                <th className="px-4 py-2 w-44">Incident</th>
                <th className="px-4 py-2">Wearer / Address</th>
                <th className="px-4 py-2">Trigger</th>
                <th className="px-4 py-2 text-right w-20">AI</th>
                <th className="px-4 py-2 w-28">Status</th>
                <th className="px-4 py-2 w-32">Responder</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => {
                const sc = statusColor(inc.status);
                const aic = aiScoreColor(inc.ai_score);
                const responder = inc.responder_dispatched ? data.responders.find((r) => r.id === inc.responder_dispatched) : null;
                return (
                  <tr key={inc.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.025)]">
                    <td className="px-4 py-2 mono text-[11px] text-[#a1a8b3] tabular">
                      {formatDateShort(inc.opened_at)}<br/>{formatTime(inc.opened_at)}
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/incidents/${inc.id}`} className="font-medium text-[#e6e9ef] hover:text-[#06b6a4]">{inc.id}</Link>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-[#e6e9ef]">{inc.wearer}</div>
                      <div className="text-[11px] text-[#6b7280]">{inc.address}</div>
                    </td>
                    <td className="px-4 py-2 text-[#a1a8b3]">{inc.trigger}</td>
                    <td className="px-4 py-2 text-right">
                      <span className="mono tabular text-[12px]" style={{ color: aic }}>{inc.ai_score.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-medium" style={{ borderColor: sc.ring, background: sc.bg, color: sc.text }}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[12px] text-[#a1a8b3]">
                      {responder ? responder.callsign : "—"}
                      {inc.responder_eta_min !== null && inc.responder_eta_min !== undefined && (
                        <span className="ml-1.5 text-[#6b7280]">· ETA {inc.responder_eta_min}m</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {incidents.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[12px] text-[#6b7280]">No incidents match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}
