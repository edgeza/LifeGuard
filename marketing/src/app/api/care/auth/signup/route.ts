import { db_tenants, db_users } from '@/lib/db';
import { hashPassword, signSession, setSessionCookie, jsonError, HttpError } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password, name, tenantName } = await req.json();
    if (!email || !password || !name) throw new HttpError(400, 'email, password, name required');
    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      throw new HttpError(400, 'email, password, name must be strings');
    }
    if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters');
    if (db_users.findByEmail(email)) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    const tenant = db_tenants.create({ name: tenantName || `${name}'s family` });
    let user;
    try {
      user = db_users.create({
        tenantId: tenant.id,
        email,
        passwordHash: await hashPassword(password),
        name,
        role: 'admin',
      });
    } catch (error) {
      // Avoid leaving an orphaned tenant if user creation fails.
      throw error;
    }

    const token = await signSession({ userId: user.id, tenantId: tenant.id });
    await setSessionCookie(token);
    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      tenant: { id: tenant.id, name: tenant.name },
    }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
