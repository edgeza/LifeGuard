import Link from "next/link";

type Column = {
  title: string;
  links: { label: string; href: string }[];
};

const columns: Column[] = [
  {
    title: "Product",
    links: [
      { label: "Hardware stack",       href: "/products" },
      { label: "Operator console",     href: "/products#console" },
      { label: "Open API",             href: "/products#api" },
      { label: "For developers",       href: "/docs" },
      { label: "Pricing",              href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation",        href: "/docs" },
      { label: "API status",           href: "/trust#status" },
      { label: "Compliance",          href: "/trust" },
      { label: "Coverage map",         href: "/trust#coverage" },
      { label: "Changelog",            href: "/docs#changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",                href: "/trust#about" },
      { label: "Press kit",            href: "/trust#press" },
      { label: "Careers",              href: "/trust#careers" },
      { label: "Contact",              href: "mailto:hello@lifeguard.example.com" },
      { label: "Partners",             href: "/for-whom#partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy",              href: "/trust#privacy" },
      { label: "Terms of service",     href: "/trust#terms" },
      { label: "Acceptable use",       href: "/trust#aup" },
      { label: "Data processing",      href: "/trust#dpa" },
      { label: "Security",             href: "/trust#security" },
    ],
  },
];

const countries = [
  { code: "ZA", name: "South Africa" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
];

export function Footer() {
  return (
    <footer className="mt-24 section-dark">
      {/* Top strip — three-massive-block CTA */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container-x py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--color-red)", fontWeight: 600 }}
            >
              Get started · 10 minutes
            </div>
            <h3
              className="text-[28px] md:text-[34px] tracking-[-0.02em]"
              style={{ color: "#fff", fontWeight: 600 }}
            >
              One account. Hardware ships within 48 hours.
            </h3>
            <p className="mt-2 text-[14px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Stripe-style onboarding · Real human in your inbox by next business day.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/pricing" className="btn btn-ghost btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
              See pricing
            </Link>
            <Link href="/signup" className="btn btn-red btn-lg">
              Get started
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" aria-label="LifeGuard home" className="flex items-center gap-2 mb-5">
              <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
                <defs>
                  <linearGradient id="footerLogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e11d2e" />
                    <stop offset="1" stopColor="#8b0c14" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="9" fill="url(#footerLogo)" />
                <path d="M16 7 L22 11 V16 C22 19.5 19 22 16 23 C13 22 10 19.5 10 16 V11 Z" fill="#fff" />
                <path d="M14 14 h4 v6 h-4 z M16 12.5 a1.2 1.2 0 1 1 0 2.4 a1.2 1.2 0 0 1 0 -2.4 z" fill="#e11d2e" />
              </svg>
              <span className="text-[15px]" style={{ color: "#fff", fontWeight: 700 }}>
                LifeGuard
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed max-w-[300px]" style={{ color: "rgba(255,255,255,0.65)" }}>
              Wearable safety, operator-grade response, and an open platform. Built
              for the families who need a button that works and the operators who
              answer when it does.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <CountrySelect />
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-md transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div
                className="text-[11px] uppercase tracking-[0.18em] mb-4"
                style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}
              >
                {col.title}
              </div>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] hover:translate-x-0.5 inline-block transition-transform"
                      style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex flex-wrap items-center gap-3 text-[12px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span className="tabular">© {new Date().getFullYear()} LifeGuard Technologies Pty Ltd</span>
            <span aria-hidden="true">·</span>
            <span>Cape Town · San Francisco · Berlin</span>
            <span aria-hidden="true">·</span>
            <span>Made for the line that no one ever wants to call.</span>
          </div>
          <div className="flex items-center gap-4 text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/trust#status" className="inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              <span
                aria-hidden="true"
                className="pulse-sos"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: "var(--color-sos)",
                  display: "inline-block",
                }}
              />
              All systems operational
            </Link>
            <span aria-hidden="true">·</span>
            <span className="tabular">v2026.07</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/lifeguard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
        <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.39v-1.36c-2.22.49-2.69-1.07-2.69-1.07-.36-.92-.89-1.16-.89-1.16-.73-.5.06-.49.06-.49.8.06 1.22.83 1.22.83.71 1.23 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82A7.66 7.66 0 0 1 8 4.04c.68 0 1.36.09 2 .27 1.52-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.08-1.88 3.76-3.67 3.95.29.25.54.74.54 1.5v2.21c0 .22.15.47.55.39A8 8 0 0 0 8 0z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/lifeguard",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="currentColor">
        <path d="M9.03 5.93 13.2 0h-1.96L7.94 4.97 5.16 0H0l4.43 6.31L0 14h1.96l3.55-5.04L9.16 14h5.16L9.03 5.93z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/lifeguard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
        <path d="M3.4 1.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM2 6.2h2.8V14H2V6.2zm4.4 0H9v1.1c.4-.7 1.3-1.4 2.7-1.4 2.9 0 3.4 1.9 3.4 4.4V14h-2.8V10c0-.9 0-2.1-1.3-2.1s-1.5 1-1.5 2V14H6.4V6.2z" />
      </svg>
    ),
  },
];

function CountrySelect() {
  return (
    <label className="inline-flex items-center gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.8)" }}>
      <span className="sr-only">Country</span>
      <select
        aria-label="Country selector"
        defaultValue="ZA"
        className="rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-red)]"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code} style={{ color: "#0a0a0a" }}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
