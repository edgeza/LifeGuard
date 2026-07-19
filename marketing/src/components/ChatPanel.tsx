"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * ChatPanel — the caregiver's window into the bot conversation with their
 * parent. The bot on the parent's side is a deterministic reminder agent;
 * the AI that helps the caregiver interpret, summarize, and act lives here.
 *
 * Segmented per caregiver: each sibling's chat history is private to them.
 * The parent never sees this window.
 */

type Message = {
  id: string;
  from: "bot" | "elder" | "caregiver" | "system";
  ts: string;
  body: string;
  meta?: { kind: "med" | "appointment" | "alert" | "note"; label?: string };
};

const seedMessages: Message[] = [
  { id: "m1", from: "bot",     ts: "08:00", body: "Good morning Marlene. Time for your metformin and aspirin.", meta: { kind: "med", label: "metformin 500mg · aspirin 81mg" } },
  { id: "m2", from: "elder",   ts: "08:03", body: "took them" },
  { id: "m3", from: "bot",     ts: "08:03", body: "Logged. Anything on your mind this morning?" },
  { id: "m4", from: "elder",   ts: "08:11", body: "when's my dr patel" },
  { id: "m5", from: "bot",     ts: "08:11", body: "Thursday at 10:15am. Lerato is driving. Want me to text her a reminder?" },
  { id: "m6", from: "elder",   ts: "08:12", body: "no she's coming" },
  { id: "m7", from: "bot",     ts: "08:12", body: "Got it. I'll remind you the night before." },
  { id: "m8", from: "system",  ts: "13:42", body: "Metformin reminder sent · 13:42 · no response · follow-up at 13:57" },
  { id: "m9", from: "elder",   ts: "14:03", body: "sorry was in the garden. took it just now" },
  { id: "m10", from: "bot",    ts: "14:03", body: "Logged. Stretching the window is fine — but anything past 2h flags it for the family." },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: `u${Date.now()}`, from: "caregiver", ts: now(), body: text }]);
    setDraft("");
    setThinking(true);
    try {
      const res = await fetch("/api/care/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "esther", care_receiver: "marlene", caregiver: "lerato", message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { id: `b${Date.now()}`, from: "bot", ts: now(), body: data.reply }]);
    } catch {
      setMessages((m) => [...m, { id: `e${Date.now()}`, from: "system", ts: now(), body: "Couldn't reach the bot. Try again." }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <article
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}
    >
      <header
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block w-2 h-2 rounded-full pulse-dot"
            style={{ background: "var(--color-red)" }}
          />
          <div>
            <div className="text-[13px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              Chat with Esther · Marlene
            </div>
            <div className="text-[11px] mono" style={{ color: "var(--color-muted)" }}>
              Lerato's view · private to you
            </div>
          </div>
        </div>
        <Link
          href="/care/architecture"
          className="text-[11px] mono"
          style={{ color: "var(--color-red)", fontWeight: 600 }}
        >
          how this works →
        </Link>
      </header>

      <div
        ref={scrollRef}
        className="px-5 py-4 space-y-3 overflow-y-auto"
        style={{ maxHeight: 460, background: "var(--color-bg-soft)" }}
      >
        {messages.map((m) => (
          <Row key={m.id} m={m} />
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-3.5 py-2 text-[12.5px] inline-flex items-center gap-1.5"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
            >
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span>Esther is drafting…</span>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-2 px-3 py-3 border-t"
        style={{ borderColor: "var(--color-line)", background: "var(--color-bg)" }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Esther: how did she sleep? any skipped doses this week?"
          className="flex-1 px-3 py-2 rounded-md text-[13px] mono placeholder:text-[var(--color-muted)]"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            color: "var(--color-ink)",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={thinking || !draft.trim()}
          className="btn btn-red btn-sm disabled:opacity-40"
          style={{ opacity: thinking ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>

      <style jsx>{`
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: var(--color-red);
          animation: blink 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
      `}</style>
    </article>
  );
}

function Row({ m }: { m: Message }) {
  if (m.from === "system") {
    return (
      <div className="flex justify-center">
        <div
          className="text-[11px] mono px-3 py-1.5 rounded-full"
          style={{
            background: "var(--color-bg)",
            color: "var(--color-muted)",
            border: "1px solid var(--color-line)",
          }}
        >
          {m.body}
        </div>
      </div>
    );
  }

  const isCaregiver = m.from === "caregiver";
  const isBot = m.from === "bot";

  return (
    <div className={`flex ${isCaregiver ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] ${isCaregiver ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className="rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed"
          style={
            isCaregiver
              ? { background: "var(--color-red)", color: "#fff", borderTopRightRadius: 4 }
              : isBot
              ? { background: "var(--color-bg)", color: "var(--color-ink)", border: "1px solid var(--color-line)", borderTopLeftRadius: 4 }
              : { background: "var(--color-bg)", color: "var(--color-ink)", border: "1px solid var(--color-line)", borderTopLeftRadius: 4 }
          }
        >
          {m.body}
        </div>
        {m.meta && (
          <span className="text-[10px] mono" style={{ color: "var(--color-red)", fontWeight: 600 }}>
            ↳ {m.meta.label}
          </span>
        )}
        <span className="text-[10px] mono" style={{ color: "var(--color-muted)" }}>
          {m.from === "bot" ? "Esther" : m.from === "elder" ? "Marlene" : "You"} · {m.ts}
        </span>
      </div>
    </div>
  );
}

function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}