import { db_tenants } from '@/lib/db';
import { getCurrentUser, jsonError } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: 'Not authenticated' }, { status: 401 });
    const tenant = db_tenants.findById(user.tenant_id);
    if (!tenant) return Response.json({ error: 'Tenant not found' }, { status: 403 });

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      tenant: { id: tenant.id, name: tenant.name },
    });
  } catch (error) {
    return jsonError(error);
  }
}
