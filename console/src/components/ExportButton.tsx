"use client";

import { useState } from "react";

export function ExportButton<T extends object>({ data, filename }: { data: T[]; filename: string }) {
  const [done, setDone] = useState(false);
  const onClick = () => {
    if (!data.length) return;
    const rows = data as unknown as Record<string, unknown>[];
    const cols = Object.keys(rows[0]);
    const escape = (v: unknown) => {
      if (v === null || v === undefined) return "";
      if (Array.isArray(v)) return JSON.stringify(v).replace(/"/g, '""');
      if (typeof v === "object") return JSON.stringify(v).replace(/"/g, '""');
      return String(v).replace(/"/g, '""');
    };
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => `"${escape(r[c])}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[12px] text-[#a1a8b3] hover:text-[#e6e9ef] hover:border-[rgba(255,255,255,0.14)]"
    >
      {done ? "Exported" : "Export CSV"}
    </button>
  );
}
