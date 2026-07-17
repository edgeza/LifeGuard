import Link from "next/link";
import { devices } from "@/lib/data";
import Sparkline from "@/components/Sparkline";
import StatusPill from "@/components/StatusPill";

export default function VitalsPage() {
  const withVitals = devices.filter((d) => d.hrvTrend.some((v) => v !== 0));

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[13px] uppercase tracking-[0.14em] text-muted">30-day view</p>
          <h1 className="text-h1 font-medium mt-1">Vitals</h1>
          <p className="text-muted mt-1 max-w-[60ch]">
            All wearables stream heart rate, HRV, SpO₂, skin temperature, and steps at 60-second resolution
            to TimescaleDB. We render the trailing 30 days here, per person.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted tabular">
          <span className="h-2 w-2 rounded-full bg-accent live-dot" aria-hidden />
          Sync · 12s ago
        </div>
      </header>

      <section className="bg-white shadow-card rounded-xl border hairline overflow-hidden">
        <div className="p-6 border-b hairline">
          <h2 className="text-[18px] font-medium">Per-person summary</h2>
          <p className="text-[13px] text-muted mt-0.5">HRV drives the fall-risk badge.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[15px]">
            <thead className="bg-bg text-muted text-[13px]">
              <tr>
                <th className="text-left font-normal px-6 py-3">Person</th>
                <th className="text-left font-normal px-6 py-3">Status</th>
                <th className="text-right font-normal px-6 py-3 tabular">HR</th>
                <th className="text-right font-normal px-6 py-3 tabular">HRV</th>
                <th className="text-right font-normal px-6 py-3 tabular">SpO₂</th>
                <th className="text-left font-normal px-6 py-3">HRV trend</th>
                <th className="text-left font-normal px-6 py-3">Fall risk</th>
                <th className="text-right font-normal px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line2">
              {withVitals.map((d) => (
                <tr key={d.id} className="hover:bg-bg/50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-[13px] text-muted">{d.deviceModel}</div>
                  </td>
                  <td className="px-6 py-4"><StatusPill status={d.status} /></td>
                  <td className="px-6 py-4 text-right tabular">{d.hr} bpm</td>
                  <td className="px-6 py-4 text-right tabular">{d.hrv} ms</td>
                  <td className="px-6 py-4 text-right tabular">{d.spo2}%</td>
                  <td className="px-6 py-4 w-[220px]">
                    <Sparkline values={d.hrvTrend} height={28} />
                  </td>
                  <td className="px-6 py-4">
                    <RiskPill value={d.fallRisk} label={d.fallRiskLabel} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/device/${d.id}`} className="text-accentInk text-[14px] hover:underline">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed HRV panel for the at-risk person */}
      <section className="bg-white shadow-card rounded-xl border hairline">
        <div className="p-6 border-b hairline flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[18px] font-medium">Margaret · HRV (30 days)</h2>
            <p className="text-[13px] text-muted mt-0.5">
              Why this matters: lower HRV over a trailing window is the leading indicator our model uses for
              fall-risk elevation.
            </p>
          </div>
          <div className="text-[13px] text-muted tabular">
            Baseline 44 ms · today 38 ms · Δ −11%
          </div>
        </div>
        <div className="p-6">
          <BigChart values={withVitals.find((d) => d.id === "dev_mom")!.hrvTrend} height={180} />
          <div className="mt-4 grid grid-cols-3 gap-6 text-[14px]">
            <Mini label="Mean"  value="38 ms" />
            <Mini label="Min"   value="34 ms" />
            <Mini label="Max"   value="44 ms" />
          </div>
        </div>
      </section>
    </div>
  );
}

function BigChart({ values, height }: { values: number[]; height: number }) {
  const w = 980;
  const h = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const stepX = w / (values.length - 1);
  const pts = values.map((v, i) => [i * stepX, h - ((v - min) / span) * (h - 12) - 6] as const);
  const d = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="block">
      <path d={area} fill="rgba(217,119,6,0.10)" stroke="none" />
      <path d={d} fill="none" stroke="#d97706" strokeWidth={2} strokeLinejoin="round" />
      {pts.map(([x, y], i) => (i % 5 === 0 ? <circle key={i} cx={x} cy={y} r={2.5} fill="#d97706" /> : null))}
    </svg>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] uppercase tracking-[0.1em] text-subtle">{label}</div>
      <div className="text-[18px] tabular text-ink">{value}</div>
    </div>
  );
}

function RiskPill({ value, label }: { value: number; label: "Low" | "Moderate" | "Elevated" }) {
  const color = label === "Elevated" ? "text-warn" : label === "Moderate" ? "text-warn/90" : "text-ok";
  return <span className={`text-[13px] tabular ${color}`}>{label} · {value}/100</span>;
}
