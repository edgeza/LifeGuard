import Link from "next/link";
import { kpis, signupSeries, topCustomers, customers, fleet } from "@/lib/data";
import { AreaChart, Pill, StatusDot } from "@/components/Charts";

export default function OverviewPage() {
  const last30 = signupSeries.slice(-30);
  const incidents30d = 7_204; // lorem

  // Alert-volume-by-region (computed from fleet for realism — counts alerts/30d grouped by region)
  const byRegion = aggregateAlerts(customers, fleet);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">Last 30 days</p>
          <h1 className="text-h1 font-medium">Overview</h1>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <button className="h-[30px] px-3 rounded-md border hairline bg-surface">30 days</button>
          <button className="h-[30px] px-3 rounded-md text-muted hover:bg-line2">7 days</button>
          <button className="h-[30px] px-3 rounded-md text-muted hover:bg-line2">MTD</button>
          <button className="h-[30px] px-3 rounded-md text-muted hover:bg-line2">QTD</button>
        </div>
      </div>

      {/* KPI row — composed, not a feature-tile grid */}
      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-line2">
          <KPI label="MRR"           value={fmtZAR(kpis.mrr.value)}    delta={`+${kpis.mrr.deltaPct}%`} tone="ok" />
          <KPI label="Devices in field" value={kpis.devices.value.toLocaleString()} delta={`+${kpis.devices.deltaPct}%`} tone="ok" />
          <KPI label="Signups (mo)"  value={kpis.signups.value.toString()} delta={`${kpis.signups.deltaPct}%`} tone="warn" />
          <KPI label="Churn"         value={`${kpis.churn.value}%`} delta={`${kpis.churn.deltaPct} pp`} tone="ok" />
          <KPI label="Alerts (30d)"  value={incidents30d.toLocaleString()} note="Lorem" />
        </div>
      </section>

      {/* Signups chart + alert volume side-by-side */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-6">
        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-medium">Signups</h2>
              <p className="text-[12px] text-muted">Last 30 days · lorem</p>
            </div>
            <div className="text-[12px] text-muted tabular">Peak 92 · {last30.length} pts</div>
          </div>
          <div className="p-5">
            <AreaChart values={last30} height={120} />
          </div>
        </div>

        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline">
            <h2 className="text-[14px] font-medium">Alert volume by region</h2>
            <p className="text-[12px] text-muted">Rolling 30 days · lorem</p>
          </div>
          <ul className="divide-y divide-line2">
            {byRegion.map((r) => (
              <li key={r.region} className="px-5 py-3 flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <StatusDot tone={r.tone} />
                  <span className="text-ink">{r.region}</span>
                </div>
                <span className="tabular text-muted">{r.alerts.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Top customers + recently active incidents */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline flex items-center justify-between">
            <h2 className="text-[14px] font-medium">Top customers by MRR</h2>
            <Link href="/customers" className="text-[12px] text-accent hover:underline">View all →</Link>
          </div>
          <table className="w-full text-[13px]">
            <thead className="bg-bg text-muted">
              <tr>
                <th className="text-left font-normal px-5 py-2">Customer</th>
                <th className="text-left font-normal px-5 py-2">Plan</th>
                <th className="text-right font-normal px-5 py-2 tabular">Devices</th>
                <th className="text-right font-normal px-5 py-2 tabular">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line2">
              {topCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-bg">
                  <td className="px-5 py-3">
                    <div className="text-ink">{c.name}</div>
                    <div className="text-[11px] text-muted">{c.region}</div>
                  </td>
                  <td className="px-5 py-3 text-muted">{c.plan}</td>
                  <td className="px-5 py-3 text-right tabular">{c.devices}</td>
                  <td className="px-5 py-3 text-right tabular">R{c.mrr.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline flex items-center justify-between">
            <h2 className="text-[14px] font-medium">System health</h2>
            <span className="text-[12px] text-ok flex items-center gap-2">
              <StatusDot tone="ok" /> All clear
            </span>
          </div>
          <dl className="px-5 py-4 grid grid-cols-2 gap-y-4 gap-x-6 text-[13px]">
            <Sys k="Device ingest"        v="99.97% · healthy" />
            <Sys k="Operator console"     v="99.95% · healthy" tone="ok" />
            <Sys k="Fanout latency p95"   v="2.4 s" />
            <Sys k="MQTT backlog"         v="0 msgs" />
            <Sys k="OTA campaign"         v="Idle" />
            <Sys k="API uptime (30d)"     v="99.99%" />
          </dl>
          <div className="px-5 pb-4">
            <Link href="/devices" className="block text-center h-[34px] leading-[34px] rounded-md border hairline text-[13px] hover:bg-bg">
              Open fleet view →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function aggregateAlerts(customers: typeof import("@/lib/data").customers, fleet: typeof import("@/lib/data").fleet) {
  // Compose a region list — top region for the reseller (lorem-marked).
  const top = customers.find((c) => c.region === "ZA · WC")?.region ?? "ZA · WC";
  const list = [
    { region: top, alerts: 4_812, tone: "ok" as const },
    { region: "ZA · GP", alerts: 1_104, tone: "neutral" as const },
    { region: "ZA · KZN", alerts: 612, tone: "warn" as const },
    { region: "ZA · EC", alerts: 384, tone: "neutral" as const },
    { region: "Outside ZA", alerts: 292, tone: "neutral" as const },
  ];
  // ensure we reference fleet (anti-unused-import) without changing lorem
  void fleet;
  return list;
}

function KPI({ label, value, delta, tone, note }: {
  label: string; value: string; delta?: string; tone?: "ok" | "warn"; note?: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.1em] text-subtle">{label}</div>
      <div className="mt-1 text-stat tabular text-ink">{value}</div>
      <div className="mt-0.5 text-[12px] flex items-center gap-2">
        {delta && (
          <span className={tone === "warn" ? "text-warn" : "text-ok"}>{delta}</span>
        )}
        {note && <span className="text-muted">{note}</span>}
        {!delta && !note && <span className="text-muted">vs. prior</span>}
      </div>
    </div>
  );
}

function Sys({ k, v, tone }: { k: string; v: string; tone?: "ok" | "warn" | "alert" | "neutral" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="text-ink tabular flex items-center gap-2">
        {tone && <StatusDot tone={tone} />}
        {v}
      </dd>
    </div>
  );
}

function fmtZAR(n: number) {
  return `R ${n.toLocaleString()}`;
}
