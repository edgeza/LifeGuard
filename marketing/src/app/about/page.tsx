import Link from "next/link";
import { MarketingReveal } from "@/components/MarketingReveal";

export const metadata = {
  title: "About — LifeGuard",
  description:
    "Why we built LifeGuard. What we ship and what we won't. The team, the principles, the founder.",
};

type Principle = {
  title: string;
  body: string;
  color: string;
};

const principles: Principle[] = [
  {
    title: "We don&rsquo;t sell a story. We ship hardware.",
    body:
      "We are not a health-tracking platform. We are not &ldquo;smart jewellery.&rdquo; We make a button that, when pressed, opens a voice line and tells five people where you are. Everything else is in service of that.",
    color: "var(--color-red)",
  },
  {
    title: "We won&rsquo;t ship what we can&rsquo;t operate.",
    body:
      "An emergency product that fails at 03:00 is worse than no product. We&rsquo;d rather not ship a feature than ship one that takes a pager-on shift we can&rsquo;t sustain.",
    color: "var(--color-red)",
  },
  {
    title: "We measure the things that matter.",
    body:
      "Mean-time-to-call. False-positive rate of the AI triage. Hardware swap latency. Carrier signal at -100 dBm at the city edge. We publish these. If a number goes the wrong way we say so.",
    color: "var(--color-red)",
  },
  {
    title: "We are a South African company first.",
    body:
      "Built in Cape Town. The first device shipped to a real South African wearer who lives in Bo-Kaap. We will never ship a feature whose failure mode affects people in our city harder than people in anyone else&rsquo;s.",
    color: "var(--color-red)",
  },
];

type Person = {
  initials: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  bg: string;
};

const team: Person[] = [
  {
    initials: "TM",
    name: "Themba Mokoena",
    role: "Founder · CEO",
    location: "Cape Town, ZA",
    bio:
      "Previously built dispatch software for a Johannesburg armed-response operator. Saw 70% of their incident volume come down to &ldquo;find the wearer&rdquo; &mdash; not &ldquo;dispatch the car&rdquo;. Started LifeGuard so the dispatch could happen automatically when seconds matter.",
    bg: "linear-gradient(140deg, var(--color-red) 0%, var(--color-red-hover) 100%)",
  },
  {
    initials: "NR",
    name: "Naledi Radebe",
    role: "Co-founder · Head of Hardware",
    location: "Cape Town, ZA",
    bio:
      "Embedded engineer. Spent six years at a Chinese OEM designing LTE-M wearables before moving back to ZA. Owns the hardware roadmap and the firmware. Currently lives in a Long-Street co-working space surrounded by oscilloscopes.",
    bg: "linear-gradient(140deg, #0a0a0a 0%, #171717 100%)",
  },
  {
    initials: "JS",
    name: "Jacobus Steyn",
    role: "Head of Operator Experience",
    location: "Cape Town, ZA",
    bio:
      "Former armed-response dispatcher. Eight years on the chair. Joined when we showed him the first version of the console and he said &ldquo;this is what we wanted five years ago.&rdquo; Owns the operator console, the audit trail, and the AI triage.",
    bg: "linear-gradient(140deg, #8b0c14 0%, #c41523 100%)",
  },
];

const wontShip = [
  "Health-claim features (sleep scores, &ldquo;wellness insights&rdquo;, step goals). We&rsquo;re a personal-safety platform. We don&rsquo;t want your steps.",
  "Subscription tiers that gate life-safety features. The SOS button works on the cheapest plan we sell.",
  "Hidden upsells in the moment of incident. We won&rsquo;t ask an operator to upsell while they&rsquo;re triaging a fall.",
  "Telemetry collection we can&rsquo;t justify. If the data doesn&rsquo;t help the wearer or the operator, we don&rsquo;t send it.",
  "Dark-pattern retention. Cancel from the dashboard, no retention call, no friction.",
];

const shipping = [
  { name: "Devices in the field",         value: "240",            sub: "wearers across 4 countries (pilot)" },
  { name: "Carriers with first-party MVNO", value: "4",             sub: "ZA · UK · NL · AU" },
  { name: "Alerts triaged",               value: "10,000+",         sub: "since the v0.4 console launched" },
  { name: "Mean time to fanout",          value: "3.1 s (p95)",     sub: "10-second target; tracking" },
  { name: "Audit-trail hash chain",       value: "Online since",    sub: "Day-one with no incidents of tamper" },
  { name: "Public changelog",             value: "Weekly",          sub: "Shipped in v0.1.0 → v0.7.0" },
];

export default function AboutPage() {
  return (
    <>
      {/* HEADER */}
      <section className="container-x pt-20 pb-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <div className="eyebrow mb-4">About</div>
            <h1 className="display-xl text-[44px] md:text-[60px]">
              We make a button that <span className="shimmer-text">calls for help.</span>
            </h1>
            <p className="lead mt-6 max-w-[640px]">
              LifeGuard is a personal-safety platform built in Cape Town. We sell
              medical-grade wearables, an operator console, and an open REST API.
              We are not a smartwatch company, an &ldquo;AI wellness&rdquo; company,
              or a surveillance company. We make the button you press when
              something&rsquo;s wrong.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-red btn-lg">
                See the hardware
              </Link>
              <Link href="/careers" className="btn btn-ghost btn-lg">
                We&rsquo;re hiring
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl p-6" style={{ background: "var(--color-bg-soft)", border: "1px solid var(--color-line)" }}>
              <div className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                Quick facts
              </div>
              <dl className="space-y-3">
                <FactRow k="Founded"    v="2025" />
                <FactRow k="HQ"          v="Cape Town, ZA" />
                <FactRow k="Team size"   v="11" />
                <FactRow k="Backed by"   v="Self-funded + 2 angels" />
                <FactRow k="Pilots"      v="4 security operators" />
                <FactRow k="Open source" v="Public REST API · SDKs in 6 languages" />
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* WHY WE BUILT IT */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-20 md:py-28">
          <div className="max-w-[820px] mb-12">
            <div className="eyebrow mb-3">Why we built it</div>
            <h2 className="display text-[36px] md:text-[48px]">
              Most personal-safety products are bad at the one thing they exist to do.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <MarketingReveal>
              <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                <strong>Consumer wearables fail at safety.</strong> Apple Watch
                fall detection forwards to PSAP only &mdash; it doesn&rsquo;t
                notify a loved one. Pendants from the 2000s use landlines or
                2G SIMs that are getting sunset. The category leader, Life Alert,
                doesn&rsquo;t include GPS.
              </p>
            </MarketingReveal>
            <MarketingReveal delay={80}>
              <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                <strong>Operator software is from the 2010s.</strong> SICURNET, Bold
                Gemini, Mimic, and SIS integrations run on Windows desktops. They
                were designed when dispatchers sat at desks and didn&rsquo;t
                move. We ship a console that runs in the browser and works on a
                phone, in a van, in a chair, in a hoodie.
              </p>
            </MarketingReveal>
            <MarketingReveal delay={160}>
              <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                <strong>Everything is opaque.</strong> Bay Alarm, Tunstall, and
                Everbridge don&rsquo;t publish prices. They don&rsquo;t publish
                uptime. They don&rsquo;t publish changelogs. A category that is
                paid for by people&rsquo;s grandmothers should be the most
                transparent industry in tech.
              </p>
            </MarketingReveal>
            <MarketingReveal delay={240}>
              <p className="text-[16px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                <strong>We are an open platform.</strong> Public REST API.
                Webhooks. SDKs in six languages. The same model our own console
                uses. We&rsquo;ll compete on the operator console; we won&rsquo;t
                lock anyone in on the data plane.
              </p>
            </MarketingReveal>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="container-x py-20 md:py-28">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">Principles</div>
          <h2 className="display text-[36px] md:text-[48px]">
            Four lines we won&rsquo;t cross.
          </h2>
          <p className="lead mt-5">
            We have a small team and a small product. The whole company can hold
            these principles in their heads. When a new feature lands, we ask:
            does this cross one of these? If yes, we don&rsquo;t ship it.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {principles.map((p, i) => (
            <MarketingReveal key={p.title} delay={i * 40}>
              <article className="lift-strong card p-6 h-full">
                <div
                  className="text-[11px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: p.color, fontWeight: 700 }}
                >
                  Principle 0{i + 1}
                </div>
                <h3
                  className="text-[18px] mb-3"
                  style={{ color: "var(--color-ink)", fontWeight: 600 }}
                  dangerouslySetInnerHTML={{ __html: p.title }}
                />
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-body)" }}>
                  {p.body}
                </p>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* WHAT WE WON'T SHIP */}
      <section className="section-soft border-y" style={{ borderColor: "var(--color-line)" }}>
        <div className="container-x py-20 md:py-28">
          <div className="max-w-[640px] mb-12">
            <div className="eyebrow mb-3">What we won&rsquo;t ship</div>
            <h2 className="display text-[36px] md:text-[48px]">
              Five things on the &ldquo;no&rdquo; list.
            </h2>
            <p className="lead mt-5">
              These are decisions we&rsquo;ve made about what not to build. They
              take money off the table. We think that&rsquo;s the point.
            </p>
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--color-line)" }}>
            {wontShip.map((it, i) => (
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
        </div>
      </section>

      {/* TEAM */}
      <section className="container-x py-20 md:py-28">
        <div className="max-w-[640px] mb-12">
          <div className="eyebrow mb-3">The team</div>
          <h2 className="display text-[36px] md:text-[48px]">
            Three people. Cape Town. Shipping.
          </h2>
          <p className="lead mt-5">
            We are small by design. The whole company fits in a Long-Street
            co-working space. When we hire, it&rsquo;s one or two people a
            quarter, async, no whiteboarding. See{" "}
            <Link href="/careers" style={{ color: "var(--color-red)", fontWeight: 600 }}>
              /careers
            </Link>{" "}
            for what we&rsquo;re hiring for next.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {team.map((p, i) => (
            <MarketingReveal key={p.name} delay={i * 60}>
              <article className="lift-strong card overflow-hidden h-full">
                <div
                  className="h-32 grid place-items-center"
                  style={{ background: p.bg }}
                  aria-hidden="true"
                >
                  <span
                    className="text-[40px]"
                    style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {p.initials}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[18px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    {p.name}
                  </h3>
                  <div
                    className="text-[12px] uppercase tracking-[0.16em] mt-1"
                    style={{ color: "var(--color-red)", fontWeight: 700 }}
                  >
                    {p.role}
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: "var(--color-muted)" }}>
                    {p.location}
                  </div>
                  <p className="text-[13.5px] mt-4 leading-relaxed" style={{ color: "var(--color-body)" }}>
                    {p.bio}
                  </p>
                </div>
              </article>
            </MarketingReveal>
          ))}
        </div>
      </section>

      {/* NUMBERS WE ACTUALLY CLAIM */}
      <section className="section-dark py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-[640px] mb-12">
            <div className="eyebrow mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
              What we actually claim
            </div>
            <h2 className="display text-[36px] md:text-[48px]" style={{ color: "#fff" }}>
              Six honest numbers.
            </h2>
            <p className="lead mt-5" style={{ color: "rgba(255,255,255,0.7)" }}>
              No &ldquo;195 countries&rdquo;. No &ldquo;97.4% accuracy.&rdquo; Just
              the numbers we&rsquo;re willing to defend in a customer call.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shipping.map((s, i) => (
              <MarketingReveal key={s.name} delay={i * 30}>
                <article
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                    {s.name}
                  </div>
                  <div className="mono tabular text-[26px]" style={{ color: "#fff", fontWeight: 600, letterSpacing: "-0.02em" }}>
                    {s.value}
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {s.sub}
                  </div>
                </article>
              </MarketingReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20 text-center">
        <MarketingReveal>
          <h2 className="display text-[28px] md:text-[36px] max-w-[640px] mx-auto">
            If this is the company you&rsquo;d build &mdash; come build it with us.
          </h2>
          <div className="mt-6 flex justify-center flex-wrap gap-3">
            <Link href="/careers" className="btn btn-red btn-lg">See open roles</Link>
            <Link href="/signup" className="btn btn-ghost btn-lg">Try the API</Link>
            <a href="mailto:hello@life.guard" className="btn btn-ghost btn-lg">Email the team</a>
          </div>
        </MarketingReveal>
      </section>
    </>
  );
}

function FactRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--color-muted)", fontWeight: 600 }}>
        {k}
      </dt>
      <dd className="text-[13px] mono tabular" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
        {v}
      </dd>
    </div>
  );
}
