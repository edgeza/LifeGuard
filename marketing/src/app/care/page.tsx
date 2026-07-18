import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "LifeGuard Care — an AI companion for the people who look after your people",
  description:
    "An AI care companion for medication schedules, doctor appointments, and family check-ins. Designed for caregivers, not the elder themselves. Multi-caregiver shared view, segmented chat history, escalation policy built in.",
};

type Step = {
  n: string;
  title: string;
  body: string;
};

const escalation: Step[] = [
  {
    n: "01",
    title: "Bot reminds.",
    body:
      "At the scheduled time, the bot pings the elder through the voice button, the Care App, or a watch complication. \"It's 8am. Time for your metformin.\"",
  },
  {
    n: "02",
    title: "Bot waits.",
    body:
      "If the elder confirms (\"took it\" or just \"yes\"), the bot logs the dose and stays quiet. If no response within 15 minutes, the bot sends a softer follow-up.",
  },
  {
    n: "03",
    title: "Family pings.",
    body:
      "After two no-responses (configurable), the bot alerts the caregivers in parallel. Each gets a short note: \"Marlene hasn't confirmed her 8am metformin. Want to shoot her a text?\"",
  },
  {
    n: "04",
    title: "Operator on standby.",
    body:
      "On paid plans, if the family doesn't acknowledge within 30 minutes, the operator console sees the incident. Same path as a panic-button event but driven by silence rather than a button press.",
  },
];

const whatItDoes = [
  {
    title: "Medication adherence.",
    body:
      "Schedule, reminders, confirmations, refills. The bot logs every dose — taken, missed, late — and turns it into a 7-day adherence score for the family.",
    href: "/care/architecture#medication",
  },
  {
    title: "Doctor visits.",
    body:
      "Calendar view of upcoming appointments, what they're for, who's driving, who's attending. Reminders start 48h out, with a \"confirm you'll be there\" prompt the night before.",
    href: "/care/architecture#appointments",
  },
  {
    title: "Family check-ins.",
    body:
      "Daily check-in message — \"how are you feeling today?\" — that's not a chore for the elder to fill in. Just a soft conversation the bot can pull on later for a weekly report.",
    href: "/care/architecture#checkins",
  },
  {
    title: "Cognitive-decline watching.",
    body:
      "Conversation patterns over time. Repetition of the same question within an hour, dropped threads, confusion about recent events. The bot logs it; the family dashboard surfaces it as a trend, not an alarm.",
    href: "/care/architecture#cognitive",
  },
  {
    title: "Weekly health reports.",
    body:
      "Every Sunday morning, each caregiver gets a 90-second read: what changed, what stayed the same, what needs your attention. No PDFs. No medical jargon.",
    href: "/care/architecture#reports",
  },
  {
    title: "Vitals ingestion (when hardware ships).",
    body:
      "When the LifeBand is paired, the bot reads HR, HRV, SpO₂, sleep, and fall events alongside the conversation log. Same escalation policy applies — silent until it isn't.",
    href: "/care/architecture#vitals",
  },
];

const whatItWontDo = [
  "Diagnose. We're not a clinical decision tool. The bot surfaces patterns; humans decide.",
  "Replace family. The caregiver is in the loop on every escalation. The bot is the reminder, not the decider.",
  "Manage end-of-life logistics. Funeral planning, hospice coordination, estate — we deliberately stay out.",
  "Run on the elder's phone. The elder shouldn't have to log in, configure, or install anything new.",
  "Push marketing. No upsells. No health-tip-of-the-day. The bot exists to do its job and stay quiet.",
];

const faq = [
  {
    q: "Does the elder need an account?",
    a: "No. The elder doesn't sign up, log in, or install anything. They receive a hardware device (or use the family-shared phone) and respond to it. The Care account lives with the caregiver.",
  },
  {
    q: "Can multiple caregivers share one elder?",
    a: "Yes — and each gets their own segmented chat with the bot. Siblings all see the same medication schedule, but their conversations with the AI are private to each other. The bot knows who it's talking to.",
  },
  {
    q: "What happens when the elder doesn't confirm a dose?",
    a: "Configurable. Default: bot follows up after 15 minutes, family is notified after a second silence (30 min total), operator console sees it after 60 min. You can tighten or relax each step per elder.",
  },
  {
    q: "Is the conversation data used to train a model?",
    a: "No. Conversations stay in your tenant, encrypted at rest. We never read them. Not for training, not for analytics, not for marketing. The agent is yours.",
  },
];

export default function CarePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" aria-labelledby="care-hero-title">
        <div className="aurora-bg" aria-hidden="true">
          <div className="blob b1" />
          <div className="blob b2" />
        </div>

        <div className="container-x relative pt-20 pb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="eyebrow mb-4">LifeGuard Care</div>
              <h1 id="care-hero-title" className="display-xl text-[44px] md:text-[60px]">
                An AI companion for the people who
                {" "}
                <span className="shimmer-text">look after your people.</span>
              </h1>
              <p className="lead mt-6 max-w-[600px]">
                Care schedules medications, reminds about doctor visits, and
                surfaces what changed this week — so the family doesn't
                have to be the one who remembers. Designed for the caregiver,
                not for the elder. Honest about what it can and can't do.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="btn btn-red btn-lg">
                  Start a 30-day sandbox
                </Link>
                <Link href="/care/architecture" className="btn btn-ghost btn-lg">
                  How the agent works
                </Link>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-6 max-w-[560px]">
                <CareStat label="Medications tracked"   value="500+"   sub="active in pilots" />
                <CareStat label="Caregivers per elder"  value="4 avg"  sub="shared tenant" />
                <CareStat label="Bot uptime target"     value="99.5%"  sub="vs. carrier-grade" />
              </dl>
            </div>

            <aside className="lg:col-span-5 lg:pt-4">
              <div
                className="rounded-2xl p-6 md:p-7 card lift-strong relative"
                aria-label="Sample bot conversation"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block w-2 h-2 rounded-full pulse-dot"
                      style={{ background: "var(--color-red)" }}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      Marlene · live
                    </span>
                  </div>
                  <span className="text-[11px] mono" style={{ color: "var(--color-muted)" }}>
                    08:00 SAST
                  </span>
                </div>
                <div className="space-y-3">
                  <BotMsg>
                    Good morning, Marlene. It's 8am — time for your metformin.
                  </BotMsg>
                  <UserMsg>took it, love</UserMsg>
                  <BotMsg>
                    Logged. Anything else on your mind this morning?
                  </BotMsg>
                  <UserMsg>when's my Dr Patel appointment?</UserMsg>
                  <BotMsg>
                    Thursday at 10:15am. Your daughter Lerato is driving. Want me
                    to send a reminder the night before?
                  </BotMsg>
                  <UserMsg>yes please</UserMsg>
                  <BotMsg>Done. Have a good morning. 🌅</BotMsg>
                </div>
                <div
                  className="mt-5 pt-4 border-t text-[11px] mono"
                  style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
                >
                  med: metformin 500mg · 08:00 · ✓ 13m
                </div>
                <div
                  className="mt-2 pt-2 border-t text-[10px] mono flex items-center gap-2 flex-wrap"
                  style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}
                >
                  <span>bot: <span style={{ color: "var(--color-red)", fontWeight: 600 }}>Esther</span></span>
                  <span aria-hidden="true">·</span>
                  <span>email: <span style={{ color: "var(--color-red)", fontWeight: 600 }}>esther@care.life.guard</span></span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-20 md:py-28">
          <div className="max-w-[640px] mb-12">
            <div className="eyebrow mb-3">What Care does</div>
            <h2 className="display text-[36px] md:text-[48px]">
              Six jobs the bot is good at. The rest, it stays out of.
            </h2>
            <p className="lead mt-5">
              We picked six specific things to make excellent rather than fifty
              things to be mediocre at. Each one ties into the same escalation
              policy. Each one logs to the family dashboard. None of them require
              the elder to learn anything new.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {whatItDoes.map((c, i) => (
              <MarketingReveal key={c.title} delay={i * 40}>
                <Link href={c.href} className="lift-strong card p-6 h-full block group">
                  <div
                    className="text-[11px] uppercase tracking-[0.18em] mb-3"
                    style={{ color: "var(--color-red)", fontWeight: 700 }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="text-[16px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {c.title}
                  </h3>
                  <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: "var(--color-body)" }}>
                    {c.body}
                  </p>
                  <span
                    className="inline-block mt-4 text-[12px] mono"
                    style={{ color: "var(--color-red)", fontWeight: 600 }}
                  >
                    How it works →
                  </span>
                </Link>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ESCALATION FLOW */}
      <section className="container-x py-20 md:py-28">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">When the elder doesn't respond</div>
          <h2 className="display text-[36px] md:text-[48px]">
            Four steps. From reminder to operator.
          </h2>
          <p className="lead mt-5">
            The single most important design decision we made: <strong>the bot never decides
            alone</strong>. If the elder isn't responsive, humans get involved — the family
            first, then a trained operator. Defaults are tunable per elder.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {escalation.map((s, i) => (
            <MarketingReveal key={s.n} delay={i * 60}>
              <article className="lift-strong card p-6 h-full relative">
                <div
                  className="absolute top-4 right-4 text-[10px] mono"
                  style={{ color: "var(--color-muted)", fontWeight: 600 }}
                >
                  {s.n}
                </div>
                <h3 className="text-[16px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                  {s.title}
                </h3>
                <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: "var(--color-body)" }}>
                  {s.body}
                </p>
              </article>
            </MarketingReveal>
          ))}
        </div>
        <p className="mt-6 text-[13px] mono" style={{ color: "var(--color-muted)" }}>
          Defaults: bot-reminder at 0 min · follow-up at +15 · family alert at +30 · operator at +60.
          Tunable per elder in the caregiver dashboard.
        </p>
      </section>

      {/* SCRIPTS NOT LLM — design decision */}
      <section className="container-x py-20 md:py-28" aria-labelledby="scripts-heading">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-3">Design decision</div>
          <h2 id="scripts-heading" className="display text-[36px] md:text-[48px]">
            The bot is a <span className="shimmer-text">script</span>. The AI is in your dashboard.
          </h2>
          <p className="lead mt-6">
            The voice Marlene hears is a <strong>scripted reminder agent</strong> with
            bounded responses. &ldquo;Time for your metformin.&rdquo; &ldquo;Did
            you take it?&rdquo; &ldquo;Yes&rdquo; / &ldquo;Not yet&rdquo; / silence.
            Three branches. No freeform chat. No LLM in the loop on the elder’s
            side — by design, because we don’t trust a hallucinating
            model with someone who can’t tell the difference.
          </p>
          <p className="lead mt-4">
            The <strong>AI</strong> — the model, the chat, the
            &ldquo;why has she been asking the same question every morning this
            week?&rdquo; pattern detection — lives in the
            <strong> caregiver’s chat window</strong>. You’re the one
            with the cognitive bandwidth to push back on a wrong answer. The
            elder never has to.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-3">
            <div className="card p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--color-red)", fontWeight: 700 }}>
                What the elder gets
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
                A scheduled reminder. A yes/no follow-up. An appointment
                confirmation. A single soft check-in message a day. Nothing
                else. No conversational AI.
              </p>
            </div>
            <div className="card p-5" style={{ background: "var(--color-red-tint)", borderColor: "var(--color-red-border)" }}>
              <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "var(--color-red-hover)", fontWeight: 700 }}>
                What the caregiver gets
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
                A real AI chat. Conversation summary, pattern detection,
                adherence trends, &ldquo;ask the AI anything about her week&rdquo;.
                Full model. With citations. With audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR CAREGIVERS, NOT FOR THE ELDER */}
      <section className="section-dark py-20 md:py-28" aria-labelledby="care-for-heading">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                Who this is for
              </div>
              <h2 id="care-for-heading" className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
                Designed for the caregiver, not the elder.
              </h2>
              <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                Most elder-care apps fail because they expect the elder to log
                in, configure things, and remember what the app does. After 80,
                the technology is too complex for the person it was built for.
                We reversed that. The elder just talks to the bot. The family
                configures everything.
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
              {[
                { k: "The elder gets",    v: "A voice on a button. No app. No login. No settings." },
                { k: "The caregiver gets", v: "A full app. Chat window. Calendar. Reports. Tweak escalation per elder." },
                { k: "The family gets",    v: "A weekly 90-second digest. A trend chart. A nudge when something changes." },
                { k: "The bot doesn't get",v: "Marketing rights. We don't upsell, advertise, or push health tips." },
              ].map((r) => (
                <div
                  key={r.k}
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="text-[11px] uppercase tracking-[0.18em] mb-1"
                    style={{ color: "#fb7185", fontWeight: 700 }}
                  >
                    {r.k}
                  </div>
                  <div className="text-[14px]" style={{ color: "rgba(255,255,255,0.92)" }}>
                    {r.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE WON'T DO */}
      <section className="container-x py-20 md:py-28" aria-labelledby="wont-do-care">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">What Care won't do</div>
          <h2 id="wont-do-care" className="display text-[36px] md:text-[48px]">
            Five lines on the bot's job description.
          </h2>
          <p className="lead mt-5">
            Out-of-scope decisions. These take features off the table on
            purpose.
          </p>
        </div>
        <ul className="divide-y" style={{ borderColor: "var(--color-line)" }}>
          {whatItWontDo.map((it, i) => (
            <MarketingReveal key={i} delay={i * 30}>
              <li className="py-5 flex items-start gap-5">
                <span
                  aria-hidden="true"
                  className="shrink-0 grid place-items-center rounded-full w-7 h-7 mt-0.5"
                  style={{ background: "var(--color-red)", color: "#fff", fontWeight: 700, fontSize: 13 }}
                >
                  ×
                </span>
                <span className="text-[15px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                  {it}
                </span>
              </li>
            </MarketingReveal>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-20 md:py-28">
          <div className="max-w-[640px] mb-10">
            <div className="eyebrow mb-3">Asked by family members</div>
            <h2 className="display text-[36px] md:text-[48px]">
              Questions we already knew you'd ask.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {faq.map((f, i) => (
              <MarketingReveal key={i} delay={i * 40}>
                <article className="lift-strong card p-6 h-full">
                  <h3 className="text-[15px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {f.q}
                  </h3>
                  <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: "var(--color-body)" }}>
                    {f.a}
                  </p>
                </article>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-24 md:py-32">
        <MarketingReveal>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h2 className="display text-[36px] md:text-[48px]">
                Care works on its own. It works even better with the hardware.
              </h2>
              <p className="lead mt-5 max-w-[560px]">
                The bot runs as a pure software product — $9/month per care
                receiver, no device required. If you also buy a LifeBand or
                Pendant, the bot pulls vitals into the same escalation policy.
                Same dashboard. Same family. Same escalation. Two products, one
                tenant.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              <Link href="/signup" className="btn btn-red btn-lg">
                Start a 30-day sandbox
              </Link>
              <Link href="/products" className="btn btn-ghost btn-lg">
                See the hardware
              </Link>
              <Link href="/care/architecture" className="btn btn-ghost btn-lg">
                Read the architecture
              </Link>
            </div>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}

function CareStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <dt
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--color-muted)", fontWeight: 600 }}
      >
        {label}
      </dt>
      <dd
        className="tabular mt-1 text-[26px]"
        style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.02em" }}
      >
        {value}
      </dd>
      <dd className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
        {sub}
      </dd>
    </div>
  );
}

function BotMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <div
        className="max-w-[88%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed"
        style={{
          background: "var(--color-bg-soft)",
          color: "var(--color-ink)",
          borderTopLeftRadius: 4,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function UserMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[88%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed"
        style={{
          background: "var(--color-red)",
          color: "#fff",
          borderTopRightRadius: 4,
        }}
      >
        {children}
      </div>
    </div>
  );
}