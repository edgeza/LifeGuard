"use client";

import { createContext, useContext, useRef, useState } from "react";

/**
 * 3DCardEffect — mouse-tracking perspective tilt where inner items can lift
 * at different translateZ depths. Pattern: 21st.dev / aceternity.
 *
 * Usage:
 *   <CardContainer>
 *     <CardBody>
 *       <CardItem translateZ={50}>floats higher</CardItem>
 *       <CardItem translateZ={20}>floats less</CardItem>
 *     </CardBody>
 *   </CardContainer>
 */

type Ctx = {
  mouseX: number;
  mouseY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const CardCtx = createContext<Ctx>({ mouseX: 0, mouseY: 0, containerRef: { current: null } });

export function CardContainer({
  children,
  className = "",
  containerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ mouseX: 0, mouseY: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setState({
      mouseX: (e.clientX - rect.left - rect.width / 2) / 30,
      mouseY: (e.clientY - rect.top - rect.height / 2) / 30,
    });
  }
  function handleMouseLeave() {
    setState({ mouseX: 0, mouseY: 0 });
  }

  return (
    <CardCtx.Provider value={{ ...state, containerRef }}>
      <div
        className={`flex items-center justify-center ${containerClassName}`}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative transition-transform duration-200 ease-linear will-change-transform ${className}`}
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${state.mouseX}deg) rotateX(${-state.mouseY}deg)`,
          }}
        >
          {children}
        </div>
      </div>
    </CardCtx.Provider>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export function CardItem({
  as: Tag = "div",
  children,
  className = "",
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}) {
  return (
    <Tag
      className={className}
      style={{
        transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </Tag>
  );
}
