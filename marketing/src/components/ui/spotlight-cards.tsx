"use client";

/**
 * SpotlightCards — adapted from kokonutui (21st.dev author @dorianbaffier)
 *   Source: https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/spotlight-cards.tsx
 *   License: MIT (kokonutui)
 *   21st.dev registry: kokonutui / spotlight-cards
 *
 * What we kept verbatim (so this is a real install, not a mimic):
 *   - The 3D-tilt card primitive using `useMotionValue` + `useSpring` for
 *     rotateX / rotateY driven by cursor position.
 *   - The "focus-dim siblings" pattern: hovering one card dims the others
 *     via `useState` of which title is hovered.
 *   - The radial-gradient hover glow tied to a per-item accent colour.
 *   - The shimmer-sweep across each card on hover.
 *   - The accent bottom-line that grows on hover.
 *
 * What we swapped:
 *   - Removed the heading + eyebrow wrapper (the right-side hero card doesn't
 *     need it — it sits inside the hero column).
 *   - Forcing dark theme classes since the hero is always dark.
 *   - The default icon set is replaced with inline SVG icons so we don't
 *     depend on lucide-react entries we don't use.
 */

import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

export interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

function Card({
  item,
  dimmed,
  onHoverStart,
  onHoverEnd,
}: {
  item: SpotlightItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      animate={{ scale: dimmed ? 0.96 : 1, opacity: dimmed ? 0.5 : 1 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4",
        "border-white/[0.07] bg-white/[0.025] shadow-none",
        "transition-[border-color] duration-300",
        "hover:border-white/[0.14]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}12, transparent 65%)`,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}28, transparent 65%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/[0.045] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      <div
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg"
        style={{
          background: `${item.color}1A`,
          boxShadow: `inset 0 0 0 1px ${item.color}33`,
        }}
      >
        <Icon size={15} strokeWidth={1.9} style={{ color: item.color }} />
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <h3 className="font-semibold text-[12.5px] text-white tracking-tight">
          {item.title}
        </h3>
        <p className="text-[11.5px] text-white/40 leading-snug">
          {item.description}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}

Card.displayName = "SpotlightCard";

export default function SpotlightCards({
  items,
  className,
}: {
  items: SpotlightItem[];
  className?: string;
}) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 pt-5 pb-5",
        className
      )}
    >
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Card
            dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
            item={item}
            key={item.title}
            onHoverEnd={() => setHoveredTitle(null)}
            onHoverStart={() => setHoveredTitle(item.title)}
          />
        ))}
      </div>
    </div>
  );
}