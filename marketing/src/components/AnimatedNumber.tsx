"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AnimatedNumber — counts up to a target value when the element first
 * enters the viewport. Once-only (does not retrigger on scroll up).
 * Supports decimal places, suffix, and formatting.
 */
export function AnimatedNumber({
  to,
  from = 0,
  durationMs = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
}: {
  to: number;
  from?: number;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
  className?: string;
}) {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      fired.current = true;
      run(from, to, durationMs, decimals, setValue);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            run(from, to, durationMs, decimals, setValue);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [from, to, durationMs, decimals]);

  const display = format ? format(value) : value.toFixed(decimals);

  return (
    <span ref={ref} className={`tabular-num ${className ?? ""}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function run(
  from: number,
  to: number,
  durationMs: number,
  decimals: number,
  set: (n: number) => void,
) {
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  function frame(now: number) {
    const t = Math.min(1, (now - start) / durationMs);
    const v = from + (to - from) * ease(t);
    set(parseFloat(v.toFixed(decimals)));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
