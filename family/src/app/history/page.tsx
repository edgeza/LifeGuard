import Link from "next/link";
import { devices, timeline } from "@/lib/data";

// Group timeline by day for a real timeline composition (not a flat list)
function groupByDay(events: typeof timeline) {
  const map = new Map<string, typeof timeline>();
  for (const e of events) {
    const day = e.ts.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(e);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function HistoryPage() {
  const grouped = groupByDay([...timeline].sort((a, b) => (a.ts < b.ts ? 1 : -1)));

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[13px] uppercase tracking-[0.14em] text-muted">Last 30 days</p>
          <h1 className="text-h1 font-medium mt-1">History</h1>
          <p className="text-muted mt-1 max-w-[60ch]">
            Every event from every device on your plan. Filter by person or severity, or export the raw
            JSON via the API.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by person"
            className="min-h-tap px-3 rounded-md border hairline bg-white text-[14px]"
            defaultValue="all"
          >
            <option value="all">All people</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <button className="min-h-tap px-4 rounded-md border hairline bg-white text-[14px] hover:bg-bg">
            Export JSON
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {grouped.map(([day, events]) => (
          <section key={day} className="bg-white shadow-card rounded-xl border hairline">
            <div className="p-5 border-b hairline flex items-center justify-between">
              <h2 className="text-[15px] font-medium">
                {new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </h2>
              <span className="text-[13px] text-muted tabular">{events.length} events</span>
            </div>
            <ol className="divide-y divide-line2">
              {events.map((e) => (
                <li key={e.id} className="p-5 flex items-start gap-4">
                  <time className="text-[13px] text-muted tabular w-[60px] flex-none pt-0.5">
                    {e.ts.slice(11)}
                  </time>
                  <span className={`mt-1.5 h-[9px] w-[9px] rounded-full flex-none ${
                    e.severity === "alert" ? "bg-alert" : e.severity === "warn" ? "bg-warn" : "bg-accent"
                  }`} aria-hidden />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-medium">{e.title}</span>
                      <Link href={`/device/${e.deviceId}`} className="text-[13px] text-muted hover:underline">
                        · {devices.find((d) => d.id === e.deviceId)?.name ?? "—"}
                      </Link>
                    </div>
                    <p className="text-[14px] text-muted mt-0.5">{e.detail}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.1em] text-subtle pt-1">
                    {e.type}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
