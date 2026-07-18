"use client";

import { useRef, useState } from "react";

/**
 * CardSpotlight — wraps content in a card whose background reveals a radial
 * gradient that follows the cursor. Pattern: 21st.dev / aceternity.
 *
 * The default `color` (#262626 = dark grey) is the aceternity default. We
 * override to lifeguard-red on hover via inline style.
 */
export function CardSpotlight({
  children,
  radius = 350,
  color = "#e11d2e",
  className = "",
}: {
  children: React.ReactNode;
  radius?: number;
  color?: string;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -radius, y: -radius });
  const [opacity, setOpacity] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - radius / 2,
      y: e.clientY - rect.top - radius / 2,
    });
  }
  function handleMouseEnter() {
    setOpacity(1);
  }
  function handleMouseLeave() {
    setOpacity(0);
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border bg-white ${className}`}
      style={{ borderColor: "var(--color-line)" }}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        aria-hidden="true"
        style={{
          opacity,
          background: `radial-gradient(${radius}px circle at ${position.x + radius / 2}px ${
            position.y + radius / 2
          }px, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
