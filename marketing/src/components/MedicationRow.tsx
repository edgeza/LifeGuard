"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * MedicationRow — single medication row with a working
 * "Mark as taken" button. POSTs to /api/care/adherence/confirm,
 * then refreshes the page so the dashboard picks up the new
 * adherence event.
 */
export function MedicationRow({
  id,
  name,
  dosage,
  schedule,
  refillsRemaining,
  adherencePercent,
  confirmedToday,
}: {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  refillsRemaining: number;
  adherencePercent: number;
  confirmedToday: boolean;
}) {
  const router = useRouter();
  const [taken, setTaken] = useState(confirmedToday);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function markTaken() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/care/adherence/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationId: id,
          confirmationSource: "caregiver",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Failed (${res.status})`);
        return;
      }
      setTaken(true);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  const refillWarn = refillsRemaining <= 2;
  const lowAdherence = adherencePercent < 85;

  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center">
      <div className="col-span-12 md:col-span-4">
        <div className="text-[13.5px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
          {name} {dosage}
        </div>
        <div className="text-[11px] mono mt-0.5" style={{ color: "var(--color-muted)" }}>
          {schedule}
        </div>
        {error && (
          <div className="text-[11px] mono mt-1" style={{ color: "var(--color-red)" }}>
            {error}
          </div>
        )}
      </div>

      <div className="col-span-6 md:col-span-2">
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--color-muted)", fontWeight: 600 }}
        >
          Refills left
        </div>
        <div
          className="text-[13px] mt-0.5 mono"
          style={{
            color: refillWarn ? "var(--color-red)" : "var(--color-ink)",
            fontWeight: refillWarn ? 700 : 500,
          }}
        >
          {refillsRemaining}
          {refillWarn && " ⚠"}
        </div>
      </div>

      <div className="col-span-6 md:col-span-4">
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--color-muted)", fontWeight: 600 }}
        >
          Adherence (30d)
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <div
            className="flex-1 h-2 rounded-full overflow-hidden"
            style={{ background: "var(--color-bg-soft)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${adherencePercent}%`,
                background: lowAdherence ? "#fb923c" : "var(--color-red)",
              }}
            />
          </div>
          <span
            className="mono tabular text-[12px]"
            style={{ color: "var(--color-ink)", fontWeight: 700 }}
          >
            {adherencePercent}%
          </span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-2 flex md:justify-end">
        <button
          onClick={markTaken}
          disabled={busy || taken}
          className="btn btn-sm w-full md:w-auto disabled:opacity-60"
          style={{
            background: taken ? "rgba(34,197,94,0.10)" : "var(--color-red)",
            color: taken ? "#15803d" : "#fff",
            border: taken ? "1px solid rgba(34,197,94,0.30)" : "1px solid transparent",
            fontWeight: 600,
          }}
        >
          {busy ? "Logging…" : taken ? "✓ Taken today" : "Mark taken"}
        </button>
      </div>
    </div>
  );
}