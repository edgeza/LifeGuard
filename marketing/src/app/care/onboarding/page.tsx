import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "Care onboarding — set up the agent in four steps",
  description:
    "When a caregiver creates an account for their parent, we spin up a dedicated agent. Name it, onboard the elder, pick a personality, and activate. Takes about three minutes.",
};

type Step = {
  n: string;
  title: string;
  body: string;
  fields: { label: string; placeholder: string; type?: string }[];
  preview?: { left: string; right: string };
};

const steps: Step[] = [
  {
    n: "01",
    title: "Name your agent.",
    body:
      "Pick a name for the bot. Some families call it &lsquo;Marlene’s helper’. Some call it &lsquo;Esther’ after an old friend. Some call it &lsquo;the bot’. The name shows up on the elder’s voice button and on outbound SMS.",
    fields: [
      { label: "Agent name",  placeholder: "Esther", type: "text" },
      { label: "Your role",   placeholder: "Daughter, neighbour, paid carer", type: "text" },
    ],
    preview: { left: "agent name", right: "Esther" },
  },
  {
    n: "02",
    title: "Onboard the care receiver.",
    body:
      "Names, conditions, general schedule, interests. The more context you give, the better the bot fits into their day. You can edit any of this later from the dashboard. Nothing here is sent to a model training pipeline.",
    fields: [
      { label: "Care receiver name",     placeholder: "Marlene Mokoena",     type: "text" },
      { label: "Date of birth (or age)", placeholder: "1943-04-21",          type: "text" },
      { label: "Primary conditions",     placeholder: "Type 2 diabetes, mild hypertension, osteoarthritis in left knee", type: "textarea" },
      { label: "Lives with",             placeholder: "Alone · with spouse · with family · in care", type: "text" },
      { label: "Languages spoken",       placeholder: "English, isiZulu",    type: "text" },
      { label: "General schedule notes", placeholder: "Likes her walk at 07:30. Lunch at 13:00. Early to bed.", type: "textarea" },
      { label: "Interests",              placeholder: "Gardening, the cats, her grandchildren, cricket", type: "textarea" },
      { label: "Phone (elder, optional)", placeholder: "+27 ...",            type: "tel" },
    ],
  },
  {
    n: "03",
    title: "Pick a personality.",
    body:
      "Pragmatic and short. Friendly with a soft touch. Quiet and never initiates chat unless scheduled. This affects the bot’s tone on outbound reminders and the caregiver chat window’s response style.",
    fields: [
      { label: "Personality",  placeholder: "Pragmatic · Friendly · Quiet", type: "select" },
      { label: "Voice tone",   placeholder: "Calm · Warm · Neutral",       type: "select" },
      { label: "Daily check-in", placeholder: "Yes, 09:00 · No",            type: "select" },
    ],
  },
  {
    n: "04",
    title: "Activate. The agent boots.",
    body:
      "We provision the runtime. We generate an email address for the agent. We spin up the calendar, medication, reminder, escalation, digest, and cognitive-watch skills. We run one synthetic conversation through to verify the script tree. The dashboard is live.",
    fields: [
      { label: "Agent email (auto)",  placeholder: "esther@care.life.guard", type: "text" },
      { label: "iCal feed URL",       placeholder: "webcal://care.life.guard/api/v1/agents/agent_044/calendar.ics", type: "text" },
      { label: "First message template", placeholder: "&lsquo;Hi Marlene. Esther here. I’ll check in with you about your medication every morning.’", type: "textarea" },
    ],
  },
];

const fieldsYouDontNeed = [
  "Bank details",
  "Medical aid number (stored separately if you choose)",
  "Address (geolocation only, on the elder’s hardware)",
  "Government ID",
];

export default function OnboardingPage() {
  return (
    <>
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[820px]">
          <div className="eyebrow mb-4">Care · onboarding</div>
          <h1 className="display-xl text-[44px] md:text-[60px]">
            Four steps. About three minutes.
          </h1>
          <p className="lead mt-6 max-w-[640px]">
            When a caregiver creates an account for their parent, we spin up a
            dedicated agent and walk you through the inputs it needs to do its
            job well. Everything you type here lives in your tenant. You can
            edit any of it later.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-red btn-lg">
              Start onboarding
            </Link>
            <Link href="/care" className="btn btn-ghost btn-lg">
              Back to /care
            </Link>
          </div>
        </div>
      </section>

      {/* THE FOUR STEPS — vertical timeline */}
      <section className="container-x py-12 md:py-16">
        <ol className="relative space-y-6">
          {/* vertical rule */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] hidden md:block"
            style={{ width: 1, background: "var(--color-line)" }}
          />
          {steps.map((s, i) => (
            <li key={s.n} className="relative md:pl-10">
              <span
                aria-hidden="true"
                className="hidden md:block absolute left-0 top-3 h-3.5 w-3.5 rounded-full"
                style={{
                  background: "var(--color-bg)",
                  border: "3px solid var(--color-red)",
                  boxShadow: "0 0 0 4px var(--color-bg)",
                }}
              />
              <MarketingReveal delay={i * 60}>
                <article
                  className="rounded-2xl border p-6 md:p-8"
                  style={{ borderColor: "var(--color-line)" }}
                >
                  <header className="flex items-baseline gap-3 mb-3">
                    <span
                      className="mono tabular text-[12px]"
                      style={{ color: "var(--color-red)", fontWeight: 700 }}
                    >
                      STEP {s.n}
                    </span>
                    <h2 className="text-[24px] md:text-[28px]" style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.01em" }}>
                      {s.title}
                    </h2>
                  </header>
                  <p
                    className="text-[15px] leading-relaxed max-w-[720px] mb-6"
                    style={{ color: "var(--color-body)" }}
                  >
                    {s.body}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div
                        className="text-[11px] uppercase tracking-[0.18em] mb-3"
                        style={{ color: "var(--color-muted)", fontWeight: 600 }}
                      >
                        What you fill in
                      </div>
                      <dl className="space-y-3">
                        {s.fields.map((f) => (
                          <div key={f.label} className="grid grid-cols-12 gap-3 items-baseline">
                            <dt
                              className="col-span-12 md:col-span-5 text-[12.5px]"
                              style={{ color: "var(--color-ink)", fontWeight: 600 }}
                            >
                              {f.label}
                            </dt>
                            <dd
                              className="col-span-12 md:col-span-7 mono text-[12px] truncate"
                              style={{ color: "var(--color-muted)" }}
                            >
                              {f.placeholder}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div
                      className="rounded-xl p-5 mono text-[12.5px] leading-relaxed"
                      style={{
                        background: "#0a0a0a",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      <div
                        className="text-[10px] uppercase tracking-[0.18em] mb-3"
                        style={{ color: "rgba(255,255,255,0.55)", fontWeight: 700 }}
                      >
                        Agent runtime preview
                      </div>
                      {i === 0 && (
                        <pre style={{ whiteSpace: "pre-wrap" }}>
{`agent.name:    "Esther"
agent.role:    "Care companion"
agent.email:   "esther@care.life.guard"
tenant_id:     "t_2zZ4"
runtime:       "agent_044"
memory:        "30-day rolling"
escalation:    { bot: 0, family: 30, operator: 60 }
skills:        [calendar, medication, reminder,
               escalation, digest, cognitive-watch]`}
                        </pre>
                      )}
                      {i === 1 && (
                        <pre style={{ whiteSpace: "pre-wrap" }}>
{`care_receiver:
  name:           "Marlene Mokoena"
  dob:            "1943-04-21"
  languages:      ["en", "zu"]
  conditions:     ["type-2-diabetes", "hypertension",
                  "osteoarthritis-L-knee"]
  lives_with:     "alone · family within 2km"
  schedule:
    wake:         "07:00"
    walk:         "07:30"
    lunch:        "13:00"
    bed:          "21:30"
  interests:      ["gardening", "cats", "grandkids",
                  "cricket"]
  phone:          "+27 ..." (optional)`}
                        </pre>
                      )}
                      {i === 2 && (
                        <pre style={{ whiteSpace: "pre-wrap" }}>
{`personality:
  tone:           "warm · pragmatic"
  voice:          "ElevenLabs · 'Aria' preset"
  initiate:       false
  daily_checkin:  "09:00"
  max_message_length: 280
  fallback_on_silence:
    - { after: "15m", action: "softer follow-up" }
    - { after: "30m", action: "notify caregivers" }
    - { after: "60m", action: "operator console" }`}
                        </pre>
                      )}
                      {i === 3 && (
                        <pre style={{ whiteSpace: "pre-wrap" }}>
{`status:         "live"
runtime:        "agent_044"
email:          "esther@care.life.guard"
ical_feed:      "webcal://care.life.guard/api/v1
                 /agents/agent_044/calendar.ics"
first_message:  "Hi Marlene. Esther here. I'll
                 check in with you about your
                 medication every morning."
smoke_test:     "passed · 3 turns verified"
dashboard:      "https://care.life.guard/t_2zZ4"`}
                        </pre>
                      )}
                    </div>
                  </div>
                </article>
              </MarketingReveal>
            </li>
          ))}
        </ol>
      </section>

      {/* FIELDS YOU DON'T NEED */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-16 md:py-20">
          <div className="max-w-[640px] mb-10">
            <div className="eyebrow mb-3">What we don’t ask for</div>
            <h2 className="display text-[32px] md:text-[40px]">
              Four things we deliberately don’t request.
            </h2>
            <p className="lead mt-4">
              Onboarding stays short because we’re not collecting what we
              don’t need.
            </p>
          </div>
          <ul className="grid md:grid-cols-2 gap-3">
            {fieldsYouDontNeed.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 rounded-xl p-5 card"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 grid place-items-center rounded-full w-7 h-7"
                  style={{ background: "var(--color-red)", color: "#fff", fontWeight: 700, fontSize: 13 }}
                >
                  ×
                </span>
                <span
                  className="text-[14.5px] leading-relaxed"
                  style={{ color: "var(--color-ink)" }}
                  dangerouslySetInnerHTML={{ __html: f }}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 md:py-24 text-center">
        <MarketingReveal>
          <h2 className="display text-[28px] md:text-[36px] max-w-[640px] mx-auto">
            Start onboarding. Cancel any time before step 4.
          </h2>
          <p className="lead mt-4 max-w-[520px] mx-auto">
            Nothing is sent anywhere until step 4. The sandbox is free for 30
            days. Hardware is sold separately if you want it.
          </p>
          <div className="mt-6 flex justify-center flex-wrap gap-3">
            <Link href="/signup" className="btn btn-red btn-lg">
              Start onboarding
            </Link>
            <Link href="/care/architecture" className="btn btn-ghost btn-lg">
              Read the architecture first
            </Link>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}