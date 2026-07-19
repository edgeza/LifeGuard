"use client";

/**
 * HeroSectionPrebuiltUI — adapted from https://21st.dev/community/components/prebuiltui/hero-section/hero-section-with-animated-navbar
 *
 * Original: black bg, animated navbar, eyebrow pill, gradient headline, dual
 * CTAs, photo row. Adapted for LifeGuard:
 *   - Poppins font imported
 *   - Brand red (#e11d2e) used instead of indigo for primary CTA
 *   - Drop the photo row (we use the existing product card on the right)
 *   - Copy: "When the band presses, the line opens." rewritten to be clear
 *   - Mobile menu state preserved from original
 */

import React from "react";

export default function HeroSectionPrebuiltUI() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        .lg-hero-21 * { font-family: 'Poppins', sans-serif; }
      `}</style>
      <section
        className="lg-hero-21 relative flex flex-col items-center justify-center w-full min-h-[760px] text-white pb-16 pt-8"
        style={{
          background:
            "radial-gradient(ellipse 1200px 600px at 50% 0%, rgba(225,29,46,0.18), transparent 60%), #08090a",
        }}
      >
        {/* eyebrow */}
        <div className="flex items-center gap-2 border border-white/15 rounded-full px-4 py-2 text-sm mt-24 mx-auto">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: "#e11d2e", animation: "lgPulse 2s infinite" }}
          />
          <p className="text-slate-300">Shipping Q3 2026 — AI triage on every alert</p>
          <a href="/trust" className="flex items-center gap-1 font-medium text-white">
            Read more
            <svg className="mt-0.5" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3.959 9.5h11.083m0 0L9.501 3.96m5.541 5.54-5.541 5.542" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* headline */}
        <h1 className="text-5xl md:text-7xl text-center font-semibold max-w-4xl mt-6 bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text tracking-[-0.03em] leading-[1.05]">
          Personal safety, shipped.
        </h1>
        <p className="text-slate-300 md:text-lg max-md:px-2 text-center max-w-2xl mt-5">
          Medical-grade wearables. A 24/7 control-room. A public REST API. One
          product line, one platform, no enterprise contracts.
        </p>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3 mt-9 text-sm max-w-md w-full">
          <a
            href="/signup"
            className="px-8 py-3.5 rounded-full text-center font-medium transition"
            style={{ background: "#e11d2e", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c8111f")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e11d2e")}
          >
            Get started
          </a>
          <a
            href="/products"
            className="flex items-center justify-center gap-2 bg-white/10 border border-white/15 rounded-full px-6 py-3.5 hover:bg-white/15 transition"
          >
            <span>See the hardware</span>
            <svg className="mt-0.5" width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <style>{`
          @keyframes lgPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </section>
    </>
  );
}