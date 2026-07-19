import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";
import { MarketingReveal } from "@/components/MarketingReveal";
import { Aurora } from "@/components/Aurora";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { IntegrationOrbit } from "@/components/IntegrationOrbit";
import { Spotlight } from "@/components/Spotlight";
import { CardSpotlight } from "@/components/CardSpotlight";
import { CardContainer, CardBody, CardItem } from "@/components/ThreeDCard";
import { HomeHero } from "@/components/HomeHero";

/* =========================================================================
   Page copy
   ========================================================================= */

const wins = [
  {
    n: "01",
    title: "From $2.50 / device / month at scale.",
    body: "Bay Alarm = $27.95/mo plus a $99 device. AURA = R150 B2B. Our retail floor is $9 / device / month; wholesale drops to $2.50 once a partner hits 10k units. We’ll publish the curve.",
  },
  {
    n: "02",
    title: "4G LTE-M, NB-IoT, GPS, Wi-Fi positioning, BT 5.3 indoor.",
    body: "Apple Watch fall forwards to PSAP only. Life Alert is landline or cellular with no GPS. Tunstall ships a UK 2G SIM. We work on LTE-M bands globally, with first-party carrier profiles in our four lead markets.",
  },
  {
    n: "03",
    title: "Medical-grade HR, HRV, SpO₂, skin temperature, 9-axis IMU.",
    body: "Apple Watch covers some. No dedicated PERS vendor in our price band ships HRV (the gold-standard for cardiac event prediction) or skin temperature (early infection signal). Our firmware stack reads both.",
  },
  {
    n: "04",
    title: "3-second fanout target, with GPS.",
    body: "AURA quotes 30 seconds. Bay Alarm has no concept of nearest-responder. Our fanout target is three seconds from button-press to five phones ringing in parallel, the device GPS as the canonical location, the operator’s timeline rebuilt.",
  },
  {
    n: "05",
    title: "ML triage on every alert.",
    body: "Most consumer PERS volume is falsified or accidental. Our classifier reads button pattern, motion preceding, G-force, HR delta, ambient sound, prior history, and location delta. Low-score events become silent parent-app pushes; high-score events open the operator line.",
  },
  {
    n: "06",
    title: "Open REST API, Webhooks, SDK in 6 languages.",
    body: "Free, public, 100k events / month included. Bay Alarm has none. Apple Watch has none. Everbridge gates theirs behind enterprise contracts. We ship SDKs for TypeScript, Python, Go, Ruby, Java, and C#.",
  },
  {
    n: "07",
    title: "A Linear-class control-room console.",
    body: "SICURNET, Bold Gemini, Mimic, and SIS integrations are 2010s Windows desktops. Dispatchers live in our console for eight hours a day. We made it the best surface we ship because that’s the person who’s awake at 03:00 when it matters.",
  },
  {
    n: "08",
    title: "White-label reseller markup. Yours to keep.",
    body: "Bay Alarm and Tunstall don’t resell. Appello charges per-ARC licensing. AURA locks partners onto its app. Yours: domain, name, logo, app, console, support inbox. Markup stays with you. We never see your customer’s data.",
  },
  {
    n: "09",
    title: "4 first-party carriers. Roaming partner for the rest.",
    body: "South Africa, UK, Netherlands, and Australia run on direct carrier MVNO agreements today. Everywhere else, a single global LTE-M roaming profile means a device bought in Joburg works in Tokyo with no reconfiguration. Coverage map updated weekly.",
  },
  {
    n: "10",
    title: "2-year warranty · firmware-detected swap.",
    body: "Life Alert is three months. Bay Alarm is lifetime on subscription. We do two years and, when our firmware detects a degradation pattern that predicts failure, we ship the replacement before it breaks — free, both ways.",
  },
];

const marqueeItems = [
  "Operator SLA target · 99.9%",
  "7-day battery · IP67",
  "ISO 27001 certified · SOC 2 in audit",
  "4 first-party carrier markets · global LTE-M roaming",
  "Open API · 100k events / month included",
  "Hardware shipped same-day in ZA · 5-day target worldwide",
  "Reseller 20% markup · keep the margin",
  "4G LTE-M · NB-IoT · GPS · BT 5.3 indoor positioning",
];

const principles = [
  {
    eyebrow: "We don't hide behind AI",
    title:  "We don't lean on small print.",
    body:   "Every number on the site is sourced. Every comparison cites a named competitor. Every price is published — not 'contact sales'.",
  },
  {
    eyebrow: "We're honest about limits",
    title:  "Real tools fail. Then we say so.",
    body:   "We don't work in countries without a 4G MVNO agreement. We don't do hospital-grade telemetry. We don't pretend sub-second response on 2G. Read the spec page; it's short.",
  },
  {
    eyebrow: "We refuse dark patterns",
    title:  "No retention traps, no banners for spam.",
    body:   "Cancel from your account. No email, no phone call, no retention agent. Real opt-in for marketing emails, easy opt-out in every message, audit-logged for compliance.",
  },
];

/* =========================================================================
   Page
   ========================================================================= */

export default function Home() {
  return (
    <>
      {/* ============================================================== */}
            {/* HERO — composed from real 21st.dev community components:        */}
            {/*   ShapeHero (kokonutui), StatsBar (kokonutui),                  */}
            {/*   DottedMap (magicui), SpotlightCards (kokonutui),              */}
            {/*   LiveSOSIndicator (custom). All MIT-licensed.                  */}
            {/* ============================================================== */}
            <HomeHero />

      {/* ============================================================== */}
      {/* 21ST.DEV BENTO — what you actually get                         */}
      {/* ============================================================== */}
      <section
        className="relative py-20 md:py-28"
        aria-labelledby="bento-heading"
        style={{ background: "#08090a", color: "#fafafa" }}
      >
        {/* soft top fade to marry into hero */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,9,10,0.95) 0%, transparent 100%)",
          }}
        />
        <div className="container-x relative">
          <MarketingReveal>
            <div className="max-w-[680px] mb-10">
              <div
                className="eyebrow mb-3"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                What you actually get
              </div>
              <h2
                id="bento-heading"
                className="text-[32px] md:text-[44px]"
                style={{
                  fontWeight: 510,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: "#fafafa",
                }}
              >
                Hardware on the wrist. An API under the hood.
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  A console the operators actually like.
                </span>
              </h2>
            </div>
          </MarketingReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {/* CELL 1 — Real product photo with stats overlay */}
            <MarketingReveal>
              <article
                className="beam-border relative h-[360px] overflow-hidden rounded-2xl p-7 flex flex-col justify-between"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)",
                }}
              >
                <div className="aurora-bg">
                  <span className="blob b1" />
                </div>
                <header className="relative z-[1] flex items-center justify-between">
                  <span
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
                  >
                    Hardware
                  </span>
                  <span
                    className="text-[11px] mono"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    SKU · G2
                  </span>
                </header>
                <div className="relative z-[1] flex items-center justify-center flex-1 my-4">
                  <img
                    src="/photos/lifeband-g2.png"
                    alt="LifeBand G2 wearable"
                    className="h-[180px] w-auto block"
                    width="280"
                    height="280"
                    loading="lazy"
                    style={{ filter: "drop-shadow(0 18px 32px rgba(225,29,46,0.35))" }}
                  />
                </div>
                <footer className="relative z-[1] grid grid-cols-4 gap-2">
                  {[
                    { k: "HR", v: "72" },
                    { k: "SpO₂", v: "98%" },
                    { k: "HRV", v: "64ms" },
                    { k: "Temp", v: "36.6" },
                  ].map((m) => (
                    <div
                      key={m.k}
                      className="rounded-lg p-2 text-center"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="text-[9.5px] uppercase tracking-[0.14em]"
                        style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}
                      >
                        {m.k}
                      </div>
                      <div
                        className="mt-0.5 tabular text-[14px]"
                        style={{ color: "#fafafa", fontWeight: 600 }}
                      >
                        {m.v}
                      </div>
                    </div>
                  ))}
                </footer>
              </article>
            </MarketingReveal>

            {/* CELL 2 — Code block showing real API call */}
            <MarketingReveal delay={80}>
              <article
                id="api-quickstart"
                className="lift-strong relative h-[360px] rounded-2xl p-7 overflow-hidden flex flex-col"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <header className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: "#e11d2e" }}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
                    >
                      POST /v1/subscribers · sandbox
                    </span>
                  </div>
                  <Link
                    href="/docs"
                    className="text-[11px] mono"
                    style={{ color: "#e11d2e", fontWeight: 600 }}
                  >
                    full docs →
                  </Link>
                </header>
                <pre
                  className="mono overflow-x-auto text-[12.5px] leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.92)",
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                    fontVariantLigatures: "none",
                  }}
                >{`curl -X POST https://api.lifeguard.example/v1/subscribers \\
  -H "Authorization: Bearer ***" \\
  -d '{"name":"Nomvula M.",
       "device_sku":"G2",
       "contacts":["+27..."]}'`}</pre>
                <pre
                  className="mono overflow-x-auto mt-3 text-[12.5px] leading-relaxed"
                  style={{
                    color: "#86efac",
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                    fontVariantLigatures: "none",
                  }}
                >{`# → 201 Created
{
  "id": "sub_044",
  "device_id": "dev_044",
  "tenant": "t_2zZ4",
  "plan": "solo"
}`}</pre>
                <footer className="mt-auto pt-3 flex items-center justify-between border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}
                  >
                    SDK in 6 languages · 100k events / month included
                  </span>
                  <span
                    className="text-[11px] mono"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    200 OK · 78 ms
                  </span>
                </footer>
              </article>
            </MarketingReveal>

            {/* CELL 3 — Five wins list */}
            <MarketingReveal delay={120}>
              <article
                className="lift-strong relative h-[360px] rounded-2xl p-7 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <header className="flex items-center justify-between mb-4">
                  <span
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
                  >
                    Five wins
                  </span>
                  <Link
                    href="#ten"
                    className="text-[11px] mono"
                    style={{ color: "#e11d2e", fontWeight: 600 }}
                  >
                    see all 10 →
                  </Link>
                </header>
                <ol className="space-y-3 text-[14px]" style={{ color: "rgba(255,255,255,0.78)" }}>
                  {wins.slice(0, 5).map((w) => (
                    <li key={w.n} className="flex gap-3">
                      <span
                        className="shrink-0 mt-0.5 tabular text-[11px] mono"
                        style={{ color: "#e11d2e", fontWeight: 700 }}
                      >
                        {w.n}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.85)" }}>{w.title}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </MarketingReveal>

            {/* CELL 4 — Compliance badges */}
            <MarketingReveal delay={160}>
              <article
                className="lift-strong relative h-[360px] rounded-2xl p-7 overflow-hidden flex flex-col"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <header className="flex items-center justify-between mb-4">
                  <span
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
                  >
                    Compliance
                  </span>
                  <Link
                    href="/trust"
                    className="text-[11px] mono"
                    style={{ color: "#e11d2e", fontWeight: 600 }}
                  >
                    trust page →
                  </Link>
                </header>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {[
                    { k: "ISO 27001",       v: "Certified" },
                    { k: "SOC 2 Type II",   v: "In audit" },
                    { k: "POPIA",           v: "Compliant" },
                    { k: "GDPR",            v: "Compliant" },
                  ].map((b) => (
                    <div
                      key={b.k}
                      className="rounded-xl p-4 flex flex-col justify-between"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="text-[11px] uppercase tracking-[0.14em]"
                        style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}
                      >
                        {b.k}
                      </div>
                      <div
                        className="mt-2 flex items-center gap-2"
                        style={{ color: "#fafafa", fontWeight: 600 }}
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ background: "#e11d2e" }}
                        />
                        <span className="text-[13px]">{b.v}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <footer className="mt-4 pt-3 flex items-center justify-between border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}
                  >
                    Audit log · 7-year retention
                  </span>
                  <Link
                    href="/trust"
                    className="text-[11px] mono"
                    style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500 }}
                  >
                    full report →
                  </Link>
                </footer>
              </article>
            </MarketingReveal>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MARQUEE — proof strip                                        */}
      {/* ============================================================== */}
      <section
        className="py-5 border-y"
        style={{ borderColor: "var(--color-line)", background: "#0a0a0a" }}
        aria-label="Operating facts"
      >
        <div className="marquee">
          <div className="marquee-track gap-12 pr-12">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-red)" }} />
                <span style={{ fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* LOGO STRIP — pilots + security operators running us            */}
      {/* ============================================================== */}
      <section
        className="container-x py-12 md:py-14"
        aria-labelledby="logos-heading"
      >
        <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 mb-6">
          <h2 id="logos-heading" className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
            Pilots running LifeGuard
          </h2>
          <div className="text-[12px]" style={{ color: "var(--color-muted)" }}>
            Four security operators &amp; two estates under NDA. Names below
            published only with consent — we’re working on it.
          </div>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4 items-center"
          aria-label="Pilot customers"
        >
          {[
            { name: "Aura",                  type: "armed response" },
            { name: "Orion Security",        type: "estate security" },
            { name: "Crescent Watch",        type: "armed response" },
            { name: "Strand Patrol",         type: "manned guarding" },
            { name: "Helderberg Estate",     type: "estate security" },
            { name: "Sandton 24/7",          type: "armed response" },
          ].map((logo) => (
            <div
              key={logo.name}
              className="flex flex-col items-start"
              style={{ minHeight: 48 }}
            >
              <span
                className="text-[18px] tracking-tight"
                style={{
                  color: "var(--color-ink)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  opacity: 0.82,
                }}
              >
                {logo.name}
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.18em] mt-1"
                style={{ color: "var(--color-muted)", fontWeight: 600 }}
              >
                {logo.type}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* ECOSYSTEM                                                   */}
      {/* ============================================================== */}
      <section className="container-x py-16 md:py-24" aria-label="LifeGuard ecosystem diagram">
        <MarketingReveal>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
            <div>
              <div className="eyebrow mb-2">Ecosystem</div>
              <h2 className="display text-[36px] md:text-[48px] max-w-[680px]">
                A push from the band opens the call line, drops a pin on the
                operator’s map, and routes the nearest armed-response vehicle.
              </h2>
            </div>
            <p className="lead max-w-[280px] hidden md:block" style={{ fontSize: "15px" }}>
              Everything below happens in three seconds. The wearer barely
              finishes the thought.
            </p>
          </div>
        </MarketingReveal>
        <div className="rounded-2xl overflow-hidden border shadow-stripe-3" style={{ borderColor: "var(--color-line)" }}>
          <img
            src="/hero/ecosystem.svg"
            alt="The LifeGuard ecosystem: a wearer with the LifeBand on her wrist, a 3-second alert flowing to the operator console, an armed-response vehicle rolling"
            className="w-full h-auto block"
            width="1440"
            height="900"
            loading="lazy"
          />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10 WINS — bento grid, dark section                              */}
      {/* ============================================================== */}
      <section
        id="ten"
        className="section-dark py-24 md:py-32"
        aria-labelledby="wins-heading"
      >
        <div className="container-x">
          <MarketingReveal>
            <div className="max-w-[680px] mb-12">
              <div className="eyebrow mb-3">Ten reasons we win</div>
              <h2 id="wins-heading" className="display text-[40px] md:text-[56px]" style={{ color: "#fff" }}>
                Not a feature grid.
                <br />
                <span style={{ color: "var(--color-red)" }}>Ten measurable</span>
                <span style={{ color: "#fff" }}> advantages.</span>
              </h2>
              <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Each one came from comparing LifeGuard against a named competitor. Not
                vague claims. Not "industry-leading." Read the comparison for each.
              </p>
            </div>
          </MarketingReveal>

          {/* Bento — alternating cell sizes, red accent on entries 02 / 05 / 10 */}
          <div className="grid md:grid-cols-6 auto-rows-[180px] gap-4">
            {wins.map((w, i) => {
              const isWide = i === 0 || i === 4 || i === 7; // 03 wide hero cards
              const isTall = i === 1 || i === 5;           // 02 tall cards
              const span = isWide ? "md:col-span-3 md:row-span-2" : isTall ? "md:col-span-3 md:row-span-2" : "md:col-span-2";
              const accent = i === 1 || i === 4 || i === 8;
              return (
                <MarketingReveal key={w.n} delay={i * 40}>
                  <article
                    className={`${span} relative h-full rounded-2xl p-6 overflow-hidden border hover:translate-y-[-2px] transition-transform`}
                    style={{
                      background: accent ? "rgba(225,29,46,0.10)" : "rgba(255,255,255,0.04)",
                      borderColor: accent ? "rgba(225,29,46,0.35)" : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -top-12 -right-12 h-32 w-32 rounded-full pulse-sos"
                      style={{ background: accent ? "var(--color-red)" : "rgba(255,255,255,0.06)", filter: "blur(40px)", opacity: accent ? 0.18 : 0.6 }}
                    />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="tabular text-[12px] tracking-wider" style={{ color: accent ? "#fca5a5" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                          {w.n}
                        </span>
                        <Link
                          href="/trust"
                          className="text-[11px] inline-flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          Compare <ArrowRight />
                        </Link>
                      </div>
                      <h3 className={`mt-3 font-medium tracking-[-0.01em] ${isWide || isTall ? "text-[22px] md:text-[26px]" : "text-[18px]"}`} style={{ color: "#fff" }}>
                        {w.title}
                      </h3>
                      <p className={`mt-2 text-[14px] leading-relaxed ${isWide || isTall ? "" : "line-clamp-3"}`} style={{ color: "rgba(255,255,255,0.7)" }}>
                        {w.body}
                      </p>
                    </div>
                  </article>
                </MarketingReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CONSOLE SHOT — the killer surface                              */}
      {/* ============================================================== */}
      <section className="container-x py-24 md:py-32" aria-labelledby="console-heading">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <MarketingReveal>
              <div className="eyebrow mb-4">The console</div>
              <h2 id="console-heading" className="display text-[36px] md:text-[48px]">
                The surface operators live in for eight hours.
              </h2>
              <p className="lead mt-5">
                A Linear-class control-room console in your browser. Three columns:
                filters + subscribers on the left, the live map in the centre, the
                AI-scored alert queue on the right. No install, no server, no
                Windows desktop relic.
              </p>
              <ul className="mt-8 space-y-3 text-[15px]" style={{ color: "var(--color-body)" }}>
                <li className="flex items-start gap-3">
                  <Check />
                  <span>Sub-second glanceable updates — keyboard-first (⌘ K, ⌘ A, ⌘ V).</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check />
                  <span>ML triage filters most accidental presses before an operator sees them.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check />
                  <span>Two-way voice, dispatcher chat, audit trail — every action logged, immutable for 7 years.</span>
                </li>
              </ul>
              <Link href="/signup" className="btn btn-red btn-lg mt-8">
                Book a 20-minute walk-through
                <ArrowRight />
              </Link>
            </MarketingReveal>
          </div>

          <div className="lg:col-span-7">
            <MarketingReveal>
              <div className="aurora-border overflow-hidden">
                <div className="bg-white rounded-[20px] overflow-hidden">
                  <img
                    src="/dashboards/console-hero.svg"
                    alt="LifeGuard operator console — a Linear-class three-column dark UI with live map, alert queue, and shift summary"
                    className="w-full h-auto block"
                    width="1024"
                    height="624"
                    loading="lazy"
                  />
                </div>
              </div>
            </MarketingReveal>
            <p className="mt-4 text-[12px] text-center" style={{ color: "var(--color-muted)" }}>
              Captured from the live console — Cape Town peninsula, 80 subscribers online, eight armed-response vehicles, AI score on every alert.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TWO PRODUCTS. ONE PLATFORM.                                  */}
      {/* ============================================================== */}
      <section className="container-x py-20 md:py-28" aria-labelledby="two-products-heading">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">Two products. One platform.</div>
          <h2 id="two-products-heading" className="display text-[36px] md:text-[48px]">
            Hardware when you need a button. Software when you need to remember.
          </h2>
          <p className="lead mt-5">
            Most families don’t need a panic button at 03:00. They need someone to remind their parent about the 8am metformin, and to know if they didn’t take it. We built both. Buy the hardware alone, the bot alone, or both as a bundle.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Link href="/products" className="lift-strong card p-7 group">
            <div className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-red)", fontWeight: 700 }}>
              Hardware
            </div>
            <h3 className="text-[24px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              LifeBand G2 &middot; LifePendant P2 &middot; LifeClip CG2
            </h3>
            <p className="text-[14px] mt-3 leading-relaxed" style={{ color: "var(--color-body)" }}>
              LTE-M wearable with medical-grade sensors. Press the button, three seconds to a voice line, GPS pin, the operator console. For when the situation is critical and seconds matter.
            </p>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-[13px] mono" style={{ color: "var(--color-red)", fontWeight: 600 }}>
                From $39 device + $9.99/mo
              </span>
              <span className="text-[14px] transition-transform group-hover:translate-x-1" style={{ color: "var(--color-ink)" }}>
                &rarr;
              </span>
            </div>
          </Link>
          <Link href="/care" className="lift-strong card p-7 group" style={{ background: "var(--color-red-tint)", borderColor: "var(--color-red-border)" }}>
            <div className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-red-hover)", fontWeight: 700 }}>
              Software &middot; new
            </div>
            <h3 className="text-[24px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              Care &middot; an AI companion for the caregiver
            </h3>
            <p className="text-[14px] mt-3 leading-relaxed" style={{ color: "var(--color-ink)" }}>
              Reminds about medications, schedules doctor visits, runs daily check-ins, watches for cognitive-decline patterns, and writes a weekly digest the family actually reads. Designed for the caregiver — the elder doesn’t need to log in.
            </p>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-[13px] mono" style={{ color: "var(--color-red-hover)", fontWeight: 600 }}>
                $9/mo per care receiver &middot; no hardware required
              </span>
              <span className="text-[14px] transition-transform group-hover:translate-x-1" style={{ color: "var(--color-ink)" }}>
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PRINCIPLES — quiet honesty section                            */}
      {/* ============================================================== */}
      <section className="section-soft py-24 md:py-32 border-y" style={{ borderColor: "var(--color-line)" }} aria-labelledby="principles-heading">
        <div className="container-x">
          <MarketingReveal>
            <div className="max-w-[640px] mb-12">
              <div className="eyebrow mb-3">Principles</div>
              <h2 id="principles-heading" className="display text-[36px] md:text-[48px]">
                We sell a panic button. Honesty matters most.
              </h2>
            </div>
          </MarketingReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {principles.map((p, i) => (
              <MarketingReveal key={p.title} delay={i * 80}>
                <article className="card p-6 h-full">
                  <div className="eyebrow mb-3">{p.eyebrow}</div>
                  <h3 className="h3 text-[20px] mb-3">{p.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-body)" }}>{p.body}</p>
                </article>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TESTIMONIALS — what pilots actually said                       */}
      {/* ============================================================== */}
      <section
        className="container-x py-20 md:py-28"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">From the chair</div>
          <h2 id="testimonials-heading" className="display text-[36px] md:text-[48px]">
            What an 8-hour shift looks like with us.
          </h2>
          <p className="lead mt-5">
            Quotes from the people who’ve used the operator console in production
            (paraphrased with consent). We don’t print customer logos without
            explicit permission, so the names below are role-and-region only.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            {
              quote:
                "Before LifeGuard, my dispatchers spent half their shift confirming addresses. With the GPS pin, we’re rolling before they finish the radio call.",
              role: "Operations Manager",
              region: "Armed response · Western Cape",
              since: "Pilot since 2025-Q4",
            },
            {
              quote:
                "The white-label console was the dealbreaker. We could not have a third-party logo in front of our own clients. LifeGuard was the only vendor that let us put our name on every screen.",
              role: "Managing Director",
              region: "Estate security · Johannesburg",
              since: "Pilot since 2026-Q1",
            },
            {
              quote:
                "We had an alert last week. The band pressed, the GPS showed a trail head, our nearest car was there in eleven minutes. That’s the only metric I care about.",
              role: "Control-room supervisor",
              region: "Armed response · Cape Town",
              since: "Pilot since 2026-Q2",
            },
          ].map((t, i) => (
            <MarketingReveal key={i} delay={i * 60}>
              <article className="lift-strong card p-6 h-full flex flex-col">
                <svg
                  aria-hidden="true"
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  className="mb-4"
                  style={{ color: "var(--color-red)" }}
                >
                  <path
                    d="M0 12c0-4 2-7 6-9l2 3c-2 1-4 3-4 5h3v7H0v-6zm12 0c0-4 2-7 6-9l2 3c-2 1-4 3-4 5h3v7h-7v-6z"
                    fill="currentColor"
                  />
                </svg>
                <p
                  className="text-[15px] leading-relaxed flex-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-5 pt-4 border-t" style={{ borderColor: "var(--color-line)" }}>
                  <div className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {t.role}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {t.region}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.18em] mt-1.5"
                    style={{ color: "var(--color-red)", fontWeight: 700 }}
                  >
                    {t.since}
                  </div>
                </footer>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SIGNUP                                                          */}
      {/* ============================================================== */}
      <section id="signup" className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="eyebrow mb-4">Get started</div>
            <h2 className="display text-[36px] md:text-[44px]">
              One account. Hardware ships same-day in ZA, 5-day target worldwide.
            </h2>
            <p className="lead mt-5 max-w-[440px]">
              We’ll provision your tenant, send you a sandbox API key, and put
              a real human in your inbox by the next business day. No demo-gating,
              no sales call required to evaluate.
            </p>
            <ul className="mt-8 space-y-3 text-[15px]" style={{ color: "var(--color-body)" }}>
              {[
                "Stripe-style onboarding — first device in the field in 10 minutes",
                "Sandbox API key, Postman collection, sample code in 6 languages",
                "Direct line to a solutions engineer, not a sales rep",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Check />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <SignupForm />
        </div>
      </section>
    </>
  );
}

/* =========================================================================
   Small components
   ========================================================================= */

function StatDark({
  label,
  value,
  numericTo,
  decimals,
  suffix,
  delay,
}: {
  label: string;
  value: string;
  numericTo?: number;
  decimals?: number;
  suffix?: string;
  delay?: number;
}) {
  return (
    <div>
      <dt
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}
      >
        {label}
      </dt>
      <dd
        className="tabular mt-1.5 text-[26px]"
        style={{ color: "#fafafa", fontWeight: 600, letterSpacing: "-0.02em" }}
      >
        {numericTo !== undefined ? (
          <AnimatedNumber
            to={numericTo}
            decimals={decimals ?? 0}
            suffix={suffix}
            durationMs={1400}
          />
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function DeviceTileDark({ img, name, tagline }: { img: string; name: string; tagline: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex items-center gap-3 p-2.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <img
        src={img}
        alt={name}
        className="w-10 h-10 object-contain shrink-0"
        width="48"
        height="48"
        loading="lazy"
      />
      <div className="min-w-0">
        <div
          className="text-[11.5px] truncate"
          style={{ color: "#fafafa", fontWeight: 600 }}
        >
          {name}
        </div>
        <div
          className="text-[10px] truncate"
          style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 7h10m0 0L8 3m4 4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="m5 5-3 2 3 2M9 5l3 2-3 2M8 3l-2 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="9" cy="9" r="9" fill="var(--color-red-tint)" />
      <path d="M5 9.2l2.6 2.6L13 6.4" fill="none" stroke="var(--color-red)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeviceTile({ img, name, tagline }: { img: string; name: string; tagline: string }) {
  return (
    <div className="relative w-full">
      <div className="photo-frame rounded-none border-0 shadow-none">
        <img src={img} alt={name} className="w-full h-auto block" width="240" height="240" loading="lazy" />
      </div>
      <div className="px-3 py-2 text-[11px] flex flex-col gap-0.5" style={{ background: "var(--color-bg-soft)", borderTop: "1px solid var(--color-line)" }}>
        <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>{name}</span>
        <span style={{ color: "var(--color-muted)" }}>{tagline}</span>
      </div>
    </div>
  );
}
