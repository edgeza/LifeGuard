/**
 * run-cron.ts
 *
 * Hits each /api/care/cron/* endpoint in sequence using the cron
 * secret. Logs results.
 *
 *   cd marketing && npx tsx scripts/run-cron.ts
 */
const cronSecret = process.env.CRON_SECRET || 'dev-cron-secret';
const base = process.env.BASE_URL || 'http://127.0.0.1:3010';

interface CronResult {
  endpoint: string;
  status: number;
  body: unknown;
  ms: number;
}

async function runOne(endpoint: string): Promise<CronResult> {
  const url = `${base}/api/care/cron/${endpoint}`;
  const start = Date.now();
  let res: Response;
  try {
    res = await fetch(url, { headers: { 'X-Cron-Secret': cronSecret } });
  } catch (err) {
    return {
      endpoint,
      status: 0,
      body: { error: err instanceof Error ? err.message : 'fetch failed' },
      ms: Date.now() - start,
    };
  }
  const text = await res.text();
  let body: unknown = text;
  try { body = JSON.parse(text); } catch { /* keep text */ }
  return { endpoint, status: res.status, body, ms: Date.now() - start };
}

async function main(): Promise<void> {
  console.log(`[run-cron] base=${base}`);
  const results: CronResult[] = [];
  for (const endpoint of ['reminders', 'escalations', 'digest']) {
    const r = await runOne(endpoint);
    results.push(r);
    const tag = r.status >= 200 && r.status < 300 ? 'OK' : 'ERR';
    console.log(`[${tag}] ${endpoint.padEnd(12)} ${r.status}  ${r.ms}ms  ${JSON.stringify(r.body)}`);
  }

  const allOk = results.every((r) => r.status >= 200 && r.status < 300);
  console.log(`[run-cron] ${allOk ? 'all cron endpoints OK' : 'one or more cron endpoints failed'}`);
  if (!allOk) process.exit(1);
}

main().catch((err) => {
  console.error('[run-cron] fatal:', err);
  process.exit(1);
});
