import Link from "next/link";

export const metadata = {
  title: "Marlene's view — LifeGuard",
  description:
    "Minimalist elder-side view. Just the next reminder and one big button. No AI chat, no app, no settings.",
};

// Minimalist elder view — what Marlene sees on the small hardware screen
// or the family-shared phone. Per Juan's privacy refactor: NO AI chat on
// the elder's side. NO login. NO settings. Just: what's next, and a button.

const nextActions = [
  { time: "08:00", label: "Metformin 500 mg + Aspirin 81 mg",     status: "done",   ts: "took at 08:03" },
  { time: "13:00", label: "Lunch",                                status: "todo",   ts: "" },
  { time: "21:00", label: "Atorvastatin 20 mg",                   status: "todo",   ts: "" },
];

const tomorrow = [
  { time: "10:15", label: "Dr Patel — follow-up",                  who: "Lerato driving" },
];

function fmtDate(d: Date) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function ElderView() {
  const now = new Date();
  const date = fmtDate(now);
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" :
                "Good evening";

  return (
    <main
      className="min-h-screen grid place-items-center p-4"
      style={{ background: "#0a0a0a" }}
    >
      <div className="w-full max-w-[480px] text-center">
        {/* tiny header */}
        <div className="flex items-center justify-between mb-8 opacity-70">
          <span className="text-[12px] mono" style={{ color: "rgba(255,255,255,0.5)" }}>
            LifeGuard
          </span>
          <span className="text-[12px] mono" style={{ color: "rgba(255,255,255,0.5)" }}>
            {date}
          </span>
        </div>

        <p className="text-[20px]" style={{ color: "rgba(255,255,255,0.85)" }}>
          {greeting}, Marlene.
        </p>

        {/* next reminder */}
        <h1 className="mt-6 text-[40px] md:text-[56px] leading-[1.05]" style={{ color: "#fff", fontWeight: 600, letterSpacing: "-0.02em" }}>
          It's 13:42.
        </h1>
        <p className="mt-4 text-[18px] md:text-[20px]" style={{ color: "rgba(255,255,255,0.7)" }}>
          Time for your afternoon metformin.
        </p>

        {/* one big button */}
        <div className="mt-10 flex justify-center">
          <button
            className="grid place-items-center rounded-full font-semibold transition-transform active:scale-95"
            style={{
              width: 220,
              height: 220,
              background: "var(--color-red)",
              color: "#fff",
              fontSize: 26,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -20px rgba(225,29,46,0.5)",
            }}
          >
            I took it
          </button>
        </div>

        <p className="mt-6 text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          or say "no" out loud
        </p>

        {/* quiet log of today */}
        <div className="mt-12 text-left">
          <div className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
            Today
          </div>
          <ul className="space-y-2">
            {nextActions.map((a) => (
              <li
                key={a.time}
                className="flex items-baseline gap-3 text-[15px]"
                style={{ color: a.status === "done" ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)" }}
              >
                <span
                  className="mono tabular shrink-0 w-12"
                  style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}
                >
                  {a.time}
                </span>
                <span className="flex-1" style={{ textDecoration: a.status === "done" ? "line-through" : "none" }}>
                  {a.label}
                </span>
                {a.status === "done" && (
                  <span className="text-[12px]" style={{ color: "var(--color-red)", fontWeight: 600 }}>
                    ✓
                  </span>
                )}
                {a.ts && (
                  <span className="text-[12px] mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {a.ts}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* tomorrow */}
        <div className="mt-8 text-left">
          <div className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
            Tomorrow
          </div>
          <ul className="space-y-2">
            {tomorrow.map((a, i) => (
              <li key={i} className="flex items-baseline gap-3 text-[15px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                <span className="mono tabular shrink-0 w-12" style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                  {a.time}
                </span>
                <span className="flex-1">{a.label}</span>
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {a.who}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* footer */}
        <div className="mt-12 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            This is what Marlene sees on her hardware button. No AI chat.
            No login. No settings.{" "}
            <Link href="/care" className="underline" style={{ color: "rgba(255,255,255,0.6)" }}>
              how it's built
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}