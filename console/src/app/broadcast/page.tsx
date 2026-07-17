import { loadData } from "@/lib/data";
import { AppShell } from "@/components/AppShell";
import { BroadcastComposer } from "@/components/BroadcastComposer";
import { formatTime, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const data = await loadData();
  return (
    <AppShell
      title="Broadcast"
      subtitle={`Geofence + audience + message · ${data.broadcasts.length} broadcasts today`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_420px] divide-x divide-[rgba(255,255,255,0.06)] h-full">
        <section className="overflow-y-auto p-6 space-y-6">
          <BroadcastComposer />
        </section>
        <aside className="overflow-y-auto p-5 space-y-4">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">Recent broadcasts</h2>
          <ul className="space-y-3">
            {data.broadcasts.map((b) => (
              <li key={b.id} className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f1114] p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[12px] font-medium text-[#e6e9ef]">{b.subject}</span>
                  <span className="mono tabular text-[10px] text-[#6b7280]">{formatDateShort(b.queued_at)} {formatTime(b.queued_at)}</span>
                </div>
                <div className="text-[11px] text-[#a1a8b3] mb-2">{b.body}</div>
                <div className="grid grid-cols-3 gap-px rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] text-[10px]">
                  <Mini k="Geofence" v={b.geofence} />
                  <Mini k="Delivered" v={b.delivered.toLocaleString()} />
                  <Mini k="Read" v={`${b.read.toLocaleString()} (${Math.round((b.read / b.delivered) * 100)}%)`} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#6b7280]">Channels · {b.channels.join(" · ")} · audience · {b.audience}</span>
                  <span className="inline-flex rounded-full border border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.10)] px-1.5 py-0.5 text-[#6ee7b7]">{b.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-[#0f1114] px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-[#6b7280]">{k}</div>
      <div className="text-[11px] text-[#e6e9ef]">{v}</div>
    </div>
  );
}
