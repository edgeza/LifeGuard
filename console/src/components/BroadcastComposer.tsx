"use client";

import { useState } from "react";

export function BroadcastComposer() {
  const [geofence, setGeofence] = useState("Sandton CBD (radius 2.0 km)");
  const [audience, setAudience] = useState("all_devices");
  const [channels, setChannels] = useState<string[]>(["push", "sms"]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ackRequired, setAckRequired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toggleChannel = (c: string) =>
    setChannels((arr) => (arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]));

  const submit = async () => {
    setBusy(true);
    setResult(null);
    try {
      const r = await fetch("/api/console/broadcast", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ geofence, audience, channels, subject, body, ack_required: ackRequired }),
      });
      const j = await r.json();
      if (j.ok) setResult(`${j.message} Estimated reach: ${j.estimated_reach.toLocaleString()} devices.`);
      else setResult(j.error ?? "Broadcast failed.");
    } catch {
      setResult("Broadcast failed — network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-5 max-w-3xl">
      <h2 className="text-[14px] font-medium text-[#e6e9ef] mb-1">Mass broadcast composer</h2>
      <p className="text-[12px] text-[#a1a8b3] mb-5">Reach every device in a geofence in under 30 seconds. Use sparingly — operators see every broadcast in the audit log.</p>

      <div className="space-y-4">
        <Field label="Geofence">
          <select value={geofence} onChange={(e) => setGeofence(e.target.value)} className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0a0b0d] px-2.5 py-1.5 text-[13px] text-[#e6e9ef]">
            <option>Sandton CBD (radius 2.0 km)</option>
            <option>Rosebank (radius 1.5 km)</option>
            <option>Hyde Park + Dunkeld (radius 1.2 km)</option>
            <option>Lone-worker route: Sandton City</option>
            <option>Lone-worker route: Melrose Arch</option>
            <option>Operator-plan subscribers (all)</option>
            <option>All subscribers (global)</option>
          </select>
        </Field>

        <Field label="Audience">
          <div className="flex flex-wrap gap-2">
            {[
              ["all_devices", "All devices"],
              ["operator_plan", "Operator plan only"],
              ["lone_workers_only", "Lone workers only"],
              ["elderly_only", "Elderly (65+)"],
              ["cardiac_watch", "Cardiac watch list"],
            ].map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setAudience(k)}
                className={
                  "rounded-full border px-3 py-1 text-[12px] font-medium " +
                  (audience === k
                    ? "border-[rgba(6,182,164,0.45)] bg-[rgba(6,182,164,0.10)] text-[#5eead4]"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#a1a8b3] hover:text-[#e6e9ef]")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Channels">
          <div className="flex flex-wrap gap-2">
            {["push", "sms", "voice_clip", "email"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleChannel(c)}
                className={
                  "rounded-full border px-3 py-1 text-[12px] font-medium " +
                  (channels.includes(c)
                    ? "border-[rgba(6,182,164,0.45)] bg-[rgba(6,182,164,0.10)] text-[#5eead4]"
                    : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#a1a8b3] hover:text-[#e6e9ef]")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Subject">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Stage 6 load-shed advisory" className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0a0b0d] px-2.5 py-1.5 text-[13px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" />
        </Field>

        <Field label="Message">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Keep under 160 chars if SMS-only. Plain language. No jargon." className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0a0b0d] px-2.5 py-1.5 text-[13px] text-[#e6e9ef] placeholder:text-[#6b7280] outline-none" />
          <div className="mt-1 text-[10px] text-[#6b7280] text-right">{body.length} chars</div>
        </Field>

        <label className="flex items-center gap-2 text-[12px] text-[#a1a8b3]">
          <input type="checkbox" checked={ackRequired} onChange={(e) => setAckRequired(e.target.checked)} className="accent-[#06b6a4]" />
          Require recipient acknowledgement (operator plan only)
        </label>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={submit}
            disabled={busy || !subject || !body}
            className="rounded-md bg-[#06b6a4] px-4 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? "Queueing…" : "Queue broadcast"}
          </button>
          <span className="text-[11px] text-[#6b7280]">Estimated reach will be shown after queueing.</span>
        </div>

        {result && <div className="rounded-md border border-[rgba(6,182,164,0.45)] bg-[rgba(6,182,164,0.10)] p-3 text-[12px] text-[#5eead4]">{result}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">{label}</div>
      {children}
    </div>
  );
}
