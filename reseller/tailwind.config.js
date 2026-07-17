/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Linear-light palette
        bg:       "#fafafb",
        surface:  "#ffffff",
        raised:   "#ffffff",
        ink:      "#1f2937",
        muted:    "#64748b",
        subtle:   "#94a3b8",
        line:     "#e5e7eb",
        line2:    "#f1f5f9",
        accent:   "#1d4ed8",
        accentHover: "#1e40af",
        accentSoft: "#eff6ff",
        ok:       "#059669",
        warn:     "#d97706",
        alert:    "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        // Operator: dense, monospace numerics
        h1: ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        h2: ["18px", { lineHeight: "26px" }],
        stat: ["28px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card:  "0 1px 0 rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.06)",
        ring:  "0 0 0 1px #e5e7eb",
      },
    },
  },
  plugins: [],
};
