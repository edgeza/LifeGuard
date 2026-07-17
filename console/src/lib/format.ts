// Tiny formatting helpers. Pure, no deps.

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

export function formatRelativeMinutes(min: number | null | undefined): string {
  if (min === null || min === undefined) return "—";
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return m ? `${h}h ${m}m` : `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function statusColor(s: string): { bg: string; text: string; ring: string } {
  switch (s) {
    case "sos":
    case "fall_detected":
      return { bg: "rgba(220,38,38,0.12)", text: "#fca5a5", ring: "rgba(220,38,38,0.45)" };
    case "en_route":
    case "on_scene":
    case "dispatched":
      return { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", ring: "rgba(59,130,246,0.45)" };
    case "low_battery":
    case "inactivity":
      return { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", ring: "rgba(245,158,11,0.45)" };
    case "resolved":
      return { bg: "rgba(16,185,129,0.10)", text: "#6ee7b7", ring: "rgba(16,185,129,0.35)" };
    case "open":
      return { bg: "rgba(220,38,38,0.18)", text: "#fecaca", ring: "rgba(220,38,38,0.55)" };
    case "acknowledged":
      return { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", ring: "rgba(59,130,246,0.45)" };
    case "available":
      return { bg: "rgba(16,185,129,0.10)", text: "#6ee7b7", ring: "rgba(16,185,129,0.35)" };
    case "offline":
      return { bg: "rgba(107,114,128,0.18)", text: "#9ca3af", ring: "rgba(107,114,128,0.35)" };
    default:
      return { bg: "rgba(255,255,255,0.04)", text: "#a1a8b3", ring: "rgba(255,255,255,0.08)" };
  }
}

export function aiScoreColor(score: number): string {
  if (score >= 0.8) return "#fca5a5";
  if (score >= 0.6) return "#fbbf24";
  if (score >= 0.4) return "#fde68a";
  return "#9ca3af";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
