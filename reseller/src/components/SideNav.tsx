"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS: { label: string; items: { href: string; label: string; badge?: string }[] }[] = [
  {
    label: "Operate",
    items: [
      { href: "/",          label: "Overview" },
      { href: "/customers", label: "Customers" },
      { href: "/devices",   label: "Devices",   badge: "1.4k" },
    ],
  },
  {
    label: "Configure",
    items: [
      { href: "/plans",     label: "Plans & bundles" },
      { href: "/branding",  label: "Branding" },
      { href: "/payouts",   label: "Payouts" },
    ],
  },
  {
    label: "Develop",
    items: [
      { href: "/api-docs",  label: "API docs" },
      { href: "/sdk",       label: "SDK & Postman" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/settings",  label: "Team & settings" },
    ],
  },
];

export default function SideNav() {
  const pathname = usePathname() ?? "/";
  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-[224px] flex-col border-r hairline bg-surface">
      <div className="px-5 h-[52px] flex items-center gap-2 border-b hairline">
        <span aria-hidden className="inline-block h-[16px] w-[16px] rounded-full border-[2px] border-accent relative">
          <span className="absolute inset-[2px] rounded-full bg-accent" />
        </span>
        <span className="text-[14px] font-medium tracking-[-0.01em]">LifeGuard</span>
        <span className="text-[12px] text-muted ml-1">Reseller</span>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {SECTIONS.map((s) => (
          <div key={s.label} className="mb-4">
            <div className="px-5 mb-1 text-[11px] uppercase tracking-[0.1em] text-subtle">
              {s.label}
            </div>
            <ul>
              {s.items.map((it) => {
                const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={`flex items-center justify-between gap-3 px-5 h-[30px] text-[13px] ${
                        active ? "text-ink bg-accentSoft" : "text-muted hover:text-ink hover:bg-line2"
                      }`}
                    >
                      <span>{it.label}</span>
                      {it.badge && (
                        <span className="text-[11px] tabular text-muted">{it.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t hairline p-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-accent text-white grid place-items-center text-[12px] font-medium">
            LK
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-medium">Lerato Khumalo</div>
            <div className="text-[11px] text-muted">Owner · CityWatch</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
