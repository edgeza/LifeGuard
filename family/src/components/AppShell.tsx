"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV: { href: string; label: string }[] = [
  { href: "/",         label: "Home" },
  { href: "/vitals",   label: "Vitals" },
  { href: "/history",  label: "History" },
  { href: "/contacts", label: "Contacts" },
  { href: "/alert",    label: "Recent alert" },
  { href: "/settings", label: "Settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setNow(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30_000);
    const d = new Date();
    setNow(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar — calm, single-row, no gradient, no glassmorphism */}
      <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-[2px] border-b hairline">
        <div className="mx-auto max-w-[1180px] px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" aria-label="LifeGuard home">
            <span
              aria-hidden
              className="inline-block h-[18px] w-[18px] rounded-full border-[2.5px] border-accent relative"
            >
              <span className="absolute inset-[3px] rounded-full bg-accent" />
            </span>
            <span className="text-[15px] tracking-[-0.01em] text-ink font-medium">
              LifeGuard
            </span>
            <span className="text-[13px] text-muted ml-1 hidden sm:inline">Family</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active =
                n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 min-h-tap inline-flex items-center text-[15px] rounded-md transition-colors ${
                    active
                      ? "text-ink bg-white shadow-ring"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-[13px] text-muted tabular">
              <span className="live-dot h-[7px] w-[7px] rounded-full bg-accent" aria-hidden />
              All systems normal · {now}
            </span>
            <div
              aria-label="Sarah Nkosi"
              className="h-[34px] w-[34px] rounded-full bg-accentSoft text-accentInk grid place-items-center text-[14px] font-medium"
            >
              SN
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          aria-label="Primary mobile"
          className="md:hidden border-t hairline overflow-x-auto"
        >
          <div className="flex gap-1 px-3 py-2 min-w-max">
            {NAV.map((n) => {
              const active =
                n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-2 rounded-md text-[14px] min-h-tap inline-flex items-center ${
                    active ? "text-ink bg-white shadow-ring" : "text-muted"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-[1180px] px-6 py-8">{children}</div>
      </main>

      <footer className="border-t hairline">
        <div className="mx-auto max-w-[1180px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] text-muted">
          <div>
            LifeGuard · 24-month warranty · AES-256 end-to-end · 99.95% operator SLA
          </div>
          <div className="tabular">v0.1 · build seed</div>
        </div>
      </footer>
    </div>
  );
}
