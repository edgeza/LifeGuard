// Easing curves used across 21st.dev / motion.dev style components.
// Source: kokonutui (MIT) — adopted for our marketing site.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  marketing: 0.4,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.06,
  relaxed: 0.08,
} as const;