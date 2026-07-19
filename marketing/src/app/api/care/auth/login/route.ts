import { db_users } from '@/lib/db';
import { HttpError, jsonError, setSessionCookie, signSession, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      throw new HttpError(400, 'email and password required');
    }

    const user = db_users.findByEmail(email);
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const token = await signSession({ userId: user.id, tenantId: user.tenant_id });
    await setSessionCookie(token);
    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    return jsonError(error);
  }
}
