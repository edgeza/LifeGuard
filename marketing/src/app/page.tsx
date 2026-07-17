import Link from "next/link";
import { DeviceTelemetry } from "@/components/DeviceTelemetry";
import { SignupForm } from "@/components/SignupForm";
import { MarketingReveal } from "@/components/MarketingReveal";

/* =========================================================================
   Page copy
   ========================================================================= */

const wins = [
  { n: "01", title: "Wholesale from $2.50 per device per month.",                  body: "Bay Alarm = $27.95/mo plus a $99 device. AURA = R150 B2B. The enterprise floor for a usable personal-safety operator is now $2.50. We lowered it." },
  { n: "02", title: "4G LTE-M, NB-IoT, GPS, Wi-Fi positioning, BT 5.3 indoor.",     body: "Apple Watch fall forwards to PSAP only. Life Alert is a landline or cellular with no GPS. Tunstall ships a UK 2G SIM. LifeGuard works on every band globally." },
  { n: "03", title: "Medical-grade HR, HRV, SpO₂, skin temperature, 9-axis IMU.",   body: "Apple Watch covers some. No dedicated PERS vendor ships HRV (the gold-standard for cardiac event prediction) or skin temperature (early infection detection). We do." },
  { n: "04", title: "3-second fanout to five contacts, in parallel, with GPS.",    body: "AURA quotes 30 seconds. Bay Alarm has no concept of nearest-responder. Five phones, three seconds, the device GPS is canonical, the operator sees the timeline." },
  { n: "05", title: "AI triage turns 1,000 noise alerts into 5 real emergencies.",  body: "Falsified SOS presses are 60–80% of consumer PERS volume. A 7-signal classifier (button pattern, motion, G-force, HR spike, ambient sound, prior history, location delta) presents only the red-marked ones." },
  { n: "06", title: "Open REST API, Webhooks, Postman, SDK in 6 languages.",       body: "Free, public, no rate-limit below 1M events a month. Bay Alarm has none. Apple Watch has none. Everbridge gates theirs behind $100k/year enterprise contracts." },
  { n: "07", title: "A Linear-class control-room console. No install. No server.",  body: "SICURNET, Bold Gemini, Mimic, SIS integrations are 2010s Windows desktops. Dispatchers live in our console for eight hours a day. It is the best surface we ship." },
  { n: "08", title: "White-label reseller at 20% retail markup. Yours to keep.",   body: "Bay Alarm and Tunstall don't resell. Appello charges per-ARC licensing. AURA locks you onto their app. Yours: domain, name, logo, app, console. Reseller markup stays with the reseller." },
  { n: "09", title: "First-party carrier coverage in 195 countries.",              body: "Cartrack works in 38. Tunstall has 38 country offices but a UK device. MVNO agreements plus 4G LTE-M roaming mean a device bought in Joburg works in Tokyo with zero reconfiguration." },
  { n: "10", title: "24-month hardware warranty + free swap, life-of-subscription.", body: "Life Alert is three months. Bay Alarm is lifetime on subscription (good) but no proactive swap on degradation. Firmware detects decay, we ship the replacement before it breaks." },
];

const marqueeItems = [
  "Operator SLA · 99.95%",
  "Sustained up to 7-day battery · IP67",
  "ISO 27001 certified · SOC 2 in audit",
  "AI triage · 97.4% accuracy, 60–80% noise cut",
  "Open API · 1M events / month free tier",
  "Hardware shipped in 48 hours · global",
  "Reseller 20% markup · keep the margin",
  "4G LTE-M · NB-IoT · 195 countries",
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
      {/* HERO                                                          */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        {/* gradient backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 0%, rgba(225,29,46,0.12) 0%, rgba(255,255,255,0) 60%),\
               radial-gradient(40% 40% at 95% 25%, rgba(10,10,10,0.05) 0%, rgba(255,255,255,0) 70%),\
               linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 grid-hairline opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 noise" />

        <div className="container-x relative pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6 rounded-full border px-3 py-1.5 text-[12px] badge-animate" style={{ borderColor: "var(--color-red-border)", background: "var(--color-red-tint)", color: "var(--color-red-hover)" }}>
                <span className="pulse-sos inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-sos)" }} />
                v2026.07 · Now shipping with AI triage on every alert
              </div>
              <h1
                id="hero-title"
                className="display-xl text-[44px] md:text-[60px] lg:text-[76px]"
              >
                When the band presses,
                <br />
                <span className="relative inline-block">
                  <span style={{ color: "var(--color-red)" }}>the line opens.</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-1 h-[6px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(225,29,46,0.0) 0%, var(--color-red) 30%, var(--color-red) 70%, rgba(225,29,46,0.0) 100%)",
                      filter: "blur(0.5px)",
                    }}
                  />
                </span>
              </h1>
              <p className="lead mt-6 max-w-[560px]">
                LifeGuard pairs medical-grade wearables with a Linear-class
                control-room console and a public REST API. Ten concrete advantages
                over every other vendor in the $40B personal-safety market.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#signup" className="btn btn-red btn-lg shadow-stripe-3">
                  Get started
                  <ArrowRight />
                </Link>
                <Link href="/products" className="btn btn-ghost btn-lg">
                  See the hardware
                </Link>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-[520px]">
                <Stat label="Countries with first-party carriers" value="195" />
                <Stat label="Operator console SLA"               value="99.95%" />
                <Stat label="API rate limit, free tier"          value="1M / mo" />
              </dl>
            </div>

            <div className="lg:col-span-5 lg:pt-6">
              <MarketingReveal>
                <DeviceTelemetry />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <DeviceTile img="/products/lifeband-g2.svg" name="LifeBand G2" tagline="HR / HRV / SpO₂ · IP67 · 7 d battery" />
                  <DeviceTile img="/products/lifependant-p2.svg" name="LifePendant P2" tagline="Two-way voice · single SOS" />
                </div>
              </MarketingReveal>
            </div>
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
      {/* ECOSYSTEM                                                   */}
      {/* ============================================================== */}
      <section className="container-x py-16 md:py-24" aria-label="LifeGuard ecosystem diagram">
        <MarketingReveal>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
            <div>
              <div className="eyebrow mb-2">Ecosystem</div>
              <h2 className="display text-[36px] md:text-[48px] max-w-[680px]">
                A push from the band opens the call line, drops a pin on the
                operator&rsquo;s map, and routes the nearest armed-response vehicle.
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
                  <span>AI triage cuts noise alerts by 60–80%. Operators only see what matters.</span>
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
      {/* SIGNUP                                                          */}
      {/* ============================================================== */}
      <section id="signup" className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="eyebrow mb-4">Get started</div>
            <h2 className="display text-[36px] md:text-[44px]">
              One account. Hardware ships within 48 hours.
            </h2>
            <p className="lead mt-5 max-w-[440px]">
              We&rsquo;ll provision your tenant, send you a sandbox API key, and put
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
        {label}
      </dt>
      <dd className="tabular mt-1.5 text-[26px]" style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em" }}>
        {value}
      </dd>
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
    <div className="lift relative rounded-xl overflow-hidden border bg-white" style={{ borderColor: "var(--color-line)" }}>
      <img src={img} alt={name} className="w-full h-auto block" width="240" height="240" loading="lazy" />
      <div className="px-3 py-2 text-[11px] flex flex-col gap-0.5" style={{ background: "var(--color-bg-soft)" }}>
        <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>{name}</span>
        <span style={{ color: "var(--color-muted)" }}>{tagline}</span>
      </div>
    </div>
  );
}
