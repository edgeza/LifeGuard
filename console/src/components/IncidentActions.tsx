"use client";

import { useState } from "react";

export function IncidentActions({ incidentId, status }: { incidentId: string; status: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const ack = async () => {
    setBusy("ack");
    setMsg(null);
    try {
      const r = await fetch(`/api/console/incidents/${incidentId}/ack`, { method: "POST" });
      const j = await r.json();
      setMsg(j.message ?? "Acknowledged.");
    } catch (e) {
      setMsg("Ack failed — network error.");
    } finally { setBusy(null); }
  };
  const voice = async () => {
    setBusy("voice");
    setMsg(null);
    try {
      const r = await fetch(`/api/console/incidents/${incidentId}/voice`, { method: "POST" });
      const j = await r.json();
      setMsg(j.message ?? "Voice session opened.");
    } catch {
      setMsg("Voice failed — network error.");
    } finally { setBusy(null); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={ack}
          disabled={busy !== null || status === "resolved"}
          className="rounded-md bg-[#06b6a4] px-3 py-1.5 text-[12px] font-medium text-[#0a0b0d] hover:bg-[#0d9488] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy === "ack" ? "Acknowledging…" : "Acknowledge"}
        </button>
        <button
          onClick={voice}
          disabled={busy !== null || status === "resolved"}
          className="rounded-md border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[12px] font-medium text-[#e6e9ef] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy === "voice" ? "Opening…" : "Open voice"}
        </button>
        <button
          disabled={busy !== null || status === "resolved"}
          className="rounded-md border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[12px] font-medium text-[#e6e9ef] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Dispatch nearest
        </button>
        <button
          disabled={busy !== null || status === "resolved"}
          className="rounded-md border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[12px] font-medium text-[#e6e9ef] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Notify family
        </button>
        <button
          disabled={busy !== null || status === "resolved"}
          className="rounded-md border border-[rgba(220,38,38,0.45)] bg-[rgba(220,38,38,0.10)] px-3 py-1.5 text-[12px] font-medium text-[#fca5a5] hover:bg-[rgba(220,38,38,0.18)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Mark resolved
        </button>
      </div>
      {msg && <div className="mt-2 text-[11px] text-[#5eead4]">{msg}</div>}
    </div>
  );
}
