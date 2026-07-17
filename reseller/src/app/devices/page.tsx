"use client";

import { useMemo, useState } from "react";
import { fleet, type FleetDevice } from "@/lib/data";
import { Pill } from "@/components/Charts";

const SIGNAL_TONE: Record<FleetDevice["signal"], "ok" | "warn" | "alert" | "neutral"> = {
  strong: "ok",
  fair: "warn",
  weak: "alert",
  offline: "neutral",
};

export default function DevicesPage() {
  const [q, setQ] = useState("");
  const [model, setModel] = useState<string>("all");

  const rows = useMemo(() => {
    return fleet.filter((d) => {
      if (model !== "all" && d.model !== model) return false;
      if (!q) return true;
      return [d.id, d.customer, d.firmware].some((s) => s.toLowerCase().includes(q.toLowerCase()));
    });
  }, [q, model]);

  const health = {
    online: fleet.filter((d) => d.signal !== "offline").length,
    lowBatt: fleet.filter((d) => d.battery < 25 && d.battery > 0).length,
    alerts7d: fleet.reduce((acc, d) => acc + d.alerts7d, 0),
    offline: fleet.filter((d) => d.signal === "offline").length,
  };

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">{fleet.length} devices</p>
          <h1 className="text-h1 font-medium">Devices</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[30px] px-3 rounded-md border hairline bg-surface text-[13px]">Push OTA</button>
          <button className="h-[30px] px-3 rounded-md bg-accent text-white text-[13px]">Provision new</button>
        </div>
      </header>

      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-line2">
          <Bucket k="Online"      v={`${health.online}/${fleet.length}`} tone="ok" />
          <Bucket k="Low battery" v={`${health.lowBatt}`} tone="warn" note="< 25%" />
          <Bucket k="Offline >24h" v={`${health.offline}`} tone="alert" />
          <Bucket k="Alerts (7d)"  v={`${health.alerts7d}`} tone="neutral" />
        </div>
      </section>

      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="px-4 py-3 border-b hairline flex items-center gap-2 flex-wrap">
          <input
            type="search"
            placeholder="Search by ID, customer, firmware…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-[30px] px-3 rounded-md border hairline bg-surface text-[13px] w-[280px]"
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-[30px] px-2 rounded-md border hairline bg-surface text-[13px]"
            aria-label="Filter by model"
          >
            <option value="all">All models</option>
            <option value="LifeBand G2">LifeBand G2</option>
            <option value="LifePendant P2">LifePendant P2</option>
            <option value="LifeCard C2">LifeCard C2</option>
            <option value="LifeClip CG2">LifeClip CG2</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-bg text-muted">
              <tr className="border-b hairline">
                <th className="text-left font-normal px-4 py-2">Device</th>
                <th className="text-left font-normal px-4 py-2">Customer</th>
                <th className="text-left font-normal px-4 py-2">Model</th>
                <th className="text-left font-normal px-4 py-2">Firmware</th>
                <th className="text-right font-normal px-4 py-2 tabular">Battery</th>
                <th className="text-left font-normal px-4 py-2">Signal</th>
                <th className="text-left font-normal px-4 py-2">Last seen</th>
                <th className="text-right font-normal px-4 py-2 tabular">Alerts 7d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line2">
              {rows.map((d) => (
                <tr key={d.id} className="hover:bg-bg">
                  <td className="px-4 py-3 mono text-ink">{d.id}</td>
                  <td className="px-4 py-3">{d.customer}</td>
                  <td className="px-4 py-3 text-muted">{d.model}</td>
                  <td className="px-4 py-3 mono text-muted">{d.firmware}</td>
                  <td className="px-4 py-3 text-right tabular">
                    <BatteryBar value={d.battery} />
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={SIGNAL_TONE[d.signal]}>{d.signal}</Pill>
                  </td>
                  <td className="px-4 py-3 text-muted">{d.lastSeen}</td>
                  <td className="px-4 py-3 text-right tabular">{d.alerts7d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Bucket({ k, v, tone, note }: { k: string; v: string; tone: "ok" | "warn" | "alert" | "neutral"; note?: string }) {
  const colors = { ok: "text-ok", warn: "text-warn", alert: "text-alert", neutral: "text-muted" };
  return (
    <div className="px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.1em] text-subtle">{k}</div>
      <div className={`mt-1 text-stat tabular ${colors[tone]}`}>{v}</div>
      {note && <div className="text-[12px] text-muted">{note}</div>}
    </div>
  );
}

function BatteryBar({ value }: { value: number }) {
  const tone = value === 0 ? "bg-alert" : value < 25 ? "bg-warn" : "bg-ok";
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block w-[40px] h-[6px] rounded bg-line2 overflow-hidden">
        <span className={`block h-full ${tone}`} style={{ width: `${value}%` }} />
      </span>
      <span className="mono">{value}%</span>
    </span>
  );
}
