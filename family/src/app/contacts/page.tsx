"use client";

import { useState } from "react";
import { contacts as seed, devices, type EmergencyContact } from "@/lib/data";

export default function ContactsPage() {
  const [list, setList] = useState<EmergencyContact[]>(seed);
  const [editing, setEditing] = useState<string | "new" | null>(null);

  function remove(id: string) {
    setList((l) => l.filter((c) => c.id !== id));
  }
  function setPrimary(id: string) {
    setList((l) => l.map((c) => ({ ...c, primary: c.id === id })));
  }
  function add() {
    setEditing("new");
    setList((l) => [
      ...l,
      { id: `c${Date.now()}`, name: "", relation: "", phone: "", primary: l.length === 0 },
    ]);
  }
  function update(id: string, patch: Partial<EmergencyContact>) {
    setList((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[13px] uppercase tracking-[0.14em] text-muted">Per device · 5 contacts max</p>
          <h1 className="text-h1 font-medium mt-1">Emergency contacts</h1>
          <p className="text-muted mt-1 max-w-[62ch]">
            When something happens, we fan out to these contacts in parallel — phone tree, not voicemail
            relay. Set one as primary; the rest are notified in the order you list them.
          </p>
        </div>
        <button
          onClick={add}
          className="min-h-tap px-4 rounded-md bg-ink text-white text-[15px] hover:bg-black"
        >
          + Add contact
        </button>
      </header>

      <section className="bg-white shadow-card rounded-xl border hairline">
        <div className="p-5 border-b hairline flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-medium">Applied to all devices</h2>
            <p className="text-[13px] text-muted">Override per-device on each profile.</p>
          </div>
          <span className="text-[13px] text-muted tabular">{list.length} / 5</span>
        </div>

        <ul className="divide-y divide-line2">
          {list.map((c, i) => (
            <li key={c.id} className="p-5">
              {editing === c.id ? (
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr,1fr,1.4fr,auto] gap-3">
                  <input
                    aria-label="Name"
                    placeholder="Name"
                    value={c.name}
                    onChange={(e) => update(c.id, { name: e.target.value })}
                    className="min-h-tap px-3 rounded-md border hairline bg-white text-[15px]"
                  />
                  <input
                    aria-label="Relation"
                    placeholder="Relation"
                    value={c.relation}
                    onChange={(e) => update(c.id, { relation: e.target.value })}
                    className="min-h-tap px-3 rounded-md border hairline bg-white text-[15px]"
                  />
                  <input
                    aria-label="Phone"
                    placeholder="+27 …"
                    value={c.phone}
                    onChange={(e) => update(c.id, { phone: e.target.value })}
                    className="min-h-tap px-3 rounded-md border hairline bg-white text-[15px] tabular"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setEditing(null)}
                      className="min-h-tap px-4 rounded-md bg-ink text-white text-[14px]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="h-9 w-9 rounded-full bg-line2 text-ink grid place-items-center text-[14px] font-medium">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium">{c.name || "Unnamed"}</span>
                      {c.primary && (
                        <span className="text-[11px] uppercase tracking-[0.1em] text-accentInk">Primary</span>
                      )}
                    </div>
                    <div className="text-[13px] text-muted tabular">
                      {c.relation || "Relation"} · {c.phone || "Phone"}
                    </div>
                  </div>
                  <button
                    onClick={() => setPrimary(c.id)}
                    disabled={c.primary}
                    className="text-[14px] text-muted hover:text-ink disabled:opacity-40 px-3 min-h-tap"
                  >
                    Set primary
                  </button>
                  <button
                    onClick={() => setEditing(c.id)}
                    className="min-h-tap px-3 rounded-md border hairline text-[14px] hover:bg-bg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="min-h-tap px-3 rounded-md text-[14px] text-alert hover:bg-alertSoft"
                    aria-label={`Remove ${c.name}`}
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white shadow-card rounded-xl border hairline">
        <div className="p-5 border-b hairline">
          <h2 className="text-[15px] font-medium">Fanout behavior</h2>
          <p className="text-[13px] text-muted mt-0.5">How we reach contacts during an incident.</p>
        </div>
        <dl className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px]">
          <Block k="Parallel SMS + WhatsApp" v="Up to 5 contacts in ≤ 3s" />
          <Block k="Geographic routing"      v="Nearest responder notified first if subscribed" />
          <Block k="Ack tracking"            v="Operator sees a fanout timeline with replies" />
        </dl>
      </section>
    </div>
  );
}

function Block({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-[0.1em] text-subtle">{k}</dt>
      <dd className="text-ink mt-1">{v}</dd>
    </div>
  );
}
