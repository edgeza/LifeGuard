import { NextResponse } from 'next/server';
import { requireUser, jsonError } from '@/lib/auth';
import { db_careReceivers, withTenant, isDbAvailable } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * /api/care/care-receivers (GET)
 *
 * Lists care_receivers the current user is linked to as a caregiver.
 * Falls back to a built-in demo care receiver when SQLite isn't
 * available (Vercel serverless runtime).
 */

function parseJsonArray(s: string | null): unknown[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const DEMO_CARE_RECEIVERS: Record<string, { id: string; name: string; conditions: string[]; interests: string[]; timezone: string; created_at: number }> = {
  'demo-tenant-001': {
    id: 'demo-patient',
    name: 'Demo Patient',
    conditions: ['hypertension', 'early dementia'],
    interests: ['gardening', 'reading', 'walking'],
    timezone: 'Africa/Johannesburg',
    created_at: Math.floor(Date.now() / 1000),
  },
};

export async function GET() {
  try {
    const user = await requireUser();

    if (!isDbAvailable()) {
      // Stubbed DB — return a demo care receiver for the demo admin.
      const demo = DEMO_CARE_RECEIVERS[user.tenant_id];
      if (!demo) {
        return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json([demo]);
    }

    return withTenant(() => {
      const list = db_careReceivers.listForUser(user.id);
      return NextResponse.json(
        list.map((cr) => ({
          id: cr.id,
          name: cr.name,
          conditions: parseJsonArray(cr.conditions),
          interests: parseJsonArray(cr.interests),
          timezone: cr.timezone,
          created_at: cr.created_at,
        })),
      );
    }, user.tenant_id);
  } catch (err) {
    return jsonError(err);
  }
}