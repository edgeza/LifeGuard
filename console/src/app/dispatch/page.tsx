import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { statusColor, formatRelativeMinutes } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const data = await loadData();
  const groups = {
    available: data.responders.filter((r) => r.status === "available"),
    dispatched: data.responders.filter((r) => r.status === "dispatched"),
    on_scene: data.responders.filter((r) => r.status === "on_scene"),
    returning: data.responders.filter((r) => r.status === "returning"),
  };

  const activeDispatches = data.incidents
    .filter((i) => i.responder_dispatched)
    .map((i) => ({ ...i, responder: data.responders.find((r) => r.id === i.responder_dispatched)! }));

  return (
    <AppShell
      title="Dispatch"
      subtitle={`${data.responders.length} units · ${groups.available.length} avail · ${groups.dispatched.length} en route · ${groups.on_scene.length} on scene`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_360px] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        {/* Fleet grid */}
        <section className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {data.responders.map((r) => {
              const c = statusColor(r.status);
              return (
                <div key={r.id} className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[16px] font-medium text-[#e6e9ef]">{r.callsign}</div>
                      <div className="text-[11px] text-[#6b7280]">{r.zone}</div>
                    </div>
                    <span className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium" style={{ borderColor: c.ring, background: c.bg, color: c.text }}>{r.status}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-px rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[11px]">
                    <Cell label="Crew" value={r.crew.join(", ")} />
                    <Cell label="Vehicle" value={r.vehicle} />
                    <Cell label="ETA" value={r.eta_min !== null ? `${r.eta_min} min` : "—"} />
                    <Cell label="Today" value={`${r.incidents_handled_today}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Active dispatches</h2>
            <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] divide-y divide-[rgba(255,255,255,0.04)]">
              {activeDispatches.map((d) => (
                <div key={d.id} className="grid grid-cols-[110px_140px_minmax(0,1fr)_120px_80px] items-center gap-3 px-4 py-3 text-[13px]">
                  <span className="mono tabular text-[11px] text-[#6b7280]">{d.id}</span>
                  <span className="text-[#e6e9ef]">{d.responder.callsign}</span>
                  <span className="truncate text-[#a1a8b3]">{d.wearer} · {d.address}</span>
                  <span className="text-[#a1a8b3]">{d.responder_eta_min !== null ? `ETA ${d.responder_eta_min} min` : "—"}</span>
                  <span className="text-right">
                    <span className="inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-medium" style={{ ...statusColorChip(d.status) }}>
                      {d.status}
                    </span>
                  </span>
                </div>
              ))}
              {activeDispatches.length === 0 && (
                <div className="px-4 py-8 text-center text-[12px] text-[#6b7280]">No active dispatches.</div>
              )}
            </div>
          </div>
        </section>

        {/* Live routing panel */}
        <aside className="overflow-y-auto p-5 space-y-5">
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Routing policy</h3>
            <ul className="space-y-2 text-[12px] text-[#a1a8b3]">
              <li>Family mode — SMS to contacts only</li>
              <li>Operator mode — subscriber's security company</li>
              <li>Network mode — nearest professional responder</li>
            </ul>
            <div className="mt-3 rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-2 text-[11px] text-[#6b7280]">
              Avg response time today: <span className="mono tabular text-[#5eead4]">{data.stats.avg_response_min} min</span>. Goal &lt; 5 min in urban zones.
            </div>
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Heatmap (today, by zone)</h3>
            <div className="space-y-1.5">
              {[
                ["Sandton Central", 4, 0.62],
                ["Rosebank", 3, 0.48],
                ["Parkhurst", 1, 0.18],
                ["Hyde Park", 2, 0.34],
                ["Sandown", 1, 0.16],
                ["Illovo / Melrose", 1, 0.20],
                ["Parktown N / Parkview", 0, 0.04],
                ["Dunkeld", 0, 0.02],
              ].map(([zone, n, t]) => (
                <div key={zone as string} className="flex items-center gap-2 text-[11px]">
                  <span className="w-32 truncate text-[#a1a8b3]">{zone}</span>
                  <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(t as number) * 100}%`, background: (t as number) > 0.5 ? "rgba(220,38,38,0.55)" : (t as number) > 0.3 ? "rgba(245,158,11,0.55)" : "rgba(6,182,164,0.45)" }} />
                  </div>
                  <span className="mono tabular text-[10px] text-[#6b7280] w-6 text-right">{n as number}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f1114] px-2.5 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-[#6b7280]">{label}</div>
      <div className="text-[11px] text-[#e6e9ef] truncate">{value}</div>
    </div>
  );
}

function statusColorChip(s: string) {
  const c = statusColor(s);
  return { borderColor: c.ring, background: c.bg, color: c.text };
}
