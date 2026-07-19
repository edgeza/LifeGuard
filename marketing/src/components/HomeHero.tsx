"use client";

/**
 * HomeHero — split-layout hero for the LifeGuard home page.
 *
 * Layout: left half is headline + subhead + 3 CTAs + 4-stat row,
 * right half is a large real product photo (LifeBand G2) with
 * subtle ambient lighting.
 *
 * No glass shapes, no gradient text, no parallax, no fancy
 * backgrounds. Pure dark canvas, white headline, brand red
 * accent on the kicker word. Linear/Stripe/Vercel aesthetic.
 */

import Link from "next/link";

export function HomeHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#08090a",
        color: "#fafafa",
      }}
    >
      {/* Single soft radial — top-left, very subtle. No floating shapes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 0%, rgba(225,29,46,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="container-x relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — copy + CTAs + stat row */}
          <div className="lg:col-span-7 relative z-[1]">
            <h1
              className="text-[44px] md:text-[60px] lg:text-[72px]"
              style={{
                fontWeight: 600,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                color: "#fafafa",
              }}
            >
              Personal safety,<br />
              <span style={{ color: "var(--color-red)" }}>shipped.</span>
            </h1>

            <p
              className="mt-7 max-w-[540px] text-[18px] md:text-[19px]"
              style={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.55,
              }}
            >
              LifeBand G2, LifePendant P2, LifeClip CG2. A 99.9% operator
              console. A public REST API. First-party carriers in ZA, GB, NL
              and AU.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="btn btn-red btn-lg"
                style={{ boxShadow: "0 0 28px rgba(225,29,46,0.35)" }}
              >
                Get started
              </Link>
              <Link
                href="/products"
                className="btn btn-lg"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#fafafa",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                See the hardware
              </Link>
              <Link
                href="/docs"
                className="btn btn-lg"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                Try the API
              </Link>
            </div>

            {/* Compact stat row — Linear-class dark, no extra chrome */}
            <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[560px]">
              <Stat label="First-party carriers" value="4" accent />
              <Stat label="Operator SLA" value="99.9%" />
              <Stat label="API events / mo" value="100k" />
              <Stat label="SDK languages" value="6" />
            </dl>
          </div>

          {/* RIGHT — real product photo */}
          <div className="lg:col-span-5 relative z-[1]">
            <img
              src="/photos/lifeband-g2.png"
              alt="LifeBand G2 wearable showing 72 BPM heart rate"
              className="w-full h-auto block"
              width="800"
              height="900"
              loading="eager"
              style={{
                filter: "drop-shadow(0 40px 60px rgba(225,29,46,0.18))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className="text-[28px] md:text-[32px]"
        style={{
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: accent ? "var(--color-red)" : "#fafafa",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        className="text-[12px] mt-1.5 uppercase tracking-[0.12em]"
        style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}
      >
        {label}
      </div>
    </div>
  );
}