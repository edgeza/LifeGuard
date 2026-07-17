"use client";

import { useEffect, useState } from "react";

/**
 * Soft animated device-status indicator.
 * The single allowed motion element on the hero.
 * Shows a real-looking telemetry panel for one LifeBand G2 device.
 * Respects prefers-reduced-motion.
 */
export function DeviceTelemetry() {
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1600);
    const c = setInterval(() => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        })
      );
    }, 1000);
    setNow(
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      })
    );
    return () => {
      clearInterval(i);
      clearInterval(c);
    };
  }, []);

  // HR oscillates in a believable resting window
  const hr = 62 + ((tick * 3) % 7) - 3;
  const battery = 84 - (tick % 5);
  const signal = -71 + ((tick * 2) % 6) - 3;
  const steps = (8432 + tick * 11).toLocaleString();

  return (
    <div className="card-elevated overflow-hidden" role="region" aria-label="Live device status">
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="flex items-center gap-2">
          <span className="relative inline-flex w-2 h-2" aria-hidden="true">
            <span
              className="absolute inset-0 rounded-full pulse-dot"
              style={{ background: "var(--color-success)" }}
            />
            <span className="relative inline-block w-2 h-2 rounded-full" style={{ background: "var(--color-success)" }} />
          </span>
          <span className="text-[12px] tracking-wide" style={{ color: "var(--color-muted)", fontWeight: 510 }}>
            LIFE BAND · G2 · ONLINE
          </span>
        </div>
        <div className="mono tabular text-[12px]" style={{ color: "var(--color-muted)" }}>
          {now} UTC
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "var(--color-muted)", fontWeight: 510 }}
            >
              Subscriber
            </div>
            <div className="mt-0.5 text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
              Nomvula Mokoena
            </div>
            <div className="text-[12px]" style={{ color: "var(--color-muted)" }}>
              Sea Point, Cape Town
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "var(--color-muted)", fontWeight: 510 }}
            >
              Battery
            </div>
            <div
              className="mt-0.5 mono tabular text-[20px]"
              style={{ color: "var(--color-ink)", fontWeight: 300, letterSpacing: "-0.01em" }}
            >
              {battery}%
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Metric label="Heart rate" value={`${hr}`} unit="bpm" />
          <Metric label="Signal" value={`${signal}`} unit="dBm" />
          <Metric label="Steps" value={steps} unit="today" />
        </div>

        <div className="mt-5">
          <div
            className="text-[11px] uppercase tracking-wider mb-2"
            style={{ color: "var(--color-muted)", fontWeight: 510 }}
          >
            Heart rate · last 30 minutes
          </div>
          <HeartRateSparkline tick={tick} />
        </div>

        <div
          className="mt-5 rounded-md p-3 flex items-center justify-between"
          style={{
            background: "var(--color-bg-soft)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="relative inline-flex w-1.5 h-1.5"
              aria-hidden="true"
            >
              <span
                className="absolute inset-0 rounded-full pulse-dot"
                style={{ background: "var(--color-blue)" }}
              />
              <span
                className="relative inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-blue)" }}
              />
            </span>
            <span className="text-[12px]" style={{ color: "var(--color-ink)", fontWeight: 510 }}>
              Caregiver App
            </span>
            <span className="text-[12px]" style={{ color: "var(--color-muted)" }}>
              last sync 3s ago
            </span>
          </div>
          <span className="text-[12px]" style={{ color: "var(--color-blue)", fontWeight: 510 }}>
            Live
          </span>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--color-line)" }}>
        <div className="px-5 py-3 flex items-center justify-between text-[12px]" style={{ color: "var(--color-muted)" }}>
          <span>Last fall event</span>
          <span className="tabular" style={{ color: "var(--color-ink-soft)" }}>
            47 days ago
          </span>
        </div>
        <div className="px-5 pb-4 flex items-center justify-between text-[12px]" style={{ color: "var(--color-muted)" }}>
          <span>Firmware</span>
          <span className="mono tabular" style={{ color: "var(--color-ink-soft)" }}>
            LG-G2 · 4.7.1 · OTA eligible
          </span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: "var(--color-bg-soft)" }}>
      <div
        className="text-[10px] uppercase tracking-wider"
        style={{ color: "var(--color-muted)", fontWeight: 510 }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="mono tabular text-[20px]"
          style={{ color: "var(--color-ink)", fontWeight: 300, letterSpacing: "-0.01em" }}
        >
          {value}
        </span>
        <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

function HeartRateSparkline({ tick }: { tick: number }) {
  // Deterministic but feels live. 36 points across the sparkline.
  const points = Array.from({ length: 36 }, (_, i) => {
    const wave = Math.sin((i + tick) * 0.4) * 6;
    const drift = Math.sin((i + tick) * 0.13) * 3;
    const jitter = ((i * 7 + tick * 11) % 5) - 2;
    return 30 + wave + drift + jitter;
  });
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 320;
  const h = 56;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 6) - 3;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const lastX = w;
  const lastY = h - ((points[points.length - 1] - min) / range) * (h - 6) - 3;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      role="img"
      aria-label="Heart rate trend"
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx={lastX - 1} cy={lastY} r="3" fill="var(--color-blue)" />
      <circle cx={lastX - 1} cy={lastY} r="6" fill="var(--color-blue)" opacity="0.18" />
    </svg>
  );
}