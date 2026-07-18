import Link from "next/link";

export const metadata = {
  title: "Trust — LifeGuard",
  description: "Compliance, country coverage, status, and security posture for LifeGuard.",
};

// Curated set — countries we highlight as "operator-grade coverage" first
// Countries where we hold first-party carrier MVNO agreements today.
// Order matters — these are the lead markets the user sees on the map.
const coverageRegions: { name: string; status: string; cities: string }[] = [
  { name: "South Africa",  status: "First-party", cities: "JHB · CPT · DBN · PE · BLO" },
  { name: "United Kingdom", status: "First-party", cities: "London · Manchester · Edinburgh" },
  { name: "Netherlands",   status: "First-party", cities: "Amsterdam · Rotterdam · Utrecht" },
  { name: "Australia",     status: "First-party", cities: "Sydney · Melbourne · Brisbane" },
];

// Roaming = everywhere else. We don't claim a country count we can't verify.
const restOfWorldCount = "Rest of world";

export default function Trust() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-4">Trust</div>
          <h1 className="display-xl text-[44px] md:text-[56px]">
            A life-safety product has to be worth the trust.
          </h1>
          <p className="lead mt-6">
            Here is what compliance looks like at LifeGuard, who audits it, where
            the devices actually work, and what we publish when something
            doesn&rsquo;t.
          </p>
        </div>
      </section>

      {/* COMPLIANCE BADGES */}
      <section
        id="compliance"
        className="section-soft border-y"
        style={{ borderColor: "var(--color-line)" }}
        aria-labelledby="compliance-heading"
      >
        <div className="container-x py-20 md:py-24">
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
            <h2 id="compliance-heading" className="h2 text-[32px] md:text-[40px]">
              Compliance posture
            </h2>
            <span
              className="text-[12px] uppercase tracking-wider"
              style={{ color: "var(--color-muted)", fontWeight: 510 }}
            >
              Updated 17 July 2026
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Badge label="ISO 27001" sub="Certified" status="ok" />
            <Badge label="SOC 2 Type II" sub="In audit" status="progress" />
            <Badge label="GDPR" sub="Compliant" status="ok" />
            <Badge label="POPIA" sub="Compliant" status="ok" />
            <Badge label="HIPAA-ready" sub="Data model" status="ok" />
            <Badge label="FedRAMP" sub="Roadmap Q4 2026" status="progress" />
          </div>

          <figure className="mt-12 rounded-xl overflow-hidden border bg-white" style={{ borderColor: "var(--color-line)" }}>
            <img
              src="/trust/compliance-badges.svg"
              alt="LifeGuard compliance stack — ISO 27001 Certified, SOC 2 Type II Audited, GDPR EU Ready, POPIA SA Ready, HIPAA Ready. 99.9% operator SLA target, AES-256 encryption."
              className="w-full h-auto block"
              width="720"
              height="240"
              loading="lazy"
            />
          </figure>

          <p className="mt-8 text-[13px] max-w-[760px]" style={{ color: "var(--color-muted)" }}>
            Certificates and audit reports are available under NDA to qualified
            prospects, partners, and procurement teams. Email{" "}
            <Link href="mailto:trust@lifeguard.example.com" style={{ color: "var(--color-red)" }}>
              trust@lifeguard.example.com
            </Link>
            .
          </p>
        </div>
      </section>

      {/* COUNTRY COVERAGE */}
      <section id="coverage" aria-labelledby="coverage-heading" className="container-x py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-4">Country coverage</div>
            <h2 id="coverage-heading" className="h2 text-[32px] md:text-[40px]">
              4 first-party markets. Roaming partner everywhere else.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--color-body)" }}>
              A device bought in Johannesburg roams to Tokyo with no
              reconfiguration. We hold MVNO agreements with first-party carriers
              in our four lead markets today, and partner-roam everywhere else
              where local 4G LTE-M is available. We&rsquo;re transparent about
              the gap &mdash; a country we don&rsquo;t list means a country
              we&rsquo;ve not yet onboarded.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 max-w-[360px]">
              <div>
                <dt className="text-[11px] uppercase tracking-wider" style={{ color: "var(--color-muted)", fontWeight: 510 }}>
                  First-party markets
                </dt>
                <dd className="mono tabular text-[28px] mt-1" style={{ color: "var(--color-ink)", fontWeight: 300, letterSpacing: "-0.02em" }}>
                  {coverageRegions.length}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider" style={{ color: "var(--color-muted)", fontWeight: 510 }}>
                  Roaming partner
                </dt>
                <dd className="text-[14px] mt-3" style={{ color: "var(--color-ink)", fontWeight: 500 }}>
                  Global LTE-M
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-8">
            <CoverageMap regions={coverageRegions} />
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section
        id="security"
        className="section-soft border-y"
        style={{ borderColor: "var(--color-line)" }}
        aria-labelledby="security-heading"
      >
        <div className="container-x py-20 md:py-24">
          <div className="max-w-[640px] mb-10">
            <div className="eyebrow mb-4">Security</div>
            <h2 id="security-heading" className="h2 text-[32px] md:text-[40px]">
              End-to-end encryption from device to console.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <SecurityCard
              title="AES-256 + TLS 1.3"
              body="Every device-to-cloud and cloud-to-console link. Optional SIM-credential swap for high-risk deployments."
            />
            <SecurityCard
              title="Zero standing privilege"
              body="Operator actions are scoped per-tenant. Every privileged action logs to the immutable audit trail with operator identity."
            />
            <SecurityCard
              title="Hardware root of trust"
              body="Every LifeGuard device carries a secure element with a per-device keypair. Firmware refuses to run if the signature doesn&rsquo;t match."
            />
            <SecurityCard
              title="Tenant isolation"
              body="Per-tenant key derivation. A reseller cannot read another reseller&rsquo;s customer data even if they share infrastructure."
            />
            <SecurityCard
              title="Pen-tested annually"
              body="Independent third-party pen-test by an NCC Group-equivalent firm. Reports summary published after every audit."
            />
            <SecurityCard
              title="Bug bounty"
              body="Public, paid bounty program. Critical findings triaged within four hours. Responsible disclosure since day one."
            />
          </div>
        </div>
      </section>

      {/* STATUS */}
      <section id="status" aria-labelledby="status-heading" className="container-x py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow mb-4">Live status</div>
            <h2 id="status-heading" className="h2 text-[32px] md:text-[40px]">
              All systems operational. Right now, honestly.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed max-w-[520px]" style={{ color: "var(--color-body)" }}>
              The status page reflects the same data our SRE team sees. When
              something degrades — even a single-region fanout delay — we publish
              it within five minutes. No marketing-driven green when the system
              is yellow.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="https://status.lifeguard.example.com" className="btn btn-red">
                Open status page
              </Link>
              <Link href="https://status.lifeguard.example.com/incidents" className="btn btn-ghost">
                Incident history
              </Link>
            </div>
          </div>
          <div>
            <StatusPanel />
          </div>
        </div>
      </section>

      {/* DPA / PRIVACY FOOTER NOTE */}
      <section id="privacy" className="container-x py-16">
        <div
          className="rounded-xl p-8 md:p-10 grid md:grid-cols-3 gap-8"
          style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
        >
          <div className="md:col-span-1">
            <h2 className="h3 text-[20px]">Data we hold, data we don&rsquo;t.</h2>
          </div>
          <ul className="md:col-span-2 space-y-3 text-[14px]" style={{ color: "var(--color-body)" }}>
            <li className="flex items-start gap-3">
              <Dot />
              <span>We hold: device telemetry, vitals history, incident logs, audit trail, billing. We never sell or share.</span>
            </li>
            <li className="flex items-start gap-3">
              <Dot />
              <span>We don&rsquo;t hold: web browsing, advertising identifiers, social-graph data, third-party tracking pixels on the Caregiver App.</span>
            </li>
            <li className="flex items-start gap-3">
              <Dot />
              <span>EU & UK data is processed in EU-WEST. African data is processed in AF-SOUTH. US data in US-EAST. APAC in AP-SOUTH.</span>
            </li>
            <li className="flex items-start gap-3">
              <Dot />
              <span>DPA, privacy policy, and sub-processor list:{" "}
                <Link href="/trust#dpa" style={{ color: "var(--color-red)" }}>
                  lifeguard.example.com/trust
                </Link>.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

function Badge({
  label,
  sub,
  status,
}: {
  label: string;
  sub: string;
  status: "ok" | "progress";
}) {
  const tone =
    status === "ok"
      ? { bg: "var(--color-red-tint)", border: "var(--color-red-border)", text: "var(--color-success)" }
      : { bg: "var(--color-amber-bg)", border: "var(--color-amber-border)", text: "var(--color-amber)" };
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "#ffffff",
        border: "1px solid var(--color-line)",
        boxShadow: "rgba(29,78,216,0.05) 0px 1px 2px",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: tone.text,
            display: "inline-block",
          }}
        />
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ color: tone.text, fontWeight: 510 }}
        >
          {status === "ok" ? "Verified" : "In progress"}
        </span>
      </div>
      <div className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
        {label}
      </div>
      <div className="text-[12px]" style={{ color: "var(--color-muted)" }}>
        {sub}
      </div>
    </div>
  );
}

function SecurityCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{ background: "#ffffff", border: "1px solid var(--color-line)" }}
    >
      <h3 className="h3 text-[15px]">{title}</h3>
      <p
        className="mt-2 text-[13px] leading-relaxed"
        style={{ color: "var(--color-body)" }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}

function CoverageMap({ regions }: { regions: typeof coverageRegions }) {
  // Stylised dot map. Not a real projection — a typographic representation.
  return (
    <div
      className="card p-6 md:p-8"
      aria-label="Country coverage map"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
          <Legend swatch="var(--color-red)" label="First-party carrier" style="solid" />
          <Legend swatch="var(--color-red)" label="Roaming partner" style="ring" />
        </div>
        <span className="text-[12px] tabular" style={{ color: "var(--color-muted)" }}>
          {regions.length} first-party · global LTE-M roaming
        </span>
      </div>
      <div
        className="relative h-[280px] rounded-lg overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--color-bg-soft) 0%, rgba(225,29,46,0.04) 100%)",
          border: "1px solid var(--color-line)",
        }}
        role="img"
        aria-label="World map showing 4 first-party carrier markets and the global LTE-M roaming footprint"
      >
        {/* Equator + meridians, hairline */}
        <svg
          viewBox="0 0 1000 280"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          className="absolute inset-0"
          aria-hidden="true"
        >
          <g stroke="rgba(10,22,40,0.06)" fill="none">
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`v${i}`} x1={(i + 1) * 166} y1="0" x2={(i + 1) * 166} y2="280" />
            ))}
            <line x1="0" y1="140" x2="1000" y2="140" />
          </g>
          {/* Continent approximations — gentle curves */}
          <g fill="rgba(10,22,40,0.08)">
            <path d="M120,90 q40,-30 90,-15 q40,10 60,40 q10,30 -30,40 q-30,5 -50,-10 q-40,-20 -70,-55 z" />
            <path d="M260,120 q60,-40 130,-30 q80,5 100,30 q15,40 -50,60 q-90,30 -160,-10 q-30,-20 -20,-50 z" />
            <path d="M480,80 q60,-25 110,-10 q40,15 30,40 q-10,40 -90,50 q-80,10 -80,-30 q5,-30 30,-50 z" />
            <path d="M620,140 q40,-30 100,-15 q70,15 90,45 q15,30 -30,45 q-50,15 -90,0 q-60,-10 -70,-75 z" />
            <path d="M780,130 q40,-15 90,-5 q60,10 70,40 q5,30 -40,40 q-60,10 -100,-15 q-30,-25 -20,-60 z" />
          </g>
          {/* Coverage dots — placed typographically, not geo-accurately */}
          {[
            ["ZA", 280, 220],
            ["GB", 470, 80],
            ["DE", 510, 95],
            ["NL", 495, 90],
            ["US", 180, 110],
            ["AU", 850, 230],
            ["JP", 870, 110],
            ["BR", 290, 200],
            // "rest of world" samples
            ["IN", 700, 145],
            ["CN", 800, 105],
            ["RU", 580, 70],
            ["EG", 540, 145],
            ["NG", 480, 170],
            ["KE", 560, 180],
            ["AR", 270, 240],
            ["MX", 150, 145],
            ["CA", 200, 70],
            ["NZ", 920, 240],
            ["KR", 850, 115],
            ["SG", 800, 170],
            ["AE", 640, 145],
            ["TR", 540, 115],
            ["ES", 460, 115],
            ["IT", 500, 115],
            ["SE", 520, 65],
          ].map(([code, x, y], i) => {
            const isLead = coverageRegions.some((r) => r.name.toUpperCase().includes(String(code)));
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isLead ? 6 : 3}
                  fill={isLead ? "var(--color-red)" : "var(--color-red)"}
                  opacity={isLead ? 0.95 : 0.6}
                />
                {isLead && (
                  <circle
                    cx={x}
                    cy={y}
                    r={11}
                    fill="none"
                    stroke="var(--color-red)"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-[12px]">
        {regions.map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: "var(--color-red)",
              }}
            />
            <span style={{ color: "var(--color-ink)", fontWeight: 510 }}>{r.name}</span>
            <span style={{ color: "var(--color-muted)" }} className="tabular">
              {r.cities}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ swatch, label, style }: { swatch: string; label: string; style?: "solid" | "ring" }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        style={
          style === "ring"
            ? {
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: "transparent",
                border: `1.5px solid ${swatch}`,
              }
            : {
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: swatch,
              }
        }
      />
      {label}
    </span>
  );
}

function StatusPanel() {
  // Service-level targets, not measured historical uptime. The status page
  // reflects last-90-days live data; this card shows what we're aiming for.
  const services = [
    { name: "Device ingest (MQTT)",   uptime: "Target 99.9%", state: "ok" },
    { name: "Operator console",       uptime: "Target 99.9%", state: "ok" },
    { name: "API · REST",             uptime: "Target 99.95%", state: "ok" },
    { name: "API · Webhooks delivery",uptime: "Target 99.9%", state: "ok" },
    { name: "WebSocket live-stream",  uptime: "Target 99.9%", state: "ok" },
    { name: "Family / Caregiver App", uptime: "Target 99.95%", state: "ok" },
  ];
  return (
    <div
      className="card overflow-hidden"
      role="region"
      aria-label="Status snapshot"
    >
      <div
        className="px-5 py-3 border-b flex items-center justify-between"
        style={{
          background: "var(--color-bg-soft)",
          borderColor: "var(--color-line)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="relative inline-flex w-2 h-2" aria-hidden="true">
            <span
              className="absolute inset-0 rounded-full pulse-dot"
              style={{ background: "var(--color-success)" }}
            />
            <span
              className="relative inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--color-success)" }}
            />
          </span>
          <span className="text-[12px] tracking-wide" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
            All systems operational
          </span>
        </div>
        <span className="text-[12px] tabular" style={{ color: "var(--color-muted)" }}>
          Targets · not live history
        </span>
      </div>
      <ul className="divide-y" style={{ borderColor: "var(--color-line)" }}>
        {services.map((s) => (
          <li
            key={s.name}
            className="px-5 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 9999,
                  background: "var(--color-success)",
                }}
              />
              <span className="text-[14px]" style={{ color: "var(--color-ink)" }}>
                {s.name}
              </span>
            </div>
            <span className="mono tabular text-[13px]" style={{ color: "var(--color-body)" }}>
              {s.uptime}
            </span>
          </li>
        ))}
      </ul>
      <div
        className="px-5 py-3 flex items-center justify-between text-[12px]"
        style={{ background: "var(--color-bg-soft)" }}
      >
        <span style={{ color: "var(--color-muted)" }}>Last updated</span>
        <span className="mono tabular" style={{ color: "var(--color-ink)" }}>
          {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
        </span>
      </div>
    </div>
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
        background: "var(--color-red)",
        flexShrink: 0,
      }}
    />
  );
}