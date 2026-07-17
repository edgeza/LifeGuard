import Link from "next/link";
import { notFound } from "next/navigation";
import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { statusColor, formatRelativeMinutes, formatTime, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SubscriberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadData();
  const sub = data.subscribers.find((s) => s.id === id);
  if (!sub) notFound();
  const device = data.devices.find((d) => d.address === sub.address);
  const incidents = data.incidents.filter((i) => i.device_id === device?.id);
  const audit = data.audit.filter((a) => a.subject.includes(sub.id) || (device && a.subject.includes(device.id)));
  const c = device ? statusColor(device.status) : statusColor("offline");

  // mock vitals history (24h)
  const vitals24h = Array.from({ length: 24 }, (_, i) => {
    const baseHr = sub.vitals.hr ?? 75;
    const baseSpo2 = sub.vitals.spo2 ?? 97;
    const noise = Math.sin(i * 0.6) * 4 + (Math.random() - 0.5) * 3;
    return { h: i, hr: Math.round(baseHr + noise), spo2: Math.max(90, Math.round(baseSpo2 + (Math.random() - 0.5) * 2)) };
  });
  const maxHr = Math.max(...vitals24h.map((v) => v.hr));

  return (
    <AppShell
      title={sub.name}
      subtitle={`${sub.id} · ${sub.plan} · subscriber since ${sub.since}`}
      right={
        <Link href="/subscribers" className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[12px] text-[#a1a8b3] hover:text-[#e6e9ef]">
          ← All subscribers
        </Link>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_320px] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <section className="overflow-y-auto p-6 space-y-6">
          {/* Identity */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[11px]">
              <Metric label="Age" value={`${sub.age}`} />
              <Metric label="Plan" value={sub.plan} />
              <Metric label="Devices" value={`${sub.devices}`} />
              <Metric label="Primary contact" value={sub.primary_contact} />
            </div>
            <div className="mt-3 text-[12px] text-[#a1a8b3]">{sub.address}</div>
          </div>

          {/* Vitals */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">Vitals — last 24h</h2>
              <span className="text-[10px] text-[#6b7280]">60s resolution · TimescaleDB</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <Vital label="HR" value={sub.vitals.hr !== null ? `${sub.vitals.hr}` : "—"} unit="bpm" tone={sub.vitals.hr && sub.vitals.hr > 110 ? "warn" : "ok"} />
              <Vital label="HRV" value={sub.vitals.hrv !== null ? `${sub.vitals.hrv}` : "—"} unit="ms" tone="ok" />
              <Vital label="SpO₂" value={sub.vitals.spo2 !== null ? `${sub.vitals.spo2}` : "—"} unit="%" tone="ok" />
              <Vital label="Skin temp" value={sub.vitals.skin_temp_c !== null ? `${sub.vitals.skin_temp_c.toFixed(1)}` : "—"} unit="°C" tone="ok" />
            </div>
            {/* HR sparkline */}
            <div className="h-20 w-full">
              <svg viewBox="0 0 240 80" preserveAspectRatio="none" className="h-full w-full">
                <polyline
                  fill="none"
                  stroke="#06b6a4"
                  strokeWidth="1.5"
                  points={vitals24h.map((v, i) => `${(i / 23) * 240},${80 - (v.hr / maxHr) * 72}`).join(" ")}
                />
                <polyline
                  fill="rgba(6,182,164,0.10)"
                  stroke="none"
                  points={`0,80 ${vitals24h.map((v, i) => `${(i / 23) * 240},${80 - (v.hr / maxHr) * 72}`).join(" ")} 240,80`}
                />
              </svg>
            </div>
            <div className="mt-1 flex justify-between text-[9px] mono tabular text-[#6b7280]">
              <span>−24h</span><span>−18h</span><span>−12h</span><span>−6h</span><span>now</span>
            </div>
          </div>

          {/* Device */}
          {device && (
            <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Device</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[11px]">
                <Metric label="Kind" value={device.kind} />
                <Metric label="ID" value={device.id} />
                <Metric label="Battery" value={device.battery !== null ? `${device.battery}%` : "—"} />
                <Metric label="Signal" value={device.signal ? `${device.signal}/5` : "—"} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium" style={{ borderColor: c.ring, background: c.bg, color: c.text }}>{device.status}</span>
                <span className="text-[11px] text-[#6b7280]">Last seen {formatRelativeMinutes(device.last_seen_min)} ago</span>
              </div>
            </div>
          )}

          {/* Emergency contacts */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Emergency contacts (up to 5)</h2>
            <ul className="divide-y divide-[rgba(255,255,255,0.04)]">
              {[
                { name: sub.primary_contact, role: "Primary", phone: "+27 82 555 0142", ack_window: "immediate" },
                { name: "Netcare 911 (private ambulance)", role: "Medical", phone: "+27 11 555 0911", ack_window: "<30s" },
                { name: "CityWatch Armed Response", role: "Operator", phone: "+27 11 555 0011", ack_window: "<15s" },
                { name: "Estate HOA — Hyde Park", role: "Fallback", phone: "+27 11 555 0123", ack_window: "<60s" },
                { name: "Household — Marisha (daughter)", role: "Backup", phone: "+27 71 555 0488", ack_window: "<60s" },
              ].map((c, i) => (
                <li key={i} className="flex items-baseline justify-between gap-3 py-2 text-[12px]">
                  <div>
                    <div className="text-[#e6e9ef] font-medium">{c.name}</div>
                    <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">{c.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="mono tabular text-[12px] text-[#a1a8b3]">{c.phone}</div>
                    <div className="text-[10px] text-[#6b7280]">ack window {c.ack_window}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Action history */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Action history</h2>
            <ol className="space-y-2">
              {incidents.length > 0 ? incidents.map((inc) => (
                <li key={inc.id} className="flex items-start gap-3 text-[12px]">
                  <span className="mono tabular text-[11px] text-[#6b7280]">{formatDateShort(inc.opened_at)}</span>
                  <Link href={`/incidents/${inc.id}`} className="text-[#e6e9ef] hover:text-[#06b6a4]">{inc.trigger}</Link>
                  <span className="text-[#6b7280]">· {inc.status}</span>
                </li>
              )) : (
                <li className="text-[12px] text-[#6b7280]">No incidents recorded for this subscriber.</li>
              )}
            </ol>
          </div>
        </section>

        {/* Right — map preview + audit */}
        <aside className="overflow-y-auto p-5 space-y-5">
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Last known location</h3>
            <div className="relative h-32 rounded-md border border-[rgba(255,255,255,0.06)] hex-bg overflow-hidden">
              <div className="absolute inset-0 streets-overlay" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-3 w-3 place-items-center rounded-full border border-[rgba(6,182,164,0.55)] bg-[rgba(6,182,164,0.30)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#06b6a4]" />
              </div>
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between text-[9px] mono tabular text-[#6b7280]">
                <span>{sub.lat.toFixed(3)}</span>
                <span>{sub.lng.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Audit slice</h3>
            {audit.length > 0 ? (
              <ul className="space-y-1.5">
                {audit.slice(0, 6).map((a) => (
                  <li key={a.id} className="text-[11px]">
                    <div className="mono tabular text-[10px] text-[#6b7280]">{formatTime(a.ts)}</div>
                    <div className="text-[#e6e9ef]"><span className="text-[#06b6a4]">{a.action}</span> · {a.actor}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[11px] text-[#6b7280]">No audit entries reference this subscriber.</div>
            )}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f1114] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">{label}</div>
      <div className="text-[12px] text-[#e6e9ef]">{value}</div>
    </div>
  );
}

function Vital({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: "ok" | "warn" | "danger" }) {
  const colors = tone === "warn" ? "#fbbf24" : tone === "danger" ? "#fca5a5" : "#5eead4";
  return (
    <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="mono tabular text-[20px] font-medium" style={{ color: colors }}>{value}</span>
        <span className="text-[10px] text-[#6b7280]">{unit}</span>
      </div>
    </div>
  );
}
