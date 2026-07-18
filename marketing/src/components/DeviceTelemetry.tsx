"use client";

import { useEffect, useState } from "react";

/**
 * The hero telemetry card.
 * Single motion-eligible element in the hero. Real-looking LifeBand G2 panel.
 * v2026.07: red/black brand, gradient border, sparkline with correct domain,
 *            staggered reveal of the four stat tiles on first appearance.
 */
export function DeviceTelemetry() {
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState<string>("—");

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1800);
    const c = setInterval(() => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }),
      );
    }, 1000);
    setNow(
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      }),
    );
    return () => {
      clearInterval(i);
      clearInterval(c);
    };
  }, []);

  // Stable, believable signals in resting-HR range.
  const hr     = 64 + ((tick * 3) % 7) - 3;
  const spo2   = Math.min(99, Math.max(94, 96 + ((tick * 2) % 4) - 1));
  const battery = Math.max(46, 86 - (tick % 9));
  const signal  = -71 + ((tick * 2) % 6) - 3;
  const steps   = (8432 + tick * 11).toLocaleString();

  return (
    <div className="aurora-border overflow-hidden">
      <div className="rounded-[20px] bg-white overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--color-line)" }}>
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex w-2 h-2" aria-hidden="true">
              <span className="absolute inset-0 rounded-full pulse-sos" style={{ background: "var(--color-red)" }} />
              <span className="relative inline-block w-2 h-2 rounded-full" style={{ background: "var(--color-red)" }} />
            </span>
            <span className="text-[12px] tracking-wider uppercase" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              LifeBand · G2
            </span>
            <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>Nomvula M.</span>
          </div>
          <div className="mono tabular text-[11px]" style={{ color: "var(--color-muted)" }}>
            {now} UTC
          </div>
        </div>

        {/* Top stats row */}
        <div className="grid grid-cols-4 gap-2 p-4">
          <Stat label="Heart rate" value={`${hr}`}     unit="bpm" delay={tick * 20 % 100} accent="red" />
          <Stat label="SpO₂"        value={`${spo2}`}   unit="%"   delay={(tick + 1) * 20 % 100} accent="red" />
          <Stat label="Battery"     value={`${battery}`} unit="%"   delay={(tick + 2) * 20 % 100} accent="red" />
          <Stat label="Signal"      value={`${signal}`}  unit="dBm" delay={(tick + 3) * 20 % 100} accent="red" />
        </div>

        {/* Sparkline */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
              Heart rate · last 30 min
            </span>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-red)", fontWeight: 600 }}>
              <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-red)" }} />
              Live
            </span>
          </div>
          <HeartRateSparkline tick={tick} />
        </div>

        {/* Caregiver app row */}
        <div
          className="mx-4 mb-4 rounded-lg p-3 flex items-center justify-between"
          style={{
            background: "var(--color-bg-soft)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-7 w-7 rounded-md grid place-items-center text-[10px]"
              style={{ background: "var(--color-red)", color: "#fff", fontWeight: 700 }}
              aria-hidden="true"
            >
              M
            </div>
            <div>
              <div className="text-[12px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Caregiver App
              </div>
              <div className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                last sync 3s ago · steps {steps}
              </div>
            </div>
          </div>
          <span className="text-[11px]" style={{ color: "var(--color-red)", fontWeight: 600 }}>
            ↗ Open
          </span>
        </div>

        {/* System status footer */}
        <div
          className="px-5 py-3 grid grid-cols-3 gap-4 text-[11px]"
          style={{
            background: "var(--color-ink)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <FootCol label="Last fall"       value="47 d ago" />
          <FootCol label="Firmware"        value="LG-G2 · 4.7.1" />
          <FootCol label="SLA target"     value="99.9 %" />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  delay,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  delay: number;
  accent: "red" | "ink";
}) {
  return (
    <div
      className="rounded-lg px-3 py-3 ticker-in"
      style={{
        background: "var(--color-bg-soft)",
        animationDelay: `${delay}ms`,
        border: "1px solid var(--color-line)",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.14em]"
        style={{ color: "var(--color-muted)", fontWeight: 600 }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1 mt-1.5">
        <span
          className="mono tabular text-[22px]"
          style={{
            color: accent === "red" ? "var(--color-red)" : "var(--color-ink)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
        <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

function FootCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
        {label}
      </div>
      <div className="mono tabular mt-1" style={{ color: "#fff", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function HeartRateSparkline({ tick }: { tick: number }) {
  // 48 points, full resting-HR range (50–90 bpm). Spans a 320×64 SVG.
  const points = Array.from({ length: 48 }, (_, i) => {
    const drift  = Math.sin(i * 0.10) * 4;
    const wave   = Math.sin((i + tick) * 0.34) * 6;
    const noise  = (((i * 7 + tick * 13) % 11) - 5) * 0.6;
    return 68 + drift + wave + noise;
  });
  const min   = Math.min(...points);
  const max   = Math.max(...points);
  const range = Math.max(1, max - min);
  const w     = 320;
  const h     = 64;
  const pad   = 6;

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * (w - pad * 2) + pad;
      const y = h - ((p - min) / range) * (h - pad * 2) - pad;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const lastX = w - pad;
  const lastY = h - ((points[points.length - 1] - min) / range) * (h - pad * 2) - pad;

  // Filled area beneath the line.
  const areaPath =
    `M ${pad} ${h - pad} ` +
    points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * (w - pad * 2) + pad;
        const y = h - ((p - min) / range) * (h - pad * 2) - pad;
        return `L ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ") +
    ` L ${lastX.toFixed(2)} ${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      role="img"
      aria-label="Heart rate trend, last 30 minutes"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="hrGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0"   stopColor="#e11d2e" stopOpacity="0.30" />
          <stop offset="0.7" stopColor="#e11d2e" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#hrGrad)" />
      <path
        d={path}
        fill="none"
        stroke="#e11d2e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX - 1} cy={lastY} r="3" fill="#e11d2e" />
      <circle cx={lastX - 1} cy={lastY} r="7" fill="#e11d2e" opacity="0.18" />
    </svg>
  );
}
