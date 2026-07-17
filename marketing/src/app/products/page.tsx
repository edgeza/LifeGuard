import Link from "next/link";

export const metadata = {
  title: "Hardware, platform, API — LifeGuard",
  description:
    "Four wearable SKUs on a shared firmware image, a 7-region cloud platform, and an open REST API with SDKs in six languages.",
};

const devices = [
  {
    id: "lifeband",
    sku: "G2",
    name: "LifeBand",
    tagline: "The wristband that knows how your body is doing.",
    body: "7-day battery. LTE-M, NB-IoT, Wi-Fi 5, Bluetooth 5.3 indoor positioning, GPS. HR, HRV, SpO\u2082, skin temperature, 9-axis IMU, fall detection, single button. 38 grams, IP67.",
    specs: [
      ["Form", "Wristband"],
      ["Battery", "7 days"],
      ["Sensors", "HR · HRV · SpO\u2082 · Skin temp · 9-axis IMU · Fall"],
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
    id: "lifecard",
    sku: "C2",
    name: "LifeCard",
    tagline: "A credit card that calls for help.",
    body: "6 months on a coin cell. Pairs to the wearer&rsquo;s phone over Bluetooth. No cellular radio, no GPS. For the wallet, the back of an ID lanyard, the inside of a passport holder. Subtle is the feature.",
    specs: [
      ["Form", "Credit card"],
      ["Battery", "6 months (coin cell)"],
      ["Sensors", "Button"],
      ["Connectivity", "BT 5.3 (paired to phone)"],
      ["Replacement", "Self-service, free with active plan"],
    ],
    price: { wholesale: "$14", retail: "$29" },
  },
  {
    id: "lifeclip",
    sku: "CG2",
    name: "LifeClip",
    tagline: "Discreet. Clipped where no one looks for it.",
    body: "3-day battery. LTE-M shared from the wearer&rsquo;s phone, or standalone with its own eSIM. Single button, fall detection that subscribes to the paired phone&rsquo;s sensors. Designed for situations where a wrist is not safe.",
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
    body: "Family mode (SMS to contacts only), Operator mode (subscriber&rsquo;s security company operator dispatches), Network mode (nearest professional responder from our partner network).",
  },
  {
    n: "06",
    title: "Vitals history, exportable.",
    body: "Every device records HR, HRV, SpO\u2082, skin temperature, steps, sleep at 60-second resolution. TimescaleDB-backed. CSV / JSON via API, or weekly email digest.",
  },
  {
    n: "07",
    title: "Predictive fall risk (beta).",
    body: "30-day HRV trend. If it&rsquo;s declining while sleep is fragmenting, the caregiver gets a heads-up before the fall, not after.",
  },
  {
    n: "08",
    title: "Mass-broadcast for estates and campuses.",
    body: "Define a geofence. Push a notice. Ten thousand devices reached in 30 seconds. Operator-grade speed for sites that need it.",
  },
  {
    n: "09",
    title: "Immutable audit trail.",
    body: "Every action by every operator, every partner config change, every firmware event. Seven years, immutable, available to the partner via API.",
  },
  {
    n: "10",
    title: "Open platform.",
    body: "REST API. Webhooks. GraphQL on the v2 roadmap. WebSocket live-stream. OAuth 2.0. Postman collection. SDK in TypeScript, Python, Go, Java, C#, Ruby.",
  },
];

export default function Products() {
  return (
    <>
      {/* HEADER */}
      <section className="relative">
        <div className="container-x pt-20 pb-16">
          <div className="eyebrow mb-4">Hardware · Platform · API</div>
          <h1 className="display-xl text-[44px] md:text-[60px] max-w-[820px]">
            One stack. Four wearables. One platform. One API.
          </h1>
          <p className="lead mt-6 max-w-[640px]">
            Every LifeGuard device runs the same firmware, shares the same SIM
            profile, and emits the same JSON shape. The platform is one product,
            not ten. The API is one surface, not a maze of integrations.
          </p>
        </div>
      </section>

      {/* HARDWARE — alternating editorial composition, not a tile grid */}
      <section aria-labelledby="hardware-heading" className="container-x pb-20">
        <h2 id="hardware-heading" className="h2 text-[32px] md:text-[40px] mb-12">
          Four SKUs on one SoC family.
        </h2>
        <div className="space-y-20 md:space-y-28">
          {devices.map((d, i) => (
            <article
              key={d.id}
              id={d.id}
              className="grid md:grid-cols-12 gap-8 md:gap-10 items-start"
            >
              <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="tabular text-[12px] tracking-wider"
                    style={{ color: "var(--color-blue)", fontWeight: 510 }}
                  >
                    SKU {d.sku}
                  </span>
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--color-muted)" }}
                  >
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
                        style={{ color: "var(--color-muted)", fontWeight: 510 }}
                      >
                        {k}
                      </dt>
                      <dd
                        className="text-[13px]"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex items-center gap-6">
                  <PriceTag label="Wholesale" value={d.price.wholesale} />
                  <PriceTag label="MSRP" value={d.price.retail} />
                </div>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <DeviceRender name={d.name} sku={d.sku} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section
        id="console"
        className="section-soft border-y"
        style={{ borderColor: "var(--color-line)" }}
        aria-labelledby="platform-heading"
      >
        <div className="container-x py-24 md:py-32">
          <div className="max-w-[640px] mb-14">
            <div className="eyebrow mb-4">Platform</div>
            <h2 id="platform-heading" className="h2 text-[36px] md:text-[44px]">
              Ten capabilities that ship on day one.
            </h2>
            <p className="lead mt-5">
              No roadmap asterisks. The capabilities on this page are in
              production today and used by paying subscribers across 195
              countries.
            </p>
          </div>
          <ol className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {platformFeatures.map((f) => (
              <li key={f.n} className="grid grid-cols-[40px_1fr] gap-4">
                <span
                  className="tabular text-[12px] tracking-wider"
                  style={{ color: "var(--color-blue)", fontWeight: 510 }}
                >
                  {f.n}
                </span>
                <div>
                  <h3 className="h3 text-[18px]">{f.title}</h3>
                  <p
                    className="mt-2 text-[14px] leading-relaxed"
                    style={{ color: "var(--color-body)" }}
                    dangerouslySetInnerHTML={{ __html: f.body }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* API SUMMARY */}
      <section id="api" aria-labelledby="api-heading" className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-4">Open API</div>
            <h2 id="api-heading" className="h2 text-[36px] md:text-[44px]">
              The console is the product. The API is the same product.
            </h2>
            <p className="lead mt-5">
              Every action an operator can take in the console is an API call.
              Every signal a device emits is a webhook. We don&rsquo;t gate the API
              behind enterprise contracts and we don&rsquo;t rate-limit it below a
              million events a month on any tier.
            </p>
            <ul
              className="mt-8 space-y-3 text-[15px]"
              style={{ color: "var(--color-body)" }}
            >
              {[
                "REST + Webhooks + WebSocket live-stream",
                "OAuth 2.0 with PKCE",
                "Postman collection, sample code in 6 languages",
                "Sandbox tenant mirrors production — free forever",
                "OpenAPI 3.1 spec, machine-readable",
              ].map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 9999,
                      marginTop: 8,
                      background: "var(--color-blue)",
                    }}
                  />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-3">
              <Link href="/docs" className="btn btn-primary">
                Read the docs
              </Link>
              <Link href="/signup" className="btn btn-ghost">
                Get a sandbox key
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <CodeSample />
          </div>
        </div>
      </section>
    </>
  );
}

function PriceTag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--color-muted)", fontWeight: 510 }}
      >
        {label}
      </div>
      <div
        className="mt-0.5 mono tabular text-[18px]"
        style={{ color: "var(--color-ink)", fontWeight: 400 }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Per-SKU render — load the canonical, photographed-grade SVG illustration for
 * each device. Each render lives in /public/products/ and was composed to be
 * visually distinctive, professionally rendered, and recognisable across all four
 * surfaces of the LifeGuard stack (marketing / family / console / reseller).
 */
const DEVICE_RENDER: Record<string, string> = {
  LifeBand:    "/products/lifeband-g2.svg",
  LifePendant: "/products/lifependant-p2.svg",
  LifeCard:    "/products/lifecard-c2.svg",
  LifeClip:    "/products/lifeclip-cg2.svg",
};

function DeviceRender({ name, sku }: { name: string; sku: string }) {
  const src = DEVICE_RENDER[name] ?? DEVICE_RENDER.LifeBand;
  return (
    <div className="rounded-xl overflow-hidden border bg-[var(--color-bg-soft)]" style={{ borderColor: "var(--color-line)" }}>
      <img
        src={src}
        alt={`${name} ${sku} — LifeGuard wearable hardware product render`}
        className="w-full h-auto block"
        width="480"
        height="480"
        loading="lazy"
      />
      <div className="px-4 py-3 flex items-center justify-between text-[12px]" style={{ background: "var(--color-bg-soft)" }}>
        <span style={{ color: "var(--color-muted)", fontWeight: 510, letterSpacing: "0.06em" }} className="uppercase">
          {name} · {sku}
        </span>
        <span style={{ color: "var(--color-success, #06b6a4)", fontWeight: 510 }}>
          In stock · ships in 48 hrs
        </span>
      </div>
    </div>
  );
}

function CodeSample() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-line)" }}>
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          background: "var(--color-bg-soft)",
          borderColor: "var(--color-line)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e5edf5" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e5edf5" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e5edf5" }} />
          </span>
          <span
            className="mono text-[12px]"
            style={{ color: "var(--color-muted)" }}
          >
            trigger-alert.ts
          </span>
        </div>
        <span
          className="text-[11px] uppercase tracking-wider"
          style={{ color: "var(--color-muted)", fontWeight: 510 }}
        >
          TypeScript SDK
        </span>
      </div>
      <pre
        className="mono text-[12.5px] leading-[1.7] p-5 overflow-x-auto"
        style={{
          background: "#0a1628",
          color: "#e6edf7",
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
        }}
      >
{`import { LifeGuard } from "@lifeguard/sdk";

const lg = new LifeGuard({
  apiKey: process.env.LIFEGUARD_API_KEY,
});

// Three lines. Every device emits this shape.
const alert = await lg.devices.trigger({
  deviceId: "LG-G2-7F3A91",
  kind: "sos_press",
  position: { lat: -33.9249, lng: 18.4241 },
  vitals: { hr: 132, hrv: 18, spo2: 96, skinTempC: 37.4 },
});

// Five contacts in parallel. ~3 seconds.
const fanout = await lg.incidents.fanout({
  alertId: alert.id,
  contacts: ["+27…", "+27…", "+27…", "+27…", "+27…"],
});`}
      </pre>
    </div>
  );
}