"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "lifeguard.cookieConsent.v1";

type State = "unset" | "essential" | "all";

export function CookieBanner() {
  const [state, setState] = useState<State>("unset");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "all" || saved === "essential") setState(saved);
    } catch {
      /* private mode etc. */
    }
  }, []);

  function decide(s: Exclude<State, "unset">) {
    try {
      window.localStorage.setItem(KEY, s);
    } catch { /* ignore */ }
    setState(s);
  }

  if (!mounted || state !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed right-4 bottom-4 z-50 max-w-[380px] w-[calc(100vw-2rem)]"
    >
      <div
        className="rounded-xl p-4 shadow-stripe-3 flex flex-col gap-3"
        style={{
          background: "#0a0a0a",
          color: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex-1">
          <div className="text-[13px]" style={{ fontWeight: 600, color: "#fff" }}>
            We use essential cookies only.
          </div>
          <p
            className="text-[12.5px] mt-1.5 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            No analytics, no third-party trackers, no ad networks. The one
            cookie we set remembers your answer on this device.{" "}
            <Link
              href="/trust#privacy"
              style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              Privacy details
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => decide("essential")}
            className="text-[12px] px-3 py-2 rounded-md"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Essential only
          </button>
          <button
            onClick={() => decide("all")}
            className="text-[12px] px-3 py-2 rounded-md"
            style={{
              background: "var(--color-red)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
