import { clearSessionCookie, jsonError } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await clearSessionCookie();
    // If the request came from a browser form submission, redirect to /login.
    // If it's an API call (JSON Accept header), return JSON.
    const accept = req.headers.get('accept') ?? '';
    if (accept.includes('text/html')) {
      return Response.redirect(new URL('/login', req.url), 303);
    }
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}