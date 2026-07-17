const LANGS = [
  { name: "TypeScript", pkg: "npm install @lifeguard/sdk" },
  { name: "Python",     pkg: "pip install lifeguard-sdk" },
  { name: "Go",         pkg: "go get github.com/lifeguard/lifeguard-go" },
  { name: "Java",       pkg: "implementation 'io.lifeguard:sdk:1.0.0'" },
  { name: "C#",         pkg: "dotnet add package Lifeguard.SDK" },
  { name: "Ruby",       pkg: "gem install lifeguard" },
];

const SAMPLES: Record<string, string> = {
  TypeScript: `import { LifeGuard } from "@lifeguard/sdk";

const lg = new LifeGuard({ apiKey: process.env.LIFEGUARD_API_KEY! });

const customer = await lg.customers.create({
  name: "Sarah Nkosi",
  email: "sarah@example.com",
  plan: "Consumer Direct",
  devices: [{ model: "LifeBand G2", imei: "357..." }],
});`,
  Python: `from lifeguard import LifeGuard

lg = LifeGuard(api_key=os.environ["LIFEGUARD_API_KEY"])

customer = lg.customers.create(
    name="Sarah Nkosi",
    email="sarah@example.com",
    plan="Consumer Direct",
    devices=[{"model": "LifeBand G2", "imei": "357..."}],
)`,
  Go: `package main

import "github.com/lifeguard/lifeguard-go"

func main() {
    lg := lifeguard.New(os.Getenv("LIFEGUARD_API_KEY"))

    customer, _ := lg.Customers.Create(&lifeguard.Customer{
        Name:  "Sarah Nkosi",
        Email: "sarah@example.com",
        Plan:  "Consumer Direct",
    })
}`,
  Java: `import io.lifeguard.sdk.*;

var lg = new LifeGuard(System.getenv("LIFEGUARD_API_KEY"));

var customer = lg.customers().create(new Customer()
    .name("Sarah Nkosi")
    .email("sarah@example.com")
    .plan("Consumer Direct"));`,
  "C#": `using Lifeguard;

var lg = new LifeGuardClient(env("LIFEGUARD_API_KEY"));

var customer = await lg.Customers.CreateAsync(new Customer {
    Name  = "Sarah Nkosi",
    Email = "sarah@example.com",
    Plan  = "Consumer Direct",
});`,
  Ruby: `require "lifeguard"

lg = LifeGuard::Client.new(api_key: ENV["LIFEGUARD_API_KEY"])

customer = lg.customers.create(
  name:  "Sarah Nkosi",
  email: "sarah@example.com",
  plan:  "Consumer Direct"
)`,
};

export default function SdkPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">Official SDKs</p>
          <h1 className="text-h1 font-medium">SDK & Postman</h1>
          <p className="text-[13px] text-muted mt-1 max-w-[60ch]">
            Six first-party languages, generated from the same OpenAPI spec. Public Postman collection
            updated on every release.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-[30px] px-3 rounded-md border hairline bg-surface text-[13px]">
            Download Postman collection
          </button>
          <a className="h-[30px] px-3 rounded-md bg-accent text-white text-[13px] inline-flex items-center" href="#">
            Open on GitHub →
          </a>
        </div>
      </header>

      <section className="bg-surface shadow-card rounded-xl border hairline">
        <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 divide-line2">
          {LANGS.map((l) => (
            <div key={l.name} className="px-5 py-4">
              <div className="text-[13px] font-medium">{l.name}</div>
              <div className="mt-1 mono text-[12px] text-muted">{l.pkg}</div>
              <details className="mt-3">
                <summary className="text-[12px] text-accent cursor-pointer hover:underline">View sample</summary>
                <pre className="mt-2 bg-bg border hairline rounded p-3 text-[11px] mono overflow-x-auto">
{SAMPLES[l.name]}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline">
            <h2 className="text-[14px] font-medium">Postman collection</h2>
            <p className="text-[12px] text-muted">Auto-generated · environment variables included.</p>
          </div>
          <ul className="divide-y divide-line2">
            {[
              "Authentication · OAuth 2.0 client-credentials",
              "Customers · CRUD + bulk actions",
              "Devices · provisioning, OTA, telemetry",
              "Incidents · list, ack, resolve",
              "Vitals · historical query + streaming",
              "Broadcasts · geofence targeting",
            ].map((row) => (
              <li key={row} className="px-5 py-3 text-[13px] flex items-center justify-between">
                <span className="text-ink">{row}</span>
                <span className="text-[12px] text-muted">12 endpoints</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface shadow-card rounded-xl border hairline">
          <div className="px-5 py-4 border-b hairline">
            <h2 className="text-[14px] font-medium">Sandbox tenant</h2>
            <p className="text-[12px] text-muted">A mirror of production that you can hammer.</p>
          </div>
          <div className="p-5 space-y-3 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-muted">Endpoint</span>
              <span className="mono text-ink">https://sandbox.lifeguard.io</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">API key</span>
              <span className="mono text-ink">sk_test_••••••••••••a91b</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Rate limit</span>
              <span className="tabular text-ink">60 req/s · 1M events/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Data retention</span>
              <span className="tabular text-ink">30 days</span>
            </div>
            <button className="w-full h-[34px] rounded-md border hairline text-[13px] hover:bg-bg mt-2">
              Reset sandbox data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
