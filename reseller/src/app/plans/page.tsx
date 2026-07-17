"use client";

import { useState } from "react";
import { plans as seed, bundles, type Plan } from "@/lib/data";

export default function PlansPage() {
  const [list, setList] = useState<Plan[]>(seed);
  const [marginInput, setMarginInput] = useState({ wholesale: 199, retail: 349 });

  const calcMargin = (w: number, r: number) => {
    if (r <= 0) return 0;
    return Math.round(((r - w) / r) * 100);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">{list.length} plans · {bundles.length} bundle SKUs</p>
          <h1 className="text-h1 font-medium">Plans & bundles</h1>
          <p className="text-[13px] text-muted mt-1 max-w-[60ch]">
            Set your retail price; we bill you at wholesale. The margin stays with you.
          </p>
        </div>
        <button className="h-[30px] px-3 rounded-md bg-accent text-white text-[13px]">+ New plan</button>
      </header>

      {/* Plans editor */}
      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="px-5 py-4 border-b hairline">
          <h2 className="text-[14px] font-medium">Retail plans</h2>
        </div>
        <table className="w-full text-[13px]">
          <thead className="bg-bg text-muted">
            <tr>
              <th className="text-left font-normal px-5 py-2">Plan</th>
              <th className="text-right font-normal px-3 py-2 tabular">Retail (ZAR)</th>
              <th className="text-right font-normal px-3 py-2 tabular">Wholesale (ZAR)</th>
              <th className="text-right font-normal px-3 py-2 tabular">Margin</th>
              <th className="text-right font-normal px-3 py-2 tabular">Active subs</th>
              <th className="w-[1%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line2">
            {list.map((p) => {
              const margin = calcMargin(p.wholesale, p.retail);
              return (
                <tr key={p.id} className="hover:bg-bg">
                  <td className="px-5 py-3">
                    <div className="text-ink">{p.name}</div>
                    <div className="text-[11px] text-muted mono">{p.id}</div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <input
                      type="number"
                      value={p.retail}
                      onChange={(e) =>
                        setList((l) => l.map((x) => x.id === p.id ? { ...x, retail: Number(e.target.value) } : x))
                      }
                      className="w-[90px] h-[28px] px-2 rounded border hairline text-right tabular"
                    />
                  </td>
                  <td className="px-3 py-3 text-right tabular text-muted">{p.wholesale}</td>
                  <td className="px-3 py-3 text-right tabular">
                    <span className={margin > 30 ? "text-ok" : "text-warn"}>{margin}%</span>
                  </td>
                  <td className="px-3 py-3 text-right tabular">{p.active.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <button className="text-accent text-[12px] hover:underline">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Margin calculator */}
      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="px-5 py-4 border-b hairline">
          <h2 className="text-[14px] font-medium">Wholesale vs. retail margin calculator</h2>
          <p className="text-[12px] text-muted mt-0.5">Test scenarios before publishing.</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <NumInput
            label="Wholesale (ZAR)"
            value={marginInput.wholesale}
            onChange={(v) => setMarginInput((s) => ({ ...s, wholesale: v }))}
          />
          <NumInput
            label="Retail (ZAR)"
            value={marginInput.retail}
            onChange={(v) => setMarginInput((s) => ({ ...s, retail: v }))}
          />
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-subtle">Margin</div>
            <div className="mt-1 text-stat tabular text-ink">
              {calcMargin(marginInput.wholesale, marginInput.retail)}%
            </div>
            <div className="text-[12px] text-muted mt-1">
              You keep R {(marginInput.retail - marginInput.wholesale).toLocaleString()} per subscriber per month.
            </div>
          </div>
        </div>
      </section>

      {/* Bundle SKUs */}
      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="px-5 py-4 border-b hairline flex items-center justify-between">
          <h2 className="text-[14px] font-medium">Bundle SKUs</h2>
          <span className="text-[12px] text-muted">Hardware + first 3 months cellular</span>
        </div>
        <table className="w-full text-[13px]">
          <thead className="bg-bg text-muted">
            <tr>
              <th className="text-left font-normal px-5 py-2">SKU</th>
              <th className="text-left font-normal px-5 py-2">Hardware</th>
              <th className="text-right font-normal px-3 py-2 tabular">Wholesale</th>
              <th className="text-right font-normal px-3 py-2 tabular">MSRP</th>
              <th className="text-right font-normal px-3 py-2 tabular">MOQ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line2">
            {bundles.map((b) => (
              <tr key={b.sku} className="hover:bg-bg">
                <td className="px-5 py-3 mono text-ink">{b.sku}</td>
                <td className="px-5 py-3">{b.name}</td>
                <td className="px-3 py-3 text-right tabular">R{b.wholesale.toLocaleString()}</td>
                <td className="px-3 py-3 text-right tabular">R{b.retail.toLocaleString()}</td>
                <td className="px-3 py-3 text-right tabular">{b.moq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function NumInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.1em] text-subtle">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block w-full h-[36px] px-3 rounded-md border hairline bg-surface tabular"
      />
    </label>
  );
}
