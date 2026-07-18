"use client";

import { useEffect, useRef } from "react";

/**
 * BackgroundGradientAnimation — 5 animated color blobs drifting in different
 * motion paths (vertical / circular / horizontal / circular-rev / horizontal),
 * plus a 6th interactive blob that lerps toward the cursor.
 *
 * Pattern follows 21st.dev / aceternity — `moveVertical`, `moveInCircle`,
 * `moveHorizontal` keyframes. The interactive pointer lerps at ~5% per frame
 * for a soft trail.
 *
 * Defaults are tuned for the LifeGuard brand:
 *   - base:    rgb(255, 255, 255) → rgb(255, 241, 242) (soft red wash)
 *   - blob 1:  red        (#e11d2e) — moves vertically
 *   - blob 2:  red-deep   (#8b0c14) — moves in a circle
 *   - blob 3:  pink       (#fda4af) — moves horizontally
 *   - blob 4:  red-hover  (#c41523) — moves in a circle reverse
 *   - blob 5:  red-tint   (#fecdd3) — moves in a circle
 *   - pointer: red        (#e11d2e) — follows cursor
 */
type RGB = `${number}, ${number}, ${number}`;
type Hex = `#${string}`;

export function BackgroundGradientAnimation({
  children,
  className = "",
  containerClassName = "",
  interactive = true,
  size = "80%",
  blendingValue = "hard-light",
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  interactive?: boolean;
  size?: string;
  blendingValue?: "hard-light" | "soft-light" | "difference" | "multiply" | "screen";
}) {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curXRef = useRef(0);
  const curYRef = useRef(0);
  const tgXRef = useRef(0);
  const tgYRef = useRef(0);

  useEffect(() => {
    // Defaults pre-set so the SSR markup and the effect agree.
    const body = document.body;
    body.style.setProperty("--gradient-background-start", "rgb(255, 255, 255)");
    body.style.setProperty("--gradient-background-end",   "rgb(255, 241, 242)");
    body.style.setProperty("--first-color",  "225, 29, 46");   // #e11d2e
    body.style.setProperty("--second-color", "139, 12, 20");   // #8b0c14
    body.style.setProperty("--third-color",  "253, 164, 175"); // #fda4af
    body.style.setProperty("--fourth-color", "196, 21, 35");   // #c41523
    body.style.setProperty("--fifth-color",  "254, 205, 211"); // #fecdd3
    body.style.setProperty("--pointer-color","225, 29, 46");
    body.style.setProperty("--size", size);
    body.style.setProperty("--blending-value", blendingValue);

    function move() {
      if (!interactiveRef.current) return;
      curXRef.current = curXRef.current + (tgXRef.current - curXRef.current) / 20;
      curYRef.current = curYRef.current + (tgYRef.current - curYRef.current) / 20;
      interactiveRef.current.style.transform = `translate(${Math.round(curXRef.current)}px, ${Math.round(curYRef.current)}px)`;
      requestAnimationFrame(move);
    }

    let raf = 0;
    if (interactive) {
      raf = requestAnimationFrame(move);
    }

    function onPointerMove(event: PointerEvent) {
      if (!interactiveRef.current?.parentElement) return;
      const rect = interactiveRef.current.parentElement.getBoundingClientRect();
      tgXRef.current = event.clientX - rect.left;
      tgYRef.current = event.clientY - rect.top;
    }

    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive, size, blendingValue]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))] ${containerClassName}`}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <filter id="bga-blur">
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>
        <g filter="url(#bga-blur)" style={{ mixBlendMode: blendingValue as any }}>
          <g style={{ animation: "moveVertical 30s ease infinite" }}>
            <circle cx="50%" cy="50%" r={size} fill="rgb(var(--first-color))" />
          </g>
          <g style={{ animation: "moveInCircle 20s reverse infinite" }}>
            <circle cx="50%" cy="50%" r={size} fill="rgb(var(--second-color))" />
          </g>
          <g style={{ animation: "moveInCircle 40s linear infinite" }}>
            <circle cx="50%" cy="50%" r={size} fill="rgb(var(--third-color))" />
          </g>
          <g style={{ animation: "moveHorizontal 40s ease infinite" }}>
            <circle cx="50%" cy="50%" r={size} fill="rgb(var(--fourth-color))" />
          </g>
          <g style={{ animation: "moveInCircle 20s ease infinite" }}>
            <circle cx="50%" cy="50%" r={size} fill="rgb(var(--fifth-color))" />
          </g>
        </g>
      </svg>

      {interactive && (
        <div
          ref={interactiveRef}
          className="absolute h-full w-full"
          aria-hidden="true"
          style={{ mixBlendMode: blendingValue as any }}
        >
          <div
            className="absolute rounded-full"
            style={{
              top: "calc(50% - var(--size) / 2)",
              left: "calc(50% - var(--size) / 2)",
              width: "var(--size)",
              height: "var(--size)",
              background: "rgb(var(--pointer-color))",
              opacity: 0.6,
              filter: "blur(60px)",
            }}
          />
        </div>
      )}

      <div className={`relative ${className}`}>{children}</div>
    </div>
  );
}

/* Keep these exports for downstream typing. */
export type { RGB, Hex };
