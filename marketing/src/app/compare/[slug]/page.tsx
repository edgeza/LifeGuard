import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";
import { IconCheck, IconClose } from "@/components/Icons";
import { competitorBySlug, competitors, lifeguard } from "../competitors";

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = competitorBySlug(slug);
  if (!c) return { title: "Not found" };
  return {
    title: `LifeGuard vs ${c.shortName} — comparison`,
    description: `Side-by-side: LifeGuard vs ${c.shortName}. Pricing, hardware, API, compliance, fanout time. Every claim sourced.`,
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = competitorBySlug(slug);
  if (!c) notFound();

  const rows: Array<{ label: string; theirs: string | boolean; ours: string | boolean; wins: "us" | "them" | "tie" }> = [
    {
      label: "Public REST API",
      theirs: c.openApi ? "Yes (gated)" : "No",
      ours: lifeguard.openApi ? "Yes" : "No",
      wins: c.openApi === lifeguard.openApi ? "tie" : lifeguard.openApi ? "us" : "them",
    },
    {
      label: "Open-source SDKs",
      theirs: "No",
      ours: "TypeScript, Python, Go, Ruby, Java, C#",
      wins: "us",
    },
    {
      label: "Cellular data in monthly fee",
      theirs: c.cellData === "included" ? "Included" : "Extra line item",
      ours: lifeguard.cellData === "included" ? "Included" : "Extra line item",
      wins: lifeguard.cellData === "included" && c.cellData !== "included" ? "us" : "tie",
    },
    {
      label: "Fanout speed (target)",
      theirs: c.fanout,
      ours: lifeguard.fanout,
      wins: "tie",
    },
    {
      label: "Operator console",
      theirs: c.console === "windows" ? "Windows desktop app" : c.console === "ios-only" ? "iOS-only app" : c.console === "web" ? "Web app" : "None",
      ours: "Browser-based, no install",
      wins: lifeguard.console === "web" && c.console !== "web" ? "us" : "tie",
    },
    {
      label: "White-label reseller",
      theirs: c.whiteLabel ? "Yes" : "No",
      ours: lifeguard.whiteLabel ? "Yes" : "No",
      wins: lifeguard.whiteLabel && !c.whiteLabel ? "us" : "tie",
    },
    {
      label: "Fallback when Wi-Fi is down",
      theirs: c.fallback === "landline" ? "Landline (PSTN)" : c.fallback === "cellular" ? "Cellular" : "Phone app only",
      ours: "Cellular + Wi-Fi + BT indoor",
      wins: c.fallback === "phone-only" ? "us" : "tie",
    },
    {
      label: "First-party carrier markets",
      theirs: "—",
      ours: "4 (ZA · UK · NL · AU)",
      wins: "us",
    },
  ];

  return (
    <>
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-4">Comparison</div>
          <h1 className="display-xl text-[44px] md:text-[60px]">
            LifeGuard <span style={{ color: "var(--color-red)" }}>vs</span> {c.name}
          </h1>
          <p className="lead mt-6 max-w-[640px]">
            Side-by-side. We&rsquo;d rather you check this against their public
            page than take our word for it. Every claim below links to a source.
          </p>
          <p className="text-[13px] mt-3" style={{ color: "var(--color-muted)" }}>
            {c.category} &middot; founded {c.founded} &middot; HQ {c.hq}
          </p>
        </div>
      </section>

      {/* PRICING & HARDWARE SIDE BY SIDE */}
      <section className="container-x pb-12">
        <div className="grid md:grid-cols-2 gap-3">
          <article className="rounded-2xl p-6 border" style={{ borderColor: "var(--color-line)" }}>
            <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
              {c.shortName}
            </div>
            <div className="text-[15px] mb-4" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              {c.pricing}
            </div>
            <ul className="space-y-2 text-[13px]" style={{ color: "var(--color-body)" }}>
              {c.devices.map((d) => (
                <li key={d.sku} className="flex items-baseline justify-between gap-3">
                  <span>{d.sku}</span>
                  <span className="mono tabular text-[12px]" style={{ color: "var(--color-muted)" }}>
                    {d.msrp}
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <article
            className="rounded-2xl p-6 border"
            style={{ borderColor: "var(--color-red-border)", background: "var(--color-red-tint)" }}
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--color-red-hover)", fontWeight: 700 }}
            >
              LifeGuard (us)
            </div>
            <div className="text-[15px] mb-4" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              {lifeguard.pricing}
            </div>
            <ul className="space-y-2 text-[13px]" style={{ color: "var(--color-ink)" }}>
              {lifeguard.devices.map((d) => (
                <li key={d.sku} className="flex items-baseline justify-between gap-3">
                  <span>{d.sku}</span>
                  <span className="mono tabular text-[12px]" style={{ color: "var(--color-red-hover)", fontWeight: 600 }}>
                    {d.msrp}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ROW-BY-ROW */}
      <section className="container-x pb-16">
        <h2 className="display text-[28px] md:text-[36px] mb-8">Row by row</h2>
        <div
          className="rounded-2xl overflow-hidden border divide-y"
          style={{ borderColor: "var(--color-line)" }}
        >
          {rows.map((r, i) => (
            <MarketingReveal key={r.label} delay={i * 30}>
              <div className="grid grid-cols-12 gap-3 px-5 md:px-6 py-5 items-start">
                <div className="col-span-12 md:col-span-4">
                  <div className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {r.label}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] mb-1" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                    {c.shortName}
                  </div>
                  <div className="text-[13px] flex items-start gap-2" style={{ color: "var(--color-body)" }}>
                    {r.wins === "them" && <IconCheck width={14} height={14} style={{ color: "var(--color-red)", flexShrink: 0, marginTop: 3 }} />}
                    {r.wins === "us" && <IconClose width={14} height={14} style={{ color: "var(--color-muted)", flexShrink: 0, marginTop: 3 }} />}
                    <span>{String(r.theirs)}</span>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] mb-1" style={{ color: "var(--color-red-hover)", fontWeight: 700 }}>
                    LifeGuard
                  </div>
                  <div className="text-[13px] flex items-start gap-2" style={{ color: "var(--color-ink)" }}>
                    {r.wins === "us" && <IconCheck width={14} height={14} style={{ color: "var(--color-red)", flexShrink: 0, marginTop: 3 }} />}
                    {r.wins === "them" && <IconClose width={14} height={14} style={{ color: "var(--color-muted)", flexShrink: 0, marginTop: 3 }} />}
                    <span>{String(r.ours)}</span>
                  </div>
                </div>
              </div>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* WHAT WE'RE HONEST ABOUT */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="display text-[24px] md:text-[32px] mb-4">
                Where they&rsquo;re better than us.
              </h3>
              <ul className="space-y-2 text-[14px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                <li>{c.shortName} has been in the category since {c.founded}. They have brand recognition we don&rsquo;t.</li>
                <li>Established customer base, established trust with insurance reimbursement in some regions.</li>
                <li>Some devices in their range support landline PSTN fallback, which we don&rsquo;t ship.</li>
              </ul>
            </div>
            <div>
              <h3 className="display text-[24px] md:text-[32px] mb-4">
                Where we think we&rsquo;re honestly ahead.
              </h3>
              <ul className="space-y-2 text-[14px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                <li>Open REST API + Webhooks + signed SDKs in 6 languages.</li>
                <li>Operator console runs in the browser. No Windows desktop, no iOS-only lock-in.</li>
                <li>Cellular data included. No separate carrier line item on your bill.</li>
                <li>White-label reseller markup stays with the partner.</li>
                <li>Public changelog, public SLA, public API stability promise.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section className="container-x py-16 md:py-20">
        <h3 className="text-[12px] uppercase tracking-[0.18em] mb-4" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
          Sources
        </h3>
        <ul className="space-y-1.5 text-[13px]">
          {c.sourceLinks.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
                style={{ color: "var(--color-red)", fontWeight: 500 }}
              >
                {s.label}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/trust"
              className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
              style={{ color: "var(--color-red)", fontWeight: 500 }}
            >
              LifeGuard coverage, compliance, SLA &mdash; /trust
            </Link>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="container-x pb-24 text-center">
        <MarketingReveal>
          <h2 className="display text-[28px] md:text-[36px] max-w-[640px] mx-auto">
            Try us against {c.shortName} on a real device.
          </h2>
          <p className="lead mt-4 max-w-[520px] mx-auto">
            30-day sandbox, hardware at cost, full operator console. We&rsquo;ll
            even pay return shipping.
          </p>
          <Link href="/signup" className="btn btn-red btn-lg mt-6">
            Create the sandbox tenant
          </Link>
        </MarketingReveal>
      </section>
    </>
  );
}
