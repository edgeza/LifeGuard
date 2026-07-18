import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Careers — LifeGuard",
  description:
    "Three roles open. Async-first hiring. Comp ranges published. No whiteboarding, no take-home >90 min, no ranking exercises.",
};

type Role = {
  slug: string;
  title: string;
  team: string;
  location: string;
  comp: string;
  commitment: "Full-time" | "Contract";
  about: string;
  responsibilities: string[];
  you: string[];
  nice: string[];
};

const principles = [
  {
    title: "Async-first, written-default.",
    body: "We work async. Most decisions happen in PRs and design docs, not in meetings. Two short all-hands per week max. Calendar-light is a feature.",
  },
  {
    title: "Comp ranges published. No negotiation theatre.",
    body: "Every role has a salary band below. We tell you the band upfront. If your ask is above the band, the answer is no negotiation on the band itself &mdash; but we can talk about the band changing for the next role.",
  },
  {
    title: "90-minute async trial. That's it.",
    body: "We do not give multi-day take-homes. The trial is a 90-minute paid async exercise. If we can't evaluate you in 90 minutes, we're not hiring well.",
  },
  {
    title: "No whiteboard. No riddle. No &ldquo;rank these flights.&rdquo;",
    body: "We hire for craft. The interview is a paired session on real code from our production codebase. We pay you for the time.",
  },
];

const roles: Role[] = [
  {
    slug: "senior-firmware-engineer",
    title: "Senior Firmware Engineer",
    team: "Hardware",
    location: "Cape Town · hybrid (3 days in office) · remote ZA considered",
    comp: "R1.20m – R1.55m base + 0.05% – 0.15% equity",
    commitment: "Full-time",
    about:
      "You'll own the firmware on the next two SKUs (LifePendant P3 and LifeClip CG3) end to end. Schematic review, sensor driver bring-up, OTA, power budget. You'll work directly with the hardware partners in Shenzhen on each revision.",
    responsibilities: [
      "Own the firmware roadmap for two upcoming SKUs",
      "Sensor bring-up: HR/HRV/SpO₂/skin temp/9-axis IMU on a new MCU",
      "OTA pipeline: staged rollouts, signed images, automatic rollback",
      "Power budget: 7-day on 350 mAh is the floor",
    ],
    you: [
      "7+ years embedded C/C++ on STM32, nRF52, or similar Cortex-M parts",
      "Shipped at least one BLE peripheral that went to a thousand+ customers",
      "Comfortable reading a schematic and arguing with hardware engineers",
      "Comfortable working in ZA hours and shipping to a global team",
    ],
    nice: [
      "Have shipped a wearable or medical device before",
      "Familiar with FreeRTOS, Zephyr, or Mynewt",
      "Have opinions on power profiling tools",
    ],
  },
  {
    slug: "backend-platform-engineer",
    title: "Backend / Platform Engineer",
    team: "Platform",
    location: "Remote SA / NL / UK / AU only · async",
    comp: "R1.30m – R1.65m base + 0.05% – 0.20% equity",
    commitment: "Full-time",
    about:
      "You'll work on the operator console's data plane: MQTT ingest (handling 200+ device events/sec/operator), incident state machine, webhook delivery with at-least-once semantics, audit-trail hash chain. PostgREST today, custom Rust services where it matters.",
    responsibilities: [
      "Own the operator console's data plane (Go + Postgres + MQTT)",
      "Webhook delivery: retries, signing, replay protection",
      "Audit-trail hash chain (append-only, verifiable)",
      "On-call rotation (one week in six)",
    ],
    you: [
      "5+ years production Go or Rust",
      "Have built and operated a multi-tenant SaaS for at least 12 months",
      "Comfortable owning a Postgres schema and migration story end-to-end",
      "Strong on observability: structured logs, traces, real SLOs",
    ],
    nice: [
      "Have shipped an IoT / fleet management product",
      "Familiar with MQTT, EMQX, or HiveMQ",
      "Have written a public REST API that's still backwards-compatible three years later",
    ],
  },
  {
    slug: "operator-ux-engineer",
    title: "Operator UX Engineer",
    team: "Console",
    location: "Cape Town · hybrid · remote ZA considered",
    comp: "R0.95m – R1.30m base + 0.02% – 0.10% equity",
    commitment: "Full-time",
    about:
      "You'll spend most of your time watching operators work. Eight-hour shifts, alert triage, dispatch. You'll write the console's TypeScript and own the AI-triage UI. The console is the killer surface for our customers &mdash; it's what they evaluate us on.",
    responsibilities: [
      "Own the operator console UX end-to-end (React 15, Next.js 14, Tailwind)",
      "Pair with armed-response operators during shifts to learn their workflow",
      "Build the AI-triage column, dispatch view, audit-trail viewer",
      "Define and measure operator SLOs (MTTC, alert-to-dispatch)",
    ],
    you: [
      "4+ years production React/Next.js",
      "You can sit with a dispatcher for 2 hours and ship a fix by EOD",
      "Strong CSS / design system instincts (you don't ship uivariables)",
      "Care about cognitive load, not aesthetics-as-decor",
    ],
    nice: [
      "Have built console / dispatch / ops-tools before",
      "Comfortable with motion design (Framer Motion, GSAP)",
      "Have opinions on the difference between &lsquo;fast&rsquo; and &lsquo;fast-feeling&rsquo;",
    ],
  },
];

export default function CareersPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="aurora-bg" aria-hidden="true">
          <div className="blob b1" />
          <div className="blob b2" />
        </div>
        <div className="container-x relative pt-20 pb-16">
          <div className="max-w-[820px]">
            <div className="eyebrow mb-4">Careers</div>
            <h1 className="display-xl text-[44px] md:text-[60px]">
              We&rsquo;re hiring. Async, written, <span className="shimmer-text">honest comp</span>.
            </h1>
            <p className="lead mt-6 max-w-[640px]">
              LifeGuard is a small team building a personal-safety platform that
              someone&rsquo;s mother is going to rely on at 03:00. That takes
              engineers who care about craft and operators who&rsquo;ve sat in
              the chair. Three roles open. No whiteboarding. No 8-hour take-homes.
              We pay you for the trial.
            </p>
          </div>
        </div>
      </section>

      {/* HIRING PRINCIPLES */}
      <section className="container-x pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {principles.map((p, i) => (
            <MarketingReveal key={p.title} delay={i * 40}>
              <article className="lift-strong card p-5 h-full">
                <div
                  className="text-[11px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: "var(--color-red)", fontWeight: 700 }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                  {p.title}
                </h3>
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--color-body)" }}>
                  {p.body}
                </p>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="container-x pb-16 md:pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="display text-[36px] md:text-[44px]">
            <span className="shimmer-text">{roles.length}</span> roles open
          </h2>
          <div className="text-[13px] hidden md:block" style={{ color: "var(--color-muted)" }}>
            Hiring pipeline updated weekly. Last refresh: today.
          </div>
        </div>
        <div className="space-y-4">
          {roles.map((r, i) => (
            <MarketingReveal key={r.slug} delay={i * 60}>
              <article
                className="rounded-2xl border p-6 md:p-8 lift-strong"
                style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}
              >
                <header className="grid lg:grid-cols-12 gap-6 items-start mb-5">
                  <div className="lg:col-span-7">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span
                        className="text-[11px] uppercase tracking-[0.18em]"
                        style={{ color: "var(--color-red)", fontWeight: 700 }}
                      >
                        {r.team}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--color-muted)", fontWeight: 500 }}
                      >
                        · {r.commitment}
                      </span>
                    </div>
                    <h3 className="h2 text-[24px] md:text-[28px]">{r.title}</h3>
                    <p className="text-[15px] mt-3 leading-relaxed" style={{ color: "var(--color-body)" }}>
                      {r.about}
                    </p>
                  </div>
                  <div className="lg:col-span-5 lg:text-right space-y-2">
                    <Meta label="Location" value={r.location} />
                    <Meta label="Comp" value={r.comp} highlight />
                    <Link
                      href={`mailto:careers@life.guard?subject=${encodeURIComponent(r.title)}`}
                      className="btn btn-red w-full mt-3"
                    >
                      Apply
                    </Link>
                  </div>
                </header>

                <div className="grid md:grid-cols-3 gap-5 pt-5 border-t" style={{ borderColor: "var(--color-line)" }}>
                  <Block label="What you'd own" items={r.responsibilities} />
                  <Block label="You probably are" items={r.you} />
                  <Block label="Bonus" items={r.nice} muted />
                </div>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* DON'T-WE-DO */}
      <section className="section-dark py-20 md:py-28" aria-labelledby="dont-do-heading">
        <div className="container-x">
          <MarketingReveal>
            <div className="max-w-[640px] mb-10">
              <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                What we don&rsquo;t do
              </div>
              <h2 id="dont-do-heading" className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
                Common interview-antics we&rsquo;ve dropped.
              </h2>
              <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                The interviewing industry collects bad habits. Here&rsquo;s what
                we don&rsquo;t do, so you don&rsquo;t have to brace for it.
              </p>
            </div>
          </MarketingReveal>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { bad: "Algorithm whiteboards.", good: "Real code from our repo. Pair with us. 90 minutes. We pay you." },
              { bad: "Multi-day take-homes.", good: "90-minute async paid trial. If we can't tell in 90 min, our process is broken, not you." },
              { bad: "Behavioural grilling.", good: "Two real conversations about real work you've shipped. We listen more than we ask." },
              { bad: "&lsquo;Rank these flights&rsquo; puzzles.", good: "Nothing. We tried one in 2025. It told us nothing about the person." },
              { bad: "Salary negotiation theatre.", good: "Band is published on this page. We tell you the band before the trial. No games." },
              { bad: "5-round gauntlets.", good: "Trial → 1 hiring manager call → 1 team call → offer. Three real conversations, then a decision." },
            ].map((row, i) => (
              <MarketingReveal key={i} delay={i * 30}>
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="text-[12px] uppercase tracking-[0.18em] mb-2"
                    style={{ color: "#fb7185", fontWeight: 700 }}
                  >
                    Not here
                  </div>
                  <div className="text-[14px] mb-3" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>
                    {row.bad}
                  </div>
                  <div className="text-[14px]" style={{ color: "rgba(255,255,255,0.92)" }}>
                    {row.good}
                  </div>
                </div>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="container-x py-20 text-center">
        <MarketingReveal>
          <h2 className="display text-[28px] md:text-[36px] max-w-[640px] mx-auto">
            Don&rsquo;t see your role? We&rsquo;re always reading good mail.
          </h2>
          <p className="lead mt-4 max-w-[520px] mx-auto">
            Send us what you&rsquo;ve shipped. If we&rsquo;re growing into your
            craft, we&rsquo;ll write back. We hire one or two people a quarter,
            but we read every note.
          </p>
          <Link
            href="mailto:careers@life.guard?subject=Hello%20from%20a%20friend%20of%20LifeGuard"
            className="btn btn-red btn-lg mt-6"
          >
            Write to careers@life.guard
          </Link>
        </MarketingReveal>
      </section>
    </>
  );
}

function Meta({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-3 lg:justify-end">
      <span
        className="text-[11px] uppercase tracking-[0.16em]"
        style={{ color: "var(--color-muted)", fontWeight: 600 }}
      >
        {label}
      </span>
      <span
        className="text-[13px] mono tabular"
        style={{ color: highlight ? "var(--color-red)" : "var(--color-ink)", fontWeight: 600 }}
      >
        {value}
      </span>
    </div>
  );
}

function Block({ label, items, muted = false }: { label: string; items: string[]; muted?: boolean }) {
  return (
    <div>
      <div
        className="text-[11px] uppercase tracking-[0.16em] mb-2"
        style={{ color: muted ? "var(--color-muted)" : "var(--color-ink)", fontWeight: 600 }}
      >
        {label}
      </div>
      <ul
        className="text-[13px] space-y-1.5 leading-relaxed"
        style={{ color: muted ? "var(--color-muted)" : "var(--color-body)" }}
      >
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-1 h-1 rounded-full mt-2 shrink-0"
              style={{ background: muted ? "var(--color-muted)" : "var(--color-red)" }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
