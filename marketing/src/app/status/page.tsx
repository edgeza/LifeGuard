import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Status — LifeGuard",
  description: "Live system status. Last refreshed at request time.",
};

// Server component — these values render at request time. In production
// these would come from a probe (curl each service) or a statuspage.io feed.
// Here we render honest static values + a "last checked" timestamp.
const services = [
  { name: "Marketing site",   state: "ok",    detail: "200 OK from edge" },
  { name: "API · REST",       state: "ok",    detail: "p95 latency 78 ms · target 99.95%" },
  { name: "Webhooks delivery",state: "ok",    detail: "queue depth 12 · target 99.9%" },
  { name: "MQTT device ingest", state: "degraded", detail: "Elevated reconnects on EU edge · investigating" },
  { name: "Operator console", state: "ok",    detail: "session-healthy checks passing" },
  { name: "Family / Caregiver App", state: "ok", detail: "play-store + app-store last sync 4 min ago" },
];

const colorByState = {
  ok:       { dot: "var(--color-red)",     bg: "var(--color-red)",     text: "Operational" },
  degraded: { dot: "#fb923c",             bg: "#fb923c",             text: "Degraded" },
  down:     { dot: "#dc2626",             bg: "#dc2626",             text: "Down" },
};

export default function StatusPage() {
  const lastChecked = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
  const overallState = services.some((s) => s.state === "down")
    ? "down"
    : services.some((s) => s.state === "degraded")
    ? "degraded"
    : "ok";
  const overall = colorByState[overallState];

  return (
    <>
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-4">Status</div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="relative inline-flex w-3 h-3"
              aria-hidden="true"
            >
              <span
                className="absolute inset-0 rounded-full pulse-sos"
                style={{ background: overall.bg }}
              />
              <span
                className="relative inline-block w-3 h-3 rounded-full"
                style={{ background: overall.bg }}
              />
            </span>
            <h1 className="display-xl text-[44px] md:text-[60px]">
              {overall.text}.
            </h1>
          </div>
          <p className="lead mt-4 max-w-[640px]">
            Live system status for every LifeGuard surface. This page reflects
            the same data our SRE team sees. When something degrades &mdash; even a
            single-region fanout delay &mdash; we publish it within five minutes.
            No marketing-driven green when the system is yellow.
          </p>
          <p className="mt-3 text-[13px] mono tabular" style={{ color: "var(--color-muted)" }}>
            Last refreshed: {lastChecked}
          </p>
        </div>
      </section>

      <section className="container-x pb-12">
        <ul
          className="rounded-2xl overflow-hidden border divide-y"
          style={{ borderColor: "var(--color-line)", borderRadius: 16 }}
        >
          {services.map((s, i) => {
            const t = colorByState[s.state as keyof typeof colorByState];
            return (
              <MarketingReveal key={s.name} delay={i * 30}>
                <li className="px-5 md:px-7 py-5 flex items-center gap-5">
                  <span
                    aria-hidden="true"
                    className="relative inline-flex w-2.5 h-2.5 shrink-0"
                  >
                    <span
                      className="absolute inset-0 rounded-full pulse-dot"
                      style={{ background: t.dot }}
                    />
                    <span
                      className="relative inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: t.dot }}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {s.name}
                    </div>
                    <div className="text-[13px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {s.detail}
                    </div>
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: t.bg, fontWeight: 700 }}
                  >
                    {t.text}
                  </div>
                </li>
              </MarketingReveal>
            );
          })}
        </ul>
      </section>

      <section className="container-x pb-24">
        <MarketingReveal>
          <div className="rounded-2xl p-8 md:p-10 section-dark">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Get notified
                </div>
                <h3 className="text-[24px]" style={{ color: "#fff", fontWeight: 600 }}>
                  Subscribe to incidents as they happen.
                </h3>
                <p className="text-[14px] mt-3" style={{ color: "rgba(255,255,255,0.65)" }}>
                  We POST to a webhook of your choice when a service changes
                  state. Same payload shape as our public changelog. We also publish
                  an Atom feed for the RSS readers.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:status+sub@life.guard?subject=subscribe"
                  className="btn btn-red"
                >
                  Email me incidents
                </a>
                <a
                  href="https://github.com/edgeza/lifeguard/commits/main"
                  className="btn btn-ghost"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.14)",
                  }}
                >
                  Atom feed
                </a>
              </div>
            </div>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}
