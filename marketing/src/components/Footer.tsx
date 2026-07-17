import Link from "next/link";

type Column = {
  title: string;
  links: { label: string; href: string }[];
};

const columns: Column[] = [
  {
    title: "Product",
    links: [
      { label: "Hardware stack", href: "/products" },
      { label: "Operator console", href: "/products#console" },
      { label: "Open API", href: "/products#api" },
      { label: "For developers", href: "/docs" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API status", href: "/trust#status" },
      { label: "Compliance", href: "/trust" },
      { label: "Coverage map", href: "/trust#coverage" },
      { label: "Changelog", href: "/docs#changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/trust#about" },
      { label: "Press kit", href: "/trust#press" },
      { label: "Careers", href: "/trust#careers" },
      { label: "Contact", href: "mailto:hello@lifeguard.example.com" },
      { label: "Partners", href: "/for-whom#partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/trust#privacy" },
      { label: "Terms of service", href: "/trust#terms" },
      { label: "Acceptable use", href: "/trust#aup" },
      { label: "Data processing", href: "/trust#dpa" },
      { label: "Security", href: "/trust#security" },
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
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "var(--color-line)", background: "var(--color-bg-soft)" }}
    >
      <div className="container-x py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
                <rect width="32" height="32" rx="7" fill="#0a1628" />
                <circle cx="16" cy="16" r="6.5" fill="none" stroke="#06b6a4" strokeWidth="2" />
                <circle cx="16" cy="16" r="2" fill="#06b6a4" />
              </svg>
              <span
                className="text-[15px]"
                style={{ color: "var(--color-ink)", fontWeight: 510 }}
              >
                LifeGuard
              </span>
            </div>
            <p
              className="text-[14px] leading-relaxed max-w-[280px]"
              style={{ color: "var(--color-body)" }}
            >
              Wearable safety, operator-grade response, and an open platform. Built
              for the families who need a button that works and the operators who
              answer when it does.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <CountrySelect />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div
                className="text-[12px] uppercase tracking-wider mb-4"
                style={{ color: "var(--color-muted)", fontWeight: 510 }}
              >
                {col.title}
              </div>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] hover:text-[var(--color-blue)] transition-colors"
                      style={{ color: "var(--color-ink-soft)" }}
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
          style={{ borderColor: "var(--color-line)" }}
        >
          <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
            <span className="tabular">© {new Date().getFullYear()} LifeGuard Technologies Pty Ltd</span>
            <span aria-hidden="true">·</span>
            <span>Cape Town · San Francisco · Berlin</span>
          </div>
          <div className="flex items-center gap-4 text-[12px]" style={{ color: "var(--color-muted)" }}>
            <Link href="/trust#status" className="hover:text-[var(--color-blue)] inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 9999,
                  background: "var(--color-success)",
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

function CountrySelect() {
  return (
    <label className="inline-flex items-center gap-2 text-[13px]" style={{ color: "var(--color-ink-soft)" }}>
      <span className="sr-only">Country</span>
      <select
        aria-label="Country selector"
        defaultValue="ZA"
        className="bg-white border rounded-md px-2.5 py-1.5 text-[13px]"
        style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}