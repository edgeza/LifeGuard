import Link from "next/link";
import { notFound } from "next/navigation";
import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { IncidentActions } from "@/components/IncidentActions";
import { statusColor, aiScoreColor, formatTime, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadData();
  const inc = data.incidents.find((i) => i.id === id);
  if (!inc) notFound();

  const device = data.devices.find((d) => d.id === inc.device_id);
  const responder = inc.responder_dispatched ? data.responders.find((r) => r.id === inc.responder_dispatched) : null;
  const sc = statusColor(inc.status);
  const aic = aiScoreColor(inc.ai_score);

  const incidentAudit = data.audit.filter((a) => a.subject.includes(inc.id) || (responder && a.subject.includes(responder.callsign)));

  return (
    <AppShell
      title={`Incident ${inc.id}`}
      subtitle={`Opened ${formatDateShort(inc.opened_at)} ${formatTime(inc.opened_at)} · ${inc.wearer}`}
      right={
        <div className="flex items-center gap-2">
          <Link href="/incidents" className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[12px] text-[#a1a8b3] hover:text-[#e6e9ef]">
            ← All incidents
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_320px] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <section className="overflow-y-auto p-6 space-y-6">
          {/* Header card */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">Wearer</div>
                <div className="text-[18px] font-medium text-[#e6e9ef]">{inc.wearer}</div>
                <div className="text-[12px] text-[#a1a8b3]">{inc.address}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">Trigger</div>
                <div className="text-[14px] text-[#e6e9ef]">{inc.trigger}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">Status</div>
                <span className="mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium" style={{ borderColor: sc.ring, background: sc.bg, color: sc.text }}>
                  {inc.status}
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">AI score</div>
                <div className="mono text-[24px] font-medium tabular" style={{ color: aic }}>{inc.ai_score.toFixed(2)}</div>
              </div>
              {responder && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">Responder</div>
                  <div className="text-[14px] text-[#e6e9ef]">{responder.callsign}</div>
                  <div className="text-[11px] text-[#6b7280]">{responder.crew.join(", ")} · {responder.vehicle}</div>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[11px]">
              <Metric label="Opened" value={`${formatDateShort(inc.opened_at)} ${formatTime(inc.opened_at)}`} />
              <Metric label="Acked" value={inc.acked_at ? `${formatTime(inc.acked_at)} · ${inc.acked_by}` : "—"} />
              <Metric label="Voice" value={inc.voice_session ?? "—"} />
              <Metric label="ETA" value={inc.responder_eta_min !== null ? `${inc.responder_eta_min} min` : "—"} />
            </div>

            <div className="mt-4">
              <IncidentActions incidentId={inc.id} status={inc.status} />
            </div>
          </div>

          {/* AI Signals */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">AI classifier — 7 signals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                "sustained_press", "hr_spike_138", "no_motion_after", "low_ambient_sound", "device_unmoving", "free_fall_420ms", "impact_8.4g", "skin_temp_drop",
              ].map((sig, idx) => {
                const on = inc.ai_signals.includes(sig);
                return (
                  <div key={sig} className={
                    "rounded-md border px-2.5 py-2 text-[11px] " +
                    (on
                      ? "border-[rgba(6,182,164,0.45)] bg-[rgba(6,182,164,0.08)] text-[#5eead4]"
                      : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-[#6b7280]")
                  }>
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">{sig}</span>
                      <span className="mono text-[9px] tabular">w{0.12 + idx * 0.08}</span>
                    </div>
                    <div className="text-[10px] text-[#6b7280] mt-0.5">{on ? "triggered" : "absent"}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Timeline</h2>
            <ol className="space-y-2">
              {inc.timeline.map((e, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <span className={"h-1.5 w-1.5 rounded-full " + (e.type === "ack" || e.type === "dispatch" || e.type === "scene" ? "bg-[#06b6a4]" : e.type === "resolve" ? "bg-[#10b981]" : "bg-[#6b7280]")} />
                    {idx < inc.timeline.length - 1 && <span className="mt-0.5 h-6 w-px bg-[rgba(255,255,255,0.06)]" />}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="mono text-[11px] tabular text-[#6b7280]">{e.t}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#6b7280]">{e.type}</span>
                    </div>
                    <div className="text-[13px] text-[#e6e9ef]">{e.text}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Voice transcript */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">Voice transcript</h2>
              <span className={"rounded-full border px-2 py-0.5 text-[10px] font-medium " + (inc.voice_session ? "border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.10)] text-[#6ee7b7]" : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#6b7280]")}>
                {inc.voice_session ?? "no session"}
              </span>
            </div>
            {inc.voice_session ? (
              <div className="space-y-2 text-[13px]">
                <VoiceLine who="operator" at={formatTime(inc.acked_at ?? inc.opened_at)} text={`${inc.wearer.split(" ")[0]}, this is K. Nkosi from CityWatch Armed Response. Can you hear me?`} />
                <VoiceLine who="device" at={formatTime(new Date(new Date(inc.acked_at ?? inc.opened_at).getTime() + 7000).toISOString())} text="Yes — yes I can. I fell in the bathroom. I can't get up." />
                <VoiceLine who="operator" at={formatTime(new Date(new Date(inc.acked_at ?? inc.opened_at).getTime() + 19000).toISOString())} text="OK. Stay still. Charlie-03 is 3 minutes out. Are you in pain?" />
                <VoiceLine who="device" at={formatTime(new Date(new Date(inc.acked_at ?? inc.opened_at).getTime() + 29000).toISOString())} text="My hip. A little. But I'm conscious." />
                <VoiceLine who="operator" at={formatTime(new Date(new Date(inc.acked_at ?? inc.opened_at).getTime() + 38000).toISOString())} text="Good. Netcare 911 is also being notified. Help is coming." />
              </div>
            ) : (
              <div className="text-[12px] text-[#6b7280]">No voice session was opened for this incident.</div>
            )}
          </div>

          {/* Audit slice */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Audit trail (this incident)</h2>
            {incidentAudit.length > 0 ? (
              <ul className="divide-y divide-[rgba(255,255,255,0.04)]">
                {incidentAudit.map((a) => (
                  <li key={a.id} className="grid grid-cols-[110px_140px_1fr_120px] gap-3 py-2 text-[12px]">
                    <span className="mono tabular text-[11px] text-[#6b7280]">{formatTime(a.ts)}</span>
                    <span className="text-[#a1a8b3]">{a.actor}</span>
                    <span className="text-[#e6e9ef]"><span className="text-[#06b6a4]">{a.action}</span> · {a.subject}</span>
                    <span className="mono text-[10px] text-[#6b7280] tabular text-right">{a.hash}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[12px] text-[#6b7280]">No audit entries reference this incident yet.</div>
            )}
          </div>
        </section>

        {/* RIGHT — comms */}
        <aside className="overflow-y-auto p-5 space-y-5">
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Device</h3>
            {device ? (
              <div className="space-y-2 text-[12px]">
                <Row k="Kind" v={device.kind} />
                <Row k="ID" v={device.id} mono />
                <Row k="Battery" v={device.battery !== null ? `${device.battery}%` : "—"} />
                <Row k="Signal" v={`${device.signal}/5`} />
                <Row k="Last seen" v={`${device.last_seen_min}m ago`} />
                <Row k="Watcher" v={device.watcher} />
              </div>
            ) : <div className="text-[12px] text-[#6b7280]">Device not found.</div>}
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Contacts notified</h3>
            <ul className="space-y-1.5">
              {inc.contacts_notified.map((c, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-[12px]">
                  <div>
                    <div className="text-[#e6e9ef]">{c.name}</div>
                    <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">{c.channel}</div>
                  </div>
                  <span className={"rounded-full border px-2 py-0.5 text-[10px] font-medium " + (c.ack ? "border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.10)] text-[#6ee7b7]" : "border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.10)] text-[#fbbf24]")}>
                    {c.ack ? "ack" : "pending"}
                  </span>
                </li>
              ))}
              {inc.contacts_notified.length === 0 && <li className="text-[12px] text-[#6b7280]">No contacts notified.</li>}
            </ul>
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280] mb-3">Operator chat</h3>
            <div className="space-y-1.5">
              <ChatLine who="K. Nkosi" at={formatTime(inc.opened_at)} text="Dispatching nearest responder." />
              <ChatLine who="T. Mahlangu" at={formatTime(new Date(new Date(inc.opened_at).getTime() + 60_000).toISOString())} text="Confirming daughter contact on phone." />
              <ChatLine who="K. Nkosi" at={formatTime(new Date(new Date(inc.opened_at).getTime() + 120_000).toISOString())} text="Netcare 911 on the line." />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input className="flex-1 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2 py-1.5 text-[12px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" placeholder="Message ops team…" />
              <button className="rounded-md bg-[#06b6a4] px-2.5 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488]">Send</button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f1114] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[#6b7280]">{label}</div>
      <div className="text-[12px] text-[#e6e9ef]">{value}</div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] uppercase tracking-wider text-[#6b7280]">{k}</span>
      <span className={(mono ? "mono tabular " : "") + "text-[12px] text-[#e6e9ef]"}>{v}</span>
    </div>
  );
}

function VoiceLine({ who, at, text }: { who: "operator" | "device"; at: string; text: string }) {
  return (
    <div className={"flex items-start gap-3 " + (who === "operator" ? "" : "flex-row-reverse text-right")}>
      <span className={"shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium " + (who === "operator" ? "border-[rgba(6,182,164,0.45)] bg-[rgba(6,182,164,0.10)] text-[#5eead4]" : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#a1a8b3]")}>
        {who}
      </span>
      <div>
        <div className="mono text-[10px] text-[#6b7280] tabular">{at}</div>
        <div className="text-[13px] text-[#e6e9ef]">{text}</div>
      </div>
    </div>
  );
}

function ChatLine({ who, at, text }: { who: string; at: string; text: string }) {
  return (
    <div className="text-[12px]">
      <span className="text-[#a1a8b3] font-medium">{who}</span>
      <span className="ml-2 mono text-[10px] text-[#6b7280] tabular">{at}</span>
      <div className="text-[#e6e9ef]">{text}</div>
    </div>
  );
}
