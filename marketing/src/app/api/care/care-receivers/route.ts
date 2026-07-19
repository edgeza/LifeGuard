import { NextResponse } from 'next/server';
import { requireUser, jsonError } from '@/lib/auth';
import { db_careReceivers, withTenant } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * /api/care/care-receivers (GET)
 * Lists care_receivers the current user is linked to as a caregiver.
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

export async function GET() {
  try {
    const user = await requireUser();
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
