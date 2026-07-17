import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { ExportButton } from "@/components/ExportButton";
import { formatTime, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ q?: string; actor?: string }> }) {
  const data = await loadData();
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const actor = sp.actor ?? "all";

  const events = data.audit.filter((e) => {
    if (actor !== "all" && e.actor !== actor) return false;
    if (q && !`${e.actor} ${e.action} ${e.subject} ${e.hash}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const actors = Array.from(new Set(data.audit.map((e) => e.actor)));

  return (
    <AppShell
      title="Audit log"
      subtitle={`${events.length} of ${data.audit.length} entries · immutable · 7-year retention`}
      right={<ExportButton data={events} filename="audit.csv" />}
    >
      <div className="grid grid-cols-[260px_minmax(0,1fr)] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <aside className="p-4 space-y-3">
          <form className="space-y-2" action="/audit" method="get">
            <div className="flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6b7280]"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input name="q" defaultValue={q} placeholder="Search actor, action, subject…" className="flex-1 bg-transparent text-[12px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" />
            </div>
            <select name="actor" defaultValue={actor} className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0f1114] px-2 py-1.5 text-[12px] text-[#e6e9ef]">
              <option value="all">All actors</option>
              {actors.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <button type="submit" className="w-full rounded-md bg-[#06b6a4] px-3 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488]">Apply</button>
          </form>

          <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3 text-[11px] text-[#a1a8b3] space-y-1">
            <div className="font-medium text-[#e6e9ef] text-[12px]">Retention</div>
            <p>Every operator action, partner config change, and firmware event is hashed and stored immutably.</p>
            <p className="mono text-[10px] text-[#6b7280]">sha256 · tamper-evident · 7-year retention</p>
          </div>
        </aside>

        <section className="overflow-y-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-[#0a0b0d] z-10">
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-left text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                <th className="px-4 py-2 w-36">Timestamp</th>
                <th className="px-4 py-2 w-48">Actor</th>
                <th className="px-4 py-2 w-40">Action</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2 w-28">IP</th>
                <th className="px-4 py-2 w-32 text-right">Hash</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.025)]">
                  <td className="px-4 py-2 mono text-[11px] text-[#a1a8b3] tabular">
                    {formatDateShort(e.ts)}<br/>{formatTime(e.ts)}
                  </td>
                  <td className="px-4 py-2 text-[#e6e9ef]">{e.actor}</td>
                  <td className="px-4 py-2"><span className="text-[#06b6a4]">{e.action}</span></td>
                  <td className="px-4 py-2 text-[#a1a8b3] truncate max-w-md">{e.subject}</td>
                  <td className="px-4 py-2 mono tabular text-[11px] text-[#6b7280]">{e.ip}</td>
                  <td className="px-4 py-2 mono tabular text-[10px] text-[#6b7280] text-right">{e.hash}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[12px] text-[#6b7280]">No audit entries match.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}
