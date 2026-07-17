import Link from "next/link";
import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { statusColor, formatRelativeMinutes } from "@/lib/format";
import { ExportButton } from "@/components/ExportButton";

export const dynamic = "force-dynamic";

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ q?: string; plan?: string }> }) {
  const data = await loadData();
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const plan = sp.plan ?? "all";

  const enriched = data.subscribers.map((s) => {
    const dev = data.devices.find((d) => d.address === s.address);
    return { ...s, status: dev?.status ?? "offline", device_kind: dev?.kind ?? "—" };
  });

  const filtered = enriched.filter((s) => {
    if (q && !`${s.name} ${s.address} ${s.id} ${s.primary_contact}`.toLowerCase().includes(q)) return false;
    if (plan !== "all" && s.plan !== plan) return false;
    return true;
  });

  const plans = Array.from(new Set(enriched.map((s) => s.plan)));

  return (
    <AppShell
      title="Subscribers"
      subtitle={`${filtered.length} of ${enriched.length} · ${data.stats.subscribers_online} devices online in active region`}
      right={<ExportButton data={filtered} filename="subscribers.csv" />}
    >
      <div className="grid grid-cols-[260px_minmax(0,1fr)] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <aside className="p-4 space-y-3">
          <form className="space-y-2" action="/subscribers" method="get">
            <div className="flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6b7280]"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input name="q" defaultValue={q} placeholder="Name, address, contact…" className="flex-1 bg-transparent text-[12px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" />
            </div>
            <select name="plan" defaultValue={plan} className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0f1114] px-2 py-1.5 text-[12px] text-[#e6e9ef]">
              <option value="all">All plans</option>
              {plans.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button type="submit" className="w-full rounded-md bg-[#06b6a4] px-3 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488]">Apply</button>
          </form>

          <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3 text-[11px] text-[#a1a8b3] space-y-1">
            <div className="font-medium text-[#e6e9ef] text-[12px]">Region snapshot</div>
            <div className="flex justify-between"><span>Total in region</span><span className="mono tabular">{data.stats.subscribers_total.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Devices active (24h)</span><span className="mono tabular">2,718</span></div>
            <div className="flex justify-between"><span>Plan mix</span><span className="mono tabular">CD 61% · SP 19% · OP 17% · NT 3%</span></div>
          </div>
        </aside>

        <section className="overflow-y-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-[#0a0b0d] z-10">
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-left text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                <th className="px-4 py-2">Subscriber</th>
                <th className="px-4 py-2 w-24">Age</th>
                <th className="px-4 py-2 w-36">Plan</th>
                <th className="px-4 py-2 w-32">Device</th>
                <th className="px-4 py-2 w-28">Status</th>
                <th className="px-4 py-2 w-28">Open incidents</th>
                <th className="px-4 py-2 w-28">Since</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const c = statusColor(s.status);
                return (
                  <tr key={s.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.025)]">
                    <td className="px-4 py-2">
                      <Link href={`/subscribers/${s.id}`} className="font-medium text-[#e6e9ef] hover:text-[#06b6a4]">{s.name}</Link>
                      <div className="text-[11px] text-[#6b7280]">{s.address}</div>
                    </td>
                    <td className="px-4 py-2 text-[#a1a8b3] mono tabular">{s.age}</td>
                    <td className="px-4 py-2 text-[#a1a8b3]">{s.plan}</td>
                    <td className="px-4 py-2 text-[#a1a8b3]">{s.device_kind}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-medium" style={{ borderColor: c.ring, background: c.bg, color: c.text }}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {s.open_incidents > 0
                        ? <span className="mono text-[12px] tabular text-[#fca5a5]">{s.open_incidents}</span>
                        : <span className="text-[#6b7280]">0</span>}
                    </td>
                    <td className="px-4 py-2 text-[#a1a8b3] mono tabular text-[11px]">{s.since}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[12px] text-[#6b7280]">No subscribers match.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}
