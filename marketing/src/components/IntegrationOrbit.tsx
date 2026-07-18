/**
 * IntegrationOrbit — concentric dashed rings with brand-icon satellites
 * arranged around a centre medallion. Pure SVG + CSS, no images.
 * Designed to read like a 2026 system diagram.
 */
export function IntegrationOrbit({
  size = 360,
  satellites,
  centerLabel = "LifeGuard",
}: {
  size?: number;
  satellites: { name: string; glyph: string }[];
  centerLabel?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  // Distribute satellites around the orbit ring.
  const angles = satellites.map((_, i) => (i / satellites.length) * 360 - 90);
  const orbitR = size * 0.36;

  return (
    <div className="orbit" style={{ width: size, maxWidth: "100%", height: size }}>
      {/* Concentric dashed rings */}
      <div className="ring r1" />
      <div className="ring r2" />
      <div className="ring r3" />
      <div className="ring r4" />

      {/* Centre medallion */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 96,
          height: 96,
          borderRadius: 24,
          background: "linear-gradient(140deg, var(--color-red) 0%, var(--color-red-hover) 100%)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          boxShadow:
            "rgba(225, 29, 46, 0.40) 0 18px 36px -12px, rgba(0, 0, 0, 0.10) 0 8px 16px -8px",
        }}
        aria-hidden="true"
      >
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ fontWeight: 600, opacity: 0.85 }}>
            Life
          </div>
          <div className="text-[14px]" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
            Guard
          </div>
        </div>
      </div>

      {/* Satellites positioned around the orbit */}
      {satellites.map((s, i) => {
        const rad = (angles[i] * Math.PI) / 180;
        const x = cx + Math.cos(rad) * orbitR;
        const y = cy + Math.sin(rad) * orbitR;
        return (
          <div
            key={s.name}
            className="sat"
            style={{
              left: `calc(${x}px - 28px)`,
              top: `calc(${y}px - 28px)`,
            }}
            aria-label={s.name}
            title={s.name}
          >
            <span aria-hidden="true">{s.glyph}</span>
          </div>
        );
      })}

      {/* Connecting threads to centre, faint */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
        aria-hidden="true"
      >
        {satellites.map((_, i) => {
          const rad = (angles[i] * Math.PI) / 180;
          const x = cx + Math.cos(rad) * orbitR;
          const y = cy + Math.sin(rad) * orbitR;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(225,29,46,0.18)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}
      </svg>
    </div>
  );
}
