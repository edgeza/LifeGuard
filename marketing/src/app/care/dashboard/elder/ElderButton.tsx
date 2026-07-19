'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function ElderButton(props: {
  receiverFirstName: string;
  fullDate: string;
  featured: { medicationId: string; name: string; dosage: string; scheduledForEpoch: number } | null;
  today: { id: string; label: string; time: string; status: 'done' | 'todo'; ts: string }[];
  tomorrow: { time: string; label: string; who: string }[];
}) {
  const router = useRouter();
  const [now, setNow] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState<'idle' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [todayList, setTodayList] = useState(props.today);
  const [featured, setFeatured] = useState(props.featured);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const hh = String(hour).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  async function confirmTookIt() {
    if (!featured) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/care/adherence/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId: featured.medicationId,
          confirmationSource: 'care_receiver',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Could not confirm');
      setConfirmState('done');
      // Reflect locally
      const t = new Date();
      const ts = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
      setTodayList((prev) =>
        prev.map((row) =>
          row.id === featured.medicationId ? { ...row, status: 'done', ts: `took at ${ts}` } : row,
        ),
      );
      // Refresh server data on next render (re-fetch care-receiver detail, bump next featured med).
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setConfirmState('error');
    } finally {
      setSubmitting(false);
    }
  }

  const allDoneToday = todayList.length > 0 && todayList.every((row) => row.status === 'done');

  return (
    <div className="w-full max-w-[480px] text-center">
      {/* tiny header */}
      <div className="flex items-center justify-between mb-8 opacity-70">
        <span className="text-[12px] mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
          LifeGuard
        </span>
        <span className="text-[12px] mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {props.fullDate}
        </span>
      </div>

      <p className="text-[20px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {greeting}, {props.receiverFirstName}.
      </p>

      {/* next reminder */}
      <h1
        className="mt-6 text-[40px] md:text-[56px] leading-[1.05]"
        style={{ color: '#fff', fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        It's {hh}:{mm}.
      </h1>
      <p className="mt-4 text-[18px] md:text-[20px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {featured
          ? confirmState === 'done' || allDoneToday
            ? 'All done for today. Well done.'
            : `Time for your ${featured.name.toLowerCase()}.`
          : 'No medication scheduled right now.'}
      </p>

      {/* one big button */}
      <div className="mt-10 flex justify-center">
        {featured ? (
          <button
            onClick={confirmTookIt}
            disabled={submitting || confirmState === 'done'}
            className="grid place-items-center rounded-full font-semibold transition-transform active:scale-95"
            style={{
              width: 220,
              height: 220,
              background:
                confirmState === 'done' ? '#16a34a' : confirmState === 'error' ? '#dc2626' : 'var(--color-red)',
              color: '#fff',
              fontSize: 26,
              boxShadow:
                confirmState === 'done'
                  ? '0 0 0 4px rgba(22,163,74,0.35), 0 30px 60px -20px rgba(22,163,74,0.55)'
                  : '0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -20px rgba(225,29,46,0.5)',
              opacity: submitting ? 0.7 : 1,
              cursor: confirmState === 'done' ? 'default' : 'pointer',
              transform: confirmState === 'done' ? 'scale(1.05)' : 'scale(1)',
              transition: 'background 200ms, transform 200ms, box-shadow 200ms',
            }}
          >
            {confirmState === 'done'
              ? 'Logged ✓'
              : confirmState === 'error'
              ? 'Try again'
              : submitting
              ? 'Sending…'
              : 'I took it'}
          </button>
        ) : (
          <div
            className="grid place-items-center rounded-full"
            style={{
              width: 220,
              height: 220,
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 18,
            }}
          >
            No dose due
          </div>
        )}
      </div>

      <p className="mt-6 text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
        or say &ldquo;no&rdquo; out loud
      </p>

      {error && (
        <p
          className="mt-4 text-[13px] p-2 rounded-md"
          style={{
            color: '#fecaca',
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.3)',
          }}
        >
          {error}
        </p>
      )}

      {/* quiet log of today */}
      <div className="mt-12 text-left">
        <div
          className="text-[11px] uppercase tracking-[0.18em] mb-3"
          style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}
        >
          Today
        </div>
        {todayList.length === 0 ? (
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Nothing scheduled for today.
          </p>
        ) : (
          <ul className="space-y-2">
            {todayList.map((a) => (
              <li
                key={a.id}
                className="flex items-baseline gap-3 text-[15px]"
                style={{
                  color: a.status === 'done' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.85)',
                }}
              >
                <span
                  className="mono tabular shrink-0 w-12"
                  style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}
                >
                  {a.time}
                </span>
                <span
                  className="flex-1"
                  style={{ textDecoration: a.status === 'done' ? 'line-through' : 'none' }}
                >
                  {a.label}
                </span>
                {a.status === 'done' && (
                  <span className="text-[12px]" style={{ color: '#86efac', fontWeight: 600 }}>
                    ✓
                  </span>
                )}
                {a.ts && (
                  <span className="text-[12px] mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {a.ts}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* tomorrow */}
      {props.tomorrow.length > 0 && (
        <div className="mt-8 text-left">
          <div
            className="text-[11px] uppercase tracking-[0.18em] mb-3"
            style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}
          >
            Tomorrow
          </div>
          <ul className="space-y-2">
            {props.tomorrow.map((a, i) => (
              <li
                key={i}
                className="flex items-baseline gap-3 text-[15px]"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                <span
                  className="mono tabular shrink-0 w-12"
                  style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}
                >
                  {a.time}
                </span>
                <span className="flex-1">{a.label}</span>
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {a.who}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* footer */}
      <div className="mt-12 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          This is the elder view. No AI chat. No login. No settings on the device.{' '}
          <Link href="/care/dashboard" className="underline" style={{ color: 'rgba(255,255,255,0.6)' }}>
            back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
