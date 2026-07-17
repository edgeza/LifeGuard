import Link from "next/link";
import { devices, alerts, timeline, user } from "@/lib/data";
import StatusPill from "@/components/StatusPill";
import Sparkline from "@/components/Sparkline";

export default function HomePage() {
  const mom = devices.find((d) => d.id === "dev_mom")!;
  const sorted = [...devices].sort((a, b) => {
    const order: Record<string, number> = { alert: 0, warn: 1, offline: 2, ok: 3 };
    return order[a.status] - order[b.status];
  });
  const lastAlert = alerts[0];
  const recentEvents = timeline.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Greeting + at-a-glance. Real composition, not a stat tile grid. */}
      <section className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[13px] uppercase tracking-[0.14em] text-muted">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-h1 font-medium mt-1">
            {greeting()}, {user.name.split(" ")[0]}.
          </h1>
          <p className="text-muted mt-1 max-w-[58ch]">
            Everyone on your plan is fine. Margaret's fall-risk badge is{" "}
            <span className="text-warn font-medium">elevated</span> this week — a quick look at her 30-day
            HRV is worthwhile.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/vitals"
            className="inline-flex items-center min-h-tap min-w-tap px-4 rounded-md border hairline text-[15px] text-ink hover:bg-white"
          >
            Vitals overview
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center min-h-tap min-w-tap px-4 rounded-md bg-ink text-white text-[15px] hover:bg-black"
          >
            Manage contacts
          </Link>
        </div>
      </section>

      {/* Featured: Margaret (warn) — pulled out of the grid for real composition */}
      <section className="bg-white shadow-card rounded-xl border hairline p-6 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-5">
            <div className="h-12 w-12 rounded-full bg-warn/15 text-warn grid place-items-center font-medium text-[18px]">
              M
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-h2 font-medium">Margaret</h2>
                <StatusPill status={mom.status} />
              </div>
              <p className="text-muted text-[15px] mt-0.5">
                {mom.city} · {mom.device} · last seen {mom.lastSeen}
              </p>
              <p className="text-ink mt-3 max-w-[62ch]">
                Her 7-day HRV has drifted down by 11%. That's the leading indicator our model uses for
                fall risk. Nothing to act on tonight, but worth a conversation with Dr. Mokoena this week.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/device/dev_mom`}
              className="inline-flex items-center min-h-tap px-4 rounded-md border hairline text-[15px] hover:bg-bg"
            >
              Open profile
            </Link>
            <Link
              href={`/device/dev_mom/vitals`}
              className="inline-flex items-center min-h-tap px-4 rounded-md bg-accent text-white text-[15px] hover:bg-accentInk"
            >
              See 30-day vitals
            </Link>
          </div>
        </div>

        {/* Inline mini-stats — three columns, but composed (chart on right) not a tile grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr,1.4fr] gap-6 items-end">
          <Stat label="Resting HR"  value="74" unit="bpm"  delta="+2 vs. 7d" tone="muted" />
          <Stat label="HRV"         value="38" unit="ms"   delta="−11% vs. 30d" tone="warn" />
          <Stat label="SpO₂"        value="96" unit="%"    delta="Stable" tone="ok" />
          <div>
            <div className="text-[13px] text-muted">HRV · last 30 days</div>
            <Sparkline values={mom.hrvTrend} height={56} />
          </div>
        </div>
      </section>

      {/* Everyone on your plan — composed list, not icon-tile-grid */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-h2 font-medium">Everyone on your plan</h2>
          <span className="text-[13px] text-muted tabular">{devices.length} devices</span>
        </div>
        <ul className="bg-white shadow-card rounded-xl border hairline divide-y divide-line2">
          {sorted.map((d) => (
            <li key={d.id} className="p-5 md:p-6 flex items-center gap-5">
              <div className="h-11 w-11 rounded-full bg-line2 text-ink grid place-items-center font-medium">
                {d.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href={`/device/${d.id}`} className="text-[17px] font-medium hover:underline">
                    {d.name}
                  </Link>
                  <span className="text-[13px] text-muted">
                    {labelFor(d.relation)} · {d.deviceModel}
                  </span>
                  <StatusPill status={d.status} />
                </div>
                <div className="text-[14px] text-muted mt-1 tabular">
                  {d.city} · {d.lastSeen === "live" ? "Live" : `Seen ${d.lastSeen}`}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-[14px] tabular text-muted">
                <Mini label="HR"   value={d.hr ? `${d.hr}` : "—"} unit="bpm" />
                <Mini label="HRV"  value={d.hrv ? `${d.hrv}` : "—"} unit="ms" />
                <Mini label="Batt" value={`${d.battery}`} unit="%" />
              </div>
              <Link
                href={`/device/${d.id}`}
                className="text-accentInk text-[14px] hover:underline whitespace-nowrap"
              >
                Open →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent activity — composed sidebar-ish row */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
        <div className="bg-white shadow-card rounded-xl border hairline">
          <div className="p-5 border-b hairline flex items-center justify-between">
            <h3 className="text-[17px] font-medium">Recent activity</h3>
            <Link href="/history" className="text-[14px] text-accentInk hover:underline">
              All events
            </Link>
          </div>
          <ul className="divide-y divide-line2">
            {recentEvents.map((e) => (
              <li key={e.id} className="p-5 flex items-start gap-4">
                <EventDot severity={e.severity} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[15px]">
                    <span className="font-medium">{e.title}</span>
                    <span className="text-muted">· {whoFor(e.deviceId)}</span>
                  </div>
                  <p className="text-[14px] text-muted mt-0.5">{e.detail}</p>
                </div>
                <time className="text-[13px] text-muted tabular whitespace-nowrap">
                  {e.ts.replace("2026-", "")}
                </time>
              </li>
            ))}
          </ul>
        </div>

        <aside className="bg-white shadow-card rounded-xl border hairline">
          <div className="p-5 border-b hairline">
            <h3 className="text-[17px] font-medium">Last alert</h3>
            <p className="text-[13px] text-muted mt-0.5">Auto-resolved after 4 minutes</p>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <div className="text-[15px] font-medium">{lastAlert.type}</div>
              <div className="text-[13px] text-muted">{lastAlert.locationLabel}</div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-[14px]">
              <Row k="Triggered" v={lastAlert.triggeredAt.split(" ")[1]} />
              <Row k="Resolved"  v={lastAlert.resolvedAt?.split(" ")[1] ?? "—"} />
              <Row k="Triage"    v={`${lastAlert.triageScore} / 100`} />
              <Row k="Contacts"  v={`${lastAlert.contactsAcked} of ${lastAlert.contactsNotified} acked`} />
            </dl>
            <Link
              href="/alert"
              className="block text-center min-h-tap leading-[44px] rounded-md border hairline hover:bg-bg text-[15px]"
            >
              Open alert receipt →
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function labelFor(r: string) {
  switch (r) {
    case "self": return "You";
    case "mother": return "Mother";
    case "father": return "Father";
    case "child": return "Child";
    case "pet": return "Pet";
    default: return r;
  }
}
function whoFor(id: string) {
  return devices.find((d) => d.id === id)?.name ?? "—";
}

function Stat({
  label, value, unit, delta, tone,
}: { label: string; value: string; unit: string; delta?: string; tone?: "muted" | "warn" | "ok" }) {
  const toneCls = tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "text-muted";
  return (
    <div>
      <div className="text-[13px] text-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-stat tabular text-ink">{value}</span>
        <span className="text-[14px] text-muted">{unit}</span>
      </div>
      {delta && <div className={`text-[13px] mt-0.5 ${toneCls}`}>{delta}</div>}
    </div>
  );
}

function Mini({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-[0.1em] text-subtle">{label}</span>
      <span className="text-ink">
        {value}
        <span className="text-muted ml-0.5">{unit}</span>
      </span>
    </div>
  );
}

function EventDot({ severity }: { severity: "info" | "warn" | "alert" }) {
  const bg = severity === "alert" ? "bg-alert" : severity === "warn" ? "bg-warn" : "bg-accent";
  return <span className={`mt-1.5 h-[9px] w-[9px] rounded-full ${bg} flex-none`} aria-hidden />;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] text-muted">{k}</dt>
      <dd className="text-ink tabular">{v}</dd>
    </div>
  );
}
