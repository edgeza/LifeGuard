"use client";

import { useRef, useState } from "react";

/**
 * TiltCard — combines a mouse-tracking 3D perspective tilt with an embedded
 * radial-gradient spotlight. Pattern: 21st.dev / tom_ui.
 *
 * Used as a drop-in card replacement.
 */
export function TiltCard({
  children,
  className = "",
  spotlightColor = "#e11d2e",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [spot, setSpot] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 16;  // ±8 deg
    const py = (y / rect.height - 0.5) * -16; // ±8 deg
    setTransform(`perspective(1000px) rotateX(${py}deg) rotateY(${px}deg)`);
    setSpot({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  }

  function handleMouseLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    setSpot((s) => ({ ...s, opacity: 0 }));
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border bg-white transition-transform duration-200 will-change-transform ${className}`}
      style={{
        borderColor: "var(--color-line)",
        transform,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, ${spotlightColor}33, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
