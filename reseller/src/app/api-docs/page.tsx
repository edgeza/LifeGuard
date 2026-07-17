"use client";

import { useState } from "react";
import { apiEndpoints } from "@/lib/data";

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-[#dcfce7] text-[#166534]",
  POST: "bg-[#dbeafe] text-[#1e40af]",
  PUT: "bg-[#fef3c7] text-[#92400e]",
  DELETE: "bg-[#fee2e2] text-[#991b1b]",
};

const SAMPLE_BODY = `{
  "name": "Sarah Nkosi",
  "email": "sarah@example.com",
  "plan": "Consumer Direct",
  "devices": [
    { "model": "LifeBand G2", "imei": "357..." }
  ]
}`;

const SAMPLE_RESP = `{
  "id": "cus_001",
  "name": "Sarah Nkosi",
  "status": "active",
  "created": "2025-12-04T08:14:21Z",
  "mrr_cents": 34900,
  "devices": 4
}`;

export default function ApiDocsPage() {
  const [selected, setSelected] = useState(0);
  const ep = apiEndpoints[selected];

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">OpenAPI 3.1 · live in-app</p>
        <h1 className="text-h1 font-medium">API docs</h1>
        <p className="text-[13px] text-muted mt-1 max-w-[60ch]">
          Try endpoints, generate clients, or grab the Postman collection from the SDK tab.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
        {/* Endpoint list */}
        <aside className="bg-surface shadow-card rounded-xl border hairline overflow-hidden self-start">
          <div className="px-4 py-3 border-b hairline text-[12px] uppercase tracking-[0.1em] text-subtle">
            Endpoints
          </div>
          <ul>
            {apiEndpoints.map((e, i) => (
              <li key={e.path}>
                <button
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-2 border-b hairline flex items-center gap-3 text-[13px] ${
                    selected === i ? "bg-accentSoft" : "hover:bg-bg"
                  }`}
                >
                  <span
                    className={`shrink-0 inline-flex items-center justify-center h-[20px] w-[52px] rounded text-[11px] font-medium mono ${METHOD_COLOR[e.method]}`}
                  >
                    {e.method}
                  </span>
                  <span className="mono text-ink truncate">{e.path}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Detail */}
        <section className="space-y-4">
          <div className="bg-surface shadow-card rounded-xl border hairline">
            <div className="px-5 py-4 border-b hairline flex items-center gap-3">
              <span
                className={`inline-flex items-center justify-center h-[24px] w-[60px] rounded text-[12px] font-medium mono ${METHOD_COLOR[ep.method]}`}
              >
                {ep.method}
              </span>
              <span className="mono text-[14px] text-ink">{ep.path}</span>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-muted">{ep.summary}</p>
              <h3 className="text-[13px] font-medium mt-4 mb-2">Authentication</h3>
              <pre className="bg-bg border hairline rounded-md p-3 text-[12px] mono overflow-x-auto">
{`Authorization: Bearer sk_live_••••••••••••3f2c
Content-Type: application/json`}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface shadow-card rounded-xl border hairline">
              <div className="px-5 py-3 border-b hairline text-[13px] font-medium">
                Request {ep.method === "GET" ? "params" : "body"}
              </div>
              <pre className="p-4 text-[12px] mono overflow-x-auto text-ink">{SAMPLE_BODY}</pre>
            </div>
            <div className="bg-surface shadow-card rounded-xl border hairline">
              <div className="px-5 py-3 border-b hairline text-[13px] font-medium flex items-center justify-between">
                Response · 200
                <button className="text-[12px] text-accent hover:underline">Try it →</button>
              </div>
              <pre className="p-4 text-[12px] mono overflow-x-auto text-ink">{SAMPLE_RESP}</pre>
            </div>
          </div>

          <div className="bg-surface shadow-card rounded-xl border hairline">
            <div className="px-5 py-3 border-b hairline text-[13px] font-medium">
              Code sample · curl
            </div>
            <pre className="p-4 text-[12px] mono overflow-x-auto text-ink">
{`curl -X ${ep.method} https://api.lifeguard.io${ep.path} \\
  -H "Authorization: Bearer $LIFEGUARD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ sample: true })}'`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
