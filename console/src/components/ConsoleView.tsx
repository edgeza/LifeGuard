"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ConsoleData, Device, Incident, Responder } from "@/lib/types";
import { statusColor, aiScoreColor, formatTime, formatRelativeMinutes, initials } from "@/lib/format";

type StatusFilter = "all" | "sos" | "fall_detected" | "low_battery" | "offline" | "en_route";
type ScoreFilter = "all" | "high" | "med" | "low";

export function ConsoleView({ data }: { data: ConsoleData }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [watcherFilter, setWatcherFilter] = useState<string>("all");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Subscribers list (left rail): show device wearers + their status
  const subscribers = useMemo(() => {
    return data.devices.map((d) => {
      const sub = data.subscribers.find((s) => s.address === d.address);
      return { device: d, sub };
    });
  }, [data]);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(({ device, sub }) => {
      if (statusFilter !== "all" && device.status !== statusFilter) return false;
      if (watcherFilter !== "all" && device.watcher !== watcherFilter) return false;
      if (zoneFilter !== "all") {
        const zone = zoneFromLatLng(device.lat, device.lng);
        if (zone !== zoneFilter) return false;
      }
      return true;
    });
  }, [subscribers, statusFilter, watcherFilter, zoneFilter]);

  // Filter incidents for the right-rail worklist
  const filteredIncidents = useMemo(() => {
    return data.incidents.filter((i) => {
      if (scoreFilter === "high" && i.ai_score < 0.8) return false;
      if (scoreFilter === "med" && (i.ai_score < 0.5 || i.ai_score >= 0.8)) return false;
      if (scoreFilter === "low" && i.ai_score >= 0.5) return false;
      return true;
    });
  }, [data.incidents, scoreFilter]);

  const zones = useMemo(() => {
    const set = new Set(subscribers.map(({ device }) => zoneFromLatLng(device.lat, device.lng)));
    return Array.from(set);
  }, [subscribers]);

  const selectedDevice = useMemo(() => {
    if (selectedDeviceId) return data.devices.find((d) => d.id === selectedDeviceId) ?? null;
    // Default: select the device tied to the top-most (or selected) incident
    if (selectedIncidentId) {
      const inc = data.incidents.find((i) => i.id === selectedIncidentId);
      if (inc) return data.devices.find((d) => d.id === inc.device_id) ?? null;
    }
    return null;
  }, [data, selectedDeviceId, selectedIncidentId]);

  return (
    <div className="grid h-full min-h-0 grid-cols-[260px_minmax(0,1fr)_360px] divide-x divide-[rgba(255,255,255,0.06)]">
      {/* LEFT RAIL */}
      <aside className="flex h-full min-h-0 flex-col bg-[#0a0b0d]">
        <div className="flex h-9 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-3 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
          <span>Filters</span>
          <span className="mono text-[#a1a8b3] tabular">{filteredSubscribers.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* STATUS */}
          <Section title="Device status" hint={`${data.stats.subscribers_online}/${data.stats.subscribers_total} online`}>
            <div className="flex flex-wrap gap-1">
              {([
                ["all", "All"],
                ["sos", "SOS"],
                ["fall_detected", "Fall"],
                ["en_route", "En route"],
                ["low_battery", "Low batt"],
                ["offline", "Offline"],
              ] as [StatusFilter, string][]).map(([k, label]) => (
                <Chip key={k} active={statusFilter === k} onClick={() => setStatusFilter(k)}>
                  <StatusDot k={k} /> {label}
                </Chip>
              ))}
            </div>
          </Section>

          {/* ZONE */}
          <Section title="Zone" hint={`${zones.length} zones`}>
            <div className="flex flex-wrap gap-1">
              <Chip active={zoneFilter === "all"} onClick={() => setZoneFilter("all")}>All</Chip>
              {zones.map((z) => (
                <Chip key={z} active={zoneFilter === z} onClick={() => setZoneFilter(z)}>{z}</Chip>
              ))}
            </div>
          </Section>

          {/* WATCHER */}
          <Section title="Watcher">
            <div className="flex flex-wrap gap-1">
              {(["all", "family", "operator", "family+operator"] as const).map((k) => (
                <Chip key={k} active={watcherFilter === k} onClick={() => setWatcherFilter(k)}>
                  {k === "all" ? "All" : k}
                </Chip>
              ))}
            </div>
          </Section>

          {/* AI SCORE */}
          <Section title="AI triage score">
            <div className="flex flex-wrap gap-1">
              {([
                ["all", "All"],
                ["high", "≥ 0.80 high"],
                ["med", "0.50–0.79"],
                ["low", "< 0.50"],
              ] as [ScoreFilter, string][]).map(([k, label]) => (
                <Chip key={k} active={scoreFilter === k} onClick={() => setScoreFilter(k)}>{label}</Chip>
              ))}
            </div>
          </Section>

          {/* RESPONDER FLEET */}
          <Section title="Responder fleet" hint={`${data.responders.filter((r) => r.status === "available").length} avail`}>
            <div className="space-y-1">
              {data.responders.map((r) => (
                <ResponderRow key={r.id} r={r} />
              ))}
            </div>
          </Section>

          {/* SUBSCRIBER LIST */}
          <Section title="Subscribers" hint={`${filteredSubscribers.length} matched`}>
            <div className="space-y-0.5 -mx-1">
              {filteredSubscribers.map(({ device }) => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={
                    "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors " +
                    (selectedDeviceId === device.id
                      ? "bg-[rgba(255,255,255,0.05)]"
                      : "hover:bg-[rgba(255,255,255,0.03)]")
                  }
                >
                  <Avatar name={device.wearer} status={device.status} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-[#e6e9ef]">{device.wearer}</div>
                    <div className="truncate text-[11px] text-[#6b7280]">{device.kind} · {zoneFromLatLng(device.lat, device.lng)}</div>
                  </div>
                  <span className="mono text-[10px] text-[#6b7280] tabular">{formatRelativeMinutes(device.last_seen_min)}</span>
                </button>
              ))}
              {filteredSubscribers.length === 0 && (
                <div className="py-3 text-center text-[11px] text-[#6b7280]">No matches.</div>
              )}
            </div>
          </Section>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.06)] px-3 py-2 text-[10px] text-[#6b7280]">
          <span className="mono">v2.4.1</span> · {data.meta.region.split("—")[0].trim()}
        </div>
      </aside>

      {/* CENTER MAP */}
      <section className="relative flex h-full min-h-0 flex-col">
        <div className="flex h-9 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-3 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="font-medium uppercase tracking-wider text-[#6b7280]">Live map</span>
            <span className="text-[#a1a8b3]">{data.meta.region.split("—")[1]?.trim() ?? data.meta.region}</span>
          </div>
          <div className="flex items-center gap-3 text-[#6b7280]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" /> {data.stats.subscribers_online} OK
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" /> {data.stats.open_incidents} SOS
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" /> {data.stats.responders_dispatched + data.stats.responders_on_scene} disp
            </span>
          </div>
        </div>
        <CityMap
          devices={data.devices}
          responders={data.responders}
          selected={selectedDevice}
          onSelect={(id) => setSelectedDeviceId(id)}
          incidents={data.incidents}
        />
        {selectedDevice && <DeviceInspector device={selectedDevice} data={data} onClose={() => setSelectedDeviceId(null)} />}
      </section>

      {/* RIGHT WORKLIST */}
      <aside className="flex h-full min-h-0 flex-col bg-[#0a0b0d]">
        <div className="flex h-9 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-3 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
          <span>Alert worklist</span>
          <span className="mono text-[#a1a8b3] tabular">{filteredIncidents.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredIncidents
            .sort((a, b) => statusOrder(a.status) - statusOrder(b.status) || b.ai_score - a.ai_score)
            .map((inc) => (
              <IncidentRow
                key={inc.id}
                inc={inc}
                selected={selectedIncidentId === inc.id}
                onClick={() => setSelectedIncidentId(inc.id === selectedIncidentId ? null : inc.id)}
              />
            ))}
        </div>
      </aside>
    </div>
  );
}

/* ----- subcomponents ----- */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6b7280]">{title}</h3>
        {hint && <span className="text-[10px] text-[#6b7280]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors " +
        (active
          ? "border-[rgba(6,182,164,0.45)] bg-[rgba(6,182,164,0.10)] text-[#5eead4]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#a1a8b3] hover:border-[rgba(255,255,255,0.14)] hover:text-[#e6e9ef]")
      }
    >
      {children}
    </button>
  );
}

function StatusDot({ k }: { k: string }) {
  const map: Record<string, string> = {
    all: "#6b7280",
    sos: "#dc2626",
    fall_detected: "#dc2626",
    en_route: "#3b82f6",
    low_battery: "#f59e0b",
    offline: "#6b7280",
  };
  return <span className="h-1.5 w-1.5 rounded-full" style={{ background: map[k] ?? "#6b7280" }} />;
}

function Avatar({ name, status }: { name: string; status: string }) {
  const c = statusColor(status);
  return (
    <div
      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-medium tabular"
      style={{ borderColor: c.ring, background: c.bg, color: c.text }}
    >
      {initials(name)}
    </div>
  );
}

function ResponderRow({ r }: { r: Responder }) {
  const c = statusColor(r.status);
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[rgba(255,255,255,0.03)]">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border" style={{ borderColor: c.ring, background: c.bg, color: c.text }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 13l2-5h14l2 5v6H3v-6z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] font-medium text-[#e6e9ef]">{r.callsign}</span>
          <span className="text-[10px] text-[#6b7280]">· {r.zone}</span>
        </div>
        <div className="truncate text-[10px] text-[#6b7280]">{r.crew.join(", ")}</div>
      </div>
      <span className="text-[10px] font-medium tabular" style={{ color: c.text }}>
        {r.status === "dispatched" && r.eta_min !== null ? `ETA ${r.eta_min}m` : r.status}
      </span>
    </div>
  );
}

function IncidentRow({ inc, selected, onClick }: { inc: Incident; selected: boolean; onClick: () => void }) {
  const c = statusColor(inc.status);
  const scoreColor = aiScoreColor(inc.ai_score);
  return (
    <button
      onClick={onClick}
      className={
        "block w-full border-b border-[rgba(255,255,255,0.04)] px-3 py-2.5 text-left transition-colors " +
        (selected ? "bg-[rgba(255,255,255,0.05)]" : "hover:bg-[rgba(255,255,255,0.025)]")
      }
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="mono text-[11px] text-[#6b7280] tabular">{formatTime(inc.opened_at)}</span>
          <span className="text-[13px] font-medium text-[#e6e9ef]">{inc.wearer}</span>
        </div>
        <span className="mono text-[11px] tabular" style={{ color: scoreColor }}>
          {inc.ai_score.toFixed(2)}
        </span>
      </div>
      <div className="mt-0.5 truncate text-[12px] text-[#a1a8b3]">{inc.trigger}</div>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          className="rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
          style={{ borderColor: c.ring, background: c.bg, color: c.text }}
        >
          {inc.status}
        </span>
        <span className="truncate text-[11px] text-[#6b7280]">{inc.address}</span>
      </div>
    </button>
  );
}

/* ----- map ----- */

function CityMap({
  devices, responders, selected, onSelect, incidents,
}: {
  devices: Device[];
  responders: Responder[];
  selected: Device | null;
  onSelect: (id: string) => void;
  incidents: Incident[];
}) {
  // Compute bounds from devices + responders, with padding.
  const lats = [...devices.map((d) => d.lat), ...responders.map((r) => r.lat)];
  const lngs = [...devices.map((d) => d.lng), ...responders.map((r) => r.lng)];
  const minLat = Math.min(...lats) - 0.01;
  const maxLat = Math.max(...lats) + 0.01;
  const minLng = Math.min(...lngs) - 0.01;
  const maxLng = Math.max(...lngs) + 0.01;
  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  const incidentDeviceIds = new Set(incidents.filter((i) => i.status !== "resolved").map((i) => i.device_id));

  return (
    <div className="relative flex-1 min-h-0 hex-bg">
      <div className="absolute inset-0 streets-overlay pointer-events-none" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {/* dispatcher routes to active incidents */}
        {incidents
          .filter((i) => i.responder_dispatched)
          .map((inc) => {
            const dev = devices.find((d) => d.id === inc.device_id);
            const resp = responders.find((r) => r.id === inc.responder_dispatched);
            if (!dev || !resp) return null;
            const a = project(dev.lat, dev.lng);
            const b = project(resp.lat, resp.lng);
            return (
              <line
                key={inc.id}
                x1={a.left} y1={a.top}
                x2={b.left} y2={b.top}
                stroke="rgba(59,130,246,0.45)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            );
          })}
      </svg>

      {/* responders first (so devices overlay) */}
      {responders.map((r) => {
        const { left, top } = project(r.lat, r.lng);
        const c = statusColor(r.status);
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id.startsWith("resp_") ? r.id : r.id)}
            style={{ left, top, borderColor: c.ring, background: c.bg, color: c.text }}
            className="absolute -translate-x-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-md border-2 text-[10px] font-medium"
            title={`${r.callsign} · ${r.zone} · ${r.status}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 13l2-5h14l2 5v6H3v-6z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          </button>
        );
      })}

      {/* device dots */}
      {devices.map((d) => {
        const { left, top } = project(d.lat, d.lng);
        const c = statusColor(d.status);
        const isIncident = incidentDeviceIds.has(d.id);
        const isSelected = selected?.id === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            style={{ left, top }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            title={`${d.wearer} · ${d.kind} · ${d.status}`}
          >
            {isIncident && (
              <span className="absolute inset-0 -m-3 rounded-full" style={{ background: c.ring, animation: "radar 2.4s ease-out infinite" }} />
            )}
            <span
              className={
                "relative grid h-3 w-3 place-items-center rounded-full border " +
                (isSelected ? "ring-2 ring-[#06b6a4] ring-offset-1 ring-offset-[#0a0b0d]" : "")
              }
              style={{ borderColor: c.ring, background: c.bg }}
            >
              {isIncident && <span className="absolute inset-1 rounded-full pulse-dot" style={{ background: c.text }} />}
              {!isIncident && <span className="absolute inset-1 rounded-full" style={{ background: c.text }} />}
            </span>
          </button>
        );
      })}

      {/* scale + compass overlay */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between text-[10px] text-[#6b7280]">
        <div className="flex items-center gap-2">
          <span className="mono">−26.135</span>
          <span className="h-px w-12 bg-[rgba(255,255,255,0.15)]" />
          <span className="mono">−26.110</span>
        </div>
        <div className="flex items-center gap-3">
          <span>zoom 14</span>
          <span className="h-3 w-3 rounded-full border border-[rgba(255,255,255,0.20)]" />
        </div>
      </div>
    </div>
  );
}

/* ----- device inspector panel (over map bottom) ----- */

function DeviceInspector({ device, data, onClose }: { device: Device; data: ConsoleData; onClose: () => void }) {
  const sub = data.subscribers.find((s) => s.address === device.address);
  const c = statusColor(device.status);
  return (
    <div className="absolute bottom-3 left-3 right-3 max-w-md rounded-lg border border-[rgba(255,255,255,0.10)] bg-[#191c20]/95 backdrop-blur shadow-2xl">
      <div className="flex items-start justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full border text-[10px] font-medium" style={{ borderColor: c.ring, background: c.bg, color: c.text }}>
            {initials(device.wearer)}
          </span>
          <div>
            <div className="text-[13px] font-medium text-[#e6e9ef]">{device.wearer}</div>
            <div className="text-[10px] text-[#6b7280]">{device.kind} · {device.id}</div>
          </div>
        </div>
        <button onClick={onClose} className="text-[#6b7280] hover:text-[#e6e9ef]" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-px bg-[rgba(255,255,255,0.04)] text-[10px]">
        <Stat label="Status" value={device.status} />
        <Stat label="Battery" value={device.battery !== null ? `${device.battery}%` : "—"} />
        <Stat label="Signal" value={device.signal ? `${device.signal}/5` : "—"} />
        <Stat label="Last seen" value={formatRelativeMinutes(device.last_seen_min)} />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-[11px]">
        <span className="truncate text-[#a1a8b3]">{device.address}</span>
        {sub && (
          <Link href={`/subscribers/${sub.id}`} className="text-[#06b6a4] hover:text-[#0d9488]">
            Open subscriber →
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#191c20] px-2.5 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-[#6b7280]">{label}</div>
      <div className="text-[12px] font-medium text-[#e6e9ef]">{value}</div>
    </div>
  );
}

/* ----- helpers ----- */

function zoneFromLatLng(lat: number, lng: number): string {
  if (lat < -26.115) return "Sandown";
  if (lat > -26.150 && lng < 28.025) return "Parkhurst";
  if (lat > -26.150) return "Parktown N / Parkview";
  if (lng > 28.050) return "Illovo / Melrose";
  if (lng < 28.030) return "Hyde Park";
  return "Dunkeld / Rosebank";
}

function statusOrder(s: string) {
  return { open: 0, acknowledged: 1, on_scene: 2, resolved: 3 }[s as keyof object] ?? 9;
}
