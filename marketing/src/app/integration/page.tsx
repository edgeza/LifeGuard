import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Integrations — LifeGuard",
  description:
    "Works with iOS, Apple Watch, Android, and your existing stack. Public REST API, webhooks, SDK in 6 languages.",
};

const integrations = [
  { name: "iOS",                  tagline: "Caregiver app, fall risk widget, quick-call widget",    glyph: "ios",     color: "#1d1d1f" },
  { name: "Apple Watch",         tagline: "Wrist-aware emergency shortcut; falls detected, push ETA", glyph: "watch", color: "#1d1d1f" },
  { name: "Android",             tagline: "Caregiver app + watch face integrations",              glyph: "android", color: "#3ddc84" },
  { name: "Wear OS",             tagline: "Tiles, complications, voice: 'Hey LifeGuard'",        glyph: "wearos",   color: "#4285f4" },
  { name: "Carrier-grade SMS",   tagline: "Every alert reaches a phone — even with no app",        glyph: "sms",     color: "#34d399" },
  { name: "Voice (Twilio etc.)", tagline: "Two-way cellular voice on every pendant",             glyph: "voice",   color: "#f43f5e" },
  { name: "Public REST API",     tagline: "REST · Webhooks · OAuth · 6-language SDK",            glyph: "api",     color: "#e11d2e" },
  { name: "MQTT / WebSocket",    tagline: "Live telemetry into your platform, no polling",       glyph: "mqtt",    color: "#06b6a4" },
  { name: "SMS gateway",         tagline: "Outbound SMS from the bot to the elder and the family — works on any phone, even with no app", glyph: "smsout", color: "#f97316" },
];

export default function IntegrationsPage() {
  return (
    <>
      <section className="container-x pt-20 pb-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="eyebrow mb-4">Integrations</div>
            <h1 className="display-xl text-[44px] md:text-[56px] max-w-[640px]">
              Works with the phone on your wrist, the one in your hand, and the ones your team already uses.
            </h1>
            <p className="lead mt-6 max-w-[560px]">
              LifeGuard pairs the fastest way to ask for help (a button on the band) with the
              fastest way to deliver help (a screen on the wrist you already wear). iOS,
              Apple Watch, Android, Wear OS, SMS fallback, two-way voice, and an open REST
              API for your security team.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products#api" className="btn btn-red btn-lg">
                Read the API docs
                <ArrowRight />
              </Link>
              <Link href="/signup" className="btn btn-ghost btn-lg">
                Get a sandbox tenant
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <MarketingReveal>
              <figure className="rounded-2xl overflow-hidden border bg-white shadow-stripe-3" style={{ borderColor: "var(--color-line)" }}>
                <img
                  src="/photos/integration-apple.png"
                  alt="iOS / Apple Watch integration — Caregiver App and SOS complication on the same screen"
                  className="w-full h-auto block"
                  width="1024"
                  height="1024"
                  loading="lazy"
                />
              </figure>
              <p className="mt-4 text-[12px] text-center" style={{ color: "var(--color-muted)" }}>
                Apple Watch + iOS Caregiver App — same home screen, same incident, real-time.
              </p>
            </MarketingReveal>
          </div>
        </div>
      </section>

      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }} aria-labelledby="int-grid-heading">
        <div className="container-x py-20 md:py-28">
          <MarketingReveal>
            <div className="max-w-[640px] mb-10">
              <div className="eyebrow mb-3">Channels</div>
              <h2 id="int-grid-heading" className="display text-[36px] md:text-[48px]">
                Nine ways in. One signal out.
              </h2>
            </div>
          </MarketingReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {integrations.map((i, idx) => (
              <MarketingReveal key={i.name} delay={idx * 40}>
                <article className="lift card p-5 h-full">
                  <div
                    className="h-10 w-10 rounded-md grid place-items-center mb-3"
                    style={{ background: "var(--color-bg-soft)" }}
                    aria-hidden="true"
                  >
                    <Glyph token={i.glyph} color={i.color} />
                  </div>
                  <h3 className="text-[16px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {i.name}
                  </h3>
                  <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: "var(--color-body)" }}>
                    {i.tagline}
                  </p>
                </article>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-28" aria-labelledby="api-heading">
        <MarketingReveal>
          <div className="max-w-[680px] mb-12">
            <div className="eyebrow mb-3">The API</div>
            <h2 id="api-heading" className="display text-[36px] md:text-[48px]">
              Public REST. Signed webhooks. Six SDKs.
            </h2>
            <p className="lead mt-5">
              Same model every operator understands. Same shape every operator can
              parse. Whichever side of the platform you live on, you can move data.
            </p>
          </div>
        </MarketingReveal>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
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
          </div>
          <div className="lg:col-span-6">
            <MarketingReveal>
              <ul className="space-y-3">
                {[
                  { name: "TypeScript · @lifeguard/sdk",  hint: "Node 18+ / Deno / Bun" },
                  { name: "Python · pip install lifeguard", hint: "3.9 +" },
                  { name: "Go · go get lifeguard/lifeguard-go", hint: "1.21 +" },
                  { name: "Ruby · gem install lifeguard", hint: "3.0 +" },
                  { name: "Java · maven com.lifeguard:sdk", hint: "21 LTS" },
                  { name: "C# · dotnet add package LifeGuard", hint: ".NET 8" },
                ].map((s) => (
                  <li
                    key={s.name}
                    className="rounded-lg px-4 py-3 flex items-center justify-between"
                    style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
                  >
                    <span className="mono text-[13px]" style={{ color: "var(--color-ink)" }}>{s.name}</span>
                    <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>{s.hint}</span>
                  </li>
                ))}
              </ul>
            </MarketingReveal>
          </div>
        </div>
      </section>

      <section className="section-dark py-24 md:py-32" aria-labelledby="cta-heading">
        <div className="container-x text-center">
          <MarketingReveal>
            <div className="max-w-[640px] mx-auto">
              <div className="eyebrow mb-3">Get started</div>
              <h2 id="cta-heading" className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
                One tenant. One sandbox key. Ten minutes.
              </h2>
              <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Connect a sandbox in three lines and start firing real alerts from real devices.
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
    <MarketingReveal>
      <div className="rounded-xl overflow-hidden shadow-stripe-3" style={{ border: "1px solid var(--color-line)" }}>
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ background: "var(--color-bg-soft)", borderColor: "var(--color-line)" }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
            {label}
          </span>
          <span className="text-[11px]" style={{ color: "var(--color-red)", fontWeight: 600 }}>
            copy &nbsp;↗
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
    </MarketingReveal>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 7h10m0 0L8 3m4 4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Glyph({ token, color }: { token: string; color: string }) {
  const c = color;
  switch (token) {
    case "ios":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill={c}>
          <path d="M16.5 1.5c.04 1.4-.45 2.7-1.2 3.6-.78 1-2.07 1.7-3.27 1.55-.06-1.36.5-2.7 1.25-3.55.83-.95 2.2-1.65 3.22-1.6zm3.4 15.7c-.6 1.36-.9 1.96-1.66 3.16-1.06 1.66-2.55 3.73-4.4 3.74-1.65.02-2.07-1.07-4.3-1.06-2.22.01-2.7 1.08-4.34 1.06-1.84-.01-3.25-1.88-4.3-3.54-2.95-4.66-3.27-10.13-1.45-13.04 1.37-2.18 3.55-3.46 5.6-3.46 1.74 0 3.4 1.18 4.49 1.18 1.06 0 3.06-1.4 4.94-1.18.83.02 3.18.34 4.69 2.55-4.36 2.4-1.2 8.6 1.73 10.6z" />
        </svg>
      );
    case "watch":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <rect x="6" y="6" width="12" height="12" rx="2.5" />
          <path d="M9 3h6l-1 3" />
          <path d="M9 21h6l-1-3" />
          <path d="M9 12h2l1-1 2 1 1-2" />
        </svg>
      );
    case "android":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill={c}>
          <path d="M5 11.5a7 7 0 0 1 14 0v5.5h-14v-5.5zM7 9.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm10 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm-10.5 8.5h11a1.5 1.5 0 0 1-1.5 1.5h-8a1.5 1.5 0 0 1-1.5-1.5zm.5 2.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm9 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5 9l1.5-2.5M19 9l-1.5-2.5" />
        </svg>
      );
    case "wearos":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "sms":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <rect x="4" y="3" width="16" height="14" rx="2" />
          <path d="M4 7l8 5 8-5" />
        </svg>
      );
    case "voice":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 12a7 7 0 0 0 14 0" />
        </svg>
      );
    case "api":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M4 8l-2 4 2 4M20 8l2 4-2 4M9 6l-2 12M15 6l2 12" />
        </svg>
      );
    case "mqtt":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M5 14a7 7 0 0 1 14 0" />
          <path d="M2 18a14 14 0 0 1 20 0" />
          <circle cx="12" cy="14" r="1.2" fill={c} />
        </svg>
      );
    case "smsout":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={c} strokeWidth="1.6">
          <path d="M4 4h16v12H7l-3 3V4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    default:
      return null;
  }
}
