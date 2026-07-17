import type { DeviceStatus } from "@/lib/data";

const STYLE: Record<DeviceStatus, { dot: string; label: string; tone: string }> = {
  ok:      { dot: "bg-accent",     label: "All good",  tone: "text-accentInk" },
  warn:    { dot: "bg-warn",       label: "Watch",     tone: "text-warn"      },
  alert:   { dot: "bg-alert",      label: "Alert",     tone: "text-alert"     },
  offline: { dot: "bg-subtle",     label: "Offline",   tone: "text-muted"     },
};

export default function StatusPill({
  status,
  withLabel = true,
}: {
  status: DeviceStatus;
  withLabel?: boolean;
}) {
  const s = STYLE[status];
  return (
    <span
      className={`inline-flex items-center gap-2 text-[13px] ${s.tone}`}
      aria-label={`Status: ${s.label}`}
    >
      <span className={`h-[8px] w-[8px] rounded-full ${s.dot} ${status === "ok" ? "live-dot" : ""}`} />
      {withLabel && <span>{s.label}</span>}
    </span>
  );
}
