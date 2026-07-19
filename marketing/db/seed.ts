import path from 'node:path';
import bcrypt from 'bcryptjs';
import { db } from './index';

const DEMO_TENANT_ID = 'demo-family-001';
const PASSWORD = 'demo1234';
const HOUR = 60 * 60;
const DAY = 24 * HOUR;

function epoch(iso: string): number {
  return Math.floor(new Date(iso).getTime() / 1000);
}

export function seed(): void {
  if (db.prepare('SELECT 1 FROM tenants WHERE id = ?').get(DEMO_TENANT_ID)) {
    console.log('Demo tenant already exists; seed skipped.');
    return;
  }

  const passwordHash = bcrypt.hashSync(PASSWORD, 10);
  const users = [
    ['lerato', 'lerato@demo.lifeguard', 'Lerato van Wyk', 'caregiver'],
    ['marlene', 'marlene@demo.lifeguard', 'Marlene Botha', 'caregiver'],
    ['julian', 'julian@demo.lifeguard', 'Julian van Wyk', 'caregiver'],
    ['sandra', 'sandra@demo.lifeguard', 'Sandra Naidoo', 'caregiver'],
  ] as const;

  const medications = [
    ['med-metformin', 'Metformin', '500mg', '08:00 daily'],
    ['med-aspirin', 'Aspirin', '100mg', '08:00 daily'],
    ['med-atorvastatin', 'Atorvastatin', '20mg', '21:00 daily'],
    ['med-vitamin-d3', 'Vitamin D3', '1000IU', '08:00 daily'],
  ] as const;

  const insert = db.transaction(() => {
    db.prepare('INSERT INTO tenants (id, name) VALUES (?, ?)').run(DEMO_TENANT_ID, 'van Wyk family');

    const insertUser = db.prepare('INSERT INTO users (id, tenant_id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)');
    for (const [id, email, name, role] of users) {
      insertUser.run(id, DEMO_TENANT_ID, email, passwordHash, name, role);
    }

    db.prepare(`
      INSERT INTO care_receivers (id, tenant_id, name, conditions, interests, timezone)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'marlene',
      DEMO_TENANT_ID,
      'Marlene van Wyk',
      JSON.stringify(['hypertension', 'early dementia']),
      JSON.stringify(['gardening', 'the cats', 'her grandchildren']),
      'Africa/Johannesburg',
    );

    db.prepare(`
      INSERT INTO agents (id, tenant_id, care_receiver_id, name, email, personality, system_prompt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'esther',
      DEMO_TENANT_ID,
      'marlene',
      'Esther',
      'esther@care.life.guard',
      'pragmatic',
      "You are Esther, a caring but pragmatic companion for Marlene van Wyk. You remind her about medications, confirm appointments, and escalate to her daughter Lerato if she doesn't respond. Keep responses short. Use plain language.",
    );

    const link = db.prepare('INSERT INTO caregiver_links (user_id, care_receiver_id) VALUES (?, ?)');
    for (const [userId] of users) link.run(userId, 'marlene');

    const insertMedication = db.prepare(`
      INSERT INTO medications (id, care_receiver_id, name, dosage, schedule, refills_remaining, active)
      VALUES (?, 'marlene', ?, ?, ?, ?, 1)
    `);
    medications.forEach(([id, name, dosage, schedule], index) => {
      insertMedication.run(id, name, dosage, schedule, [3, 2, 1, 5][index]);
    });

    const insertAppointment = db.prepare(`
      INSERT INTO appointments (id, care_receiver_id, title, scheduled_for, location, transport, state)
      VALUES (?, 'marlene', ?, ?, ?, ?, ?)
    `);
    insertAppointment.run('appt-dr-patel', 'Dr Patel', epoch('2026-07-24T10:15:00+02:00'), 'Dr Patel\'s rooms', 'Lerato driving', 'confirmed');
    insertAppointment.run('appt-pharmacy', 'Pharmacy', epoch('2026-07-26T09:30:00+02:00'), 'Clicks Pharmacy', 'Family pickup', 'scheduled');
    insertAppointment.run('appt-optometrist', 'Optometrist', epoch('2026-07-28T11:00:00+02:00'), 'Vision Works', 'Julian driving', 'scheduled');
    insertAppointment.run('appt-hair', 'Hair', epoch('2026-08-01T14:00:00+02:00'), 'Salon Marais', 'Sandra driving', 'scheduled');

    const now = Math.floor(Date.now() / 1000);
    const adherenceStatuses = [
      'confirmed', 'confirmed', 'late', 'confirmed', 'confirmed', 'missed', 'confirmed',
      'confirmed', 'late', 'confirmed', 'confirmed', 'confirmed', 'missed', 'confirmed',
    ] as const;
    const insertAdherence = db.prepare(`
      INSERT INTO adherence_events (id, medication_id, scheduled_for, confirmed_at, confirmation_source, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    adherenceStatuses.forEach((status, index) => {
      const dayAgo = Math.floor(index / 2) + 1;
      const scheduledFor = now - dayAgo * DAY + (index % 2 === 0 ? 8 * HOUR : 21 * HOUR);
      const confirmedAt = status === 'missed' ? null : scheduledFor + (status === 'late' ? 2 * HOUR : 10 * 60);
      insertAdherence.run(
        `adherence-${String(index + 1).padStart(2, '0')}`,
        index % 2 === 0 ? 'med-metformin' : 'med-atorvastatin',
        scheduledFor,
        confirmedAt,
        status === 'missed' ? null : 'chat',
        status,
      );
    });

    const insertEscalation = db.prepare(`
      INSERT INTO escalations (id, agent_id, triggered_at, reason, state, acknowledged_by, resolved_at)
      VALUES (?, 'esther', ?, ?, 'resolved', 'lerato', ?)
    `);
    insertEscalation.run('esc-missed-dose', now - 6 * DAY, 'Marlene did not confirm her evening medication.', now - 6 * DAY + HOUR);
    insertEscalation.run('esc-after-hours-chat', now - 4 * DAY, 'Marlene reported feeling confused during an after-hours chat.', now - 4 * DAY + 30 * 60);
    insertEscalation.run('esc-hr-spike', now - 2 * DAY, 'Heart rate spike detected above Marlene\'s normal range.', now - 2 * DAY + 20 * 60);

    const insertVital = db.prepare('INSERT INTO vitals (care_receiver_id, metric, value, recorded_at) VALUES (?, ?, ?, ?)');
    const readings = [
      [72, 98, 61], [68, 97, 66], [75, 96, 58], [81, 95, 49],
      [70, 99, 70], [85, 96, 45], [73, 98, 63],
    ] as const;
    readings.forEach(([heartRate, spo2, hrv], index) => {
      const recordedAt = now - (6 - index) * DAY;
      insertVital.run('marlene', 'heart_rate', heartRate, recordedAt);
      insertVital.run('marlene', 'spo2', spo2, recordedAt);
      insertVital.run('marlene', 'hrv', hrv, recordedAt);
    });
  });

  insert();
  console.log(`Seeded ${DEMO_TENANT_ID}. Login: lerato@demo.lifeguard / ${PASSWORD}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  seed();
}
