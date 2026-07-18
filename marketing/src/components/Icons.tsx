/**
 * Brand icon set — uniform 24×24 viewBox, 1.6 stroke-width, `currentColor`
 * for fill or stroke as appropriate. No emoji, no Tailwind, no external deps.
 *
 * Sized via the parent (e.g. width="20" height="20" or Tailwind w-5 h-5).
 * `aria-hidden="true"` is the caller's responsibility — these are decorative.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconIOS(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.5 2c.04 1.4-.45 2.7-1.2 3.6-.78 1-2.07 1.7-3.27 1.55-.06-1.36.5-2.7 1.25-3.55.83-.95 2.2-1.65 3.22-1.6Z" />
      <path d="M20 17.5c-.6 1.36-.9 1.96-1.66 3.16-1.06 1.66-2.55 3.73-4.4 3.74-1.65.02-2.07-1.07-4.3-1.06-2.22.01-2.7 1.08-4.34 1.06-1.84-.01-3.25-1.88-4.3-3.54C-1 16.2-.32 10.73 1.5 7.82 2.87 5.64 5.05 4.36 7.1 4.36c1.74 0 3.4 1.18 4.49 1.18 1.06 0 3.06-1.4 4.94-1.18.83.02 3.18.34 4.69 2.55-4.36 2.4-1.2 8.6 1.78 10.59Z" />
    </svg>
  );
}

export function IconWatch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M9 3h6l-1 3" />
      <path d="M9 21h6l-1-3" />
      <path d="M9 12h2l1-1 2 1 1-2" />
    </svg>
  );
}

export function IconAndroid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 11.5a7 7 0 0 1 14 0v6h-14z" />
      <circle cx="8" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M7.5 5.5 6 3M16.5 5.5 18 3" />
      <path d="M4 19.5h16" />
    </svg>
  );
}

export function IconWearOS(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </svg>
  );
}

export function IconSMS(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4" width="17" height="13" rx="2" />
      <path d="m4 7 8 5 8-5" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function IconVoice(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3M9 21h6" />
    </svg>
  );
}

export function IconAPI(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4 4 12l5 8M15 4l5 8-5 8M14 4l-4 16" />
    </svg>
  );
}

export function IconMQTT(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <path d="M7.5 14a4.5 4.5 0 0 1 9 0" />
      <path d="M4 11a8 8 0 0 1 16 0" />
      <path d="M1 8a11 11 0 0 1 22 0" />
    </svg>
  );
}

/* --- utility glyphs used elsewhere --------------------------------------- */

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M11 19l-7-7 7-7" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconPulse(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
