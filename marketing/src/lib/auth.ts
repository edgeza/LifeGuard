import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { db_users, db_tenants, setActiveTenant, type User, type Tenant } from './db';

const SESSION_COOKIE = 'lg_session';
const SESSION_TTL = '7d';
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'lifeguard-dev-secret-do-not-use-in-prod-replace-this-2026-07',
);

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signSession(payload: { userId: string; tenantId: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(SESSION_SECRET);
}

export async function verifySession(token: string): Promise<{ userId: string; tenantId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    if (typeof payload.userId !== 'string' || typeof payload.tenantId !== 'string') return null;
    return { userId: payload.userId, tenantId: payload.tenantId };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const user = db_users.findById(session.userId);
  if (!user || user.tenant_id !== session.tenantId) return null;
  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, 'Not authenticated');
  // Set the active tenant for the duration of this synchronous call frame
  // so all subsequent db_* queries filter by the right tenant.
  setActiveTenant(user.tenant_id);
  return user;
}

export async function requireTenant(): Promise<{ user: User; tenant: Tenant }> {
  const user = await requireUser();
  const tenant = db_tenants.findById(user.tenant_id);
  if (!tenant) throw new HttpError(403, 'Tenant not found');
  return { user, tenant };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export function jsonError(error: unknown): Response {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  return Response.json({ error: message }, { status: 500 });
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
