import Link from "next/link";

export const metadata = {
  title: "Documentation — LifeGuard",
  description: "OpenAPI 3.1, Postman collection, SDKs in six languages, OAuth flow.",
};

const sdks = [
  { name: "TypeScript", pkg: "npm i @lifeguard/sdk" },
  { name: "Python", pkg: "pip install lifeguard" },
  { name: "Go", pkg: "go get github.com/lifeguard/lifeguard-go" },
  { name: "Java", pkg: "implementation 'com.lifeguard:sdk:1.0.0'" },
  { name: "C#", pkg: "dotnet add package LifeGuard" },
  { name: "Ruby", pkg: "gem install lifeguard" },
];

const sections = [
  {
    title: "Quickstart",
    items: [
      "Create a sandbox tenant",
      "Send your first device signal",
      "Receive your first webhook",
      "Open the operator console",
    ],
  },
  {
    title: "Devices",
    items: [
      "Provisioning & lifecycle",
      "Firmware OTA",
      "Signal reference",
      "SIM profile & roaming",
    ],
  },
  {
    title: "Incidents",
    items: [
      "Trigger & fanout",
      "Voice line",
      "Responder dispatch",
      "Closures & post-mortems",
    ],
  },
  {
    title: "Operator console",
    items: [
      "WebSocket live-stream",
      "Bulk actions",
      "Shift handoff notes",
      "Audit trail access",
    ],
  },
  {
    title: "Reseller",
    items: [
      "Branded subdomain",
      "Pricing plans editor",
      "Payouts (Stripe Connect)",
      "Co-branded hardware MOQ",
    ],
  },
];

export default function Docs() {
  return (
    <>
      <section className="container-x pt-20 pb-12">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-4">Documentation</div>
          <h1 className="display-xl text-[44px] md:text-[56px]">
            The API is the product. Here&rsquo;s how to use it.
          </h1>
          <p className="lead mt-6">
            OpenAPI 3.1 spec, Postman collection, sample code in six languages,
            a sandbox tenant that mirrors production. Built so a developer can
            ship a LifeGuard integration in an afternoon.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get a sandbox key
            </Link>
            <Link href="https://github.com/lifeguard/postman" className="btn btn-ghost btn-lg">
              Download Postman collection
            </Link>
          </div>
        </div>
      </section>

      <section
        className="section-soft border-y"
        style={{ borderColor: "var(--color-line)" }}
        aria-labelledby="sdks-heading"
      >
        <div className="container-x py-20">
          <h2 id="sdks-heading" className="h2 text-[28px] md:text-[36px] mb-10">
            Official SDKs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdks.map((sdk) => (
              <div
                key={sdk.name}
                className="card p-5"
              >
                <div
                  className="text-[11px] uppercase tracking-wider mb-1"
                  style={{ color: "var(--color-muted)", fontWeight: 510 }}
                >
                  {sdk.name}
                </div>
                <code
                  className="mono block text-[13px] mt-1 px-3 py-2 rounded-md"
                  style={{
                    background: "var(--color-bg-soft)",
                    color: "var(--color-ink)",
                    border: "1px solid var(--color-line)",
                  }}
                >
                  {sdk.pkg}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="sections-heading" className="container-x py-20 md:py-24">
        <h2 id="sections-heading" className="h2 text-[28px] md:text-[36px] mb-10">
          Browse the docs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <div
              key={s.title}
              className="card p-6"
            >
              <h3 className="h3 text-[16px] mb-3">{s.title}</h3>
              <ul className="space-y-2">
                {s.items.map((it) => (
                  <li key={it}>
                    <Link
                      href="#"
                      className="text-[14px] inline-flex items-center gap-1.5 hover:text-[var(--color-blue)] transition-colors"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {it}
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <path
                          d="M3 7l4-4M4 3h3v3"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-24">
        <div
          className="rounded-xl p-8 md:p-10 grid md:grid-cols-3 gap-8 items-start"
          style={{ background: "var(--color-bg-deep)", color: "#e6edf7" }}
        >
          <div className="md:col-span-1">
            <h2 className="h2 text-[24px] md:text-[28px]" style={{ color: "#ffffff" }}>
              Looking for the OpenAPI 3.1 spec?
            </h2>
          </div>
          <div className="md:col-span-2 space-y-3 text-[14px]">
            <Spec href="/openapi.json">openapi.json</Spec>
            <Spec href="/openapi.yaml">openapi.yaml</Spec>
            <Spec href="/postman.json">postman.collection.json</Spec>
            <Spec href="/changelog">Changelog</Spec>
          </div>
        </div>
      </section>
    </>
  );
}

function Spec({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-3 rounded-md mono tabular text-[13px]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#e6edf7",
      }}
    >
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}