"use client";

import { useState } from "react";
import { team, auditLog } from "@/lib/data";

const ROLES = ["Owner", "Admin", "Dispatcher", "Billing", "Read-only"] as const;
type Role = typeof ROLES[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<"team" | "audit" | "security">("team");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">Account</p>
        <h1 className="text-h1 font-medium">Team & settings</h1>
      </header>

      <nav className="bg-surface shadow-card rounded-xl border hairline overflow-hidden inline-flex">
        {[
          { id: "team",     label: "Team" },
          { id: "audit",    label: "Audit log" },
          { id: "security", label: "Security & SSO" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 h-[36px] text-[13px] ${
              tab === t.id ? "bg-bg text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "team" && (
        <section className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-medium">Team</h2>
              <p className="text-[12px] text-muted">Invite teammates and assign roles.</p>
            </div>
            <button className="h-[30px] px-3 rounded-md bg-accent text-white text-[13px]">+ Invite</button>
          </div>
          <table className="w-full text-[13px]">
            <thead className="bg-bg text-muted">
              <tr>
                <th className="text-left font-normal px-5 py-2">Name</th>
                <th className="text-left font-normal px-3 py-2">Email</th>
                <th className="text-left font-normal px-3 py-2">Role</th>
                <th className="text-left font-normal px-3 py-2">Last active</th>
                <th className="w-[1%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line2">
              {team.map((u) => (
                <tr key={u.id} className="hover:bg-bg">
                  <td className="px-5 py-3 text-ink">{u.name}</td>
                  <td className="px-3 py-3 text-muted mono text-[12px]">{u.email}</td>
                  <td className="px-3 py-3">
                    <RoleSelect defaultRole={u.role as Role} />
                  </td>
                  <td className="px-3 py-3 text-muted">{u.lastActive}</td>
                  <td className="px-3 py-3">
                    <button className="text-alert text-[12px] hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "audit" && (
        <section className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-medium">Audit log</h2>
              <p className="text-[12px] text-muted">7-year immutable retention · lorem sample</p>
            </div>
            <button className="h-[30px] px-3 rounded-md border hairline text-[13px] hover:bg-bg">Export JSONL</button>
          </div>
          <ul className="divide-y divide-line2">
            {auditLog.map((row, i) => (
              <li key={i} className="px-5 py-3 grid grid-cols-[140px,140px,1fr,1fr] gap-3 text-[13px]">
                <span className="text-muted tabular">{row.ts}</span>
                <span className="mono text-ink">{row.actor}</span>
                <span className="text-ink">{row.action}</span>
                <span className="mono text-[11px] text-muted">{row.target}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "security" && (
        <section className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline">
            <h2 className="text-[14px] font-medium">Security & SSO</h2>
            <p className="text-[12px] text-muted">SAML 2.0 and OIDC supported.</p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px]">
            <Sec k="SSO (SAML 2.0 / OIDC)" v="Connected · Okta" />
            <Sec k="SCIM provisioning"    v="On · auto-deprovision on leave" />
            <Sec k="2FA enforcement"      v="Required for all roles" />
            <Sec k="IP allow-list"        v="3 ranges · lorem" />
            <Sec k="Session timeout"      v="8 hours" />
            <Sec k="API key rotation"     v="Auto-rotate every 90 days" />
          </div>
        </section>
      )}
    </div>
  );
}

function RoleSelect({ defaultRole }: { defaultRole: string }) {
  const [r, setR] = useState(defaultRole);
  return (
    <select
      value={r}
      onChange={(e) => setR(e.target.value)}
      className="h-[28px] px-2 rounded border hairline bg-surface text-[12px]"
    >
      {ROLES.map((x) => <option key={x} value={x}>{x}</option>)}
    </select>
  );
}

function Sec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border hairline rounded-md px-4 py-3 bg-bg">
      <span className="text-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
