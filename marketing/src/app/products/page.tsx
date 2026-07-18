import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";
import { IntegrationOrbit } from "@/components/IntegrationOrbit";

export const metadata = {
  title: "Hardware, platform, API — LifeGuard",
  description:
    "Three wearable SKUs on a shared firmware image, a 195-country cloud platform, an open REST API with SDKs in six languages, and integrations with the platforms your customers already use.",
};

const devices = [
  {
    id: "lifeband",
    sku: "G2",
    name: "LifeBand",
    tagline: "The wristband that knows how your body is doing.",
    body: "7-day battery. LTE-M, NB-IoT, Wi-Fi 5, Bluetooth 5.3 indoor positioning, GPS. HR, HRV, SpO<sub>2</sub>, skin temperature, 9-axis IMU, fall detection, single button. 38 grams, IP67.",
    photo: "/photos/lifeband-g2.png",
    photoAlt: "LifeBand G2 wristband — real product photograph",
    specs: [
      ["Form", "Wristband"],
      ["Battery", "7 days"],
      ["Sensors", "HR · HRV · SpO₂ · Skin temp · 9-axis IMU · Fall"],
      ["Connectivity", "LTE-M · NB-IoT · Wi-Fi · BT 5.3 · GPS"],
      ["Weight", "38 g"],
    ],
    price: { wholesale: "$24", retail: "$39" },
  },
  {
    id: "lifependant",
    sku: "P2",
    name: "LifePendant",
    tagline: "Worn over the heart. Two-way voice. The pendant that talks back.",
    body: "14-day standby, 6 hours active voice on the cellular call. LTE-M plus GPS plus Bluetooth indoor. Single button, 9-axis IMU for fall detection. Designed to be worn and forgotten.",
    photo: "/photos/lifependant-p2.png",
    photoAlt: "LifePendant P2 — real product photograph",
    specs: [
      ["Form", "Pendant / lanyard"],
      ["Battery", "14 days standby · 6 hr voice"],
      ["Sensors", "9-axis IMU · Fall"],
      ["Connectivity", "LTE-M · GPS · BT indoor"],
      ["Audio", "Two-way cellular voice"],
    ],
    price: { wholesale: "$32", retail: "$59" },
  },
  {
    id: "lifeclip",
    sku: "CG2",
    name: "LifeClip",
    tagline: "Discreet. Clipped where no one looks for it.",
    body: "3-day battery. LTE-M shared from the wearer's phone, or standalone with its own eSIM. Single button, fall detection that subscribes to the paired phone's sensors. Designed for situations where a wrist is not safe.",
    photo: "/photos/lifeclip-cg2.png",
    photoAlt: "LifeClip CG2 — real product photograph",
    specs: [
      ["Form", "Clip / watch add-on"],
      ["Battery", "3 days"],
      ["Sensors", "Button · Fall (subscribes to phone)"],
      ["Connectivity", "LTE-M · BT 5.3"],
      ["Use case", "Lone worker · At-risk individuals"],
    ],
    price: { wholesale: "$22", retail: "$44" },
  },
];

const platformFeatures = [
  {
    n: "01",
    title: "SOS fanout in 3 seconds.",
    body: "Five emergency contacts in parallel. SMS carries location and a live-tracking link. Routed to the geographically nearest professional responder if subscribed.",
  },
  {
    n: "02",
    title: "AI triage on every alert.",
    body: "7-signal classifier: button press pattern, motion preceding, G-force, HR spike, ambient sound, prior history, location delta. Low-score = silent parent-app push. High-score = call operator, ready-to-dispatch incident.",
  },
  {
    n: "03",
    title: "Voice line auto-opens.",
    body: "Two-way cellular voice on the device. Auto-opens on operator ack, or auto-opens on a configurable threshold (HR > 130 sustained, fall detected, no motion for N minutes).",
  },
  {
    n: "04",
    title: "Live location streaming during incidents.",
    body: "Second-by-second GPS plus Wi-Fi positioning. Battery cost is handled. The map in the operator console updates as the wearer moves.",
  },
  {
    n: "05",
    title: "Three responder modes.",
    body: "Family-only (SMS fanout), Pro (dedicated operator console + SLA), Hybrid (escalates to operator after family no-response in 90 s). Every plan supports all three.",
  },
  {
    n: "06",
    title: "Branded firmware skin.",
    body: "Operator-app launch icon, carrier-APN profile, voice-greeting message, end-of-session SMS — every channel carries your name, not ours.",
  },
];

const integrations = [
  { name: "iOS",          glyph: "" },
  { name: "Apple Watch",  glyph: "" },
  { name: "Android",      glyph: "" },
  { name: "Wear OS",      glyph: "" },
  { name: "SMS fallback", glyph: "" },
  { name: "Voice",        glyph: "" },
  { name: "REST API",     glyph: "" },
  { name: "MQTT",         glyph: "" },
];

const satelliteEmoji: Record<string, string> = {
  "iOS": "📱",
  "Apple Watch": "⌚",
  "Android": "🤖",
  "Wear OS": "◍",
  "SMS fallback": "✉",
  "Voice": "🎙",
  "REST API": "{ }",
  "MQTT": "📡",
};

export default function ProductsPage() {
  return (
    <>
      {/* ============================================================== */}
      {/* HEADER — aurora + dot grid + animated hero number             */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden" aria-labelledby="products-title">
        <div className="aurora-bg" aria-hidden="true">
          <div className="blob b1" />
          <div className="blob b2" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 dot-grid dot-grid-fade opacity-50" />

        <div className="container-x relative pt-20 pb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="eyebrow mb-4">Hardware · Platform · API</div>
              <h1 id="products-title" className="display-xl text-[44px] md:text-[60px] max-w-[820px]">
                Three wearables. One platform.{" "}
                <span className="shimmer-text">Anything you already use.</span>
              </h1>
              <p className="lead mt-6 max-w-[640px]">
                Every LifeGuard device runs the same firmware, shares the same SIM
                profile, and emits the same JSON shape. The platform is one product,
                not ten. The API is one surface, not a maze of integrations. The
                channels your customers already trust — iOS, Watch, Android,
                SMS, voice — are first-class citizens.
              </p>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <MarketingReveal>
                <IntegrationOrbit
                  size={360}
                  satellites={integrations.map((i) => ({
                    name: i.name,
                    glyph: satelliteEmoji[i.name] ?? "·",
                  }))}
                />
              </MarketingReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* HARDWARE — alternating editorial composition                   */}
      {/* ============================================================== */}
      <section aria-labelledby="hardware-heading" className="container-x py-12 md:py-20">
        <h2 id="hardware-heading" className="h2 text-[32px] md:text-[40px] mb-12">
          Three SKUs. One firmware image.
        </h2>
        <div className="space-y-24 md:space-y-32">
          {devices.map((d, i) => (
            <article key={d.id} id={d.id} className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Photo — alternates left/right */}
              <div className={`md:col-span-6 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <MarketingReveal>
                  <div className="beam-border lift-strong">
                    <div className="photo-frame" style={{ border: "none" }}>
                      <img
                        src={d.photo}
                        alt={d.photoAlt}
                        className="w-full h-auto block"
                        width="900"
                        height="900"
                        loading="lazy"
                      />
                    </div>
                    <div
                      className="px-4 py-2.5 flex items-center justify-between text-[12px]"
                      style={{ background: "var(--color-bg-soft)", borderTop: "1px solid var(--color-line)" }}
                    >
                      <span
                        className="uppercase tracking-wider"
                        style={{ color: "var(--color-muted)", fontWeight: 600 }}
                      >
                        {d.name} · SKU {d.sku}
                      </span>
                      <span
                        className="flex items-center gap-1.5"
                        style={{ color: "var(--color-red)", fontWeight: 600 }}
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-red)" }} />
                        In stock · ships in 48 hrs
                      </span>
                    </div>
                  </div>
                </MarketingReveal>
              </div>

              {/* Copy */}
              <div className={`md:col-span-6 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <MarketingReveal delay={120}>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span
                      className="tabular text-[12px] tracking-[0.18em] uppercase"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      SKU {d.sku}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--color-muted)" }}>
                      · {d.name}
                    </span>
                  </div>
                  <h3 className="h2 text-[28px] md:text-[36px]">{d.tagline}</h3>
                  <p
                    className="mt-4 text-[16px] leading-relaxed max-w-[540px]"
                    style={{ color: "var(--color-body)" }}
                    dangerouslySetInnerHTML={{ __html: d.body }}
                  />
                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 max-w-[540px]">
                    {d.specs.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt
                          className="text-[12px] uppercase tracking-wider"
                          style={{ color: "var(--color-muted)", fontWeight: 600 }}
                        >
                          {k}
                        </dt>
                        <dd className="text-[13px]" style={{ color: "var(--color-ink)" }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex items-center gap-6">
                    <div>
                      <div
                        className="text-[11px] uppercase tracking-wider"
                        style={{ color: "var(--color-muted)", fontWeight: 600 }}
                      >
                        Wholesale
                      </div>
                      <div className="mt-0.5 mono tabular text-[20px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {d.price.wholesale}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[11px] uppercase tracking-wider"
                        style={{ color: "var(--color-muted)", fontWeight: 600 }}
                      >
                        MSRP
                      </div>
                      <div className="mt-0.5 mono tabular text-[20px]" style={{ color: "var(--color-muted)" }}>
                        {d.price.retail}
                      </div>
                    </div>
                  </div>
                </MarketingReveal>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTEGRATIONS — orbit graphic + tile grid                       */}
      {/* ============================================================== */}
      <section
        className="relative overflow-hidden"
        id="integrations"
        aria-labelledby="integrations-heading"
      >
        <div className="aurora-bg" aria-hidden="true">
          <div className="blob b3" />
        </div>
        <div className="container-x py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <MarketingReveal>
                <div className="eyebrow mb-3">Channels</div>
                <h2 id="integrations-heading" className="display text-[36px] md:text-[48px]">
                  Works with the apps you already use.
                </h2>
                <p className="lead mt-5 max-w-[480px]">
                  We don&rsquo;t ask your customers to learn another app. The push
                  alert lands on the iPhone, the complication sits on the Watch
                  face, the SMS goes to anyone with a phone. If they can read
                  text and press a button, they can use LifeGuard.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/integration" className="btn btn-red btn-lg">
                    Read integration details
                    <ArrowRight />
                  </Link>
                  <Link href="/docs" className="btn btn-ghost btn-lg">
                    Public REST API docs
                  </Link>
                </div>
              </MarketingReveal>
            </div>
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-3">
                {integrations.map((i, idx) => (
                  <MarketingReveal key={i.name} delay={idx * 40}>
                    <article className="lift-strong card p-5 h-full">
                      <div
                        className="h-10 w-10 rounded-md grid place-items-center text-[16px] mb-3"
                        style={{ background: "var(--color-bg-soft)" }}
                        aria-hidden="true"
                      >
                        {satelliteEmoji[i.name] ?? "·"}
                      </div>
                      <h3 className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                        {i.name}
                      </h3>
                      <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: "var(--color-body)" }}>
                        {i.name === "iOS"           && "Caregiver app, fall-risk widget, quick-call widget, share-sheet receipt."}
                        {i.name === "Apple Watch"   && "Wrist-aware emergency shortcut; falls detected, push ETA, complication icon."}
                        {i.name === "Android"       && "Caregiver app + Watch Active complications; same data shape as iOS."}
                        {i.name === "Wear OS"       && "Tiles, complications, voice: 'Hey LifeGuard, send help'."}
                        {i.name === "SMS fallback"  && "Every alert reaches a phone — even with no app installed."}
                        {i.name === "Voice"         && "Two-way cellular voice on every pendant and band — no app needed."}
                        {i.name === "REST API"      && "Public, REST, OAuth + Webhooks. SDK in 6 languages. No rate limit under 1M events."}
                        {i.name === "MQTT"          && "Live telemetry into your platform, no polling — sub-200 ms path."}
                      </p>
                    </article>
                  </MarketingReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PLATFORM — bento grid of features                              */}
      {/* ============================================================== */}
      <section
        aria-labelledby="platform-heading"
        className="section-soft border-y"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div className="container-x py-20 md:py-28">
          <div className="max-w-[640px] mb-12">
            <div className="eyebrow mb-3">Platform</div>
            <h2 id="platform-heading" className="display text-[36px] md:text-[48px]">
              What the firmware actually does.
            </h2>
            <p className="lead mt-5">
              The wearable is only half the product. The platform is the other half.
              Six concrete guarantees, each measured and publishable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {platformFeatures.map((f, i) => (
              <MarketingReveal key={f.n} delay={i * 40}>
                <article className="lift-strong card p-6 h-full">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="tabular text-[12px] tracking-[0.18em] uppercase"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      {f.n}
                    </span>
                  </div>
                  <h3 className="h3 mt-2 text-[18px]">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                    {f.body}
                  </p>
                </article>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CONSOLE — section that hints at the operator console           */}
      {/* ============================================================== */}
      <section
        id="console"
        className="section-dark py-20 md:py-28"
        aria-labelledby="console-heading"
      >
        <div className="container-x">
          <MarketingReveal>
            <div className="max-w-[640px] mb-12">
              <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                Operator console
              </div>
              <h2 id="console-heading" className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
                Three columns. Three seconds. Zero install.
              </h2>
              <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                A Linear-class control-room in the browser. Filters + subscribers
                on the left, the live map in the centre, the AI-scored alert
                queue on the right. The killer surface for security dispatchers
                who live in it eight hours a day.
              </p>
            </div>
          </MarketingReveal>
          <MarketingReveal>
            <div className="beam-border" style={{ borderRadius: "16px" }}>
              <div className="photo-frame" style={{ border: "none", borderRadius: 16 }}>
                <img
                  src="/dashboards/console-hero.svg"
                  alt="The LifeGuard operator console — three-column Linear-class dark UI with AI-scored alert queue, live map, shift summary"
                  className="w-full h-auto block"
                  width="1024"
                  height="624"
                  loading="lazy"
                />
              </div>
            </div>
          </MarketingReveal>
        </div>
      </section>

      {/* ============================================================== */}
      {/* API — code + SDK list                                          */}
      {/* ============================================================== */}
      <section id="api" className="container-x py-20 md:py-28" aria-labelledby="api-heading">
        <MarketingReveal>
          <div className="max-w-[680px] mb-12">
            <div className="eyebrow mb-3">API</div>
            <h2 id="api-heading" className="display text-[36px] md:text-[48px]">
              Same model every operator understands. Same shape every operator can parse.
            </h2>
            <p className="lead mt-5">
              Public REST. Signed webhooks. SDK in six languages. Free up to
              1&nbsp;M events a month. No "contact sales" gating.
            </p>
          </div>
        </MarketingReveal>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <MarketingReveal>
              <CodeBlock
                label="curl"
                body={`# Subscribe to every open incident on tenant t_2zZ4
curl -X POST https://api.lifeguard.example/v1/webhooks \\
  -H 'Authorization: Bearer ' $LIFEGUARD_KEY \\
  -H 'Content-Type: application/json' \\
  -d '{
    "url": "https://ops.crescent.example/v1/incidents",
    "events": ["incident.opened", "incident.dispatched", "incident.resolved"],
    "secret": "'"$LIFEGUARD_WEBHOOK_SECRET"'"
  }'

# Sample inbound payload
{
  "id": "inc_2026_0717_0046",
  "type": "incident.opened",
  "wearer_id": "sub_044",
  "wearer_name": "Nomvula Mokoena",
  "ai_score": 0.91,
  "trigger": "panic_press",
  "lat": -33.918, "lng": 18.385,
  "device_battery": 84
}`}
              />
            </MarketingReveal>
          </div>
          <div className="lg:col-span-5">
            <MarketingReveal delay={120}>
              <ul className="space-y-3">
                {[
                  { name: "TypeScript · @lifeguard/sdk",           hint: "Node 18+ / Deno / Bun" },
                  { name: "Python · pip install lifeguard",         hint: "3.9 +" },
                  { name: "Go · go get lifeguard/lifeguard-go",    hint: "1.21 +" },
                  { name: "Ruby · gem install lifeguard",           hint: "3.0 +" },
                  { name: "Java · maven com.lifeguard:sdk",         hint: "21 LTS" },
                  { name: "C# · dotnet add package LifeGuard",      hint: ".NET 8" },
                ].map((s) => (
                  <li
                    key={s.name}
                    className="rounded-lg px-4 py-3 flex items-center justify-between lift-strong"
                    style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
                  >
                    <span className="mono text-[13px]" style={{ color: "var(--color-ink)" }}>{s.name}</span>
                    <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>{s.hint}</span>
                  </li>
                ))}
              </ul>
              <Link href="/docs" className="btn btn-red w-full mt-6">
                Full reference →
              </Link>
            </MarketingReveal>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CTA                                                            */}
      {/* ============================================================== */}
      <section className="section-dark py-24 md:py-32" aria-labelledby="cta-heading">
        <div className="container-x text-center">
          <MarketingReveal>
            <div className="max-w-[640px] mx-auto">
              <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                Next step
              </div>
              <h2 id="cta-heading" className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
                One tenant. One sandbox key. Ten minutes.
              </h2>
              <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Provision a sandbox in three lines. Start firing real alerts from
                real devices. No sales call.
              </p>
              <Link href="/signup" className="btn btn-red btn-lg mt-8">
                Create the tenant
                <ArrowRight />
              </Link>
            </div>
          </MarketingReveal>
        </div>
      </section>
    </>
  );
}

function CodeBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="beam-border" style={{ borderRadius: 12 }}>
      <div className="rounded-xl overflow-hidden shadow-stripe-3" style={{ border: "1px solid var(--color-line)" }}>
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ background: "var(--color-bg-soft)", borderColor: "var(--color-line)" }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--color-muted)", fontWeight: 600 }}
          >
            {label}
          </span>
          <span className="text-[11px] flex items-center gap-2" style={{ color: "var(--color-red)", fontWeight: 600 }}>
            copy <span className="blink-caret" />
          </span>
        </div>
        <pre
          className="mono overflow-x-auto p-5 text-[12.5px] leading-relaxed"
          style={{
            color: "var(--color-ink)",
            background: "#fff",
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontVariantLigatures: "none",
          }}
        >
          {body}
        </pre>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M2 7h10m0 0L8 3m4 4l-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
