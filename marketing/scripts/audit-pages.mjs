/**
 * Audit every marketing page at 1440px, save screenshots,
 * print one-line summary per page. Use the output to decide
 * which pages need polish.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');

const BASE = 'http://127.0.0.1:3010';
const OUT = 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const pages = [
  { name: 'home',         url: '/' },
  { name: 'products',     url: '/products' },
  { name: 'for-whom',     url: '/for-whom' },
  { name: 'pricing',      url: '/pricing' },
  { name: 'trust',        url: '/trust' },
  { name: 'docs',         url: '/docs' },
  { name: 'care',         url: '/care' },
  { name: 'care-arch',    url: '/care/architecture' },
  { name: 'care-onboard', url: '/care/onboarding' },
  { name: 'changelog',    url: '/changelog' },
  { name: 'careers',      url: '/careers' },
  { name: 'about',        url: '/about' },
  { name: 'status',       url: '/status' },
  { name: 'integration',  url: '/integration' },
  { name: 'login',        url: '/login' },
  { name: 'signup',       url: '/signup' },
];

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });

const results = [];
for (const p of pages) {
  const page = await ctx.newPage();
  let status = 0, error = null;
  try {
    const res = await page.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 20000 });
    status = res?.status() ?? 0;
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/audit-${p.name}.png`, fullPage: false });
  } catch (e) {
    error = e.message;
  }
  results.push({ name: p.name, url: p.url, status, error });
  await page.close();
}

// Repeat with auth for the gated pages
await ctx.request.post(BASE + '/api/care/auth/login', {
  data: { email: 'lerato@demo.lifeguard', password: 'demo1234' }
});
const gated = [
  { name: 'dashboard',       url: '/care/dashboard' },
  { name: 'dashboard-elder', url: '/care/dashboard/elder' },
];
for (const p of gated) {
  const page = await ctx.newPage();
  let status = 0, error = null;
  try {
    const res = await page.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 20000 });
    status = res?.status() ?? 0;
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/audit-${p.name}.png`, fullPage: false });
  } catch (e) {
    error = e.message;
  }
  results.push({ name: p.name, url: p.url, status, error });
  await page.close();
}

await browser.close();

console.log('\n=== AUDIT RESULTS ===');
for (const r of results) {
  const flag = r.status === 200 ? '✓' : '✗';
  console.log(`${flag} ${r.name.padEnd(20)} ${String(r.status).padEnd(4)} ${r.url}${r.error ? '  err=' + r.error.slice(0, 50) : ''}`);
}
console.log(`\nScreenshots in ${OUT}/audit-*.png`);