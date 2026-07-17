import Link from "next/link";

export const metadata = {
  title: "Pricing — LifeGuard",
  description:
    "Four plans, transparent pricing. Consumer Direct, Solo Pro, Operator, Network / Enterprise.",
};

type Plan = {
  id: string;
  name: string;
  target: string;
  summary: string;
  hardware: string;
  monthly: string;
  detail: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

const plans: Plan[] = [
  {
    id: "consumer",
    name: "Consumer Direct",
    target: "Families & individuals",
    summary: "Everything a single household needs. No device minimum.",
    hardware: "$19 / device, one-time",
    monthly: "$24.99 / device / month",
    detail: [
      "Cellular, AI triage, Caregiver App",
      "3-contact SOS fanout",
      "Weekly digest email",
      "Free device swap for life on active plan",
      "Optional $9.99/mo pro: vitals export & predictive fall risk",
    ],
    ctaLabel: "Get started",
    ctaHref: "/signup",
  },
  {
    id: "solo",
    name: "Solo Pro",
    target: "Small security companies · Lone-worker employers",
    summary: "Per-seat pricing. Built for under-500-worker programs.",
    hardware: "$24 / device, one-time",
    monthly: "$24.99 / worker / month",
    detail: [
      "Operator console for one account",
      "Webhooks & REST API included",
      "5-contact SOS fanout",
      "Man-down, impact, and stillness detection",
      "7-year immutable audit trail",
    ],
    ctaLabel: "Start a Solo Pro trial",
    ctaHref: "/signup",
  },
  {
    id: "operator",
    name: "Operator",
    target: "Security companies · Armed response · Estates",
    summary: "Run a control room on top of LifeGuard with your own brand.",
    hardware: "$24–$32 / device, one-time",
    monthly: "$14.99 / operator seat / month + $2 / device-month",
    detail: [
      "Full Linear-class console, white-label",
      "Dispatch logic + nearest-responder routing",
      "Mass broadcast to geofenced devices",
      "Branded operator app (your logo, your name)",
      "Reseller markup stays with you",
    ],
    highlighted: true,
    ctaLabel: "Talk to sales",
    ctaHref: "/signup",
  },
  {
    id: "network",
    name: "Network / Enterprise",
    target: "Multi-country · Fleets · Hospital systems · Insurers",
    summary: "When you need SLAs, on-prem options, and a named CSM.",
    hardware: "Custom",
    monthly: "From $250,000 / year",
    detail: [
      "99.95% operator uptime SLA, contractual",
      "On-prem option for regulated workloads",
      "Dedicated solutions engineer + CSM",
      "Custom compliance (HIPAA, FedRAMP roadmap)",
      "Co-branded hardware at 500+ MOQ",
    ],
    ctaLabel: "Contact enterprise",
    ctaHref: "/signup",
  },
];

const comparisonRows: { label: string; values: (string | boolean)[] }[] = [
  { label: "Hardware (wholesale)", values: ["$24–$32 / device", "$24 / device", "$24–$32 / device", "Custom"] },
  { label: "Cellular & AI triage", values: [true, true, true, true] },
  { label: "SOS fanout contacts", values: ["3", "5", "5", "Custom"] },
  { label: "Caregiver / Family App", values: [true, true, true, true] },
  { label: "Operator console", values: [false, "1 account", "White-label", "Multi-tenant"] },
  { label: "Open REST API + Webhooks", values: ["Read-only", true, true, true] },
  { label: "White-label reseller", values: [false, false, true, true] },
  { label: "Mass broadcast", values: [false, false, true, true] },
  { label: "Audit trail retention", values: ["2 years", "5 years", "7 years", "7 years"] },
  { label: "SLA", values: ["99.5%", "99.9%", "99.95%", "99.95% contractual"] },
  { label: "On-prem option", values: [false, false, false, true] },
  { label: "Dedicated CSM", values: [false, false, false, true] },
];

export default function Pricing() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-4">Pricing</div>
          <h1 className="display-xl text-[44px] md:text-[56px]">
            Four plans. The same platform. No &ldquo;contact us&rdquo; until you need it.
          </h1>
          <p className="lead mt-6">
            Consumer Direct and Solo Pro self-serve. Operator and Network have
            real engineering in the loop. All four use the same hardware, the
            same firmware, the same API, the same console.
          </p>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="container-x pb-20">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
        <p
          className="mt-8 text-[13px]"
          style={{ color: "var(--color-muted)" }}
        >
          All prices in USD. Local pricing available in ZAR, GBP, EUR, AUD — see
          the country selector in the footer. Educational and verified
          non-profit pricing: 30% off Consumer Direct, on request.
        </p>
      </section>

      {/* COMPARISON TABLE */}
      <section
        className="section-soft border-y"
        style={{ borderColor: "var(--color-line)" }}
        aria-labelledby="compare-heading"
      >
        <div className="container-x py-20 md:py-28">
          <div className="max-w-[640px] mb-12">
            <div className="eyebrow mb-4">Compare</div>
            <h2 id="compare-heading" className="h2 text-[36px] md:text-[44px]">
              What you actually get, side by side.
            </h2>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[860px] tabular">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-left text-[12px] uppercase tracking-wider pb-4"
                    style={{ color: "var(--color-muted)", fontWeight: 510 }}
                  >
                    Capability
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className="text-left text-[12px] uppercase tracking-wider pb-4 px-3"
                      style={{
                        color: p.highlighted ? "var(--color-blue)" : "var(--color-muted)",
                        fontWeight: 510,
                      }}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--color-line)" }}>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="text-left py-4 pr-4 align-top text-[14px]"
                      style={{ color: "var(--color-ink-soft)", fontWeight: 510 }}
                    >
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className="py-4 px-3 align-top text-[14px]"
                        style={{ color: "var(--color-body)" }}
                      >
                        <CellValue v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="eyebrow mb-4">FAQ</div>
            <h2 className="h2 text-[32px] md:text-[40px]">
              Honest answers to the questions that come up.
            </h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--color-body)" }}>
              If your question isn&rsquo;t here, email{" "}
              <Link href="mailto:hello@lifeguard.example.com" style={{ color: "var(--color-blue)" }}>
                hello@lifeguard.example.com
              </Link>
              . A real person answers.
            </p>
          </div>
          <div className="md:col-span-8 divide-y" style={{ borderColor: "var(--color-line)" }}>
            {[
              {
                q: "What does &lsquo;wholesale&rsquo; mean exactly?",
                a: "The price we charge a reseller who buys hardware at scale and on-bills their own customers at retail. Public MSRP is the same as our direct-to-consumer price. We don&rsquo;t punish resellers; we don&rsquo;t undercut them either.",
              },
              {
                q: "Why is the per-device-month so much lower than Bay Alarm or AURA?",
                a: "Three reasons: we ship our own silicon-adjacent firmware (no licensed fall-detection stack beyond Apple&rsquo;s), our cloud COGS target is under $1.20 per active device per month, and we don&rsquo;t pay a 24/7 human-staffed call centre that has to phone-verify every alert — the AI triage handles 99.5% of noise before it lands on an operator&rsquo;s screen.",
              },
              {
                q: "Is there a device minimum on Solo Pro or Operator?",
                a: "Solo Pro: 5 devices. Operator: 25 devices or 25 seats, whichever is larger. Network / Enterprise has no minimum, and an annual contract.",
              },
              {
                q: "What happens if I cancel?",
                a: "The device stops transmitting. The cellular service deactivates within 30 days. Your data is exportable via the API for 90 days after cancellation, then deleted.",
              },
              {
                q: "Do you offer a discount for annual payment?",
                a: "Yes — two months free on annual on Consumer Direct and Solo Pro. Operator and Network include the annual discount by default.",
              },
            ].map((item) => (
              <div key={item.q} className="py-6">
                <h3
                  className="text-[16px]"
                  style={{ color: "var(--color-ink)", fontWeight: 510 }}
                  dangerouslySetInnerHTML={{ __html: item.q }}
                />
                <p
                  className="mt-3 text-[14px] leading-relaxed max-w-[640px]"
                  style={{ color: "var(--color-body)" }}
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div
          className="rounded-xl p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center"
          style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}
        >
          <div>
            <h2 className="h2 text-[28px] md:text-[36px]">
              Ready to put a button in the field?
            </h2>
            <p className="mt-4 max-w-[440px]" style={{ color: "var(--color-body)" }}>
              Sandbox tenant is free forever. Real devices ship within 48 hours
              of order confirmation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get started
            </Link>
            <Link href="/trust" className="btn btn-ghost btn-lg">
              See coverage & compliance
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className="card relative p-6 md:p-7 flex flex-col h-full"
      style={
        plan.highlighted
          ? {
              borderColor: "var(--color-blue-border)",
              boxShadow:
                "rgba(29,78,216,0.18) 0px 30px 45px -30px, rgba(0,0,0,0.06) 0px 12px 24px -16px",
            }
          : undefined
      }
    >
      {plan.highlighted && (
        <span
          className="absolute -top-2.5 left-6 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: "var(--color-blue)",
            color: "white",
            fontWeight: 510,
          }}
        >
          Most popular
        </span>
      )}
      <div>
        <div
          className="text-[11px] uppercase tracking-wider mb-1"
          style={{ color: "var(--color-muted)", fontWeight: 510 }}
        >
          {plan.target}
        </div>
        <h3 className="h3 text-[20px]">{plan.name}</h3>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--color-body)" }}>
          {plan.summary}
        </p>
      </div>
      <div className="mt-6">
        <div
          className="text-[11px] uppercase tracking-wider"
          style={{ color: "var(--color-muted)", fontWeight: 510 }}
        >
          Hardware
        </div>
        <div className="mono tabular text-[15px] mt-0.5" style={{ color: "var(--color-ink)", fontWeight: 400 }}>
          {plan.hardware}
        </div>
        <div
          className="text-[11px] uppercase tracking-wider mt-4"
          style={{ color: "var(--color-muted)", fontWeight: 510 }}
        >
          Monthly
        </div>
        <div className="mono tabular text-[18px] mt-0.5" style={{ color: "var(--color-ink)", fontWeight: 400 }}>
          {plan.monthly}
        </div>
      </div>
      <ul className="mt-6 space-y-2.5 flex-1">
        {plan.detail.map((d) => (
          <li key={d} className="flex items-start gap-2.5 text-[13px]" style={{ color: "var(--color-ink-soft)" }}>
            <span
              aria-hidden="true"
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                marginTop: 3,
                flexShrink: 0,
                background: "var(--color-teal-tint)",
                border: "1px solid var(--color-teal-border)",
                position: "relative",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "var(--color-teal-hover)",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <Link
        href={plan.ctaHref}
        className={`btn mt-7 ${plan.highlighted ? "btn-primary" : "btn-ghost"} w-full`}
      >
        {plan.ctaLabel}
      </Link>
    </div>
  );
}

function CellValue({ v }: { v: string | boolean }) {
  if (v === true) {
    return (
      <span aria-label="Included" title="Included">
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 16,
            height: 16,
            borderRadius: 9999,
            background: "var(--color-teal-tint)",
            border: "1px solid var(--color-teal-border)",
            color: "var(--color-teal-hover)",
            textAlign: "center",
            lineHeight: "14px",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          ✓
        </span>
      </span>
    );
  }
  if (v === false) {
    return (
      <span aria-label="Not included" title="Not included" style={{ color: "var(--color-faint)" }}>
        —
      </span>
    );
  }
  return <span>{v}</span>;
}