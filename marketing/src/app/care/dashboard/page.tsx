import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { MarketingReveal } from '@/components/MarketingReveal';
import { ChatPanel } from '@/components/ChatPanel';
import type {
  CareReceiver,
  Agent,
  Medication,
  Appointment,
  AdherenceEvent,
  Escalation,
} from '@/lib/db';

// Shape of /api/care/care-receivers/[id] response
type FamilyRow = { id: string; name: string; role: string };
type DetailResponse = {
  careReceiver: CareReceiver & { conditions: unknown[]; interests: unknown[] };
  agent: Pick<Agent, 'id' | 'name' | 'email' | 'personality'> | null;
  medications: Pick<Medication, 'id' | 'name' | 'dosage' | 'schedule' | 'refills_remaining' | 'active'>[];
  appointments: Pick<Appointment, 'id' | 'title' | 'scheduled_for' | 'location' | 'transport' | 'state'>[];
  adherence: Pick<AdherenceEvent, 'id' | 'medication_id' | 'scheduled_for' | 'confirmed_at' | 'confirmation_source' | 'status'>[];
  escalations: Pick<Escalation, 'id' | 'triggered_at' | 'reason' | 'state' | 'acknowledged_by' | 'resolved_at'>[];
  vitals: {
    latest: Record<string, { value: number; recorded_at: number }>;
    raw: { id: number; metric: string; value: number; recorded_at: number }[];
  };
  chat: { id: string; sender_type: string; sender_id: string | null; content: string; created_at: number }[];
  family: FamilyRow[];
};

async function getJSON<T>(path: string): Promise<T | null> {
  // Server-side fetch against the local Next.js server. Uses absolute URL
  // so this works inside a Server Component during build / prerender.
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3010';
  try {
    const res = await fetch(new URL(path, base), {
      cache: 'no-store',
      // Pass the cookie through so the API can read the lg_session.
      // In Server Components, headers() gives us the request headers.
      headers: await getAuthHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  // Server components can't read cookies directly via cookies() in fetch
  // calls — fetch() does not forward them automatically. Instead, we
  // re-implement: call the API with a hand-crafted Cookie header from
  // the incoming request. next/headers exposes cookies() in Server
  // Components in 15; read it.
  const { cookies } = await import('next/headers');
  const c = await cookies();
  const token = c.get('lg_session')?.value;
  return token ? { Cookie: `lg_session=${token}` } : {};
}

export const metadata = {
  title: 'Care dashboard — LifeGuard',
  description:
    'Live caregiver dashboard. Chat with the bot, see medication adherence, upcoming appointments, vitals trends, escalation log. Multi-caregiver, segmented chat history.',
};

const DAY = 86_400;
const HOUR = 3_600;

function fmtDate(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function fmtTime(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function fmtDateTime(epochSec: number): string {
  return `${fmtDate(epochSec)} ${fmtTime(epochSec)}`;
}

function adherencePercent(events: DetailResponse['adherence']): number {
  if (events.length === 0) return 100;
  const confirmed = events.filter((e) => e.status === 'confirmed').length;
  return Math.round((confirmed / events.length) * 100);
}

function adherencePerDay(events: DetailResponse['adherence']): number[] {
  // 7 buckets, oldest → newest, today is the last bucket.
  const buckets: number[] = [0, 0, 0, 0, 0, 0, 0];
  const denom: number[] = [0, 0, 0, 0, 0, 0, 0];
  const nowSec = Math.floor(Date.now() / 1000);
  for (const e of events) {
    const ageDays = Math.floor((nowSec - e.scheduled_for) / DAY);
    const idx = 6 - Math.min(ageDays, 6);
    denom[idx] += 1;
    if (e.status === 'confirmed') buckets[idx] += 1;
  }
  return buckets.map((c, i) => (denom[i] === 0 ? 0 : Math.round((c / denom[i]) * 100)));
}

function medicationAdherence30d(
  medicationId: string,
  events: DetailResponse['adherence'],
): number {
  const own = events.filter((e) => e.medication_id === medicationId && e.status !== 'pending');
  if (own.length === 0) return 100;
  const confirmed = own.filter((e) => e.status === 'confirmed').length;
  return Math.round((confirmed / own.length) * 100);
}

export default async function CareDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?from=/care/dashboard');

  // 1. List care_receivers for this user
  const list = await getJSON<
    { id: string; name: string; conditions: unknown[]; interests: unknown[]; timezone: string; created_at: number }[]
  >('/api/care/care-receivers');

  if (!list || list.length === 0) {
    redirect('/care/onboarding');
  }

  // MVP: render detail for the first care_receiver
  const receiverId = list[0].id;
  const detail = await getJSON<DetailResponse>(`/api/care/care-receivers/${receiverId}`);
  if (!detail) {
    // Auth drop or backend issue; bounce back to onboarding for safety.
    redirect('/care/dashboard?error=load-failed');
  }

  const week = adherencePerDay(detail.adherence);
  const combinedAdherence = adherencePercent(detail.adherence);

  const todaySec = Math.floor(Date.now() / 1000);
  const upcomingAppointments = detail.appointments
    .filter((a) => a.scheduled_for >= todaySec - DAY) // include last 24h for context
    .slice(0, 6);

  const escalations = detail.escalations.slice(0, 6);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg-soft)' }}>
      {/* TOP BAR */}
      <header
        className="border-b sticky top-0 z-30 backdrop-blur"
        style={{
          borderColor: 'var(--color-line)',
          background: 'rgba(255,255,255,0.85)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/care" className="flex items-center gap-2">
              <span
                className="inline-grid place-items-center w-8 h-8 rounded-md"
                style={{ background: 'var(--color-red)' }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 12V4h2v6h5v2H2z" fill="#fff" />
                  <circle cx="11.5" cy="5" r="1.5" fill="#fff" />
                </svg>
              </span>
              <span className="text-[14px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                LifeGuard · Care
              </span>
            </Link>
            <span className="text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
              / {detail.agent?.name ?? 'agent'} · {detail.careReceiver.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/care/onboarding" className="text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
              onboarding
            </Link>
            <Link href="/care/architecture" className="text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
              architecture
            </Link>
            <Link
              href={`/care/dashboard/elder?id=${detail.careReceiver.id}`}
              className="btn btn-red btn-sm"
            >
              Elder view →
            </Link>
          </div>
        </div>
      </header>

      {/* ADHERENCE STRIP */}
      <section
        className="border-b"
        style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Stat
              label="Adherence · 7 days"
              value={`${combinedAdherence}%`}
              sub="from logged events"
            />
            <VitalStat label="Resting HR" vital={detail.vitals.latest.heart_rate} unit="bpm" />
            <VitalStat label="SpO₂" vital={detail.vitals.latest.spo2} unit="%" />
            <VitalStat label="HRV" vital={detail.vitals.latest.hrv} unit="ms" />
            <Stat
              label="Family online"
              value={`${detail.family.length}`}
              sub={detail.family.map((f) => f.name.split(' ')[0]).join(' · ')}
            />
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT — CHAT */}
          <div className="lg:col-span-7">
            {/* ChatPanel owns its own state and chat URL. Phase 2B will
                swap the seed messages for real DB-backed history. */}
            <ChatPanel />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <MarketingReveal>
              <article
                className="rounded-xl border p-5"
                style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
              >
                <header className="flex items-baseline justify-between mb-4">
                  <h3 className="text-[13px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                    Weekly adherence
                  </h3>
                  <span className="text-[11px] mono" style={{ color: 'var(--color-red)', fontWeight: 700 }}>
                    {combinedAdherence}%
                  </span>
                </header>
                <div className="grid grid-cols-7 gap-2">
                  {week.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-full rounded-sm relative overflow-hidden"
                        style={{
                          height: 56,
                          background: 'var(--color-bg-soft)',
                          border: '1px solid var(--color-line)',
                        }}
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0"
                          style={{
                            height: `${v}%`,
                            background: v < 85 ? '#fb923c' : 'var(--color-red)',
                          }}
                        />
                      </div>
                      <span
                        className="text-[9px] mono"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        {['6d', '5d', '4d', '3d', '2d', '1d', 'now'][i]}
                      </span>
                      <span
                        className="text-[10px] mono tabular"
                        style={{ color: 'var(--color-ink)', fontWeight: 600 }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </MarketingReveal>

            <MarketingReveal delay={80}>
              <article
                className="rounded-xl border p-5"
                style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
              >
                <header className="flex items-baseline justify-between mb-3">
                  <h3 className="text-[13px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                    Escalation log
                  </h3>
                  <span className="text-[11px] mono" style={{ color: 'var(--color-muted)' }}>
                    {escalations.length} entries
                  </span>
                </header>
                {escalations.length === 0 ? (
                  <p className="text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
                    No escalations yet.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {escalations.map((e) => (
                      <li
                        key={e.id}
                        className="flex items-start gap-3 py-2.5 text-[12.5px] border-t first:border-t-0"
                        style={{ borderColor: 'var(--color-line)' }}
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{
                            background:
                              e.state === 'resolved'
                                ? 'var(--color-red)'
                                : e.state === 'acknowledged'
                                ? '#fb923c'
                                : 'var(--color-muted)',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                              {e.reason}
                            </span>
                            <span
                              className="text-[10px] uppercase tracking-[0.16em]"
                              style={{ color: 'var(--color-muted)', fontWeight: 700 }}
                            >
                              {e.state}
                            </span>
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                            {fmtDateTime(e.triggered_at)} · {e.acknowledged_by ?? '—'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </MarketingReveal>

            <MarketingReveal delay={140}>
              <article
                className="rounded-xl border p-5"
                style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
              >
                <header className="mb-3">
                  <h3 className="text-[13px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                    Family on this tenant
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    Each caregiver has their own chat history with the bot.
                  </p>
                </header>
                <ul className="space-y-1">
                  {detail.family.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 py-2 text-[12.5px] border-t first:border-t-0"
                      style={{ borderColor: 'var(--color-line)' }}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ background: p.id === user.id ? 'var(--color-red)' : 'var(--color-muted)' }}
                      />
                      <span className="flex-1" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                        {p.name}
                        {p.id === user.id && (
                          <span className="text-[10px] mono ml-2" style={{ color: 'var(--color-red)' }}>
                            (you)
                          </span>
                        )}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                        {p.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </MarketingReveal>
          </div>
        </div>

        {/* MEDS + APPOINTMENTS */}
        <div className="grid lg:grid-cols-12 gap-6 mt-6">
          <MarketingReveal className="lg:col-span-7">
            <article
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
            >
              <header
                className="px-5 py-4 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--color-line)' }}
              >
                <div>
                  <h3 className="text-[14px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                    Medication schedule
                  </h3>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    {detail.medications.filter((m) => m.active).length} active · refills routed to the
                    family.
                  </p>
                </div>
              </header>
              <div className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
                {detail.medications.length === 0 && (
                  <p className="p-5 text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
                    No medications yet.
                  </p>
                )}
                {detail.medications.map((m) => {
                  const adh = medicationAdherence30d(m.id, detail.adherence);
                  return (
                    <div
                      key={m.id}
                      className="grid grid-cols-12 gap-3 px-5 py-4 items-center"
                    >
                      <div className="col-span-12 md:col-span-5">
                        <div className="text-[13.5px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                          {m.name} {m.dosage}
                        </div>
                        <div
                          className="text-[11px] mono mt-0.5"
                          style={{ color: 'var(--color-muted)' }}
                        >
                          {m.schedule}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <div
                          className="text-[10px] uppercase tracking-[0.16em]"
                          style={{ color: 'var(--color-muted)', fontWeight: 600 }}
                        >
                          Refills left
                        </div>
                        <div className="text-[13px] mt-0.5" style={{ color: 'var(--color-ink)' }}>
                          {m.refills_remaining}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-4">
                        <div
                          className="text-[10px] uppercase tracking-[0.16em]"
                          style={{ color: 'var(--color-muted)', fontWeight: 600 }}
                        >
                          Adherence
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div
                            className="flex-1 h-2 rounded-full overflow-hidden"
                            style={{ background: 'var(--color-bg-soft)' }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${adh}%`,
                                background: adh < 85 ? '#fb923c' : 'var(--color-red)',
                              }}
                            />
                          </div>
                          <span
                            className="mono tabular text-[12px]"
                            style={{ color: 'var(--color-ink)', fontWeight: 700 }}
                          >
                            {adh}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </MarketingReveal>

          <MarketingReveal className="lg:col-span-5" delay={80}>
            <article
              className="rounded-xl border h-full"
              style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
            >
              <header className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-line)' }}>
                <h3 className="text-[14px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                  Upcoming appointments
                </h3>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  Agent sends 48-hour confirm; you get the 24-hour nudge.
                </p>
              </header>
              {upcomingAppointments.length === 0 ? (
                <p className="p-5 text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
                  Nothing scheduled.
                </p>
              ) : (
                <ul className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
                  {upcomingAppointments.map((a) => (
                    <li
                      key={a.id}
                      className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center"
                    >
                      <div className="col-span-4">
                        <div
                          className="text-[11px] uppercase tracking-[0.16em]"
                          style={{ color: 'var(--color-red)', fontWeight: 700 }}
                        >
                          {fmtDate(a.scheduled_for)}
                        </div>
                        <div
                          className="mono text-[13px] tabular mt-0.5"
                          style={{ color: 'var(--color-ink)', fontWeight: 600 }}
                        >
                          {fmtTime(a.scheduled_for)}
                        </div>
                      </div>
                      <div className="col-span-5">
                        <div className="text-[13px]" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                          {a.title}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                          {a.transport ?? ''}
                          {a.location ? ` · ${a.location}` : ''}
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <span
                          className="text-[10px] uppercase tracking-[0.18em]"
                          style={{
                            color: a.state === 'confirmed' ? 'var(--color-success, #16a34a)' : 'var(--color-muted)',
                            fontWeight: 700,
                          }}
                        >
                          {a.state}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </MarketingReveal>
        </div>
      </section>

      <footer
        className="max-w-[1400px] mx-auto px-6 py-8 border-t"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <p className="text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
          Live · connected to db · tenant <code>{user.tenant_id}</code> ·{' '}
          <Link href="/care/architecture" style={{ color: 'var(--color-red)' }}>
            how this is built
          </Link>
        </p>
      </footer>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: 'var(--color-muted)', fontWeight: 600 }}
      >
        {label}
      </div>
      <div
        className="mono tabular mt-1 text-[24px]"
        style={{ color: 'var(--color-ink)', fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        {value}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
        {sub}
      </div>
    </div>
  );
}

function VitalStat({
  label,
  vital,
  unit,
}: {
  label: string;
  vital?: { value: number; recorded_at: number };
  unit: string;
}) {
  if (!vital) {
    return <Stat label={label} value="—" sub="no data" />;
  }
  const d = new Date(vital.recorded_at * 1000);
  const hrs = Math.max(0, Math.round((Date.now() / 1000 - vital.recorded_at) / HOUR));
  return (
    <Stat
      label={label}
      value={`${vital.value.toString()} ${unit}`}
      sub={`${hrs}h ago`}
    />
  );
}
