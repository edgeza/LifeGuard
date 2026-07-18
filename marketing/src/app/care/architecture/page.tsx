import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Care architecture — one agent per care receiver",
  description:
    "Each care receiver gets their own agent: a sandboxed runtime with their meds, schedule, contacts, and history. The bot is theirs, not the platform's.",
};

type Component = {
  id: string;
  title: string;
  one: string;
  body: string;
};

const components: Component[] = [
  {
    id: "medication",
    title: "Medication scheduler",
    one: "Cron + adherence scoring + refill warnings.",
    body:
      "Each medication has a schedule (time, days, dose), an inventory estimate, and an adherence score over rolling 7 / 30 / 90 days. Refill triggers fire at the 7-day remaining threshold and route to the family, not the elder.",
  },
  {
    id: "appointments",
    title: "Appointment memory",
    one: "Calendar with attendees, transport, prep notes.",
    body:
      "Each appointment stores who, where, why, who's driving, what to bring. 48-hour-ahead reminder with a \"confirm you'll be there\" prompt. 24-hour ahead includes prep notes (\"fasting 8 hours before bloods\").",
  },
  {
    id: "checkins",
    title: "Daily check-in",
    one: "One soft, conversational nudge.",
    body:
      "Every morning at a configurable time, the bot sends a single message — not a checklist. The reply (or non-reply) is logged. The conversation is summarized into a weekly report for the family.",
  },
  {
    id: "cognitive",
    title: "Cognitive-decline watching",
    one: "Pattern detection over the conversation log.",
    body:
      "We compute rolling signals on the conversation log: question repetition, dropped threads, time-of-day confusion, vocabulary shift. These appear in the caregiver dashboard as a chart, not an alert. A human reviews.",
  },
  {
    id: "reports",
    title: "Weekly digest",
    one: "A 90-second read for the family.",
    body:
      "Every Sunday morning each caregiver gets a 90-second text-format summary: what changed, what stayed the same, what to watch. No PDFs. No clinical jargon. Written by the agent, edited by a model, signed by the family relationship.",
  },
  {
    id: "vitals",
    title: "Vitals ingestion",
    one: "Optional. Plugs into the LifeBand when paired.",
    body:
      "HR, HRV, SpO₂, sleep, falls. The agent treats a vitals trigger the same way it treats a missed dose — it goes through the same escalation policy. Silent until it isn't.",
  },
];

const runtime = [
  { k: "Isolation",       v: "Per-tenant VM. No shared memory between families." },
  { k: "Storage",         v: "Tenant-scoped Postgres + object store, AES-256 at rest." },
  { k: "Inference",       v: "Tool-using agent loop. Cheap classifier for triage, larger model for the conversation." },
  { k: "Voice",           v: "ElevenLabs (configurable). Falls back to Twilio text-to-speech." },
  { k: "Telephony",       v: "Twilio for SMS + voice. Latency target 3 s end-to-end." },
  { k: "Email",           v: "Per-agent mailbox (e.g. esther@care.life.guard). Inbound goes to the caregiver dashboard; outbound is signed and audit-logged." },
  { k: "Calendar",        v: "iCal feed per care receiver. Subscribe from Google Calendar, Apple Calendar, Outlook." },
  { k: "Memory",          v: "Vector store per agent. Conversation summary + episodic retrieval. 30-day retention by default." },
  { k: "Audit trail",     v: "Append-only hash chain. Caregiver-visible, regulator-exportable." },
  { k: "Model training",  v: "We do not train on your conversations. Configurable per tenant." },
];

const tenants = [
  { k: "Caregiver",       v: "Sees chat, calendar, escalations, reports, vitals, audit. Cannot impersonate the elder." },
  { k: "Care receiver",   v: "Sees nothing on the dashboard. Only receives bot messages on their device." },
  { k: "Operator",        v: "On Pro plans: sees escalations only. Cannot read conversation history unless explicitly shared." },
  { k: "Family read-only",v: "Optional: sees weekly digest and a trend chart. No chat, no escalations." },
];

export default function ArchitecturePage() {
  return (
    <>
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-4">Architecture</div>
          <h1 className="display-xl text-[44px] md:text-[60px]">
            One agent. One care receiver. One runtime.
          </h1>
          <p className="lead mt-6 max-w-[640px]">
            When a caregiver creates an account for their parent, we spin up a
            dedicated runtime — their meds, their schedule, their chat
            history, their contacts, their escalation policy. The agent is
            theirs, not ours. We never read their data, never train on it, and
            never share it across tenants.
          </p>
          <div
            className="mt-6 inline-flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{
              background: "var(--color-red-tint)",
              border: "1px solid var(--color-red-border)",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block w-2 h-2 rounded-full pulse-dot"
              style={{ background: "var(--color-red)" }}
            />
            <span className="text-[13px]" style={{ color: "var(--color-ink)" }}>
              <strong>Important:</strong> the bot is a{" "}
              <span style={{ color: "var(--color-red-hover)", fontWeight: 600 }}>
                scripted reminder agent
              </span>
              . The LLM lives in the <strong>caregiver’s chat window</strong>
              {" "}— never in the elder’s.
            </span>
          </div>
        </div>
      </section>

      {/* SCHEMATIC — runs into the page */}
      <section className="container-x pb-16">
        <div
          className="rounded-2xl border p-6 md:p-10"
          style={{ borderColor: "var(--color-line)", background: "var(--color-bg-soft)" }}
        >
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* ELDER */}
            <div
              className="rounded-xl p-5 text-center"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)" }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--color-muted)", fontWeight: 700 }}
              >
                Care receiver
              </div>
              <div className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Marlene, 81
              </div>
              <div className="text-[12px] mt-1" style={{ color: "var(--color-muted)" }}>
                Hardware button · No app · No login
              </div>
            </div>

            {/* AGENT — center */}
            <div
              className="rounded-xl p-6 text-center relative"
              style={{
                background: "var(--color-red-tint)",
                border: "1px solid var(--color-red-border)",
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--color-red-hover)", fontWeight: 700 }}
              >
                Per-tenant agent
              </div>
              <div className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Marlene's runtime
              </div>
              <div className="text-[12px] mt-2 leading-relaxed" style={{ color: "var(--color-body)" }}>
                Sandbox VM &middot; meds &middot; appointments &middot; chat log
                &middot; escalation policy &middot; vitals feed
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {["memory", "tools", "policy"].map((tag) => (
                  <span
                    key={tag}
                    className="mono text-[10px] px-2 py-1 rounded"
                    style={{
                      background: "var(--color-bg)",
                      color: "var(--color-red-hover)",
                      border: "1px solid var(--color-red-border)",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CAREGIVER */}
            <div
              className="rounded-xl p-5 text-center"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)" }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--color-muted)", fontWeight: 700 }}
              >
                Caregiver
              </div>
              <div className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                Lerato, 47
              </div>
              <div className="text-[12px] mt-1" style={{ color: "var(--color-muted)" }}>
                Caregiver app &middot; chat &middot; calendar &middot; reports
              </div>
            </div>
          </div>

          <p className="mt-6 text-[12px] mono text-center" style={{ color: "var(--color-muted)" }}>
            One runtime per care receiver. Multiple caregivers per runtime. Zero
            shared state across tenants.
          </p>
        </div>
      </section>

      {/* COMPONENTS */}
      <section className="container-x py-16">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">What's in the runtime</div>
          <h2 className="display text-[36px] md:text-[48px]">
            Six components per agent.
          </h2>
          <p className="lead mt-5">
            Each component is independently testable. Each is replaceable. We
            document the contracts because we're betting on the long tail of
            caregivers who want to integrate this with their own systems.
          </p>
        </div>
        <div className="space-y-3">
          {components.map((c, i) => (
            <MarketingReveal key={c.id} delay={i * 40}>
              <article
                id={c.id}
                className="grid lg:grid-cols-12 gap-6 rounded-2xl border p-6 md:p-8 scroll-mt-24"
                style={{ borderColor: "var(--color-line)" }}
              >
                <header className="lg:col-span-4">
                  <div
                    className="text-[11px] uppercase tracking-[0.18em] mb-2"
                    style={{ color: "var(--color-red)", fontWeight: 700 }}
                  >
                    Component 0{i + 1}
                  </div>
                  <h3 className="text-[20px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {c.title}
                  </h3>
                  <p
                    className="text-[13px] mt-2 mono"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {c.one}
                  </p>
                </header>
                <p
                  className="lg:col-span-8 text-[15px] leading-relaxed"
                  style={{ color: "var(--color-body)" }}
                >
                  {c.body}
                </p>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* RUNTIME DETAIL */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <div className="eyebrow mb-3">The runtime</div>
              <h2 className="display text-[32px] md:text-[40px]">
                What's underneath the agent.
              </h2>
              <p className="lead mt-5">
                Every tenant gets a fresh sandbox. Defaults are sane; nothing
                is shared. Operators are off by default.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl
                className="rounded-2xl overflow-hidden border divide-y"
                style={{ borderColor: "var(--color-line)" }}
              >
                {runtime.map((r) => (
                  <div
                    key={r.k}
                    className="grid grid-cols-12 gap-3 px-5 md:px-7 py-4"
                  >
                    <dt
                      className="col-span-4 text-[12px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      {r.k}
                    </dt>
                    <dd
                      className="col-span-8 text-[13.5px] leading-relaxed"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="container-x py-20 md:py-28" aria-labelledby="skills-heading">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">Skills</div>
          <h2 id="skills-heading" className="display text-[36px] md:text-[48px]">
            The agent is built from skills, not hardcoded.
          </h2>
          <p className="lead mt-5">
            Each skill is a small prompt + tool pair the agent loads on demand.
            When it needs to handle a calendar event, it loads the calendar
            skill. When it needs to draft a weekly digest, it loads the digest
            skill. Skills are versioned, auditable, and replaceable — we
            can ship a new medication-adherence skill without touching the
            chat layer.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              name: "calendar",
              one: "CRUD on appointments",
              body: "Creates, updates, deletes events. Syncs with the per-agent iCal feed. Handles attendees, transport, prep notes.",
            },
            {
              name: "medication",
              one: "Schedule + adherence + refills",
              body: "Records doses. Computes rolling adherence. Fires refill warnings 7 days before depletion.",
            },
            {
              name: "reminder",
              one: "Send a message at a time",
              body: "Channels: voice (ElevenLabs), SMS (Twilio), caregiver app push, family email. Falls back if the elder doesn't respond.",
            },
            {
              name: "escalation",
              one: "Decision tree on silence",
              body: "Bot reminder → bot follow-up → family alert → operator console. Configurable per elder.",
            },
            {
              name: "digest",
              one: "Weekly 90-second summary",
              body: "Reads the conversation log + adherence data + vitals trend. Writes a short, parent-language summary for the family.",
            },
            {
              name: "cognitive-watch",
              one: "Pattern detection on chat log",
              body: "Rolling signals: question repetition, dropped threads, time-of-day confusion. Trend chart on the caregiver dashboard.",
            },
          ].map((s, i) => (
            <article key={s.name} className="lift-strong card p-6 h-full">
              <div
                className="text-[10px] uppercase tracking-[0.18em] mb-2 mono"
                style={{ color: "var(--color-red)", fontWeight: 700 }}
              >
                /{s.name}
              </div>
              <h3 className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                {s.one}
              </h3>
              <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--color-body)" }}>
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ACCESS TIERS */}
      <section className="container-x py-20 md:py-28">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">Who can see what</div>
          <h2 className="display text-[36px] md:text-[48px]">
            Five access tiers per tenant.
          </h2>
          <p className="lead mt-5">
            Default is the least-privilege model. You add capability; we don't
            take it away. The fifth tier is opt-in for healthcare partners.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tenants.map((t, i) => (
            <MarketingReveal key={t.k} delay={i * 40}>
              <article className="lift-strong card p-6 h-full">
                <div
                  className="text-[11px] uppercase tracking-[0.18em] mb-2"
                  style={{ color: "var(--color-red)", fontWeight: 700 }}
                >
                  {t.k}
                </div>
                <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
                  {t.v}
                </p>
              </article>
            </MarketingReveal>
          ))}
          <article
            className="lift-strong card p-6 h-full relative"
            style={{ borderColor: "var(--color-red-border)", borderStyle: "dashed" }}
          >
            <div
              className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.18em] mono"
              style={{ color: "var(--color-muted)", fontWeight: 700 }}
            >
              Future
            </div>
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--color-red-hover)", fontWeight: 700 }}
            >
              Doctor
            </div>
            <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--color-body)" }}>
              Read-only access to a care receiver’s meds, appointments,
              and recent adherence. Opt-in per care receiver. Not in the MVP
              — we’re scoping the consent model with healthcare
              partners before shipping.
            </p>
          </article>
        </div>
      </section>

      {/* COMING SOON — operator escalation */}
      <section className="section-dark py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-[640px">
            <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
              When the agent needs a human
            </div>
            <h2 className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
              Operators on standby. Same console, different surface.
            </h2>
            <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
              On paid plans, after the family-escalation timer expires, the
              same LifeGuard operator console that handles hardware panic
              events sees the bot's escalation. The dispatcher doesn't know
              whether the alert came from a button or from silence. They just
              see the timeline, the location, the meds, and the chat context.
              Same ops team. Same SLA.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 md:py-28 text-center">
        <MarketingReveal>
          <h2 className="display text-[28px] md:text-[36px] max-w-[640px] mx-auto">
            Try the agent. Two minutes to provision a sandbox tenant.
          </h2>
          <p className="lead mt-4 max-w-[520px] mx-auto">
            Sandbox includes 1 agent, 3 medications, 1 appointment, all
            escalation modes, 30 days.
          </p>
          <div className="mt-6 flex justify-center flex-wrap gap-3">
            <Link href="/signup" className="btn btn-red btn-lg">
              Provision sandbox
            </Link>
            <Link href="/care" className="btn btn-ghost btn-lg">
              Back to /care
            </Link>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}