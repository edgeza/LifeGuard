"use client";

/**
 * HomeHero — composed client component for the hero block.
 *
 * Lives at top of page.tsx so we don't have to mark the entire page
 * "use client" (which would break server-side rendering of the
 * marketing pages below the hero).
 */

import Link from "next/link";
import {
  Activity,
  Battery,
  Droplets,
  Footprints,
  Heart,
  Thermometer,
} from "lucide-react";
import ShapeHero from "@/components/ui/shape-hero";
import StatsBar from "@/components/ui/stats-bar";
import DottedMap from "@/components/ui/dotted-map";
import SpotlightCards from "@/components/ui/spotlight-cards";
import { LiveDot } from "@/components/ui/live-sos-indicator";

export function HomeHero() {
  return (
    <ShapeHero
      title1="Medical-grade wearables."
      title2="Help that arrives."
      lead="LifeBand G2, LifePendant P2, LifeClip CG2 — paired with a 99.9% operator console and a public REST API. First-party carriers in ZA, GB, NL and AU."
      eyebrow={
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.78)",
            fontWeight: 500,
          }}
        >
          <LiveDot size={6} className="bg-[#e11d2e]" />
          Shipping this quarter — AI triage on every alert
        </span>
      }
      cta={
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="btn btn-red btn-lg"
            style={{ boxShadow: "0 0 28px rgba(225,29,46,0.35)" }}
          >
            Get started →
          </Link>
          <Link
            href="/products"
            className="btn btn-lg"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#fafafa",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            See the hardware
          </Link>
          <Link
            href="/docs"
            className="btn btn-lg"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            Try the API in 30s
          </Link>
        </div>
      }
    >
      <div className="grid lg:grid-cols-12 gap-10 mt-20 max-w-[1100px] mx-auto px-6 w-full">
        {/* LEFT — stats strip */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <StatsBar
            className="!grid-cols-2 !gap-y-5 !gap-x-5"
            items={[
              { value: "4", label: "First-party carriers", accent: true },
              { value: "99.9%", label: "Operator SLA" },
              { value: "100k", label: "API events / mo" },
              { value: "6", label: "SDK languages" },
              { value: "3", label: "Hardware SKUs" },
            ]}
          />
        </div>

        {/* RIGHT — carriers map + telemetry tiles */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LiveDot size={6} className="bg-[#e11d2e]" />
                <span
                  className="text-[11px] uppercase"
                  style={{
                    letterSpacing: "0.18em",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  First-party carriers · live
                </span>
              </div>
              <span
                className="text-[11px] mono"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                ZA · GB · NL · AU
              </span>
            </div>
            <DottedMap
              width={560}
              height={220}
              mapSamples={4500}
              dotColor="rgba(255,255,255,0.45)"
              markerColor="#e11d2e"
              pulse
              markers={[
                { lat: -33.9, lng: 18.4, size: 2.4 }, // Cape Town (ZA)
                { lat: 51.5, lng: -0.1, size: 2.4 }, // London (GB)
                { lat: 52.4, lng: 4.9, size: 2.2 }, // Amsterdam (NL)
                { lat: -33.9, lng: 151.2, size: 2.4 }, // Sydney (AU)
              ]}
            />
          </div>

          <SpotlightCards
            items={[
              { icon: Heart, title: "Heart rate", description: "72 bpm · resting", color: "#e11d2e" },
              { icon: Droplets, title: "SpO₂", description: "98 % · normal", color: "#3b82f6" },
              { icon: Activity, title: "HRV", description: "64 ms · steady", color: "#a855f7" },
              { icon: Footprints, title: "Steps", description: "8,432 today", color: "#22c55e" },
              { icon: Thermometer, title: "Skin temp", description: "36.7 °C", color: "#f59e0b" },
              { icon: Battery, title: "Battery", description: "84 % · 3 days", color: "#06b6d4" },
            ]}
          />

          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{
              background: "rgba(225,29,46,0.10)",
              border: "1px solid rgba(225,29,46,0.30)",
            }}
          >
            <LiveDot size={8} className="bg-[#e11d2e]" />
            <span
              className="text-[12.5px]"
              style={{ color: "rgba(255,255,255,0.92)", fontWeight: 500 }}
            >
              Fan-out 3s · GPS locked · 5 responders ringing
            </span>
            <span
              className="ml-auto text-[11px] mono"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              just now
            </span>
          </div>
        </div>
      </div>
    </ShapeHero>
  );
}