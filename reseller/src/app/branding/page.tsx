"use client";

import { useState } from "react";
import { org } from "@/lib/data";

export default function BrandingPage() {
  const [subdomain, setSubdomain] = useState(org.domain.split(".")[0]);
  const [primary, setPrimary] = useState("#1d4ed8");
  const [accent, setAccent]   = useState("#06b6a4");
  const [bg, setBg]           = useState("#fafafb");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">White-label</p>
        <h1 className="text-h1 font-medium">Branding</h1>
        <p className="text-[13px] text-muted mt-1 max-w-[60ch]">
          Your subdomain, logo, color palette, and email templates are yours. Co-branded hardware is
          available at 500+ MOQ.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
        {/* Form */}
        <div className="space-y-6">
          <Card title="Subdomain" caption="Live in ≤ 5 minutes">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.1em] text-subtle">Subdomain</span>
              <div className="mt-1 flex items-stretch rounded-md border hairline overflow-hidden bg-surface">
                <input
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 h-[36px] px-3 mono"
                />
                <span className="px-3 grid place-items-center bg-line2 text-[12px] text-muted">.lifeguard.io</span>
              </div>
              <p className="text-[12px] text-muted mt-1">DNS auto-managed · TLS provisioned automatically.</p>
            </label>
          </Card>

          <Card title="Logo & wordmark" caption="SVG or PNG · 512×512 min">
            <div className="flex items-center gap-4">
              <div
                className="h-[64px] w-[64px] rounded-md border hairline grid place-items-center"
                style={{ background: "#fff" }}
              >
                <span aria-hidden className="inline-block h-6 w-6 rounded-full border-[2.5px]" style={{ borderColor: primary }} />
              </div>
              <div className="flex items-center gap-2">
                <button className="h-[30px] px-3 rounded-md border hairline text-[13px] hover:bg-bg">Upload</button>
                <button className="h-[30px] px-3 rounded-md text-[13px] text-muted hover:bg-line2">Reset</button>
              </div>
            </div>
          </Card>

          <Card title="Color palette" caption="Primary, accent, surface">
            <div className="grid grid-cols-3 gap-4">
              <Swatch label="Primary" value={primary} onChange={setPrimary} />
              <Swatch label="Accent"  value={accent}  onChange={setAccent} />
              <Swatch label="Surface" value={bg}       onChange={setBg} />
            </div>
          </Card>

          <Card title="Email templates" caption="Onboarding, alerts, weekly summary">
            <ul className="divide-y divide-line2 -mx-5">
              {[
                { name: "Welcome",          enabled: true  },
                { name: "SOS alert",        enabled: true  },
                { name: "Weekly summary",   enabled: true  },
                { name: "Payment failed",   enabled: true  },
                { name: "Plan upgrade",     enabled: false },
              ].map((t) => (
                <li key={t.name} className="px-5 py-3 flex items-center justify-between text-[13px]">
                  <span className="text-ink">{t.name}</span>
                  <Toggle on={t.enabled} />
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <Card title="Live preview" caption="What your customers will see">
            <div className="rounded-md border hairline overflow-hidden" style={{ background: bg }}>
              <div
                className="px-4 h-[44px] flex items-center justify-between text-white"
                style={{ background: primary }}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-white/90" />
                  <span className="text-[13px] font-medium">CityWatch</span>
                </div>
                <span className="text-[11px] opacity-80">family.citywatch.lifeguard.io</span>
              </div>
              <div className="p-5">
                <div className="text-[18px] font-medium text-ink">All good, Sarah.</div>
                <p className="text-[13px] text-muted mt-1">Everyone on your plan is fine.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-white border hairline p-3">
                    <div className="text-[10px] uppercase text-subtle">HR</div>
                    <div className="text-[18px] tabular text-ink">68 bpm</div>
                  </div>
                  <div className="rounded-md bg-white border hairline p-3">
                    <div className="text-[10px] uppercase text-subtle">HRV</div>
                    <div className="text-[18px] tabular text-ink">54 ms</div>
                  </div>
                </div>
                <button
                  className="mt-4 h-[34px] px-4 rounded-md text-white text-[13px]"
                  style={{ background: accent }}
                >
                  Open profile
                </button>
              </div>
            </div>
          </Card>

          <Card title="Co-branded hardware" caption="≥ 500-unit MOQ">
            <p className="text-[13px] text-muted">
              Your logo engraved on LifeBand G2 and LifePendant P2 faceplates. 12-week lead time.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md border hairline p-4 text-center text-[12px] text-muted">
                500 units · 12 weeks
              </div>
              <div className="rounded-md border hairline p-4 text-center text-[12px] text-muted">
                1,000 units · 10 weeks
              </div>
            </div>
            <button className="mt-4 w-full h-[34px] rounded-md border hairline text-[13px] hover:bg-bg">
              Request quote
            </button>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Card({ title, caption, children }: { title: string; caption?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface shadow-card rounded-xl border hairline">
      <div className="px-5 py-4 border-b hairline">
        <h3 className="text-[14px] font-medium">{title}</h3>
        {caption && <p className="text-[12px] text-muted mt-0.5">{caption}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.1em] text-subtle">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[36px] w-[44px] rounded border hairline cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-[36px] px-2 rounded border hairline mono text-[12px]"
        />
      </div>
    </label>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-block h-[18px] w-[30px] rounded-full transition-colors ${on ? "bg-accent" : "bg-line"} relative`}
      aria-checked={on}
      role="switch"
    >
      <span
        className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-transform ${on ? "translate-x-[14px]" : "translate-x-[2px]"}`}
      />
    </span>
  );
}
