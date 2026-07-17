import { payouts, payoutHistory } from "@/lib/data";
import { AreaChart } from "@/components/Charts";

export default function PayoutsPage() {
  const series = [60, 62, 58, 64, 68, 71, 72, 76, 78, 81, 80, 84];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">Stripe Connect-style</p>
        <h1 className="text-h1 font-medium">Payouts</h1>
      </header>

      {/* Top balance row */}
      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-line2">
          <Stat k="Available balance" v={`R ${payouts.balance.value.toLocaleString()}`} />
          <Stat k="Pending"           v={`R ${payouts.pending.value.toLocaleString()}`} note="Clears in 2 d" />
          <Stat k="Next payout"       v={`R ${payouts.nextPayout.value.toLocaleString()}`} note={`${payouts.nextPayout.date} · ${payouts.schedule}`} />
          <Stat k="Bank"              v={`${payouts.bank.name} · ${payouts.bank.account}`} note={payouts.bank.branch} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-6">
        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-medium">Payout history</h2>
              <p className="text-[12px] text-muted">Lorem schedule · last 6 weeks shown</p>
            </div>
            <button className="h-[28px] px-3 rounded-md border hairline text-[12px] hover:bg-bg">Export CSV</button>
          </div>
          <table className="w-full text-[13px]">
            <thead className="bg-bg text-muted">
              <tr>
                <th className="text-left font-normal px-5 py-2">Date</th>
                <th className="text-right font-normal px-3 py-2 tabular">Amount</th>
                <th className="text-left font-normal px-3 py-2">Status</th>
                <th className="text-left font-normal px-3 py-2">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line2">
              {payoutHistory.map((p) => (
                <tr key={p.id} className="hover:bg-bg">
                  <td className="px-5 py-3 tabular text-ink">{p.date}</td>
                  <td className="px-3 py-3 text-right tabular">R{p.value.toLocaleString()}</td>
                  <td className="px-3 py-3 text-ok">{p.status}</td>
                  <td className="px-3 py-3 mono text-[11px] text-muted">{p.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-surface shadow-card rounded-xl border hairline">
            <div className="px-5 py-4 border-b hairline">
              <h2 className="text-[14px] font-medium">Weekly payouts trend</h2>
              <p className="text-[12px] text-muted">Last 12 weeks · lorem</p>
            </div>
            <div className="p-5">
              <AreaChart values={series} height={96} />
            </div>
          </div>

          <div className="bg-surface shadow-card rounded-xl border hairline">
            <div className="px-5 py-4 border-b hairline">
              <h2 className="text-[14px] font-medium">Bank accounts</h2>
            </div>
            <ul className="divide-y divide-line2">
              <li className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-ink">{payouts.bank.name}</div>
                  <div className="text-[12px] text-muted mono">{payouts.bank.account} · {payouts.bank.branch}</div>
                </div>
                <span className="text-[11px] uppercase tracking-[0.1em] text-ok">Primary</span>
              </li>
              <li className="px-5 py-3 text-[13px] text-muted">
                <button className="text-accent hover:underline">+ Add bank account</button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div className="px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.1em] text-subtle">{k}</div>
      <div className="mt-1 text-stat tabular text-ink">{v}</div>
      {note && <div className="text-[12px] text-muted">{note}</div>}
    </div>
  );
}
