/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2937",
        muted: "#6b7280",
        subtle: "#9ca3af",
        bg: "#fafaf9",
        surface: "#ffffff",
        line: "#e7e5e4",
        line2: "#f5f4f2",
        accent: "#06b6a4",
        accentSoft: "#ccfbf1",
        accentInk: "#0f766e",
        alert: "#dc2626",
        alertSoft: "#fee2e2",
        warn: "#d97706",
        ok: "#059669",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        // Family App: 17px body minimum for aging eyes
        body: ["17px", { lineHeight: "26px" }],
        h1: ["34px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        h2: ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        stat: ["40px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
      },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
      boxShadow: {
        card: "0 1px 0 rgba(0,0,0,0.02), 0 1px 2px rgba(15,23,42,0.04)",
        ring: "0 0 0 1px #e7e5e4",
      },
    },
  },
  plugins: [],
};
