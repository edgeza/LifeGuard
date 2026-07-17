"use client";

import { org } from "@/lib/data";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const t = () => setNow(new Date().toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
    t();
    const id = setInterval(t, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-[52px] bg-surface/90 backdrop-blur-[2px] border-b hairline">
      <div className="h-full flex items-center justify-between px-6 lg:px-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-[13px] text-muted truncate">
            <span className="text-ink font-medium">{org.name}</span>
            <span className="mx-2 text-subtle">/</span>
            <span className="mono text-[12px]">{org.domain}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-muted">
          <span className="hidden md:inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ok live-dot" aria-hidden />
            <span>Operational</span>
          </span>
          <span className="tabular hidden md:inline">{now}</span>
          <button className="h-[30px] px-3 rounded-md border hairline bg-surface hover:bg-line2 text-ink">
            Search ⌘K
          </button>
        </div>
      </div>
    </header>
  );
}
