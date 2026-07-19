"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ChatPanel — the caregiver's window into the bot conversation with
 * their care receiver. The bot on the care-receiver side is a
 * deterministic reminder agent; the caregiver-side agent (Aria, etc.)
 * helps the caregiver interpret, summarize, and act.
 *
 * Segmented per caregiver: each sibling's chat history is private to
 * them. The care receiver never sees this window.
 *
 * Dynamic — accepts the actual agent / care_receiver / caregiver
 * identifiers + display names as props so the panel reflects whatever
 * user is logged in. No more hardcoded "Marlene / Lerato" copy.
 */

type Message = {
  id: string;
  from: "bot" | "elder" | "caregiver" | "system";
  ts: string;
  body: string;
  meta?: { kind: "med" | "appointment" | "alert" | "note"; label?: string };
};

export function ChatPanel(props: {
  agentId: string;
  agentName: string;
  careReceiverId: string;
  careReceiverName: string;
  caregiverId: string;
  caregiverName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  // Show one starter message so the panel isn't empty for first-time users.
  // Once the user sends their first message, the panel reflects real history.
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "s0",
          from: "bot",
          ts: now(),
          body: `Hi ${props.caregiverName.split(" ")[0]} — I'm ${props.agentName}, the assistant for ${props.careReceiverName}. Ask me about today's meds, upcoming appointments, or recent vitals.`,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.agentName, props.careReceiverName, props.caregiverName]);

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
        body: JSON.stringify({
          agentId: props.agentId,
          careReceiverId: props.careReceiverId,
          caregiverId: props.caregiverId,
          message: text,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { id: `b${Date.now()}`, from: "bot", ts: now(), body: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `e${Date.now()}`,
          from: "bot",
          ts: now(),
          body: "(couldn't reach the bot — try again in a moment)",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  const firstName = props.careReceiverName.split(" ")[0];

  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{
        background: "#fff",
        borderColor: "var(--color-line)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        height: 580,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div>
          <div
            className="text-[13px]"
            style={{ color: "var(--color-ink)", fontWeight: 600 }}
          >
            Chat with {props.agentName} · {props.careReceiverName}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
            {props.caregiverName}&apos;s view · private to you
          </div>
        </div>
        <a
          href="/care/architecture"
          className="text-[11px]"
          style={{ color: "var(--color-red)" }}
        >
          how this works →
        </a>
      </div>

      {/* Message stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-3"
        style={{ background: "var(--color-bg-soft)" }}
      >
        {messages.map((m) => (
          <Bubble
            key={m.id}
            from={m.from}
            agentName={props.agentName}
            elderName={firstName}
            caregiverName={props.caregiverName}
            ts={m.ts}
            body={m.body}
            meta={m.meta}
          />
        ))}
        {thinking && (
          <div
            className="flex justify-start"
            aria-live="polite"
          >
            <div
              className="rounded-2xl px-3.5 py-2 text-[13.5px]"
              style={{
                background: "#fff",
                border: "1px solid var(--color-line)",
                color: "var(--color-muted)",
              }}
            >
              <span>{props.agentName} is drafting</span>
              <span className="inline-flex ml-1 gap-0.5" aria-hidden="true">
                <Dot delay={0} />
                <Dot delay={120} />
                <Dot delay={240} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="p-3 flex items-center gap-2 border-t"
        style={{ borderColor: "var(--color-line)" }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Ask ${props.agentName}: how is ${firstName} doing this week?`}
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
    </div>
  );
}

function Bubble({
  from,
  agentName,
  elderName,
  caregiverName,
  ts,
  body,
  meta,
}: {
  from: Message["from"];
  agentName: string;
  elderName: string;
  caregiverName: string;
  ts: string;
  body: string;
  meta?: Message["meta"];
}) {
  if (from === "system") {
    return (
      <div className="text-center text-[11px] mono" style={{ color: "var(--color-muted)" }}>
        {body}
      </div>
    );
  }

  const isBot = from === "bot";
  const isElder = from === "elder";
  const isYou = from === "caregiver";

  return (
    <div
      className={`flex ${isYou ? "justify-end" : "justify-start"}`}
    >
      <div style={{ maxWidth: "85%" }}>
        <div
          className="rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed"
          style={{
            background: isBot
              ? "#fff"
              : isElder
              ? "rgba(225,29,46,0.04)"
              : "var(--color-red)",
            color: isBot
              ? "var(--color-ink)"
              : isElder
              ? "var(--color-ink)"
              : "#fff",
            border:
              isBot || isElder
                ? "1px solid var(--color-line)"
                : "1px solid transparent",
            borderTopLeftRadius: isBot || isElder ? 4 : 16,
            borderTopRightRadius: isBot ? 16 : 4,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          {body}
          {meta?.label && (
            <div
              className="mt-1 text-[10px] mono uppercase tracking-wide"
              style={{
                color: isBot ? "var(--color-muted)" : "rgba(255,255,255,0.7)",
              }}
            >
              {meta.label}
            </div>
          )}
        </div>
        <div
          className="text-[10px] mono mt-1"
          style={{
            color: "var(--color-muted)",
            textAlign: isYou ? "right" : "left",
          }}
        >
          {isBot ? agentName : isElder ? elderName : caregiverName.split(" ")[0]} · {ts}
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      style={{
        animation: "lg-bounce 1.2s ease-in-out infinite",
        animationDelay: `${delay}ms`,
      }}
    >
      ·
    </span>
  );
}

function now(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}