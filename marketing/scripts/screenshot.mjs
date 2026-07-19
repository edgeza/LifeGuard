// scripts/screenshot.mjs — one-shot visual verification of key pages
// Uses playwright-core with the system Chrome binary (avoids 200MB download).
// Captures the home hero, caregiver dashboard, elder view, and onboarding.

import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = process.env.SCREENSHOTS_DIR || 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens';
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3010';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const PAGES = [
  { name: '01-home',                 url: '/',                wait: 'domcontentloaded' },
  { name: '02-products',             url: '/products',        wait: 'networkidle' },
  { name: '03-care',                 url: '/care',            wait: 'networkidle' },
  { name: '04-care-architecture',    url: '/care/architecture', wait: 'networkidle' },
  { name: '05-care-onboarding',      url: '/care/onboarding', wait: 'networkidle' },
  { name: '06-pricing',              url: '/pricing',         wait: 'networkidle' },
  { name: '07-trust',                url: '/trust',           wait: 'networkidle' },
  { name: '08-integration',          url: '/integration',     wait: 'networkidle' },
  { name: '09-login',                url: '/login',           wait: 'networkidle' },
  { name: '10-signup',               url: '/signup',          wait: 'networkidle' },
  // Auth-gated pages need a session cookie
  { name: '11-dashboard',            url: '/care/dashboard',     wait: 'networkidle', auth: true },
  { name: '12-dashboard-elder',      url: '/care/dashboard/elder', wait: 'networkidle', auth: true },
];

async function login(context) {
  const res = await context.request.post(`${BASE}/api/care/auth/login`, {
    data: { email: 'lerato@demo.lifeguard', password: 'demo1234' },
  });
  if (!res.ok()) throw new Error(`Login failed: ${res.status()}`);
}

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  // Login first so subsequent pages have the session cookie
  await login(context);

  for (const page of PAGES) {
    const p = await context.newPage();
    console.log(`[${page.name}] ${BASE}${page.url}`);
    try {
      const res = await p.goto(`${BASE}${page.url}`, { waitUntil: page.wait, timeout: 15000 });
      // Wait for the aurora / hero animations to settle
      await p.waitForTimeout(800);
      const status = res?.status() ?? 0;
      const out = path.join(OUT_DIR, `${page.name}.png`);
      await p.screenshot({ path: out, fullPage: false });
      console.log(`  status=${status}  -> ${out}`);
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
    } finally {
      await p.close();
    }
  }
  await browser.close();
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
