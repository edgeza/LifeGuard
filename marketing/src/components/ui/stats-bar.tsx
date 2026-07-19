"use client";

/**
 * StatsBar — adapted from kokonutui (21st.dev author @dorianbaffier)
 *   Source: https://github.com/kokonut-labs/kokonutui/blob/main/components/landing/stats-bar.tsx
 *   License: MIT (kokonutui)
 *   21st.dev registry: kokonutui / stats-bar
 *
 * What we kept:
 *   - The exact "grid-cols-N, centred stat + label below" structural primitive
 *     from the original kokonutui piece.
 *   - The gradient-text value style (`bg-gradient-to-br from-X to-Y/60
 *     bg-clip-text text-transparent`) which is what makes a large number
 *     feel like a Linear-class brand metric.
 *
 * What we swapped:
 *   - The default 4-up / 2-up grid (the original) is now a 5-up flex row
 *     sized for our hero left column — the wide page-level section wrapper
 *     is dropped because the stats live inside the hero now.
 *   - Added an optional `suffix` slot (e.g. "%", "k") so the SLA and SDK
 *     counts can read cleanly without awkward wrapping.
 *   - Forced dark theme (the hero is always dark).
 *   - Numbered `accent` items get the brand red gradient instead of white.
 */

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export interface StatItem {
  value: string;
  label: string;
  accent?: boolean;
  suffix?: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

export default function StatsBar({
  items,
  className,
}: {
  items: StatItem[];
  className?: string;
}) {
  return (
    <motion.dl
      className={cn(
        "grid grid-cols-2 gap-y-6 gap-x-6 sm:grid-cols-3 md:grid-cols-5",
        className
      )}
      initial="hidden"
      variants={stagger}
      viewport={{ once: true, margin: "-40px" }}
      whileInView="visible"
    >
      {items.map((item) => (
        <motion.div
          className="flex flex-col gap-1"
          key={item.label}
          variants={fadeUp}
        >
          <dt
            className={cn(
              "font-semibold text-[26px] tracking-tight tabular-nums leading-none",
              "bg-gradient-to-br bg-clip-text text-transparent",
              item.accent
                ? "from-red-300 to-red-500/70"
                : "from-white to-white/60"
            )}
          >
            {item.value}
            {item.suffix && (
              <span className="ml-0.5 text-[16px] font-medium opacity-80">
                {item.suffix}
              </span>
            )}
          </dt>
          <dd className="text-[11px] text-white/45 uppercase tracking-[0.18em]">
            {item.label}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}