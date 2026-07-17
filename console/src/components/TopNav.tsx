"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Console" },
  { href: "/incidents", label: "Incidents" },
  { href: "/subscribers", label: "Subscribers" },
  { href: "/dispatch", label: "Dispatch" },
  { href: "/shifts", label: "Shifts" },
  { href: "/broadcast", label: "Broadcast" },
  { href: "/audit", label: "Audit" },
];

interface Stats {
  subscribers_total: number;
  subscribers_online: number;
  open_incidents: number;
  incidents_today: number;
  incidents_acked_in_30s_pct: number;
  responders_available: number;
  responders_dispatched: number;
  responders_on_scene: number;
  avg_response_min: number;
}

export function TopNav({ stats }: { stats: Stats | null }) {
  const pathname = usePathname();
  const [now, setNow] = useState<string>("—");
  const [cmdk, setCmdk] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setNow(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdk(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const alerts = stats?.open_incidents ?? 0;
  const online = stats?.subscribers_online ?? 0;
  const total = stats?.subscribers_total ?? 0;

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b border-[rgba(255,255,255,0.06)] bg-[#0a0b0d]/95 px-4 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2 pr-3">
        <span className="relative grid h-6 w-6 place-items-center">
          <span className="absolute inset-0 rounded-full bg-[#06b6a4]/15" />
          <span className="absolute inset-1 rounded-full bg-[#06b6a4]/30" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-[#06b6a4] pulse-dot" />
        </span>
        <span className="text-[13px] font-medium tracking-tight text-[#e6e9ef]">
          LifeGuard
        </span>
        <span className="ml-1 hidden md:inline rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
          Console
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-0.5 text-[13px]">
        {NAV.map((n) => {
          const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={
                "rounded-md px-2.5 py-1 transition-colors " +
                (active
                  ? "bg-[rgba(255,255,255,0.05)] text-[#e6e9ef]"
                  : "text-[#a1a8b3] hover:text-[#e6e9ef] hover:bg-[rgba(255,255,255,0.03)]")
              }
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="hidden lg:flex items-center gap-3 rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[12px] text-[#a1a8b3]">
        <span className="grid h-1.5 w-1.5 place-items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] pulse-dot" />
        </span>
        <span className="text-[#e6e9ef] tabular">{alerts}</span>
        <span className="text-[#6b7280]">open alerts</span>
        <span className="text-[#3f4248]">·</span>
        <span className="text-[#e6e9ef] tabular">{online}</span>
        <span className="text-[#6b7280]">/ {total} online</span>
        <span className="text-[#3f4248]">·</span>
        <span className="text-[#e6e9ef] tabular">{stats?.responders_available ?? 0}</span>
        <span className="text-[#6b7280]">resps avail</span>
      </div>

      <button
        onClick={() => setCmdk(true)}
        className="hidden md:flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[12px] text-[#6b7280] hover:text-[#a1a8b3] hover:border-[rgba(255,255,255,0.10)] transition-colors"
        aria-label="Open command palette"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <span>Search subscribers, devices, incidents…</span>
        <span className="ml-2 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-1 py-0.5 text-[10px] font-medium tracking-wide text-[#a1a8b3]">⌘K</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="hidden md:inline mono text-[11px] text-[#6b7280] tabular">{now}</span>
        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#191c20] border border-[rgba(255,255,255,0.08)] text-[11px] font-medium text-[#e6e9ef]">
          KN
        </div>
      </div>

      {cmdk && <CommandPalette onClose={() => setCmdk(false)} />}
    </header>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-start pt-[12vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative w-full max-w-xl mx-4 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#191c20] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6b7280]"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            autoFocus
            placeholder="Type a subscriber, device, incident ID, or command…"
            className="flex-1 bg-transparent text-[14px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none"
          />
          <span className="rounded border border-[rgba(255,255,255,0.08)] px-1 py-0.5 text-[10px] text-[#6b7280]">ESC</span>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-1 text-[13px]">
          {[
            { label: "Go to Console home", href: "/" },
            { label: "Go to Incidents list", href: "/incidents" },
            { label: "Go to Subscribers", href: "/subscribers" },
            { label: "Go to Dispatch", href: "/dispatch" },
            { label: "Go to Audit log", href: "/audit" },
            { label: "Open broadcast composer", href: "/broadcast" },
            { label: "View today's shift", href: "/shifts" },
          ].map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-[rgba(255,255,255,0.04)]"
            >
              <span className="text-[#e6e9ef]">{it.label}</span>
              <span className="mono text-[11px] text-[#6b7280]">↵</span>
            </Link>
          ))}
        </div>
        <div className="border-t border-[rgba(255,255,255,0.06)] bg-[#0f1114] px-3 py-1.5 text-[10px] text-[#6b7280] flex justify-between">
          <span>Operator: K. Nkosi · Day shift · CityWatch JHB</span>
          <span className="mono">/command-palette</span>
        </div>
      </div>
    </div>
  );
}
