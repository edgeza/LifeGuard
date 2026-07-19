/**
 * seed-vitals.ts
 *
 * Generates 7 days × 24 hours = 168 vitals readings per care_receiver
 * across four metrics. Idempotent: bails out if readings already exist
 * for the most-recent 7-day window for a receiver.
 *
 *   cd marketing && npx tsx scripts/seed-vitals.ts
 */
import { db } from '../db';
import { db_vitals } from '../src/lib/db';

const HOUR = 60 * 60;
const DAY = 24 * HOUR;
const WINDOW_DAYS = 7;

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate one hour of plausible vitals for a healthy elderly person.
 * HR: 60-85 baseline with ~1% spike probability.
 * SpO2: 96-99
 * HRV: 40-80
 * Temp: 36.4-37.0
 */
function generateHour(nowSec: number): Array<{ metric: string; value: number; recordedAt: number }> {
  const hr = Math.random() < 0.01 ? rand(91, 110) : rand(60, 85);
  return [
    { metric: 'hr', value: Math.round(hr), recordedAt: nowSec },
    { metric: 'spo2', value: Math.round(rand(96, 99)), recordedAt: nowSec },
    { metric: 'hrv', value: Math.round(rand(40, 80)), recordedAt: nowSec },
    { metric: 'temp', value: Number(rand(36.4, 37.0).toFixed(1)), recordedAt: nowSec },
  ];
}

function main(): void {
  const now = Math.floor(Date.now() / 1000);
  // Phase 1's db_careReceivers.listForUser requires a userId; for the
  // seed we want all receivers regardless of who owns them, so we
  // hit the raw db directly.
  const receivers = db.prepare('SELECT * FROM care_receivers').all() as { id: string; name: string }[];
  if (receivers.length === 0) {
    console.log('No care receivers found. Run db/seed.ts first.');
    return;
  }

  let totalInserted = 0;
  const windowStart = now - WINDOW_DAYS * DAY;

  for (const cr of receivers) {
    const existing = db
      .prepare('SELECT COUNT(*) AS n FROM vitals WHERE care_receiver_id = ? AND recorded_at >= ?')
      .get(cr.id, windowStart) as { n: number };

    if (existing.n >= WINDOW_DAYS * 24) {
      console.log(`[${cr.name}] already has ${existing.n} vitals in window — skipping.`);
      continue;
    }

    let inserted = 0;
    for (let day = WINDOW_DAYS - 1; day >= 0; day--) {
      for (let hour = 0; hour < 24; hour++) {
        const recordedAt = now - day * DAY - (23 - hour) * HOUR;
        for (const reading of generateHour(recordedAt)) {
          db_vitals.create({
            careReceiverId: cr.id,
            metric: reading.metric,
            value: reading.value,
            recordedAt: reading.recordedAt,
          });
          inserted += 1;
        }
      }
    }

    totalInserted += inserted;
    console.log(`[${cr.name}] inserted ${inserted} vitals (${WINDOW_DAYS} days × 24 hours × 4 metrics).`);
  }

  console.log(`Done. ${totalInserted} vitals inserted across ${receivers.length} care receiver(s).`);
}

main();
