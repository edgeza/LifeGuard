import Link from "next/link";

export const metadata = {
  title: "For whom — LifeGuard",
  description:
    "Four personas, four tailored pitches. Elderly, lone worker, women and at-risk individuals, families.",
};

export default function ForWhom() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-20 pb-12">
        <div className="eyebrow mb-4">For whom</div>
        <h1 className="display-xl text-[44px] md:text-[56px] max-w-[760px]">
          Four kinds of people need this. None of them are the same.
        </h1>
        <p className="lead mt-6 max-w-[600px]">
          We don&rsquo;t have a single pitch for everyone. The pitch to a daughter
          buying for her father is not the pitch to a security company owner
          buying for an estate. Here is each one, written for the person it&rsquo;s
          actually for.
        </p>
      </section>

      {/* PERSONA 1 — ELDERLY: A LONG, EDITORIAL COMPOSITION */}
      <Persona
        index={1}
        eyebrow="Persona 01"
        name="Elderly"
        headline="A button that just works. A family that knows."
        lede="Your mother is 84 and lives alone. She doesn&rsquo;t want a fall detector she has to charge every night, a smartphone app she has to remember to open, or a monthly subscription she has to defend on the bank statement. She wants a wristband she puts on once a week, a button she can press with a thumb, and a daughter who texts back &lsquo;got it, mom&rsquo; when she walks the dog."
        tone="soft"
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="h3 text-[18px]">What we ship to her wrist</h3>
            <ul className="mt-4 space-y-3 text-[15px]" style={{ color: "var(--color-body)" }}>
              {[
                "LifeBand G2 in a soft silicone strap — she wears it on her non-dominant wrist and forgets it&rsquo;s there",
                "7-day battery means she only has to remember to charge on Sunday morning",
                "Single large recessed button — she presses with her thumb, hears a confirmation tone, and knows the call went out",
                "Fall detection runs in firmware, not in an app she has to keep open",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Dot />
                  <span dangerouslySetInnerHTML={{ __html: line }} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="h3 text-[18px]">What you, her daughter, see</h3>
            <ul className="mt-4 space-y-3 text-[15px]" style={{ color: "var(--color-body)" }}>
              {[
                "Caregiver App — a single green dot that says &lsquo;all good&rsquo; every time you open it",
                "Vitals sparkline: resting heart rate, sleep hours, steps. Not a medical readout — a reassurance readout",
                "Last-fall timestamp and a 60-day &lsquo;no falls&rsquo; counter",
                "Weekly email digest on Sunday — the same time the band goes on the charger",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Dot />
                  <span dangerouslySetInnerHTML={{ __html: line }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 rounded-lg p-6 md:p-7"
          style={{ background: "white", border: "1px solid var(--color-line)" }}
        >
          <div
            className="text-[11px] uppercase tracking-wider mb-2"
            style={{ color: "var(--color-muted)", fontWeight: 510 }}
          >
            Pricing for this persona
          </div>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <PriceMain value="$19 + $24.99/mo" sub="Hardware + subscription, USD" />
            <PriceAdd value="+ $9.99/mo" sub="Optional pro: vitals history export, predictive fall risk" />
          </div>
          <Link href="/pricing" className="btn btn-link mt-4 px-0">
            See the full plan
            <Arrow />
          </Link>
        </div>
      </Persona>

      {/* PERSONA 2 — LONE WORKER: AN ENTERPRISE-FLAVORED COMPOSITION */}
      <Persona
        index={2}
        eyebrow="Persona 02"
        name="Lone worker"
        headline="Hands-free escalation. Evidence trail. Employer liability covered."
        lede="You&rsquo;re a head of operations for a utility company with 1,800 field engineers. You need a panic button that&rsquo;s discreet, durable, and not a smartphone — because field engineers don&rsquo;t always have their phone in their hand when the mast goes wrong and the farmer with the shotgun turns up. You need the button to escalate, the dispatch to land, and the audit trail to defend the company if anything goes to court."
        tone="dark"
      >
        <div className="grid md:grid-cols-3 gap-8">
          <Stage
            step="01"
            title="Detect"
            body="9-axis IMU detects freefall, impact, or &lsquo;man-down&rsquo; stillness longer than 90 seconds. The device auto-opens a voice line before the worker has to ask."
          />
          <Stage
            step="02"
            title="Escalate"
            body="The alert lands in your operator console in 3 seconds, with GPS, HR, the last 60 seconds of ambient audio, and the worker&rsquo;s incident profile."
          />
          <Stage
            step="03"
            title="Audit"
            body="Every operator action, every device firmware event, every webhook delivery is logged immutably for seven years. Court-defensible by default."
          />
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Pill label="Devices supported" value="LifeClip CG2 · LifeBand G2" />
          <Pill label="Dispatch modes" value="Operator · Network · Family" />
          <Pill label="Compliance" value="POPIA · GDPR · ISO 27001 (in audit)" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/pricing" className="btn btn-primary">
            See Solo Pro pricing
          </Link>
          <Link href="/trust#compliance" className="btn btn-ghost">
            Compliance details
          </Link>
        </div>
      </Persona>

      {/* PERSONA 3 — WOMEN / AT-RISK: A COMPOSITION ABOUT TRUST, NOT TECH */}
      <Persona
        index={3}
        eyebrow="Persona 03"
        name="Women & at-risk individuals"
        headline="Invisible panic. Real armed response."
        lede="Most panic devices fail the same way: the press is too slow, the dispatch is too late, the operator is too far away to matter. LifeGuard&rsquo;s panic was designed by women who&rsquo;ve had to use them — and tested by operators who know the difference between a button that triggers a workflow and a button that ends an incident."
        tone="soft"
      >
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <h3 className="h3 text-[18px]">What &lsquo;invisible&rsquo; means here</h3>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: "var(--color-body)" }}
            >
              The LifeClip CG2 clips inside a jacket, under a collar, against the
              inside of a bra strap, against the back of a lanyard. No light. No
              sound. No screen to glance at. A single press held for two seconds
              triggers the incident.
            </p>
            <p
              className="mt-4 text-[15px] leading-relaxed"
              style={{ color: "var(--color-body)" }}
            >
              The voice line opens silently. The operator listens before they speak.
              They already have the GPS. They already have the responder ETA.
            </p>
          </div>
          <div className="md:col-span-7">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                border: "1px solid var(--color-line)",
                background: "var(--color-bg-soft)",
              }}
            >
              <div
                className="px-5 py-3 border-b flex items-center justify-between"
                style={{ borderColor: "var(--color-line)" }}
              >
                <span
                  className="text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--color-muted)", fontWeight: 510 }}
                >
                  Network partners · Africa & EU
                </span>
                <span
                  className="text-[11px] tabular"
                  style={{ color: "var(--color-muted)" }}
                >
                  Live count
                </span>
              </div>
              <ul>
                {[
                  ["Netcare 911", "South Africa · Armed response + ambulance", "Available"],
                  ["ER24", "South Africa · Paramedic", "Available"],
                  ["Vumacam", "South Africa · CCTV-linked dispatch", "Available"],
                  ["Namola", "South Africa · Community dispatch", "Available"],
                  ["SIA-licensed contractors", "United Kingdom · BS 7984", "Available"],
                  ["Eurocross", "Netherlands · International SOS", "Available"],
                ].map(([name, region, status], i, arr) => (
                  <li
                    key={name}
                    className={`px-5 py-3 flex items-center justify-between ${
                      i < arr.length - 1 ? "border-b" : ""
                    }`}
                    style={{ borderColor: "var(--color-line)" }}
                  >
                    <div>
                      <div className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
                        {name}
                      </div>
                      <div className="text-[12px]" style={{ color: "var(--color-muted)" }}>
                        {region}
                      </div>
                    </div>
                    <span
                      className="text-[11px] uppercase tracking-wider"
                      style={{ color: "var(--color-success)", fontWeight: 510 }}
                    >
                      {status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="h3 text-[18px]">What we promise, in writing</h3>
          <div className="mt-4 grid md:grid-cols-3 gap-6">
            <Promise
              title="Press to voice line, in 3 seconds."
              body="No app to open. No unlock. The voice line is open and the operator is on it before you finish the thought."
            />
            <Promise
              title="GPS pinned before you press."
              body="The device streams its location every second. By the time the operator speaks, the responder is already en route."
            />
            <Promise
              title="No data lingers on the device."
              body="Local logs auto-purge after the incident is closed. There is no record on the band for anyone to find later."
            />
          </div>
        </div>
      </Persona>

      {/* PERSONA 4 — FAMILIES: A CALENDAR / DAILY-RITUAL COMPOSITION */}
      <Persona
        index={4}
        eyebrow="Persona 04"
        name="Families"
        headline="A Sunday-morning ritual, not an always-on emergency."
        lede="The way most families actually use LifeGuard isn&rsquo;t the SOS button. It&rsquo;s the Sunday-morning check: she opens the Caregiver App while the kettle boils, sees the green dot, sees mom took her walk, sees dad&rsquo;s resting HR is back to baseline after the flu. That&rsquo;s the moment LifeGuard is worth the subscription."
        tone="soft"
      >
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h3 className="h3 text-[18px]">A typical Sunday morning, on her phone</h3>
            <ol className="mt-5 space-y-5">
              {[
                {
                  time: "07:42",
                  title: "She opens the app.",
                  body: "Three cards: Mom (green), Dad (amber — low battery), Sam (green). One tap each for the detail view.",
                },
                {
                  time: "07:43",
                  title: "Mom&rsquo;s vitals.",
                  body: "Resting HR 68, HRV 42 ms, sleep 7h 12m, steps yesterday 4,212. Looks like a good week. No falls logged.",
                },
                {
                  time: "07:45",
                  title: "Dad&rsquo;s amber dot.",
                  body: "Battery at 12%. Tap to nudge — LifeBand buzzes once on his wrist with a &lsquo;please charge&rsquo; icon. He&rsquo;ll plug it in after breakfast.",
                },
                {
                  time: "07:48",
                  title: "Weekly digest lands in her inbox.",
                  body: "Both parents, both devices, both weeks. One email. She reads it once, files it under &lsquo;good&rsquo;.",
                },
              ].map((step) => (
                <li key={step.time} className="grid grid-cols-[64px_1fr] gap-4">
                  <span
                    className="mono tabular text-[13px]"
                    style={{ color: "var(--color-blue)", fontWeight: 510 }}
                  >
                    {step.time}
                  </span>
                  <div>
                    <h4
                      className="text-[15px]"
                      style={{ color: "var(--color-ink)", fontWeight: 510 }}
                      dangerouslySetInnerHTML={{ __html: step.title }}
                    />
                    <p
                      className="mt-1 text-[14px] leading-relaxed"
                      style={{ color: "var(--color-body)" }}
                      dangerouslySetInnerHTML={{ __html: step.body }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5">
            <div
              className="rounded-lg p-5 md:p-6"
              style={{
                background: "var(--color-bg-soft)",
                border: "1px solid var(--color-line)",
              }}
            >
              <div
                className="text-[11px] uppercase tracking-wider mb-3"
                style={{ color: "var(--color-muted)", fontWeight: 510 }}
              >
                What you actually pay
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="mono tabular"
                  style={{
                    color: "var(--color-ink)",
                    fontSize: 44,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                  }}
                >
                  $19
                </span>
                <span className="text-[14px]" style={{ color: "var(--color-body)" }}>
                  / device, one-time
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className="mono tabular"
                  style={{
                    color: "var(--color-ink)",
                    fontSize: 28,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                  }}
                >
                  $24.99
                </span>
                <span className="text-[14px]" style={{ color: "var(--color-body)" }}>
                  / device / month, all-in
                </span>
              </div>
              <p className="mt-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
                Cellular. AI triage. Caregiver App. 3-contact SOS fanout. Weekly
                digest. Free device swap.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href="/signup" className="btn btn-primary w-full">
                  Get started
                </Link>
                <Link href="/pricing" className="btn btn-ghost w-full">
                  See the full plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Persona>

      {/* CLOSING CTA */}
      <section className="container-x py-24">
        <div
          className="rounded-xl p-10 md:p-14 text-center"
          style={{ background: "var(--color-bg-deep)", color: "#e6edf7" }}
        >
          <h2
            className="display text-[32px] md:text-[44px] max-w-[640px] mx-auto"
            style={{ color: "#ffffff" }}
          >
            Don&rsquo;t see yourself in one of these four?
          </h2>
          <p className="mt-4 max-w-[520px] mx-auto" style={{ color: "rgba(230,237,247,0.7)" }}>
            We also support patients with chronic cardiac conditions, kids
            (Junior Guardian SKU), and pets (Pet Tracker SKU). Email us. We&rsquo;ll
            be specific about what we ship.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="mailto:hello@lifeguard.example.com"
              className="btn btn-primary btn-lg"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Persona({
  index,
  eyebrow,
  name,
  headline,
  lede,
  children,
  tone,
}: {
  index: number;
  eyebrow: string;
  name: string;
  headline: string;
  lede: string;
  children: React.ReactNode;
  tone: "soft" | "dark";
}) {
  const bg = tone === "dark" ? "section-deep" : "section-soft";
  return (
    <section className={`${bg}`} id={`persona-${index}`} aria-labelledby={`persona-${index}-heading`}>
      <div className="container-x py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="tabular text-[12px] tracking-wider"
                style={{
                  color: tone === "dark" ? "#06b6a4" : "var(--color-blue)",
                  fontWeight: 510,
                }}
              >
                {eyebrow}
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 1,
                  background: tone === "dark" ? "rgba(230,237,247,0.2)" : "var(--color-line-strong)",
                }}
              />
              <span
                className="text-[12px]"
                style={{
                  color: tone === "dark" ? "rgba(230,237,247,0.6)" : "var(--color-muted)",
                  fontWeight: 510,
                }}
              >
                {name}
              </span>
            </div>
            <h2
              id={`persona-${index}-heading`}
              className="h2 text-[32px] md:text-[44px]"
              style={tone === "dark" ? { color: "#ffffff" } : undefined}
            >
              {headline}
            </h2>
            <p
              className="mt-5 text-[16px] leading-relaxed max-w-[640px]"
              style={{
                color: tone === "dark" ? "rgba(230,237,247,0.72)" : "var(--color-body)",
              }}
              dangerouslySetInnerHTML={{ __html: lede }}
            />
          </div>
        </div>
        <div
          className="rounded-xl p-6 md:p-10"
          style={
            tone === "dark"
              ? {
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }
              : {
                  background: "#ffffff",
                  border: "1px solid var(--color-line)",
                  boxShadow:
                    "rgba(29,78,216,0.06) 0px 1px 2px",
                }
          }
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 6,
        height: 6,
        borderRadius: 9999,
        marginTop: 8,
        background: "var(--color-blue)",
        flexShrink: 0,
      }}
    />
  );
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2 6h8M6 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PriceMain({ value, sub }: { value: string; sub: string }) {
  return (
    <div>
      <div className="mono tabular text-[22px]" style={{ color: "var(--color-ink)", fontWeight: 400 }}>
        {value}
      </div>
      <div className="text-[12px]" style={{ color: "var(--color-muted)" }}>
        {sub}
      </div>
    </div>
  );
}

function PriceAdd({ value, sub }: { value: string; sub: string }) {
  return (
    <div>
      <div className="mono tabular text-[18px]" style={{ color: "var(--color-body)", fontWeight: 400 }}>
        {value}
      </div>
      <div className="text-[12px]" style={{ color: "var(--color-muted)" }}>
        {sub}
      </div>
    </div>
  );
}

function Stage({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div>
      <div
        className="mono tabular text-[12px] tracking-wider mb-2"
        style={{ color: "var(--color-teal)", fontWeight: 510 }}
      >
        {step}
      </div>
      <h3 className="h3 text-[18px]">{title}</h3>
      <p
        className="mt-2 text-[14px] leading-relaxed"
        style={{ color: "var(--color-body)" }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-md px-4 py-3"
      style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
    >
      <div
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--color-muted)", fontWeight: 510 }}
      >
        {label}
      </div>
      <div className="mt-1 text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
        {value}
      </div>
    </div>
  );
}

function Promise({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-md p-5"
      style={{ border: "1px solid var(--color-line)" }}
    >
      <h4 className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
        {title}
      </h4>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--color-body)" }}>
        {body}
      </p>
    </div>
  );
}