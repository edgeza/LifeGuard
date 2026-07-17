import Link from "next/link";
import { alerts, devices } from "@/lib/data";

export default function AlertPage() {
  const a = alerts[0];
  const subject = devices.find((d) => d.id === a.deviceId)!;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[13px] uppercase tracking-[0.14em] text-warn">Auto-resolved</p>
        <h1 className="text-h1 font-medium mt-1">{a.type}</h1>
        <p className="text-muted mt-1">
          {subject.name} · {a.triggeredAt} · resolved {a.resolvedAt?.split(" ")[1]} ·{" "}
          <Link href={`/device/${subject.id}`} className="text-accentInk hover:underline">open profile</Link>
        </p>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-6">
        <div className="bg-white shadow-card rounded-xl border hairline">
          <div className="p-6 border-b hairline">
            <h2 className="text-[18px] font-medium">Summary</h2>
            <p className="text-[13px] text-muted mt-0.5">
              We treat false positives as a feature: this alert scored low on the AI triage and was
              therefore not escalated to a human operator.
            </p>
          </div>
          <dl className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-[14px]">
            <Stat k="Trigger"           v={a.type} />
            <Stat k="Triggered at"      v={a.triggeredAt} />
            <Stat k="Resolved at"       v={a.resolvedAt ?? "—"} />
            <Stat k="Location"          v={a.locationLabel} />
            <Stat k="Triage score"      v={`${a.triageScore} / 100`} />
            <Stat k="Responder"         v={a.responder} />
            <Stat k="Contacts notified" v={`${a.contactsNotified}`} />
            <Stat k="Contacts acked"    v={`${a.contactsAcked}`} />
            <Stat k="Resolution time"   v="3 min 48 s" />
          </dl>
        </div>

        <aside className="bg-white shadow-card rounded-xl border hairline">
          <div className="p-5 border-b hairline">
            <h3 className="text-[15px] font-medium">Why this was quiet</h3>
            <p className="text-[13px] text-muted mt-0.5">7-signal AI triage</p>
          </div>
          <ul className="p-5 space-y-3 text-[14px]">
            <Signal label="Button press pattern"    value="No press"            ok />
            <Signal label="Motion preceding"        value="Walk → bend → impact" />
            <Signal label="G-force"                 value="0.85g" />
            <Signal label="HR spike"                value="+6 bpm"             ok />
            <Signal label="Ambient sound"           value="Tile + tap" />
            <Signal label="Prior history (30 d)"    value="Similar events: 0"  ok />
            <Signal label="Location delta"          value="Bathroom → standing 4s" />
          </ul>
        </aside>
      </section>

      {/* Post-event action log */}
      <section className="bg-white shadow-card rounded-xl border hairline">
        <div className="p-6 border-b hairline flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-medium">Action log</h2>
            <p className="text-[13px] text-muted mt-0.5">Audit-grade · immutable · 7-year retention.</p>
          </div>
          <button className="min-h-tap px-4 rounded-md border hairline text-[14px] hover:bg-bg">Download JSON</button>
        </div>
        <ol className="divide-y divide-line2">
          {a.actions.map((s, i) => (
            <li key={i} className="p-5 flex items-start gap-4">
              <time className="text-[13px] text-muted tabular w-[80px] flex-none pt-0.5">{s.ts}</time>
              <span className="mt-1.5 h-[8px] w-[8px] rounded-full bg-accent flex-none" aria-hidden />
              <div className="flex-1">
                <div className="text-[15px] font-medium">{s.action}</div>
                <div className="text-[13px] text-muted">Actor: {s.actor}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-[0.1em] text-subtle">{k}</dt>
      <dd className="text-ink mt-1 tabular">{v}</dd>
    </div>
  );
}

function Signal({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={`tabular ${ok ? "text-ok" : "text-ink"}`}>
        {value}
      </span>
    </li>
  );
}
