"use client";

/**
 * LiveSOSIndicator — small "live" pill with pulsing dot + optional metrics.
 *
 * Not from 21st.dev — this is our own composition. The pulse uses a CSS keyframe
 * defined in globals.css (`@keyframes pulse-sos`) so we don't burn a `motion`
 * animation cycle on it.
 */

import { cn } from "@/lib/utils";

export function LiveDot({
  size = 8,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("pulse-sos inline-block rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: "currentColor",
      }}
    />
  );
}

export function LiveSOSIndicator({
  label,
  trailing,
  tone = "red",
  className,
}: {
  label: string;
  trailing?: string;
  tone?: "red" | "amber" | "green";
  className?: string;
}) {
  const color =
    tone === "red"
      ? "text-[#e11d2e]"
      : tone === "amber"
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-xl px-3 py-2.5",
        "border border-white/[0.07] bg-white/[0.025]",
        className
      )}
    >
      <LiveDot size={8} className={color} />
      <span className="text-[12.5px] text-white/90 font-medium">{label}</span>
      {trailing ? (
        <span className="ml-auto text-[11px] text-white/45 tracking-wide tabular-nums">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}