"use client";

import { useState } from "react";
import { user } from "@/lib/data";

export default function SettingsPage() {
  const [tab, setTab] = useState<"plan" | "notifications" | "privacy" | "account">("plan");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[13px] uppercase tracking-[0.14em] text-muted">Account</p>
        <h1 className="text-h1 font-medium mt-1">Settings</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-8">
        {/* Vertical tabs — calm, no tile grid */}
        <nav aria-label="Settings sections" className="md:sticky md:top-[80px] self-start">
          <ul className="bg-white shadow-card rounded-xl border hairline overflow-hidden">
            {[
              { id: "plan", label: "Plan & billing" },
              { id: "notifications", label: "Notifications" },
              { id: "privacy", label: "Privacy & sharing" },
              { id: "account", label: "Account" },
            ].map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`w-full text-left px-4 min-h-tap inline-flex items-center text-[15px] ${
                    tab === t.id ? "bg-bg text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section className="bg-white shadow-card rounded-xl border hairline">
          {tab === "plan" && (
            <>
              <header className="p-6 border-b hairline">
                <h2 className="text-[18px] font-medium">Plan & billing</h2>
                <p className="text-[13px] text-muted mt-0.5">
                  You're on <span className="text-ink font-medium">{user.plan}</span>. Renews {user.renewal}.
                </p>
              </header>
              <div className="p-6 space-y-6">
                <Row k="Monthly price"   v={user.price} />
                <Row k="Devices on plan" v={`${user.devices}`} />
                <Row k="Region"          v={user.region} />
                <Row k="Payment method"  v="Visa •••• 4421" />
                <Row k="Next invoice"    v={`$${user.price.match(/\d+(\.\d+)?/)?.[0]} on ${user.renewal}`} />
                <div className="pt-2 flex items-center gap-3">
                  <button className="min-h-tap px-4 rounded-md bg-ink text-white text-[15px]">Manage payment</button>
                  <button className="min-h-tap px-4 rounded-md border hairline text-[15px] hover:bg-bg">
                    Download invoices
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "notifications" && (
            <>
              <header className="p-6 border-b hairline">
                <h2 className="text-[18px] font-medium">Notifications</h2>
                <p className="text-[13px] text-muted mt-0.5">Choose what reaches you, and how.</p>
              </header>
              <ul className="divide-y divide-line2">
                {[
                  { label: "Fall detected", desc: "Always on — operator and contacts notified in parallel.", on: true, locked: true },
                  { label: "SOS press",     desc: "Always on.", on: true, locked: true },
                  { label: "Low battery",   desc: "Notify me when a device drops below 20%.", on: true },
                  { label: "Weekly summary",desc: "Sunday morning — vitals rollup and any quiet anomalies.", on: true },
                  { label: "Predictive fall-risk badge", desc: "Notify when HRV drift crosses our model threshold.", on: true },
                  { label: "Marketing",     desc: "Product updates and feature releases.", on: false },
                ].map((row) => (
                  <li key={row.label} className="p-5 flex items-center gap-5">
                    <div className="flex-1">
                      <div className="text-[15px] font-medium">{row.label}</div>
                      <div className="text-[13px] text-muted">{row.desc}</div>
                    </div>
                    <Toggle defaultOn={row.on} disabled={row.locked} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "privacy" && (
            <>
              <header className="p-6 border-b hairline">
                <h2 className="text-[18px] font-medium">Privacy & sharing</h2>
                <p className="text-[13px] text-muted mt-0.5">
                  You're in control of every data field. End-to-end encrypted between device and console.
                </p>
              </header>
              <div className="p-6 space-y-5">
                <Privacy k="Share vitals history with my physician" desc="Dr. Mokoena can view HR, HRV, SpO₂, sleep." />
                <Privacy k="Share location with armed response"      desc="Sea Point Neighbourhood Watch sees your location during active incidents." />
                <Privacy k="Anonymised product analytics"            desc="Crash & latency events only. No content." />
                <Privacy k="Family-circle sharing"                   desc="Allow adult children to view vitals read-only." />
              </div>
            </>
          )}

          {tab === "account" && (
            <>
              <header className="p-6 border-b hairline">
                <h2 className="text-[18px] font-medium">Account</h2>
                <p className="text-[13px] text-muted mt-0.5">Profile, security, and account deletion.</p>
              </header>
              <div className="p-6 space-y-5">
                <Row k="Name"    v={user.name} />
                <Row k="Email"   v={user.email} />
                <Row k="2FA"     v="Authenticator app · on" />
                <Row k="Sessions" v="2 active · 1 mobile, 1 web" />
                <div className="pt-2 flex items-center gap-3">
                  <button className="min-h-tap px-4 rounded-md border hairline text-[15px] hover:bg-bg">Change password</button>
                  <button className="min-h-tap px-4 rounded-md text-[15px] text-alert hover:bg-alertSoft">Delete account</button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[180px,1fr] gap-4 items-center text-[15px]">
      <span className="text-muted">{k}</span>
      <span className="text-ink tabular">{v}</span>
    </div>
  );
}

function Toggle({ defaultOn, disabled }: { defaultOn: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => !disabled && setOn((v) => !v)}
      disabled={disabled}
      className={`relative h-[26px] w-[44px] rounded-full transition-colors ${
        on ? "bg-accent" : "bg-line"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span
        className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[20px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function Privacy({ k, desc }: { k: string; desc: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-start gap-5">
      <div className="flex-1">
        <div className="text-[15px] font-medium">{k}</div>
        <div className="text-[13px] text-muted">{desc}</div>
      </div>
      <Toggle defaultOn={on} />
    </div>
  );
}
