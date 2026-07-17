import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { formatTime, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ShiftsPage() {
  const data = await loadData();
  const activeShift = data.shifts.find((s) => s.kind === "day")!;
  const nextShift = data.shifts.find((s) => s.kind === "night")!;

  return (
    <AppShell
      title="Shifts"
      subtitle={`Day shift active · ${formatDateShort(activeShift.starts)} ${formatTime(activeShift.starts)}–${formatTime(activeShift.ends)}`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_320px] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <section className="overflow-y-auto p-6 space-y-6">
          {/* Active shift */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 className="text-[16px] font-medium text-[#e6e9ef]">Day shift — active</h2>
                <p className="text-[12px] text-[#a1a8b3]">{activeShift.id} · {formatTime(activeShift.starts)}–{formatTime(activeShift.ends)} SAST</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.10)] px-2 py-0.5 text-[11px] font-medium text-[#6ee7b7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] pulse-dot" /> LIVE
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {activeShift.active_staff.map((s) => (
                <div key={s.callsign} className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="text-[13px] font-medium text-[#e6e9ef]">{s.name}</div>
                  <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">{s.role}</div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <div className="text-[#6b7280]">Callsign</div>
                      <div className="mono tabular text-[#a1a8b3]">{s.callsign}</div>
                    </div>
                    <div>
                      <div className="text-[#6b7280]">Handled</div>
                      <div className="mono tabular text-[#a1a8b3]">{s.incidents_handled}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next shift preview */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-medium text-[#e6e9ef]">Night shift — upcoming</h2>
                <p className="text-[12px] text-[#a1a8b3]">{nextShift.id} · {formatTime(nextShift.starts)}–{formatTime(nextShift.ends)} SAST</p>
              </div>
              <span className="text-[11px] text-[#6b7280]">starts in {5}h {47}m</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {nextShift.active_staff.map((s) => (
                <div key={s.callsign} className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3 opacity-75">
                  <div className="text-[13px] font-medium text-[#e6e9ef]">{s.name}</div>
                  <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">{s.role}</div>
                  <div className="mt-2 text-[11px] mono tabular text-[#6b7280]">{s.callsign}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Handoff notes */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Handoff notes</h2>
            <ul className="space-y-3">
              {data.handoff_notes.map((n) => (
                <li key={n.id} className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[12px]"><span className="text-[#e6e9ef] font-medium">{n.from}</span> → <span className="text-[#e6e9ef] font-medium">{n.to}</span></span>
                    <span className="mono tabular text-[10px] text-[#6b7280]">{formatDateShort(n.at)} {formatTime(n.at)}</span>
                  </div>
                  <p className="text-[12px] text-[#a1a8b3]">{n.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="overflow-y-auto p-5 space-y-5">
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Shift summary</h3>
            <div className="space-y-2 text-[12px]">
              <Row k="On call" v={`${activeShift.active_staff.length} operators`} />
              <Row k="Incidents handled" v={`${activeShift.active_staff.reduce((s, x) => s + x.incidents_handled, 0)}`} />
              <Row k="Open at handoff" v="1 (Lerato Dlamini — Sandton)" />
              <Row k="Resps in field" v="5 / 6" />
              <Row k="Acknowledged &lt; 30s" v={`${data.stats.incidents_acked_in_30s_pct}%`} />
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Add handoff note</h3>
            <textarea className="w-full min-h-24 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-2 text-[12px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" placeholder="What should the next shift know?" />
            <button className="mt-2 w-full rounded-md bg-[#06b6a4] px-3 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488]">Post handoff</button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] uppercase tracking-wider text-[#6b7280]">{k}</span>
      <span className="text-[12px] text-[#e6e9ef]">{v}</span>
    </div>
  );
}
