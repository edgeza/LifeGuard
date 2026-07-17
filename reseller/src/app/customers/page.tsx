"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { customers, type Customer } from "@/lib/data";

const STATUS_TONE: Record<Customer["status"], "ok" | "warn" | "alert" | "accent"> = {
  active: "ok",
  trialing: "accent",
  past_due: "warn",
  churned: "alert",
};
import { Pill } from "@/components/Charts";

export default function CustomersPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Customer["status"]>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return [c.name, c.email, c.id].some((s) => s.toLowerCase().includes(needle));
    });
  }, [q, statusFilter]);

  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  function toggleAll() {
    setSelected((s) => {
      const next = new Set(s);
      if (allChecked) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });
  }
  function toggleRow(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">{rows.length} of {customers.length}</p>
          <h1 className="text-h1 font-medium">Customers</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[30px] px-3 rounded-md border hairline bg-surface text-[13px]">Export CSV</button>
          <button className="h-[30px] px-3 rounded-md bg-accent text-white text-[13px] hover:bg-accentHover">+ Add customer</button>
        </div>
      </header>

      <section className="bg-surface shadow-card rounded-xl border hairline">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b hairline flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              aria-label="Select all"
              className="h-4 w-4 accent-accent"
            />
            {selected.size > 0 ? (
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-muted">{selected.size} selected</span>
                <button className="h-[26px] px-2 rounded border hairline hover:bg-bg">Send email</button>
                <button className="h-[26px] px-2 rounded border hairline hover:bg-bg">Change plan</button>
                <button className="h-[26px] px-2 rounded text-alert hover:bg-[#fee2e2]">Suspend</button>
              </div>
            ) : (
              <span className="text-[12px] text-muted">No selection</span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <input
              type="search"
              placeholder="Search by name, email, ID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-[30px] px-3 rounded-md border hairline bg-surface text-[13px] w-[260px]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-[30px] px-2 rounded-md border hairline bg-surface text-[13px]"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past due</option>
              <option value="churned">Churned</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-bg text-muted">
              <tr className="border-b hairline">
                <th className="px-4 py-2 w-[34px]"></th>
                <th className="text-left font-normal px-3 py-2">Customer</th>
                <th className="text-left font-normal px-3 py-2">Plan</th>
                <th className="text-right font-normal px-3 py-2 tabular">Devices</th>
                <th className="text-right font-normal px-3 py-2 tabular">MRR</th>
                <th className="text-left font-normal px-3 py-2">Region</th>
                <th className="text-left font-normal px-3 py-2">Status</th>
                <th className="text-right font-normal px-3 py-2 tabular">Alerts 30d</th>
                <th className="text-left font-normal px-3 py-2">Started</th>
                <th className="w-[1%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line2">
              {rows.map((c) => {
                const checked = selected.has(c.id);
                return (
                  <tr key={c.id} className={checked ? "bg-accentSoft" : "hover:bg-bg"}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRow(c.id)}
                        aria-label={`Select ${c.name}`}
                        className="h-4 w-4 accent-accent"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-ink">{c.name}</div>
                      <div className="text-[11px] text-muted">{c.email}</div>
                    </td>
                    <td className="px-3 py-3 text-muted">{c.plan}</td>
                    <td className="px-3 py-3 text-right tabular">{c.devices}</td>
                    <td className="px-3 py-3 text-right tabular">R{c.mrr.toLocaleString()}</td>
                    <td className="px-3 py-3 text-muted">{c.region}</td>
                    <td className="px-3 py-3">
                      <Pill tone={STATUS_TONE[c.status]}>{c.status.replace("_", " ")}</Pill>
                    </td>
                    <td className="px-3 py-3 text-right tabular">{c.alerts30d}</td>
                    <td className="px-3 py-3 text-muted tabular">{c.started}</td>
                    <td className="px-3 py-3">
                      <Link href={`/customers/${c.id}`} className="text-accent text-[12px] hover:underline">Open</Link>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-muted text-[13px]">
                    No customers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t hairline flex items-center justify-between text-[12px] text-muted">
          <span>Showing {rows.length} of {customers.length}</span>
          <div className="flex items-center gap-2">
            <button className="h-[26px] px-2 rounded border hairline text-muted" disabled>‹ Prev</button>
            <button className="h-[26px] px-2 rounded border hairline text-muted">Next ›</button>
          </div>
        </div>
      </section>
    </div>
  );
}
