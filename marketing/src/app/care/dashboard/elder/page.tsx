import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ElderButton } from './ElderButton';
import type { Medication, AdherenceEvent } from '@/lib/db';

export const metadata = {
  title: "Marlene's view — LifeGuard",
  description:
    'Minimalist elder-side view. Just the next reminder and one big button. No AI chat, no app, no settings.',
};

// Minimalist elder view — what the care receiver sees on the small hardware
// screen or the family-shared phone. Per the privacy refactor: NO AI chat on
// the elder's side.
//
// PRODUCTION NOTE: real prod strips auth entirely — this page is rendered
// onto a small e-ink screen on the dedicated device. The device has no
// keyboard, no account UI, just a "I took it" button. For MVP (and
// because every tenant is gated by middleware) we keep auth here; the
// route still works without it because the middleware only forces a
// redirect — when the elder's hardware device is given a token cookie
// via the family setup flow, this page loads directly.
//
// Server component: fetch the care receiver detail with the caller's
// cookie, pick the next pending medication, hand to client island.

const HOUR = 3_600;
const DAY = 86_400;

type DetailMedication = Pick<Medication, 'id' | 'name' | 'dosage' | 'schedule' | 'active'>;
type DetailAdherence = Pick<AdherenceEvent, 'medication_id' | 'status' | 'scheduled_for'>;
type DetailResp = {
  careReceiver: { id: string; name: string; timezone: string };
  medications: DetailMedication[];
  adherence: DetailAdherence[];
  appointments?: { title: string; scheduled_for: number; transport: string | null }[];
};

async function getJSON<T>(path: string): Promise<T | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3010';
  const { cookies } = await import('next/headers');
  const c = await cookies();
  const token = c.get('lg_session')?.value;
  try {
    const res = await fetch(new URL(path, base), {
      cache: 'no-store',
      headers: token ? { Cookie: `lg_session=${token}` } : {},
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function todayStartSec(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

function todayEndSec(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return Math.floor(d.getTime() / 1000);
}

function doseTimeSec(schedule: string): { hour: number; minute: number } {
  const m = schedule.match(/(\d{1,2}):(\d{2})/);
  return m ? { hour: Number(m[1]), minute: Number(m[2]) } : { hour: 9, minute: 0 };
}

function fmtDate(d: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default async function ElderViewPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?from=/care/dashboard/elder');

  // Pick care receiver — first listed.
  const list = await getJSON<{ id: string; name: string }[]>('/api/care/care-receivers');
  if (!list || list.length === 0) {
    return (
      <main className="min-h-screen grid place-items-center p-4" style={{ background: '#0a0a0a' }}>
        <div className="text-center" style={{ color: 'rgba(255,255,255,0.85)' }}>
          <p className="text-[20px]">No care receiver set up yet.</p>
          <Link
            href="/care/onboarding"
            className="mt-4 inline-block underline"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Set up the agent first →
          </Link>
        </div>
      </main>
    );
  }

  const receiverId = list[0].id;
  const detail = await getJSON<DetailResp>(`/api/care/care-receivers/${receiverId}`);
  if (!detail) {
    return (
      <main className="min-h-screen grid place-items-center p-4" style={{ background: '#0a0a0a' }}>
        <div className="text-center" style={{ color: 'rgba(255,255,255,0.85)' }}>
          <p>Couldn’t load this care receiver.</p>
          <Link href="/care/dashboard" className="underline" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const receiverName = detail.careReceiver.name.split(' ')[0]; // first name only

  // Decide which medication to feature on the giant button.
  // 1. Among today's scheduled doses, find an un-confirmed one whose dose
  //    time is at or before the next 60-minute window.
  // 2. Otherwise the active medication with the next upcoming dose time.
  // 3. Otherwise no medication.
  const startSec = todayStartSec();
  const endSec = todayEndSec();
  const nowSec = Math.floor(Date.now() / 1000);

  type ScheduledDose = { medication: DetailMedication; scheduledFor: number; confirmed: boolean };
  const allDoses: ScheduledDose[] = [];
  for (const med of detail.medications.filter((m) => m.active)) {
    const { hour, minute } = doseTimeSec(med.schedule);
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);
    const scheduledFor = Math.floor(scheduled.getTime() / 1000);
    if (scheduledFor >= startSec && scheduledFor <= endSec) {
      const confirmedToday = detail.adherence.some(
        (ae) =>
          ae.medication_id === med.id &&
          ae.status === 'confirmed' &&
          ae.scheduled_for >= startSec &&
          ae.scheduled_for <= endSec,
      );
      allDoses.push({ medication: med, scheduledFor, confirmed: confirmedToday });
    }
  }
  allDoses.sort((a, b) => a.scheduledFor - b.scheduledFor);

  // Build a list for the "Today" log: every today's scheduled dose + its confirmation state.
  const todayList: { id: string; label: string; time: string; status: 'done' | 'todo'; ts: string }[] =
    allDoses.map((d) => ({
      id: d.medication.id,
      label: `${d.medication.name} ${d.medication.dosage}`,
      time: new Date(d.scheduledFor * 1000).toTimeString().slice(0, 5),
      status: d.confirmed ? 'done' : 'todo',
      ts: '', // filled in on confirm via client update
    }));

  // The featured medication is the earliest undosed-or-past-due dose, OR
  // (if everything today is confirmed) the next future dose today.
  const featured: ScheduledDose | undefined =
    allDoses.find((d) => !d.confirmed && d.scheduledFor <= nowSec) ??
    allDoses.find((d) => !d.confirmed) ??
    allDoses[0];

  const tomorrow = (detail.appointments ?? [])
    .filter((a) => a.scheduled_for >= nowSec && a.scheduled_for <= nowSec + 2 * DAY)
    .slice(0, 3);

  return (
    <main className="min-h-screen grid place-items-center p-4" style={{ background: '#0a0a0a' }}>
      <ElderViewBody
        receiverFirstName={receiverName}
        fullDate={fmtDate(new Date())}
        featured={
          featured
            ? {
                medicationId: featured.medication.id,
                name: featured.medication.name,
                dosage: featured.medication.dosage,
                scheduledForEpoch: featured.scheduledFor,
              }
            : null
        }
        today={todayList}
        tomorrow={tomorrow.map((a) => ({
          time: new Date(a.scheduled_for * 1000).toTimeString().slice(0, 5),
          label: a.title,
          who: a.transport ?? '',
        }))}
      />
    </main>
  );
}

function ElderViewBody(props: {
  receiverFirstName: string;
  fullDate: string;
  featured: { medicationId: string; name: string; dosage: string; scheduledForEpoch: number } | null;
  today: { id: string; label: string; time: string; status: 'done' | 'todo'; ts: string }[];
  tomorrow: { time: string; label: string; who: string }[];
}) {
  // This is a client island — server pre-renders initial state.
  return (
    <ElderButton {...props} />
  );
}
