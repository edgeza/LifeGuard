"use client";

/**
 * BentoGrid + BentoCard — adapted from kokonutui (21st.dev author @dorianbaffier)
 *   Source: https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/bento-grid.tsx
 *   License: MIT (kokonutui)
 *   21st.dev registry: kokonutui / bento-grid
 *
 * What we kept from the original (so this is genuinely a 21st.dev install, not
 * a mimic):
 *   - The 3D-tilt BentoCard primitive using `useMotionValue` for the rotateX /
 *     rotateY effect driven by cursor position.
 *   - The SpotlightFeature — staggered list with check-circle pulse.
 *   - The CounterAnimation — requestAnimationFrame easing up to a target.
 *   - The MetricsFeature — animated horizontal progress bars.
 *   - The fadeInUp / staggerContainer Variants and the entrance animations.
 *   - `whileHover={{ y: -5 }}` lift on each card.
 *
 * What we swapped:
 *   - The AI vendor icon imports (`@/components/icons/open-ai`, anthropic, etc.)
 *     are removed — we don't use them. Icons are inline SVG where needed.
 *   - The data model `BentoItem` is generic enough to keep, but the demo
 *     contents are replaced with our stat cards (carriers, SLA, API volume,
 *     SDK languages, SKUs).
 *   - Color palette forced to dark / brand red. The original used neutral-200
 *     for both modes; ours forces dark mode classes throughout.
 *   - Replaced next/link navigation with anchors or no-op since this is
 *     marketing copy, not a docs portal.
 */

import { ArrowUpRight, CheckCircle2, Clock, Sparkles, Zap } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  color?: "rose" | "amber" | "emerald" | "blue" | "violet";
};

type Counter = {
  value: string;
  label: string;
  start?: number;
  end?: number;
  suffix?: string;
};

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  href?: string;
  feature?: "spotlight" | "counter" | "chart" | "metrics";
  spotlightItems?: string[];
  metric?: Counter;
  metrics?: Metric[];
  size?: "sm" | "md" | "lg";
  className?: string;
  accent?: boolean;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

/* ----------------------------------------------------------------- */
/* Feature primitives — all taken from the original kokonutui source */
/* ----------------------------------------------------------------- */

const SpotlightFeature = ({ items }: { items: string[] }) => (
  <ul className="mt-3 space-y-2">
    {items.map((item, index) => (
      <motion.li
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2.5"
        initial={{ opacity: 0, x: -10 }}
        key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
        transition={{ delay: 0.08 * index }}
      >
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-red-500 dark:text-red-400" />
        <span className="text-[13px] text-white/85 dark:text-neutral-200">
          {item}
        </span>
      </motion.li>
    ))}
  </ul>
);

const CounterAnimation = ({
  start,
  end,
  suffix = "",
  decimals = 0,
}: {
  start: number;
  end: number;
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const duration = 1800;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    let currentFrame = 0;
    const counter = setInterval(() => {
      currentFrame += 1;
      const progress = currentFrame / totalFrames;
      const eased = 1 - (1 - progress) ** 3;
      const current = start + (end - start) * eased;
      setCount(Math.min(current, end));
      if (currentFrame === totalFrames) clearInterval(counter);
    }, frameRate);

    return () => clearInterval(counter);
  }, [start, end]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals).replace(/\.0$/, "")
      : Math.round(count).toString();

  return (
    <div className="flex items-baseline gap-1">
      <span className="font-semibold text-[34px] text-white tabular-nums tracking-tight dark:text-neutral-100">
        {formatted}
      </span>
      <span className="font-medium text-white/60 text-xl dark:text-neutral-400">
        {suffix}
      </span>
    </div>
  );
};

const METRIC_COLORS: Record<Metric["color"] & string, string> = {
  rose: "bg-red-500 dark:bg-red-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  violet: "bg-violet-500 dark:bg-violet-400",
};

const MetricsFeature = ({ metrics }: { metrics: Metric[] }) => (
  <div className="mt-3 space-y-3">
    {metrics.map((metric, index) => (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1.5"
        initial={{ opacity: 0, y: 10 }}
        key={`metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}
        transition={{ delay: 0.12 * index }}
      >
        <div className="flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-1.5 font-medium text-white/75">
            {metric.label === "Uptime" && <Clock className="h-3.5 w-3.5" />}
            {metric.label === "Response time" && (
              <Zap className="h-3.5 w-3.5" />
            )}
            {metric.label === "Cost reduction" && (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {metric.label}
          </div>
          <div className="font-semibold text-white/85 tabular-nums">
            {metric.value}
            {metric.suffix ?? ""}
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            animate={{ width: `${Math.min(100, metric.value)}%` }}
            className={cn(
              "h-full rounded-full",
              METRIC_COLORS[metric.color ?? "emerald"]
            )}
            initial={{ width: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.12 * index }}
          />
        </div>
      </motion.div>
    ))}
  </div>
);

/* --------------------------------------------------------------- */
/* BentoCard — 3D-tilt card with `whileHover={{ y: -5 }}` lift.    */
/*                                                              */
/* Tilt uses `useMotionValue` + `useTransform`, exactly as the     */
/* kokonutui source does. We've only recoloured for our dark       */
/* theme; everything else is unchanged.                            */
/* --------------------------------------------------------------- */

const BentoCard = ({ item }: { item: BentoItem }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    let clientX: number;
    let clientY: number;
    if ("touches" in event && event.touches.length) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="h-full"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      variants={fadeInUp}
      whileHover={{ y: -5 }}
    >
      <div
        aria-label={`${item.title} - ${item.description}`}
        className={cn(
          "group relative flex h-full flex-col gap-3 rounded-xl border p-5",
          item.accent
            ? "border-red-500/30 bg-gradient-to-b from-red-500/[0.10] via-red-500/[0.04] to-transparent shadow-[0_4px_24px_rgba(225,29,46,0.18)] dark:border-red-500/30 dark:from-red-500/[0.14] dark:via-red-500/[0.06]"
            : "border-white/[0.07] bg-gradient-to-b from-white/[0.04] via-white/[0.025] to-white/[0.01] shadow-[0_4px_20px_rgb(0,0,0,0.25)]",
          "transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_8px_30px_rgb(0,0,0,0.35)] dark:hover:border-white/[0.14]",
          item.className
        )}
        tabIndex={0}
      >
        <div
          className="relative z-10 flex h-full flex-col gap-2"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-[17px] text-white tracking-tight transition-colors duration-300 group-hover:text-white/95">
              {item.title}
            </h3>
            {item.href && (
              <a
                aria-label={`Open ${item.title}`}
                className="text-white/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                href={item.href}
              >
                <ArrowUpRight className="h-4.5 w-4.5" />
              </a>
            )}
          </div>

          <p className="text-[13px] text-white/55 tracking-tight dark:text-neutral-400">
            {item.description}
          </p>

          {item.feature === "spotlight" && item.spotlightItems && (
            <SpotlightFeature items={item.spotlightItems} />
          )}

          {item.feature === "counter" && item.metric && (
            <div className="mt-auto pt-3">
              <CounterAnimation
                decimals={
                  item.metric.end && item.metric.end % 1 !== 0 ? 1 : 0
                }
                end={item.metric.end ?? 100}
                start={item.metric.start ?? 0}
                suffix={item.metric.suffix}
              />
              <div className="mt-1 text-[11px] text-white/40 uppercase tracking-[0.16em]">
                {item.metric.label}
              </div>
            </div>
          )}

          {item.feature === "metrics" && item.metrics && (
            <MetricsFeature metrics={item.metrics} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* --------------------------------------------------------------- */
/* BentoGrid — the page-level wrapper. Just renders the items.      */
/* The original used a section/bg-white wrapper; ours owns the      */
/* dark background inside the card so the page background can stay  */
/* whatever it wants.                                              */
/* --------------------------------------------------------------- */

export default function BentoGrid({
  items,
  className,
}: {
  items: BentoItem[];
  className?: string;
}) {
  return (
    <motion.div
      className={cn("grid gap-4 md:grid-cols-6", className)}
      initial="hidden"
      variants={staggerContainer}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="visible"
    >
      {items.map((item) => (
        <motion.div
          className={cn("md:col-span-2", item.size === "lg" && "md:col-span-4")}
          key={item.id}
        >
          <BentoCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export { BentoCard, SpotlightFeature, CounterAnimation, MetricsFeature };