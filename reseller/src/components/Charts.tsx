export function AreaChart({
  values, height = 64, stroke = "#1d4ed8", fill = "rgba(29,78,216,0.08)",
}: { values: number[]; height?: number; stroke?: string; fill?: string }) {
  if (!values.length) return null;
  const w = 480;
  const h = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const stepX = w / (values.length - 1 || 1);
  const pts = values.map((v, i) => [i * stepX, h - ((v - min) / span) * (h - 6) - 3] as const);
  const d = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" className="block">
      <path d={area} fill={fill} stroke="none" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}

export function BarChart({
  data, height = 96, color = "#1d4ed8",
}: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm"
            style={{
              height: `${(d.value / max) * (height - 20)}px`,
              background: color,
              opacity: 0.85,
            }}
            title={`${d.label}: ${d.value}`}
          />
          <div className="text-[10px] text-subtle tabular">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export function StatusDot({ tone }: { tone: "ok" | "warn" | "alert" | "neutral" | "muted" }) {
  const map = { ok: "bg-ok", warn: "bg-warn", alert: "bg-alert", neutral: "bg-subtle", muted: "bg-subtle" };
  return <span className={`inline-block h-2 w-2 rounded-full ${map[tone]}`} aria-hidden />;
}

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "ok" | "warn" | "alert" | "accent";
  children: React.ReactNode;
}) {
  const map = {
    neutral: "bg-line2 text-muted",
    ok:      "bg-[#ecfdf5] text-[#065f46]",
    warn:    "bg-[#fef3c7] text-[#92400e]",
    alert:   "bg-[#fee2e2] text-[#991b1b]",
    accent:  "bg-accentSoft text-accent",
  };
  return (
    <span className={`inline-flex items-center h-[20px] px-2 rounded text-[11px] font-medium uppercase tracking-[0.05em] ${map[tone]}`}>
      {children}
    </span>
  );
}
