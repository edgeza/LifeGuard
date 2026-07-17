import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

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
    target: "Individuals & families",
    summary: "One device, one subscription, full operator coverage.",
    hardware: "$19 (any SKU) + subscription",
    monthly: "$19.99 / mo",
    detail: [
      "Cellular, AI triage, family app, 3-contact fanout.",
      "Open API access, full audit trail.",
      "Self-serve onboarding. Cancel from account.",
    ],
    ctaLabel: "Get started",
    ctaHref: "/signup",
  },
  {
    id: "solo",
    name: "Solo Pro",
    target: "Small security & lone-worker employers",
    summary: "10–500 workers, white-label option included.",
    hardware: "$24 (any SKU) per device",
    monthly: "$24.99 / worker / mo",
    detail: [
      "Operator console for one account.",
      "Webhooks + public API. 5-contact fanout.",
      "Proactive hardware swap, full audit trail, SOC2 ready.",
    ],
    highlighted: true,
    ctaLabel: "Book a walkthrough",
    ctaHref: "/signup",
  },
  {
    id: "operator",
    name: "Operator",
    target: "Security companies, armed response, estates",
    summary: "Per-dispatch seat + per-device wholesale.",
    hardware: "$2.50 / device / mo wholesale",
    monthly: "$14.99 / seat / mo",
    detail: [
      "Console, dispatch logic, audit trail, mass-broadcast.",
      "Branded operator app + co-branded hardware.",
      "API + webhook quotas 10× Solo Pro. SLA 99.95%.",
    ],
    ctaLabel: "See reseller program",
    ctaHref: "/for-whom#partners",
  },
  {
    id: "network",
    name: "Network / Enterprise",
    target: "Multi-country · fleets · hospital systems · insurers",
    summary: "Custom · on-prem option · dedicated CSM.",
    hardware: "Cohort pricing",
    monthly: "From $250k / year",
    detail: [
      "SLA, on-prem option, regional data residency.",
      "Dedicated CSM, custom compliance, fleet rollout.",
      "Audit-grade APIs, integrations, prioritised roadmap.",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "mailto:hello@lifeguard.example.com",
  },
];

const faqs = [
  {
    q: "Does LifeGuard include cellular service?",
    a: "Every plan includes the cellular data the device needs. Whichever device you choose, the SIM is provisioned in 195 countries and you don't pay separately.",
  },
  {
    q: "What is the white-label markup?",
    a: "Resellers set their own retail price. Wholesale runs $2.50/device/month for Operators, with a 20% markup envelope. The margin is yours.",
  },
  {
    q: "Can I move plans later?",
    a: "Yes. Upgrade, downgrade, or add devices at any time from your dashboard. We bill monthly in arrears, no annual contract.",
  },
  {
    q: "Do you offer a free trial?",
    a: "We offer a 30-day sandbox with the same APIs and console as a paid tenant, but hardware is sold upfront at cost — there is no money back after ships.",
  },
  {
    q: "What if I want to leave?",
    a: "Cancel from the dashboard. Hardware stays yours. We export all data as a portable JSON archive. No retention calls, no small-print traps.",
  },
  {
    q: "Do you cover country X?",
    a: "We cover 195 countries for first-party carrier service. Coverage map + last-mile test plans are published at /trust.",
  },
];

export default function Pricing() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-4">Pricing</div>
          <h1 className="display-xl text-[44px] md:text-[60px]">
            Four plans. Transparent. <br />
            <span style={{ color: "var(--color-red)" }}>No "contact sales".</span>
          </h1>
          <p className="lead mt-6 max-w-[640px]">
            Wholesale, retail, and white-label markup envelope — published. The 80%
            of personal-safety products that gate their pricing behind a sales
            call: we won't. Read the brief, pick a tier, ship tomorrow.
          </p>
        </div>
      </section>

      {/* PLANS — bento */}
      <section className="container-x pb-20" aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="sr-only">Plans</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {plans.map((p, i) => (
            <MarketingReveal key={p.id} delay={i * 60}>
              <article
                className={`relative h-full rounded-2xl p-7 overflow-hidden border ${
                  p.highlighted
                    ? "lift bg-white shadow-stripe-3"
                    : "lift bg-white"
                }`}
                style={{
                  borderColor: p.highlighted
                    ? "var(--color-red-border)"
                    : "var(--color-line)",
                }}
              >
                {p.highlighted && (
                  <div
                    className="absolute -top-12 -right-12 h-40 w-40 rounded-full pulse-sos"
                    aria-hidden="true"
                    style={{
                      background: "var(--color-red)",
                      filter: "blur(40px)",
                      opacity: 0.22,
                    }}
                  />
                )}
                <div className="relative">
                  {p.highlighted && (
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase mb-3"
                      style={{
                        background: "var(--color-red)",
                        color: "#ffffff",
                      }}
                    >
                      <span className="blink inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#fff" }} />
                      Most popular
                    </div>
                  )}
                  <div
                    className="text-[11px] uppercase tracking-[0.18em] mb-2"
                    style={{ color: "var(--color-muted)", fontWeight: 600 }}
                  >
                    {p.target}
                  </div>
                  <h3 className="h2 text-[28px]">{p.name}</h3>
                  <p className="text-[14px] mt-2 mb-6" style={{ color: "var(--color-body)" }}>
                    {p.summary}
                  </p>
                  <div className="border-t border-b py-4 mb-6" style={{ borderColor: "var(--color-line)" }}>
                    <div className="text-[11px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                      Hardware
                    </div>
                    <div className="text-[14px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {p.hardware}
                    </div>
                    <div className="mt-3 text-[11px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                      Monthly
                    </div>
                    <div className="tabular text-[22px]" style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                      {p.monthly}
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-[14px]" style={{ color: "var(--color-body)" }}>
                    {p.detail.map((d) => (
                      <li key={d} className="flex items-start gap-2.5">
                        <CheckSm />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.ctaHref}
                    className={`btn mt-7 w-full ${p.highlighted ? "btn-red" : "btn-ghost"}`}
                  >
                    {p.ctaLabel}
                  </Link>
                </div>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* COMPARISON STRIP */}
      <section
        className="section-dark py-20 md:py-28"
        aria-labelledby="compare-heading"
      >
        <div className="container-x">
          <MarketingReveal>
            <div className="max-w-[640px] mb-12">
              <div className="eyebrow mb-3">How we compare</div>
              <h2 id="compare-heading" className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
                Every other vendor gates pricing behind a sales call.
              </h2>
            </div>
          </MarketingReveal>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <table className="w-full text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  <th className="text-left px-5 py-4 font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Feature</th>
                  <th className="px-3 py-4 font-semibold text-center" style={{ color: "var(--color-red)" }}>LifeGuard</th>
                  <th className="px-3 py-4 font-semibold text-center">Bay Alarm</th>
                  <th className="px-3 py-4 font-semibold text-center">Tunstall</th>
                  <th className="px-3 py-4 font-semibold text-center">AURA</th>
                  <th className="px-3 py-4 font-semibold text-center">Apple Watch</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Wholesale price disclosed",          "✓",       "—",       "—",       "—",       "n/a"],
                  ["Open API + Webhooks free tier",      "1M/mo",   "—",       "—",       "—",       "—"],
                  ["Works in 195 countries",             "✓",       "US",      "UK+38",   "ZA+3",    "150+"],
                  ["White-label reseller markup",        "20%",     "—",       "—",       "—",       "—"],
                  ["Months minimum commitment",          "0",        "3",       "12",      "6",       "0"],
                  ["Avg monthly cost per device",        "$14",    "$28",     "$24",     "$15",     "$10 + carrier"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-3 py-3 ${j === 0 ? "text-left pl-5" : "text-center"} ${j === 1 ? "" : ""}`}
                        style={{ color: j === 1 ? "#fff" : j === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.6)" }}
                      >
                        {cell === "✓" && j === 1 ? (
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                            style={{ background: "var(--color-red)" }}
                          >
                            <CheckSm white />
                          </span>
                        ) : (
                          cell
                        )}
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
      <section className="container-x py-20 md:py-28" aria-labelledby="faq-heading">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-3">FAQ</div>
            <h2 id="faq-heading" className="display text-[36px] md:text-[44px]">
              Pricing questions, answered.
            </h2>
            <p className="lead mt-5 text-[15px]" style={{ fontSize: "15px" }}>
              Can&rsquo;t find what you&rsquo;re looking for?{" "}
              <Link href="mailto:hello@lifeguard.example.com" className="btn-link" style={{ color: "var(--color-red)" }}>
                Email us
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-8 divide-y" style={{ borderColor: "var(--color-line)" }}>
            {faqs.map((f, i) => (
              <MarketingReveal key={f.q} delay={i * 40}>
                <details className="group py-5">
                  <summary className="flex justify-between items-center gap-4 cursor-pointer list-none">
                    <span className="text-[16px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {f.q}
                    </span>
                    <Plus className="shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                    {f.a}
                  </p>
                </details>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CheckSm({ white }: { white?: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 7l3 3 5-6"
        fill="none"
        stroke={white ? "#fff" : "var(--color-red)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M3 8h10M8 3v10" stroke="var(--color-red)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
