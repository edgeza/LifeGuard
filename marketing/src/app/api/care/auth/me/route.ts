import { getCurrentUser, jsonError } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: 'Not authenticated' }, { status: 401 });

    // Try DB for tenant name; fall back to a default.
    let tenant = { id: user.tenant_id, name: 'Demo Family' };
    try {
      const { db_tenants } = await import('@/lib/db');
      const t = db_tenants.findById(user.tenant_id);
      if (t) tenant = { id: t.id, name: t.name };
    } catch {
      // SQLite unavailable on Vercel — keep the default tenant.
    }

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      tenant,
    });
  } catch (error) {
    return jsonError(error);
  }
}