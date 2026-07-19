/**
 * Sparkline — a minimal inline SVG line chart, no axes, no labels.
 * Used for HR / SpO₂ / HRV trends on the caregiver dashboard.
 *
 * Pure server component, no client JS needed.
 */
export function Sparkline({
  values,
  height = 28,
  stroke = "var(--color-red)",
  strokeWidth = 1.5,
  width = 90,
}: {
  values: number[];
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
}) {
  if (values.length < 2) {
    return (
      <span
        aria-hidden="true"
        className="inline-block mono"
        style={{ width, height, lineHeight: `${height}px`, color: "var(--color-muted)", fontSize: 10 }}
      >
        —
      </span>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const last = values[values.length - 1];
  const lastY = height - ((last - min) / range) * height;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`trend: ${values.join(", ")}`}
      style={{ display: "block" }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={width - 1} cy={lastY} r={2} fill={stroke} />
    </svg>
  );
}