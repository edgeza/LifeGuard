// scripts/screenshot-onboarding.mjs — capture the new-user onboarding flow
import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens';
fs.mkdirSync(OUT_DIR, { recursive: true });
const BASE = 'http://127.0.0.1:3010';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

// 1. Login as the new test user via API request (sets session cookie)
const loginRes = await context.request.post(`${BASE}/api/care/auth/login`, {
  data: { email: 'newuser@test.lifeguard', password: 'newuser1234' },
});
if (!loginRes.ok()) throw new Error(`Login failed: ${loginRes.status()}`);

// 2. Navigate to /care/dashboard — middleware should redirect to /care/onboarding
const p = await context.newPage();
console.log('[onboarding-step1] /care/dashboard (should redirect to onboarding)');
const res = await p.goto(`${BASE}/care/dashboard`, { waitUntil: 'networkidle', timeout: 15000 });
console.log('  final URL:', p.url());
console.log('  status:', res?.status());
await p.waitForTimeout(1000);
await p.screenshot({ path: path.join(OUT_DIR, '13-onboarding-step1.png') });
await p.close();

// 3. Navigate to /care/onboarding directly
const p2 = await context.newPage();
console.log('[onboarding-direct] /care/onboarding');
await p2.goto(`${BASE}/care/onboarding`, { waitUntil: 'networkidle', timeout: 15000 });
await p2.waitForTimeout(1500);
await p2.screenshot({ path: path.join(OUT_DIR, '14-onboarding-wizard.png') });
console.log('  final URL:', p2.url());
await p2.close();

await browser.close();
console.log('Done.');
