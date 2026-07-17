// Minimal inline SVG sparkline. No charting library. Calm line.
export default function Sparkline({
  values,
  height = 48,
  stroke = "#06b6a4",
  fill = "rgba(6,182,164,0.10)",
}: {
  values: number[];
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  if (!values.length) return <div style={{ height }} className="w-full" aria-hidden />;
  const w = 240;
  const h = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const stepX = w / (values.length - 1 || 1);
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / span) * (h - 6) - 3;
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg
      role="img"
      aria-label="Trend sparkline"
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      preserveAspectRatio="none"
      className="block"
    >
      <path d={area} fill={fill} stroke="none" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke} />
    </svg>
  );
}
