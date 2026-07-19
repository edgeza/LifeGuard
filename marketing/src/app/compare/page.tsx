import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";
import { competitors } from "./competitors";

export const metadata = {
  title: "Compare LifeGuard — every claim sourced",
  description:
    "Side-by-side comparisons of LifeGuard against named competitors. Pricing, hardware, API, compliance, fanout time. Every claim is sourced — not 'industry-leading.'",
};

export default function CompareIndexPage() {
  // Group by category
  const byCategory = new Map<string, typeof competitors>();
  for (const c of competitors) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, []);
    byCategory.get(c.category)!.push(c);
  }
  const categories = Array.from(byCategory.keys());

  return (
    <section className="container-x py-24">
      <MarketingReveal>
        <div className="max-w-[720px] mb-12">
          <div className="eyebrow mb-3">Compare</div>
          <h1 className="display text-[40px] md:text-[56px]">
            Every claim, sourced.
          </h1>
          <p className="lead mt-5">
            LifeGuard compared against {competitors.length} named competitors —
            medical alert, lone-worker, EU telecare, smartwatch, security-app.
            Each comparison cites the public source for every cell. No
            "industry-leading," no asterisks.
          </p>
        </div>
      </MarketingReveal>

      <div className="space-y-12">
        {categories.map((cat) => {
          const items = byCategory.get(cat)!;
          return (
            <div key={cat}>
              <div className="flex items-baseline justify-between mb-5">
                <h2
                  className="text-[20px] font-medium tracking-[-0.01em]"
                  style={{ color: "var(--color-ink)" }}
                >
                  {cat}
                </h2>
                <span
                  className="text-[12px] mono uppercase tracking-[0.12em]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {items.length} comparison{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="group block rounded-2xl border p-6 transition-all hover:translate-y-[-2px]"
                    style={{
                      background: "#fff",
                      borderColor: "var(--color-line)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="text-[16px] font-medium tracking-[-0.01em]"
                        style={{ color: "var(--color-ink)" }}
                      >
                        vs {c.shortName}
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-[14px]"
                        style={{ color: "var(--color-muted)" }}
                      >
                        →
                      </span>
                    </div>
                    <div
                      className="text-[12px] mono uppercase tracking-[0.10em] mb-3"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {c.hq} · est. {c.founded}
                    </div>
                    <p
                      className="text-[13.5px] leading-relaxed"
                      style={{ color: "var(--color-body)" }}
                    >
                      {c.pricing}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-[11px] mono">
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{
                          background: c.api === "open" ? "rgba(34,197,94,0.10)" : "rgba(225,29,46,0.08)",
                          color: c.api === "open" ? "#15803d" : "var(--color-red)",
                        }}
                      >
                        API: {c.api}
                      </span>
                      <span style={{ color: "var(--color-muted)" }}>
                        Fanout: {c.fanout}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}