import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Care dashboard preview — what caregivers see",
  description:
    "A static preview of the caregiver dashboard: chat window, calendar, vitals trend, escalation log, weekly digest.",
};

const meds = [
  { name: "Metformin 500 mg",   time: "08:00", days: "Mon–Sun",    refills: "in 9 days",  adherence: "92%" },
  { name: "Atorvastatin 20 mg", time: "21:00", days: "Mon–Sun",    refills: "in 21 days", adherence: "98%" },
  { name: "Aspirin 81 mg",      time: "08:00", days: "Mon–Sun",    refills: "in 32 days", adherence: "86%" },
  { name: "Vitamin D3 1000 IU", time: "08:00", days: "Mon, Thu",   refills: "in 18 days", adherence: "74%" },
];

const calendar = [
  { d: "Thu 24 Jul", t: "10:15", title: "Dr Patel — follow-up", who: "Lerato driving", state: "confirmed" },
  { d: "Sat 26 Jul", t: "09:30", title: "Pharmacy refill",       who: "Walking",         state: "scheduled" },
  { d: "Mon 28 Jul", t: "11:00", title: "Optometrist",           who: "Lerato driving", state: "scheduled" },
  { d: "Fri  1 Aug", t: "14:00", title: "Hair appointment",      who: "Walking",         state: "scheduled" },
];

const chatLog = [
  { from: "bot",   t: "08:00", text: "Good morning Marlene. Time for your metformin and aspirin." },
  { from: "user",  t: "08:03", text: "took them" },
  { from: "bot",   t: "08:03", text: "Logged. Anything else on your mind?" },
  { from: "user",  t: "08:11", text: "can you remind me about Dr Patel on thursday" },
  { from: "bot",   t: "08:11", text: "Yes — Thu 24 Jul at 10:15, Lerato driving. Want me to text her?" },
  { from: "user",  t: "08:12", text: "no she's coming" },
  { from: "bot",   t: "08:12", text: "Got it. Confirmed in the calendar." },
];

const escalations = [
  { ts: "Mon 21 Jul 09:42", rule: "Missed dose × 2",         state: "resolved",  by: "Lerato" },
  { ts: "Wed 16 Jul 22:18", rule: "After-hours chat (22:18)", state: "watched",   by: "—" },
  { ts: "Fri 11 Jul 14:08", rule: "HR spike (138 sustained)", state: "resolved",  by: "Operator" },
];

export default function DashboardPage() {
  return (
    <>
      <section className="container-x pt-16 pb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="eyebrow mb-2">Care dashboard · preview</div>
            <h1 className="display text-[32px] md:text-[40px]">
              What Lerato sees about Marlene.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/care" className="btn btn-ghost">Back to /care</Link>
            <Link href="/care/architecture" className="btn btn-red">How it works</Link>
          </div>
        </div>
        <p className="text-[12px] mt-3 mono" style={{ color: "var(--color-muted)" }}>
          Static preview. The live dashboard is gated behind sign-in and
          tenant provisioning.
        </p>
      </section>

      <section className="container-x pb-16">
        <div className="grid lg:grid-cols-12 gap-4">
          {/* LEFT: CHAT WINDOW */}
          <MarketingReveal className="lg:col-span-7">
            <article className="rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--color-line)" }}>
              <header className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-block w-2 h-2 rounded-full pulse-dot"
                    style={{ background: "var(--color-red)" }}
                  />
                  <div>
                    <div className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      Bot chat with Marlene
                    </div>
                    <div className="text-[11px] mono" style={{ color: "var(--color-muted)" }}>
                      Lerato's segmented view
                    </div>
                  </div>
                </div>
                <div className="text-[11px] mono" style={{ color: "var(--color-muted)" }}>
                  Today · Mon 21 Jul
                </div>
              </header>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {chatLog.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col gap-0.5 max-w-[80%]">
                      <div
                        className="rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed"
                        style={
                          m.from === "user"
                            ? { background: "var(--color-red)", color: "#fff", borderTopRightRadius: 4 }
                            : { background: "var(--color-bg-soft)", color: "var(--color-ink)", borderTopLeftRadius: 4 }
                        }
                      >
                        {m.text}
                      </div>
                      <div
                        className="text-[10px] mono"
                        style={{
                          color: "var(--color-muted)",
                          alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                        }}
                      >
                        {m.from === "bot" ? "bot" : "Marlene"} · {m.t}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 pt-4 border-t text-[12px] flex items-center gap-3"
                style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
              >
                <span aria-hidden="true">⌨</span>
                <span>Send a message to the bot (as Lerato)</span>
                <span
                  className="ml-auto mono text-[10px]"
                  style={{ color: "var(--color-red)", fontWeight: 600 }}
                >
                  segmenting on
                </span>
              </div>
            </article>
          </MarketingReveal>

          {/* RIGHT: VITALS + ADHERENCE */}
          <div className="lg:col-span-5 space-y-4">
            <MarketingReveal>
              <article
                className="rounded-2xl p-5 md:p-6"
                style={{
                  background: "var(--color-bg-soft)",
                  border: "1px solid var(--color-line)",
                }}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    7-day adherence
                  </h3>
                  <span
                    className="text-[11px] mono"
                    style={{ color: "var(--color-red)", fontWeight: 700 }}
                  >
                    89% combined
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mt-3">
                  {[92, 88, 95, 90, 84, 86, 89].map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm"
                        style={{
                          height: 56,
                          background: "var(--color-bg)",
                          position: "relative",
                          overflow: "hidden",
                          border: "1px solid var(--color-line)",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${v}%`,
                            background: v < 85 ? "#fb923c" : "var(--color-red)",
                          }}
                        />
                      </div>
                      <span className="text-[9px] mono" style={{ color: "var(--color-muted)" }}>
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                      <span className="text-[10px] mono tabular" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {v}%
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </MarketingReveal>

            <MarketingReveal delay={80}>
              <article className="rounded-2xl p-5 md:p-6" style={{ border: "1px solid var(--color-line)" }}>
                <h3 className="text-[14px] mb-3" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                  Escalation log
                </h3>
                <ul className="space-y-2">
                  {escalations.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[12.5px] py-2 border-t first:border-t-0"
                      style={{ borderColor: "var(--color-line)" }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{
                          background:
                            e.state === "resolved"
                              ? "var(--color-red)"
                              : e.state === "watched"
                              ? "#fb923c"
                              : "var(--color-muted)",
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
          </div>
        </div>

        {/* MEDS TABLE */}
        <MarketingReveal>
          <article className="rounded-2xl border mt-4 overflow-hidden" style={{ borderColor: "var(--color-line)" }}>
            <header className="p-5 md:p-6 border-b" style={{ borderColor: "var(--color-line)" }}>
              <h3 className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Medication schedule
              </h3>
              <p className="text-[12px] mt-1" style={{ color: "var(--color-muted)" }}>
                4 active medications. Refills routed to Lerato.
              </p>
            </header>
            <div className="divide-y" style={{ borderColor: "var(--color-line)" }}>
              {meds.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 px-5 md:px-7 py-4 items-center"
                >
                  <div className="col-span-12 md:col-span-5">
                    <div className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {m.name}
                    </div>
                    <div className="text-[11px] mono mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {m.days} · {m.time}
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div
                      className="text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--color-muted)", fontWeight: 600 }}
                    >
                      Refill
                    </div>
                    <div className="text-[13px] mt-0.5" style={{ color: "var(--color-ink)" }}>
                      {m.refills}
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <div
                      className="text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--color-muted)", fontWeight: 600 }}
                    >
                      30-day adherence
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg-soft)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: m.adherence,
                            background: parseInt(m.adherence) < 85 ? "#fb923c" : "var(--color-red)",
                          }}
                        />
                      </div>
                      <span
                        className="mono tabular text-[12px]"
                        style={{ color: "var(--color-ink)", fontWeight: 700 }}
                      >
                        {m.adherence}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </MarketingReveal>

        {/* CALENDAR */}
        <MarketingReveal>
          <article className="rounded-2xl border mt-4" style={{ borderColor: "var(--color-line)" }}>
            <header className="p-5 md:p-6 border-b" style={{ borderColor: "var(--color-line)" }}>
              <h3 className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Upcoming appointments
              </h3>
              <p className="text-[12px] mt-1" style={{ color: "var(--color-muted)" }}>
                Bot sends 48-hour confirm; you get the 24-hour nudge.
              </p>
            </header>
            <ul className="divide-y" style={{ borderColor: "var(--color-line)" }}>
              {calendar.map((c, i) => (
                <li
                  key={i}
                  className="grid grid-cols-12 gap-3 px-5 md:px-7 py-4 items-center"
                >
                  <div className="col-span-4 md:col-span-3">
                    <div
                      className="text-[11px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      {c.d}
                    </div>
                    <div className="mono text-[13px] tabular mt-0.5" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {c.t}
                    </div>
                  </div>
                  <div className="col-span-8 md:col-span-7">
                    <div className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {c.title}
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {c.who}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2 md:text-right">
                    <span
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{
                        color:
                          c.state === "confirmed"
                            ? "var(--color-red)"
                            : "var(--color-muted)",
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
      </section>

      {/* CTA */}
      <section className="container-x py-16 text-center">
        <MarketingReveal>
          <p className="text-[14px] mono mb-4" style={{ color: "var(--color-muted)" }}>
            This is a static preview. The real dashboard is multi-caregiver,
            multi-elder, with chat segmentation, role-based access, and an audit
            trail.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            <Link href="/signup" className="btn btn-red btn-lg">
              Try the real one
            </Link>
            <Link href="/care/architecture" className="btn btn-ghost btn-lg">
              Architecture
            </Link>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}