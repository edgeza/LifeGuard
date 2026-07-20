import { HttpError, jsonError, setSessionCookie, signSession } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * /api/care/auth/login (POST)
 *
 * Tries DB-backed user lookup first (works locally with SQLite).
 * Falls back to a built-in hardcoded credential for demo / Vercel
 * where the SQLite file may not be writable.
 *
 * The hardcoded admin is intentionally weak — it's a demo
 * placeholder. In production this whole path is replaced by a
 * real auth provider (Clerk, Auth0, in-house).
 */

const DEMO_ACCOUNTS: Record<string, { password: string; userId: string; tenantId: string; name: string; role: string }> = {
  'admin@life.guard': { password: 'admin', userId: 'admin', tenantId: 'demo-tenant-001', name: 'Admin', role: 'admin' },
};

async function tryDbLogin(email: string, password: string) {
  try {
    const { db_users } = await import('@/lib/db');
    const { verifyPassword } = await import('@/lib/auth');
    const user = db_users.findByEmail(email);
    if (!user) return null;
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenant_id,
    };
  } catch {
    // SQLite native binding not available (e.g. on Vercel serverless).
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      throw new HttpError(400, 'email and password required');
    }

    // 1. Try DB-backed lookup first.
    const dbUser = await tryDbLogin(email, password);
    if (dbUser) {
      const token = await signSession({ userId: dbUser.id, tenantId: dbUser.tenantId });
      await setSessionCookie(token);
      return Response.json({
        user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role },
      });
    }

    // 2. Fall back to built-in demo account (so /login works on Vercel).
    const demo = DEMO_ACCOUNTS[email.toLowerCase()];
    if (demo && demo.password === password) {
      const token = await signSession({ userId: demo.userId, tenantId: demo.tenantId });
      await setSessionCookie(token);
      return Response.json({
        user: { id: demo.userId, email, name: demo.name, role: demo.role },
      });
    }

    throw new HttpError(401, 'Invalid email or password');
  } catch (error) {
    return jsonError(error);
  }
}