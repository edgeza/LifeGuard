import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Changelog — LifeGuard",
  description:
    "Every shipped change to LifeGuard. Honest release notes, no marketing. Tagged by what we ship.",
};

type Change = {
  type: "feature" | "fix" | "perf" | "security" | "breaking";
  text: string;
};

type Release = {
  date: string;       // ISO yyyy-mm-dd
  version: string;    // semver
  title: string;
  body?: string;
  changes: Change[];
};

const typeStyle: Record<Change["type"], { label: string; color: string; bg: string }> = {
  feature:  { label: "Feature",  color: "#fff",            bg: "var(--color-red)" },
  fix:      { label: "Fix",      color: "var(--color-ink)", bg: "var(--color-bg-soft)" },
  perf:     { label: "Perf",     color: "#fff",            bg: "#0a0a0a" },
  security: { label: "Security", color: "#fff",            bg: "#8b0c14" },
  breaking: { label: "Breaking", color: "#fff",            bg: "#dc2626" },
};

const releases: Release[] = [
  {
    date: "2026-07-18",
    version: "v0.7.0",
    title: "Operator console: AI triage column is now sticky.",
    body: "We split the alert queue into two columns: everything on the left, what the model considers high-confidence on the right. Operators no longer have to scroll past low-score events to reach the ones that matter.",
    changes: [
      { type: "feature", text: "Sticky AI triage column in the operator console" },
      { type: "feature", text: "Score breakdown overlay: 7 signals at a glance" },
      { type: "fix",     text: "Fixed a race condition that let two operators ack the same alert" },
      { type: "perf",    text: "Alert ingest latency p99 dropped from 480 ms to 210 ms on LTE-M" },
    ],
  },
  {
    date: "2026-07-09",
    version: "v0.6.4",
    title: "Caregiver App for Android + Wear OS.",
    changes: [
      { type: "feature", text: "Wear OS complication with last-seen + battery" },
      { type: "feature", text: "Android quick-call tile for emergency contacts" },
      { type: "fix",     text: "Push notifications now arrive within 2 s on Android 14+" },
    ],
  },
  {
    date: "2026-06-22",
    version: "v0.6.2",
    title: "Webhook signing & replay protection.",
    body: "Webhooks now include a per-delivery HMAC-SHA256 signature in `X-LifeGuard-Signature`. Old unsigned webhooks still work but log a warning.",
    changes: [
      { type: "security", text: "Webhook signatures (HMAC-SHA256)" },
      { type: "security", text: "5-minute replay window enforced via timestamp + nonce" },
      { type: "breaking", text: "`POST /v1/webhooks/{id}/test` payload format updated — see API docs" },
    ],
  },
  {
    date: "2026-06-01",
    version: "v0.6.0",
    title: "First-party carrier in the Netherlands.",
    body: "KPN agreement signed. Devices shipped in NL now use a native KPN LTE-M profile and the SIM auto-registers on Vodafone NL as a backup.",
    changes: [
      { type: "feature", text: "KPN LTE-M profile in NL (lead market #3)" },
      { type: "feature", text: "Auto-failover to secondary carrier when primary signal < −95 dBm" },
    ],
  },
  {
    date: "2026-05-19",
    version: "v0.5.7",
    title: "Reseller program: per-tenant themes + subdomains.",
    body: "Resellers can now publish a fully-branded console at `console.<their-domain>.com` without any LifeGuard branding leaking through.",
    changes: [
      { type: "feature", text: "Subdomain mapping via CNAME" },
      { type: "feature", text: "Theme tokens (logo, colour, favicon) per tenant" },
      { type: "fix",     text: "Custom domains no longer break audit-trail hash chain" },
    ],
  },
  {
    date: "2026-04-30",
    version: "v0.5.0",
    title: "SDKs in 6 languages, all versioned together.",
    body: "All six SDKs now share a release train. Pin to a major version (`lifeguard@^1.0`) and you get a coherent API surface across languages.",
    changes: [
      { type: "feature", text: "TypeScript, Python, Go, Ruby, Java, C# SDKs (1.0 GA)" },
      { type: "perf",    text: "SDKs ship with pre-built TypeScript types — no schema fetch on cold start" },
    ],
  },
  {
    date: "2026-04-12",
    version: "v0.4.3",
    title: "UK first-party carrier.",
    changes: [
      { type: "feature", text: "EE LTE-M profile in UK (lead market #2)" },
      { type: "feature", text: "999 PSAP escalation for UK accounts" },
    ],
  },
  {
    date: "2026-03-20",
    version: "v0.4.0",
    title: "Public REST API v1.",
    body: "The same API our own console uses. OAuth 2.0 + Webhooks. We commit to API stability until v2.",
    changes: [
      { type: "feature", text: "REST API v1: subscribers, devices, incidents, webhooks, audit" },
      { type: "feature", text: "100k events / month free per tenant" },
      { type: "security", text: "Tenant-scoped API keys, rotated from console" },
    ],
  },
  {
    date: "2026-02-14",
    version: "v0.3.0",
    title: "Hardware: LifeClip CG2.",
    body: "Discreet clip form factor for situations where a wrist isn't safe. Shares the LTE-M profile from a paired phone or runs standalone with its own eSIM.",
    changes: [
      { type: "feature", text: "LifeClip CG2 SKU" },
      { type: "feature", text: "Shared-cellular mode (LTE-M piggyback on phone)" },
    ],
  },
  {
    date: "2026-01-22",
    version: "v0.2.0",
    title: "Hardware: LifePendant P2.",
    changes: [
      { type: "feature", text: "Pendant form factor with two-way cellular voice" },
      { type: "feature", text: "14-day standby, 6-hour active voice on the cellular call" },
    ],
  },
  {
    date: "2026-01-08",
    version: "v0.1.0",
    title: "Initial release.",
    body: "First LifeGuard devices ship in South Africa. Aurora pilot goes live with 240 subscribers on a single armed-response operator.",
    changes: [
      { type: "feature", text: "LifeBand G2 wristband SKU" },
      { type: "feature", text: "Operator console v1 (3-column Linear-class layout)" },
      { type: "feature", text: "SMS fanout to 5 emergency contacts" },
    ],
  },
];

function Pill({ children, color, bg }: { children: string; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
      style={{ background: bg, color, fontWeight: 700 }}
    >
      {children}
    </span>
  );
}

export default function ChangelogPage() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-4">Changelog</div>
          <h1 className="display-xl text-[44px] md:text-[60px]">
            Every change we ship.
          </h1>
          <p className="lead mt-6 max-w-[640px]">
            Honest release notes. Tagged by what we shipped, dated, versioned. No
            marketing-speak &mdash; if we added a feature, we say what it does and
            what we broke doing it. Subscribe via the API and we&rsquo;ll POST the
            same notes to your webhook.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <code
              className="mono text-[12px] px-3 py-2 rounded-md inline-block"
              style={{
                background: "var(--color-bg-soft)",
                color: "var(--color-ink)",
                border: "1px solid var(--color-line)",
              }}
            >
              curl -X POST https://api.lifeguard.example/v1/webhooks \
              <br />
              &nbsp;&nbsp;-H &apos;Authorization: Bearer $LIFEGUARD_API_KEY&apos; \
              <br />
              &nbsp;&nbsp;-d &apos;{`{ "url": "https://you.example/changelog", "events": ["changelog.published"] }`}&apos;
            </code>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/signup" className="btn btn-red btn-lg">
              Get a sandbox tenant
              <Arrow />
            </Link>
            <Link href="/docs" className="btn btn-ghost btn-lg">
              Read the API
            </Link>
            <a
              href="https://github.com/edgeza/lifeguard/releases.atom"
              className="btn btn-ghost btn-lg"
            >
              RSS / Atom feed
            </a>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container-x pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Releases shipped" value={releases.length.toString()} />
          <Stat label="First release"  value={releases[releases.length - 1].date} />
          <Stat label="Latest release"  value={releases[0].version} />
          <Stat label="Cadence"         value="Weekly" />
        </div>
      </section>

      {/* RELEASES LIST */}
      <section className="container-x pb-24 md:pb-32">
        <ol className="relative">
          {/* vertical timeline rule */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-px hidden md:block"
            style={{ background: "var(--color-line)" }}
          />
          {releases.map((r, i) => (
            <li key={r.version} className="relative md:pl-10 pb-12 md:pb-16 last:pb-0">
              {/* dot on the timeline */}
              <span
                aria-hidden="true"
                className="hidden md:block absolute left-0 top-2 h-3.5 w-3.5 rounded-full"
                style={{
                  background: "var(--color-bg)",
                  border: "3px solid var(--color-red)",
                  boxShadow: "0 0 0 4px var(--color-bg)",
                }}
              />
              <MarketingReveal delay={Math.min(i * 30, 200)}>
                <article
                  className="rounded-2xl border p-6 md:p-8"
                  style={{
                    borderColor: "var(--color-line)",
                    background: "var(--color-bg)",
                  }}
                >
                  <header className="flex flex-wrap items-baseline gap-3 mb-3">
                    <time
                      className="mono tabular text-[12px]"
                      dateTime={r.date}
                      style={{ color: "var(--color-muted)", fontWeight: 600, letterSpacing: "0.06em" }}
                    >
                      {r.date}
                    </time>
                    <span
                      className="mono tabular text-[12px]"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      {r.version}
                    </span>
                    <h2 className="text-[20px] md:text-[22px] flex-1" style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {r.title}
                    </h2>
                  </header>

                  {r.body && (
                    <p className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--color-body)" }}>
                      {r.body}
                    </p>
                  )}

                  <ul className="space-y-2">
                    {r.changes.map((c, j) => {
                      const t = typeStyle[c.type];
                      return (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-[14px]"
                          style={{ color: "var(--color-body)" }}
                        >
                          <Pill color={t.color} bg={t.bg}>{t.label}</Pill>
                          <span>{c.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </MarketingReveal>
            </li>
          ))}
        </ol>

        {/* Bottom: subscribe + commit to cadence */}
        <MarketingReveal>
          <div className="mt-16 rounded-2xl p-8 md:p-10 text-center section-dark">
            <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
              Cadence
            </div>
            <h3 className="display text-[28px] md:text-[36px]" style={{ color: "#fff" }}>
              Weekly releases. Public changelog. No dark launches.
            </h3>
            <p className="lead mt-4 max-w-[640px] mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              If it&rsquo;s shipped, it&rsquo;s here. If it broke something, the
              breaking-change row says what. We commit to a public changelog and a
              weekly cadence. Less than that, and the team isn&rsquo;t shipping.
            </p>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--color-muted)", fontWeight: 600 }}
      >
        {label}
      </div>
      <div
        className="mono tabular mt-1 text-[24px]"
        style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 7h10m0 0L8 3m4 4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
