import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";
import { ChatPanel } from "@/components/ChatPanel";

export const metadata = {
  title: "Care dashboard — LifeGuard",
  description:
    "Live caregiver dashboard. Chat with the bot, see medication adherence, upcoming appointments, vitals trends, escalation log. Multi-caregiver, segmented chat history.",
};

// Mock data — in production these come from /api/care/{meds,calendar,vitals,escalations}
const adherence = {
  weekly: [92, 88, 95, 90, 84, 86, 89] as number[],
  combined: 89,
  trend: "+1.4% week-on-week",
};

const vitals = {
  resting_hr: { current: 72, delta: -2, points: [78, 80, 76, 74, 75, 73, 72] },
  sleep_hours: { current: 6.8, delta: +0.3, points: [5.5, 6.2, 6.0, 6.5, 6.8, 7.1, 6.8] },
  steps: { current: 1820, delta: +120, points: [1200, 1450, 1600, 1700, 1750, 1700, 1820] },
};

const meds = [
  { name: "Metformin 500 mg",   schedule: "08:00 · daily",      refills_in_days: 9,  adherence_30d: 92, status: "ok" },
  { name: "Atorvastatin 20 mg", schedule: "21:00 · daily",      refills_in_days: 21, adherence_30d: 98, status: "ok" },
  { name: "Aspirin 81 mg",      schedule: "08:00 · daily",      refills_in_days: 32, adherence_30d: 86, status: "ok" },
  { name: "Vitamin D3 1000 IU", schedule: "08:00 · Mon, Thu",    refills_in_days: 18, adherence_30d: 74, status: "watch" },
];

const appointments = [
  { d: "Thu 24 Jul", t: "10:15", title: "Dr Patel — follow-up",      transport: "Lerato driving", state: "confirmed" },
  { d: "Sat 26 Jul", t: "09:30", title: "Pharmacy refill",            transport: "Walking",         state: "scheduled" },
  { d: "Mon 28 Jul", t: "11:00", title: "Optometrist",                transport: "Lerato driving", state: "scheduled" },
  { d: "Fri  1 Aug", t: "14:00", title: "Hair appointment",           transport: "Walking",         state: "scheduled" },
];

const escalations = [
  { ts: "Mon 21 Jul 09:42", rule: "Missed dose × 2",            state: "resolved",  by: "Lerato" },
  { ts: "Wed 16 Jul 22:18", rule: "After-hours chat (22:18)",   state: "watched",   by: "—" },
  { ts: "Fri 11 Jul 14:08", rule: "HR spike (138 sustained)",   state: "resolved",  by: "Operator" },
];

const family = [
  { name: "Lerato",   role: "Primary caregiver",  online: true,  last_seen: "now",     chats: 18 },
  { name: "Sipho",    role: "Sibling",            online: true,  last_seen: "09:18",   chats: 6 },
  { name: "Nomsa",    role: "Sibling",            online: false, last_seen: "yest.",   chats: 12 },
  { name: "Themba",   role: "Sibling",            online: false, last_seen: "3d ago",  chats: 3 },
];

export default function CareDashboardPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg-soft)" }}>
      {/* TOP BAR */}
      <header
        className="border-b sticky top-0 z-30 backdrop-blur"
        style={{
          borderColor: "var(--color-line)",
          background: "rgba(255,255,255,0.85)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/care" className="flex items-center gap-2">
              <span
                className="inline-grid place-items-center w-8 h-8 rounded-md"
                style={{ background: "var(--color-red)" }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 12V4h2v6h5v2H2z" fill="#fff" />
                  <circle cx="11.5" cy="5" r="1.5" fill="#fff" />
                </svg>
              </span>
              <span className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                LifeGuard · Care
              </span>
            </Link>
            <span className="text-[12px] mono" style={{ color: "var(--color-muted)" }}>
              / Esther · Marlene Mokoena
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/care/onboarding" className="text-[12px] mono" style={{ color: "var(--color-muted)" }}>
              onboarding
            </Link>
            <Link href="/care/architecture" className="text-[12px] mono" style={{ color: "var(--color-muted)" }}>
              architecture
            </Link>
            <button className="btn btn-red btn-sm">
              Add medication
            </button>
          </div>
        </div>
      </header>

      {/* ADHERENCE STRIP */}
      <section className="border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Stat label="Adherence · 7 days"  value={`${adherence.combined}%`} sub={adherence.trend} />
            <Stat label="Resting HR"          value={`${vitals.resting_hr.current} bpm`} sub={`${vitals.resting_hr.delta} bpm vs 7d avg`} />
            <Stat label="Sleep · last night"  value={`${vitals.sleep_hours.current} h`} sub={`${vitals.sleep_hours.delta > 0 ? "+" : ""}${vitals.sleep_hours.delta} h vs 7d avg`} />
            <Stat label="Steps · yesterday"   value={`${vitals.steps.current.toLocaleString()}`} sub={`${vitals.steps.delta > 0 ? "+" : ""}${vitals.steps.delta} vs 7d avg`} />
            <Stat label="Family online"       value="2 of 4" sub="Lerato · Sipho" />
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT — CHAT */}
          <MarketingReveal className="lg:col-span-7">
            <ChatPanel />
          </MarketingReveal>

          {/* RIGHT — VITALS + ESCALATIONS + FAMILY */}
          <div className="lg:col-span-5 space-y-6">
            <MarketingReveal>
              <article className="rounded-xl border p-5" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
                <header className="flex items-baseline justify-between mb-4">
                  <h3 className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    Weekly adherence
                  </h3>
                  <span className="text-[11px] mono" style={{ color: "var(--color-red)", fontWeight: 700 }}>
                    {adherence.combined}%
                  </span>
                </header>
                <div className="grid grid-cols-7 gap-2">
                  {adherence.weekly.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-full rounded-sm relative overflow-hidden"
                        style={{
                          height: 56,
                          background: "var(--color-bg-soft)",
                          border: "1px solid var(--color-line)",
                        }}
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0"
                          style={{
                            height: `${v}%`,
                            background: v < 85 ? "#fb923c" : "var(--color-red)",
                          }}
                        />
                      </div>
                      <span className="text-[9px] mono" style={{ color: "var(--color-muted)" }}>
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                      <span className="text-[10px] mono tabular" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </MarketingReveal>

            <MarketingReveal delay={80}>
              <article className="rounded-xl border p-5" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
                <header className="flex items-baseline justify-between mb-3">
                  <h3 className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    Escalation log
                  </h3>
                  <Link href="/care/dashboard/escalations" className="text-[11px] mono" style={{ color: "var(--color-red)", fontWeight: 600 }}>
                    full log →
                  </Link>
                </header>
                <ul className="space-y-1">
                  {escalations.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 py-2.5 text-[12.5px] border-t first:border-t-0"
                      style={{ borderColor: "var(--color-line)" }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{
                          background:
                            e.state === "resolved" ? "var(--color-red)" : e.state === "watched" ? "#fb923c" : "var(--color-muted)",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                            {e.rule}
                          </span>
                          <span
                            className="text-[10px] uppercase tracking-[0.16em]"
                            style={{ color: "var(--color-muted)", fontWeight: 700 }}
                          >
                            {e.state}
                          </span>
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                          {e.ts} · {e.by}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </MarketingReveal>

            <MarketingReveal delay={140}>
              <article className="rounded-xl border p-5" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
                <header className="mb-3">
                  <h3 className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    Family on this tenant
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                    Each caregiver has their own chat history with the bot.
                  </p>
                </header>
                <ul className="space-y-1">
                  {family.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 py-2 text-[12.5px] border-t first:border-t-0"
                      style={{ borderColor: "var(--color-line)" }}
                    >
                      <span
                        className="relative inline-flex w-2 h-2 shrink-0"
                        aria-label={p.online ? "online" : "offline"}
                      >
                        {p.online && (
                          <span
                            className="absolute inset-0 rounded-full pulse-dot"
                            style={{ background: "var(--color-red)" }}
                          />
                        )}
                        <span
                          className="relative inline-block w-2 h-2 rounded-full"
                          style={{ background: p.online ? "var(--color-red)" : "var(--color-muted)" }}
                        />
                      </span>
                      <span className="flex-1" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {p.name}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                        {p.role}
                      </span>
                      <span className="text-[10px] mono" style={{ color: "var(--color-muted)" }}>
                        {p.chats} chats
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </MarketingReveal>
          </div>
        </div>

        {/* MEDS + CALENDAR */}
        <div className="grid lg:grid-cols-12 gap-6 mt-6">
          <MarketingReveal className="lg:col-span-7">
            <article className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
              <header className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
                <div>
                  <h3 className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    Medication schedule
                  </h3>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                    4 active. Refills routed to the family.
                  </p>
                </div>
                <button className="btn btn-ghost btn-sm">+ Add medication</button>
              </header>
              <div className="divide-y" style={{ borderColor: "var(--color-line)" }}>
                {meds.map((m, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-5 py-4 items-center">
                    <div className="col-span-12 md:col-span-5">
                      <div className="text-[13.5px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {m.name}
                      </div>
                      <div className="text-[11px] mono mt-0.5" style={{ color: "var(--color-muted)" }}>
                        {m.schedule}
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                        Refill in
                      </div>
                      <div className="text-[13px] mt-0.5" style={{ color: "var(--color-ink)" }}>
                        {m.refills_in_days} days
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-4">
                      <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                        30-day adherence
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg-soft)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${m.adherence_30d}%`,
                              background: m.adherence_30d < 85 ? "#fb923c" : "var(--color-red)",
                            }}
                          />
                        </div>
                        <span className="mono tabular text-[12px]" style={{ color: "var(--color-ink)", fontWeight: 700 }}>
                          {m.adherence_30d}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </MarketingReveal>

          <MarketingReveal className="lg:col-span-5" delay={80}>
            <article className="rounded-xl border h-full" style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}>
              <header className="px-5 py-4 border-b" style={{ borderColor: "var(--color-line)" }}>
                <h3 className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                  Upcoming appointments
                </h3>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                  Bot sends 48-hour confirm; you get the 24-hour nudge.
                </p>
              </header>
              <ul className="divide-y" style={{ borderColor: "var(--color-line)" }}>
                {appointments.map((c, i) => (
                  <li key={i} className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center">
                    <div className="col-span-4">
                      <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--color-red)", fontWeight: 700 }}>
                        {c.d}
                      </div>
                      <div className="mono text-[13px] tabular mt-0.5" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {c.t}
                      </div>
                    </div>
                    <div className="col-span-5">
                      <div className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {c.title}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                        {c.transport}
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      <span
                        className="text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color: c.state === "confirmed" ? "var(--color-success)" : "var(--color-muted)",
                          fontWeight: 700,
                        }}
                      >
                        {c.state}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </MarketingReveal>
        </div>
      </section>

      <footer className="max-w-[1400px] mx-auto px-6 py-8 border-t" style={{ borderColor: "var(--color-line)" }}>
        <p className="text-[12px] mono" style={{ color: "var(--color-muted)" }}>
          Live preview · mock data · not connected to a real tenant · <Link href="/care/architecture" style={{ color: "var(--color-red)" }}>how this is built</Link> · <Link href="/care/onboarding" style={{ color: "var(--color-red)" }}>set up the real thing</Link>
        </p>
      </footer>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "var(--color-muted)", fontWeight: 600 }}
      >
        {label}
      </div>
      <div
        className="mono tabular mt-1 text-[24px]"
        style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
        {sub}
      </div>
    </div>
  );
}