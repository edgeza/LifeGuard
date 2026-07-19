import path from 'node:path';
import bcrypt from 'bcryptjs';
import { db } from './index';

const DEMO_TENANT_ID = 'demo-tenant-001';
const ADMIN_PASSWORD = 'admin';
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

  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);

  const insert = db.transaction(() => {
    // Tenant
    db.prepare('INSERT INTO tenants (id, name) VALUES (?, ?)').run(
      DEMO_TENANT_ID,
      'Demo Family'
    );

    // Single default admin user — anyone can log in with admin / admin
    db.prepare(`
      INSERT INTO users (id, tenant_id, email, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'admin',
      DEMO_TENANT_ID,
      'admin@life.guard',
      passwordHash,
      'Admin',
      'admin'
    );

    // Demo care receiver (the elder)
    db.prepare(`
      INSERT INTO care_receivers (id, tenant_id, name, conditions, interests, timezone)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'demo-patient',
      DEMO_TENANT_ID,
      'Demo Patient',
      JSON.stringify(['hypertension', 'early dementia']),
      JSON.stringify(['gardening', 'reading', 'walking']),
      'Africa/Johannesburg'
    );

    // Default agent (bot) for the care receiver
    db.prepare(`
      INSERT INTO agents (id, tenant_id, care_receiver_id, name, email, personality, system_prompt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'demo-agent',
      DEMO_TENANT_ID,
      'demo-patient',
      'Aria',
      'aria@care.life.guard',
      'pragmatic',
      "You are Aria, a caring but pragmatic companion for the demo patient. You remind them about medications, confirm appointments, and escalate to the admin if they don't respond. Keep responses short. Use plain language."
    );

    // Link admin to the care receiver
    db.prepare('INSERT INTO caregiver_links (user_id, care_receiver_id) VALUES (?, ?)').run(
      'admin',
      'demo-patient'
    );

    // 4 medications
    const medications = [
      ['med-metformin', 'Metformin', '500mg', '08:00 daily'],
      ['med-aspirin', 'Aspirin', '100mg', '08:00 daily'],
      ['med-atorvastatin', 'Atorvastatin', '20mg', '21:00 daily'],
      ['med-vitamin-d3', 'Vitamin D3', '1000IU', '08:00 daily'],
    ] as const;
    const insertMedication = db.prepare(`
      INSERT INTO medications (id, care_receiver_id, name, dosage, schedule, refills_remaining, active)
      VALUES (?, 'demo-patient', ?, ?, ?, ?, 1)
    `);
    medications.forEach(([id, name, dosage, schedule], index) => {
      insertMedication.run(id, name, dosage, schedule, [3, 2, 1, 5][index]);
    });

    // Appointments — fixed dates (next week) + relative dates (today/tomorrow)
    const insertAppointment = db.prepare(`
      INSERT OR IGNORE INTO appointments (id, care_receiver_id, title, scheduled_for, location, transport, state)
      VALUES (?, 'demo-patient', ?, ?, ?, ?, ?)
    `);
    insertAppointment.run('appt-doctor', 'Doctor checkup', epoch('2026-07-24T10:15:00+02:00'), 'Main clinic', 'Family driving', 'confirmed');
    insertAppointment.run('appt-pharmacy', 'Pharmacy refill', epoch('2026-07-26T09:30:00+02:00'), 'Local pharmacy', 'Family pickup', 'scheduled');

    const now = Math.floor(Date.now() / 1000);
    insertAppointment.run('appt-pharmacy-tomorrow', 'Pharmacy refill', now + 1 * 24 * 3600, 'Local pharmacy', 'Family pickup', 'scheduled');
    insertAppointment.run('appt-club-tomorrow', 'Community group', now + 1 * 24 * 3600 + 4 * 3600, 'Community Hall', 'Family driving', 'scheduled');

    // Adherence events — last 14 days, mixed confirmed/late/missed
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

    // Past escalations (all resolved — operator handled them)
    const insertEscalation = db.prepare(`
      INSERT INTO escalations (id, agent_id, triggered_at, reason, state, acknowledged_by, resolved_at)
      VALUES (?, 'demo-agent', ?, ?, 'resolved', 'admin', ?)
    `);
    insertEscalation.run('esc-missed-dose', now - 6 * DAY, 'Missed evening medication.', now - 6 * DAY + HOUR);
    insertEscalation.run('esc-after-hours-chat', now - 4 * DAY, 'Confused after-hours chat.', now - 4 * DAY + 30 * 60);
    insertEscalation.run('esc-hr-spike', now - 2 * DAY, 'Heart rate spike detected.', now - 2 * DAY + 20 * 60);

    // Vitals — last 7 days
    const insertVital = db.prepare('INSERT INTO vitals (care_receiver_id, metric, value, recorded_at) VALUES (?, ?, ?, ?)');
    const readings = [
      [72, 98, 61], [68, 97, 66], [75, 96, 58], [81, 95, 49],
      [70, 99, 70], [85, 96, 45], [73, 98, 63],
    ] as const;
    readings.forEach(([heartRate, spo2, hrv], index) => {
      const recordedAt = now - (6 - index) * DAY;
      insertVital.run('demo-patient', 'heart_rate', heartRate, recordedAt);
      insertVital.run('demo-patient', 'spo2', spo2, recordedAt);
      insertVital.run('demo-patient', 'hrv', hrv, recordedAt);
    });
  });

  insert();
  console.log(`Seeded ${DEMO_TENANT_ID}. Login: admin@life.guard / ${ADMIN_PASSWORD}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  seed();
}