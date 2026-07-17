import Link from "next/link";
import { DeviceTelemetry } from "@/components/DeviceTelemetry";
import { SignupForm } from "@/components/SignupForm";

const wins = [
  {
    n: "01",
    title: "Wholesale from $2.50 per device per month.",
    body: "Bay Alarm = $27.95/mo plus a $99 device. AURA = R150 B2B. The enterprise floor for a usable personal-safety operator is now $2.50. We lowered it.",
  },
  {
    n: "02",
    title: "4G LTE-M, NB-IoT, GPS, Wi-Fi positioning, Bluetooth indoor.",
    body: "Apple Watch fall forwards to PSAP only. Life Alert is a landline or cellular with no GPS. Tunstall ships a UK 2G SIM. LifeGuard works on every band globally.",
  },
  {
    n: "03",
    title: "Medical-grade HR, HRV, SpO\u2082, skin temperature, 9-axis IMU.",
    body: "Apple Watch covers some. No dedicated PERS vendor ships HRV (the gold-standard for cardiac event prediction) or skin temperature (early infection detection). We do.",
  },
  {
    n: "04",
    title: "3-second fanout to five contacts, in parallel, with live location.",
    body: "AURA quotes 30 seconds. Bay Alarm has no concept of nearest-responder. Five phones, three seconds, the device GPS is canonical, and the operator sees the timeline.",
  },
  {
    n: "05",
    title: "AI triage turns 1,000 noise alerts into 5 real emergencies.",
    body: "Falsified SOS presses are 60\u201380% of consumer PERS volume. A 7-signal classifier (button pattern, motion, G-force, HR spike, ambient sound, prior history, location delta) presents only the red-marked ones.",
  },
  {
    n: "06",
    title: "Open REST API, Webhooks, Postman collection, SDK in 6 languages.",
    body: "Free, public, no rate-limit below 1M events a month. Bay Alarm has none. Apple Watch has none. Everbridge gates theirs behind $100k/year enterprise contracts.",
  },
  {
    n: "07",
    title: "A Linear-class control-room console. No install. No server.",
    body: "SICURNET, Bold Gemini, Mimic, SIS integrations are 2010s Windows desktops. Dispatchers live in our console for eight hours a day. It is the best surface we ship.",
  },
  {
    n: "08",
    title: "White-label reseller at 20% retail markup. The margin is yours.",
    body: "Bay Alarm and Tunstall don\u2019t resell. Appello charges per-ARC licensing fees. AURA locks you into their app. Yours: domain, name, logo, app, console. Reseller markup stays with the reseller.",
  },
  {
    n: "09",
    title: "First-party carrier coverage in 195 countries.",
    body: "Cartrack works in 38. Tunstall has 38 country offices but a UK device. MVNO agreements plus 4G LTE-M roaming mean a device bought in Joburg works in Tokyo with zero reconfiguration.",
  },
  {
    n: "10",
    title: "24-month hardware warranty. Free device swap for life on active subscription.",
    body: "Life Alert is three months. Bay Alarm is lifetime on subscription (good) but no proactive swap on degradation. Firmware detects decay, we ship the replacement before it breaks.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 grid-hairline opacity-60" aria-hidden="true" />
        <div className="absolute inset-0 noise" aria-hidden="true" />
        <div className="container-x relative pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="eyebrow mb-6">Personal-safety platform · v2026.07</div>
              <h1 id="hero-title" className="display-xl text-[44px] md:text-[60px] lg:text-[68px]">
                Wearable safety.
                <br />
                <span style={{ color: "var(--color-blue)" }}>Operator-grade</span> response.
                <br />
                An API your team can use today.
              </h1>
              <p className="lead mt-6 max-w-[560px]">
                LifeGuard pairs medical-grade wearables with a Linear-class
                control-room console and a public REST API. Ten concrete advantages
                over every other vendor in the $40B personal-safety market. We&rsquo;ll
                show you all ten, then you can decide.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="#signup" className="btn btn-primary btn-lg">
                  Get started
                  <ArrowRight />
                </Link>
                <Link href="/products" className="btn btn-ghost btn-lg">
                  See the hardware
                </Link>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-[520px]">
                <Stat label="Countries with first-party carriers" value="195" />
                <Stat label="Operator console SLA" value="99.95%" />
                <Stat label="API rate limit, free tier" value="1M / mo" />
              </dl>
            </div>

            <div className="lg:col-span-5 lg:pt-6">
              <DeviceTelemetry />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-line)" }}>
                  <img src="/products/lifeband-g2.svg" alt="LifeBand G2 wristband" className="w-full h-auto block" width="240" height="240" />
                </div>
                <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-line)" }}>
                  <img src="/products/lifependant-p2.svg" alt="LifePendant P2 pendant" className="w-full h-auto block" width="240" height="240" />
                </div>
              </div>
              <p className="mt-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
                <span style={{ fontWeight: 510 }}>LifeBand G2</span> &mdash; medical-grade wearable (HR / HRV / SpO₂ / fall, IP67, 7 d battery).
                <br />
                <span style={{ fontWeight: 510 }}>LifePendant P2</span> &mdash; two-way voice pendant with a single, large SOS button.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE TEN */}
      <section id="ten" className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-24 md:py-32">
          <div className="max-w-[640px] mb-16">
            <div className="eyebrow mb-4">Ten reasons we win</div>
            <h2 className="h2 text-[36px] md:text-[48px]">
              Not a feature grid. Ten specific, measurable advantages.
            </h2>
            <p className="lead mt-5">
              Each one came from comparing LifeGuard against a named competitor, in
              a category that fragment, in writing. No vague claims. No
              &ldquo;industry-leading.&rdquo; Read the comparison for each one.
            </p>
          </div>
          <ol className="space-y-0 divide-y" style={{ borderColor: "var(--color-line)" }}>
            {wins.map((w) => (
              <li
                key={w.n}
                className="grid md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-12 first:pt-0"
              >
                <div className="md:col-span-2">
                  <div
                    className="tabular text-[13px] tracking-wider"
                    style={{ color: "var(--color-blue)", fontWeight: 510 }}
                  >
                    {w.n}
                  </div>
                </div>
                <div className="md:col-span-7">
                  <h3 className="h2 text-[24px] md:text-[28px]">{w.title}</h3>
                  <p
                    className="mt-3 text-[16px] leading-relaxed"
                    style={{ color: "var(--color-body)" }}
                  >
                    {w.body}
                  </p>
                </div>
                <div className="md:col-span-3 md:pt-1">
                  <Link
                    href="/trust"
                    className="inline-flex items-center gap-1.5 text-[13px]"
                    style={{ color: "var(--color-blue)", fontWeight: 510 }}
                  >
                    Read the comparison
                    <ArrowRight />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CONSOLE IN CONTEXT — the killr surface, shown in honest scale */}
      <section className="container-x py-24 md:py-32 border-t" style={{ borderColor: "var(--color-line)" }} aria-labelledby="console-heading">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="eyebrow mb-4">The console</div>
            <h2 id="console-heading" className="h2 text-[36px] md:text-[48px]">
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
            <Link href="/signup" className="btn btn-primary btn-lg mt-8">
              Book a 20-minute walk-through
              <ArrowRight />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl overflow-hidden shadow-stripe-3 border" style={{ borderColor: "var(--color-line)" }}>
              <img
                src="/dashboards/console-hero.svg"
                alt="LifeGuard operator console — a Linear-class three-column dark UI with live map, alert queue, and shift summary"
                className="w-full h-auto block"
                width="1024"
                height="624"
              />
            </div>
            <p className="mt-4 text-[12px] text-center" style={{ color: "var(--color-muted)" }}>
              A captured frame from the live console — Cape Town peninsula, 80 subscribers online, eight armed-response vehicles, AI score on every alert.
            </p>
          </div>
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="eyebrow mb-4">Get started</div>
            <h2 className="h2 text-[36px] md:text-[44px]">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--color-muted)", fontWeight: 510 }}
      >
        {label}
      </dt>
      <dd
        className="tabular mt-1.5 text-[26px]"
        style={{ color: "var(--color-ink)", fontWeight: 300, letterSpacing: "-0.02em" }}
      >
        {value}
      </dd>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="mt-0.5 flex-shrink-0"
    >
      <circle cx="8" cy="8" r="7.5" fill="none" stroke="var(--color-teal-border)" />
      <path
        d="M4.5 8.2l2.3 2.3 4.7-4.7"
        stroke="var(--color-teal)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

