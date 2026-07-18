import Link from "next/link";
import { Aurora } from "@/components/Aurora";

export const metadata = {
  title: "404 — LifeGuard",
  description: "That page doesn't exist. Here's where to go instead.",
};

const popularRoutes = [
  { href: "/products",   label: "Hardware",     body: "Three wearables · one firmware image · public REST API." },
  { href: "/pricing",    label: "Pricing",      body: "Four plans, transparent. No contact-sales gating." },
  { href: "/trust",      label: "Trust",        body: "Compliance, coverage, audit trail, encryption." },
  { href: "/integration",label: "Integrations", body: "iOS, Apple Watch, Android, Wear OS, SMS, voice, REST." },
];

export default function NotFound() {
  return (
    <main id="main" className="relative overflow-hidden">
      <Aurora />

      <section className="container-x relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[760px]">
          <div className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
            Error 404
          </div>
          <h1 className="display-xl text-[56px] md:text-[88px] leading-[0.95]" style={{ letterSpacing: "-0.03em" }}>
            <span className="shimmer-text">Off the map.</span>
          </h1>
          <p className="lead mt-6 max-w-[560px]">
            The page you tried to reach doesn&rsquo;t exist, was renamed, or was
            never published. If you followed a link from our docs or a webhook,
            please email{" "}
            <a
              href="mailto:hello@life.guard"
              style={{ color: "var(--color-red)", fontWeight: 600 }}
            >
              hello@life.guard
            </a>{" "}
            so we can fix it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-red btn-lg">Back to home</Link>
            <Link href="/products" className="btn btn-ghost btn-lg">See the hardware</Link>
            <Link href="/docs" className="btn btn-ghost btn-lg">Read the API</Link>
          </div>
        </div>
      </section>

      <section className="container-x relative pb-32">
        <h2 className="text-[12px] uppercase tracking-[0.18em] mb-4" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
          Or jump to a popular page
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularRoutes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="lift-strong card p-5 group"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-red)", fontWeight: 700 }}
                >
                  {r.label}
                </span>
                <span
                  className="text-[14px] transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--color-muted)" }}
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                {r.body}
              </p>
              <code
                className="mono text-[11px] mt-3 block"
                style={{ color: "var(--color-muted)" }}
              >
                lifeguard.example{r.href}
              </code>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-dark py-16">
        <div className="container-x text-center">
          <p className="text-[13px] max-w-[640px] mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            If you&rsquo;re seeing this in production, that&rsquo;s a bug &mdash;
            our 404 page should never render in the normal flow. Email{" "}
            <a
              href="mailto:engineering@life.guard"
              style={{ color: "#fff", fontWeight: 600 }}
            >
              engineering@life.guard
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
