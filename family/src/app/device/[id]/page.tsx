import Link from "next/link";
import { notFound } from "next/navigation";
import { devices, getDevice, contacts, timeline } from "@/lib/data";
import StatusPill from "@/components/StatusPill";
import Sparkline from "@/components/Sparkline";

export function generateStaticParams() {
  return devices.map((d) => ({ id: d.id }));
}

export default function DevicePage({ params }: { params: { id: string } }) {
  const d = getDevice(params.id);
  if (!d) notFound();

  const events = timeline.filter((t) => t.deviceId === d.id).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-[14px] text-muted">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2 text-subtle">/</span>
        <span className="text-ink">{d.name}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-start gap-5">
          <div className="h-14 w-14 rounded-full bg-line2 text-ink grid place-items-center font-medium text-[20px]">
            {d.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-h1 font-medium">{d.name}</h1>
              <StatusPill status={d.status} />
            </div>
            <p className="text-muted mt-1 text-[15px] tabular">
              {d.city} · {d.deviceModel} · {d.age ? `Age ${d.age}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/device/${d.id}/vitals`}
            className="inline-flex items-center min-h-tap px-4 rounded-md border hairline text-[15px] hover:bg-white"
          >
            30-day vitals
          </Link>
          <Link
            href={`/device/${d.id}/history`}
            className="inline-flex items-center min-h-tap px-4 rounded-md bg-ink text-white text-[15px] hover:bg-black"
          >
            Event history
          </Link>
        </div>
      </header>

      {/* Two-column main composition */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-6">
        {/* Vitals snapshot */}
        <section className="bg-white shadow-card rounded-xl border hairline">
          <div className="p-6 border-b hairline">
            <h2 className="text-[18px] font-medium">Vitals right now</h2>
            <p className="text-[13px] text-muted mt-0.5">
              Last reading {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · 60s resolution
            </p>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <BigStat label="Heart rate" value={d.hr || "—"} unit="bpm" sub="Resting" trend={d.hrTrend} />
            <BigStat label="HRV"        value={d.hrv || "—"} unit="ms" sub="rMSSD"   trend={d.hrvTrend} warn={d.fallRiskLabel === "Elevated"} />
            <BigStat label="SpO₂"       value={d.spo2 || "—"} unit="%"   sub="Blood O₂" trend={d.spo2Trend} />
            <BigStat label="Sleep"      value={d.sleepHrs.toFixed(1)} unit="hr" sub="Last night" />
          </div>

          <div className="px-6 pb-6">
            <div className="border hairline rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-muted">7-day steps</div>
                  <div className="text-[18px] font-medium tabular">{d.steps.toLocaleString()} today</div>
                </div>
                <div className="w-1/2 max-w-[420px]">
                  <Sparkline values={d.stepsTrend} height={42} stroke="#1f2937" fill="rgba(31,41,55,0.06)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right rail: location, last fall, fall risk, contacts */}
        <aside className="space-y-6">
          <Card title="Location" caption="Updated 12 sec ago">
            <div className="aspect-[4/3] w-full rounded-md bg-line2 border hairline grid place-items-center text-muted text-[14px] relative overflow-hidden">
              {/* Schematic location — no fake map tile. Real-composition placeholder. */}
              <div className="absolute inset-0 opacity-50" aria-hidden
                   style={{
                     backgroundImage:
                       "repeating-linear-gradient(0deg, rgba(31,41,55,0.06) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(31,41,55,0.06) 0 1px, transparent 1px 24px)",
                   }} />
              <div className="relative text-center">
                <div className="h-3 w-3 rounded-full bg-accent mx-auto mb-2 live-dot" />
                <div className="text-ink font-medium tabular text-[15px]">{d.city}</div>
                <div className="text-[13px] mt-1">GPS + Wi-Fi positioning</div>
              </div>
            </div>
          </Card>

          <Card title="Fall risk (30-day)" caption="Beta · HRV-based">
            <div className="flex items-baseline gap-3">
              <span className="text-stat tabular text-ink">{d.fallRisk}</span>
              <span className="text-[14px] text-muted">/ 100</span>
            </div>
            <RiskBar value={d.fallRisk} label={d.fallRiskLabel} />
            <p className="text-[13px] text-muted mt-3">
              We watch HRV drift over the trailing 30 days and surface a badge when it suggests an
              elevated fall risk window.
            </p>
          </Card>

          <Card title="Last fall" caption={d.status === "warn" ? "Today, 08:42 SAST" : "No fall in the last 14 days"}>
            {d.status === "warn" ? (
              <>
                <p className="text-[15px]">
                  Brief impact at the bathroom — device resumed standing within 4 seconds. No SOS pressed.
                </p>
                <Link href="/alert" className="text-accentInk text-[14px] hover:underline mt-2 inline-block">
                  Open alert receipt →
                </Link>
              </>
            ) : (
              <p className="text-[15px] text-muted">Nothing to report.</p>
            )}
          </Card>

          <Card title="Emergency contacts" caption="Up to 5 contacts">
            <ul className="divide-y divide-line2 -mx-5">
              {contacts.slice(0, 5).map((c) => (
                <li key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-medium">{c.name}</div>
                    <div className="text-[13px] text-muted">{c.relation} · {c.phone}</div>
                  </div>
                  {c.primary && <span className="text-[11px] uppercase tracking-[0.1em] text-accentInk">Primary</span>}
                </li>
              ))}
            </ul>
            <Link href="/contacts" className="block mt-4 text-center min-h-tap leading-[44px] rounded-md border hairline text-[15px] hover:bg-bg">
              Manage contacts
            </Link>
          </Card>
        </aside>
      </div>

      {/* Recent activity for this device */}
      <section className="bg-white shadow-card rounded-xl border hairline">
        <div className="p-5 border-b hairline flex items-center justify-between">
          <h3 className="text-[17px] font-medium">Recent activity for {d.name}</h3>
          <Link href="/history" className="text-[14px] text-accentInk hover:underline">All events</Link>
        </div>
        {events.length === 0 ? (
          <div className="p-6 text-muted text-[15px]">No events in the last 30 days.</div>
        ) : (
          <ul className="divide-y divide-line2">
            {events.map((e) => (
              <li key={e.id} className="p-5 flex items-start gap-4">
                <span className={`mt-1.5 h-[9px] w-[9px] rounded-full flex-none ${
                  e.severity === "alert" ? "bg-alert" : e.severity === "warn" ? "bg-warn" : "bg-accent"
                }`} aria-hidden />
                <div className="flex-1">
                  <div className="text-[15px] font-medium">{e.title}</div>
                  <p className="text-[14px] text-muted mt-0.5">{e.detail}</p>
                </div>
                <time className="text-[13px] text-muted tabular whitespace-nowrap">{e.ts.replace("2026-", "")}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ title, caption, children }: { title: string; caption?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-card rounded-xl border hairline">
      <div className="p-5 border-b hairline">
        <h3 className="text-[15px] font-medium">{title}</h3>
        {caption && <p className="text-[13px] text-muted mt-0.5">{caption}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function BigStat({
  label, value, unit, sub, trend, warn,
}: { label: string; value: string | number; unit: string; sub: string; trend?: number[]; warn?: boolean }) {
  return (
    <div>
      <div className="text-[13px] text-muted">{label}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-[28px] tabular ${warn ? "text-warn" : "text-ink"}`}>{value}</span>
        <span className="text-[13px] text-muted">{unit}</span>
      </div>
      <div className="text-[12px] text-muted">{sub}</div>
      {trend && trend.some((v) => v !== 0) && (
        <div className="mt-2">
          <Sparkline values={trend} height={32} stroke={warn ? "#d97706" : "#06b6a4"} fill={warn ? "rgba(217,119,6,0.10)" : "rgba(6,182,164,0.10)"} />
        </div>
      )}
    </div>
  );
}

function RiskBar({ value, label }: { value: number; label: "Low" | "Moderate" | "Elevated" }) {
  const color = label === "Elevated" ? "bg-warn" : label === "Moderate" ? "bg-warn/70" : "bg-accent";
  return (
    <div className="mt-3">
      <div className="h-2 rounded-full bg-line2 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[13px]">
        <span className="text-muted">Index</span>
        <span className="tabular text-ink">{label}</span>
      </div>
    </div>
  );
}
