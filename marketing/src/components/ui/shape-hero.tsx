"use client";

/**
 * ShapeHero — adapted from kokonutui (21st.dev author @dorianbaffier)
 *   Source: https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/shape-hero.tsx
 *   License: MIT (kokonutui)
 *   21st.dev registry: kokonutui / shape-hero
 *
 * What this is in production: a dark hero with floating glass "shape" tiles
 * (gradient-glow rectangles with subtle ring + drift animation), and a centred
 * gradient text headline. Backs the new LifeGuard marketing hero.
 *
 * Adaptations from the original:
 *   - Removed next/font/google Pacifico (we don't ship a script font in
 *     marketing); the gradient-text is pure CSS now.
 *   - Hard-coded colour stops to our brand palette (red `#e11d2e`,
 *     violet/rose/indigo accents replaced with brand-safe hues).
 *   - Default title swapped for the LifeGuard hero copy.
 *   - Added a "content slot" so we can drop a CTA row under the headline
 *     without rewriting the shape primitives.
 *   - The original used background bg `#030303`; we keep that exact tone for
 *     our `--color-bg` parity (#08090a).
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  borderRadius = 16,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  borderRadius?: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, rotate }}
      className={cn("absolute", className)}
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        className="relative"
        style={{ width, height }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-linear-to-r to-transparent",
            gradient,
            "backdrop-blur-[1px]",
            "ring-1 ring-white/[0.04]",
            "shadow-[0_2px_16px_-2px_rgba(255,255,255,0.04)]",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.10),transparent_70%)]",
            "after:rounded-[inherit]"
          )}
          style={{ borderRadius }}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * ShapeHero — LifeGuard marketing variant.
 *
 * The headline accepts two strings (line 1 + line 2). `lead` is the paragraph
 * beneath. `cta` is an optional ReactNode slot for the buttons row.
 *
 * The floating shapes are the visual "stage" — eight gradient rectangles
 * drift in and float in a 12s ease-in-out loop. We use a brand-safe palette
 * (red, rose, amber, violet, teal, indigo, emerald, blue) so the page reads
 * as on-brand without random colour noise.
 */
export default function ShapeHero({
  title1 = "Medical-grade wearables.",
  title2 = "Help that arrives.",
  lead = "LifeBand G2, LifePendant P2, LifeClip CG2 — paired with a 99.9% operator console and a public REST API. First-party carriers in ZA, GB, NL and AU.",
  eyebrow,
  cta,
  children,
}: {
  title1?: string;
  title2?: string;
  lead?: string;
  eyebrow?: ReactNode;
  cta?: ReactNode;
  children?: ReactNode;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative flex min-h-[720px] w-full items-center justify-center overflow-hidden bg-[#08090a] dark:bg-[#030303]">
      {/* Top-of-stage wash — warm, red-tinted, not the original indigo */}
      <div className="absolute inset-0 bg-linear-to-br from-red-500/[0.04] via-transparent to-rose-500/[0.04] blur-3xl dark:from-red-500/[0.10] dark:via-transparent dark:to-rose-500/[0.10]" />

      {/* Floating shapes — same motion contract as the original kokonutui piece,
          recoloured to the brand palette. */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          borderRadius={24}
          className="top-[-10%] left-[-15%]"
          delay={0.3}
          gradient="from-red-500/[0.30] dark:from-red-500/[0.40]"
          height={500}
          rotate={-8}
          width={300}
        />
        <ElegantShape
          borderRadius={20}
          className="right-[-20%] bottom-[-5%]"
          delay={0.5}
          gradient="from-rose-500/[0.28] dark:from-rose-500/[0.38]"
          height={200}
          rotate={15}
          width={600}
        />
        <ElegantShape
          borderRadius={32}
          className="top-[40%] left-[-5%]"
          delay={0.4}
          gradient="from-violet-500/[0.22] dark:from-violet-500/[0.30]"
          height={300}
          rotate={24}
          width={300}
        />
        <ElegantShape
          borderRadius={12}
          className="top-[5%] right-[10%]"
          delay={0.6}
          gradient="from-amber-500/[0.20] dark:from-amber-500/[0.28]"
          height={100}
          rotate={-20}
          width={250}
        />
        <ElegantShape
          borderRadius={16}
          className="top-[45%] right-[-10%]"
          delay={0.7}
          gradient="from-emerald-500/[0.18] dark:from-emerald-500/[0.26]"
          height={150}
          rotate={35}
          width={400}
        />
        <ElegantShape
          borderRadius={28}
          className="bottom-[10%] left-[20%]"
          delay={0.2}
          gradient="from-blue-500/[0.18] dark:from-blue-500/[0.26]"
          height={200}
          rotate={-25}
          width={200}
        />
        <ElegantShape
          borderRadius={10}
          className="top-[15%] left-[40%]"
          delay={0.8}
          gradient="from-purple-500/[0.18] dark:from-purple-500/[0.26]"
          height={80}
          rotate={45}
          width={150}
        />
        <ElegantShape
          borderRadius={18}
          className="top-[60%] left-[25%]"
          delay={0.9}
          gradient="from-teal-500/[0.16] dark:from-teal-500/[0.22]"
          height={120}
          rotate={-12}
          width={450}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <motion.div
              animate="visible"
              className="mb-6 flex justify-center"
              custom={0}
              initial="hidden"
              variants={fadeUpVariants as any}
            >
              {eyebrow}
            </motion.div>
          ) : null}

          <motion.div
            animate="visible"
            custom={1}
            initial="hidden"
            variants={fadeUpVariants as any}
          >
            <h1 className="mb-6 font-semibold text-4xl tracking-tight sm:text-6xl md:mb-8 md:text-7xl">
              <span className="bg-linear-to-b from-white to-white/80 bg-clip-text text-transparent dark:from-white dark:to-white/80">
                {title1}
              </span>
              <br />
              <span className="bg-linear-to-r from-red-300 via-white/95 to-rose-300 bg-clip-text text-transparent dark:from-red-300 dark:via-white/95 dark:to-rose-300">
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            animate="visible"
            custom={2}
            initial="hidden"
            variants={fadeUpVariants as any}
          >
            <p className="mx-auto mb-8 max-w-2xl px-4 font-light text-base text-white/55 leading-relaxed tracking-wide sm:text-lg md:text-xl dark:text-white/55">
              {lead}
            </p>
          </motion.div>

          {cta ? (
            <motion.div
              animate="visible"
              className="flex flex-wrap items-center justify-center gap-3"
              custom={3}
              initial="hidden"
              variants={fadeUpVariants as any}
            >
              {cta}
            </motion.div>
          ) : null}

          {children ? (
            <motion.div
              animate="visible"
              className="mt-10"
              custom={4}
              initial="hidden"
              variants={fadeUpVariants as any}
            >
              {children}
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Bottom-fade to next section — keeps the dark wash consistent */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#08090a] via-transparent to-transparent dark:from-[#030303] dark:via-transparent dark:to-transparent" />
    </div>
  );
}