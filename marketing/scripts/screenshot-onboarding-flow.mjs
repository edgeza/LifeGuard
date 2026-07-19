// scripts/screenshot-onboarding-flow.mjs — click through all 4 steps
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

// Login as the new test user
await context.request.post(`${BASE}/api/care/auth/login`, {
  data: { email: 'newuser@test.lifeguard', password: 'newuser1234' },
});

const p = await context.newPage();
await p.goto(`${BASE}/care/onboarding`, { waitUntil: 'networkidle' });
await p.waitForTimeout(800);

// Step 1: fill in agent name
await p.fill('input[placeholder="Esther"]', 'Esther');
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(OUT_DIR, '15-onboarding-step1-filled.png') });

// Click Continue → step 2
await p.click('button:has-text("Continue")');
await p.waitForTimeout(800);
await p.screenshot({ path: path.join(OUT_DIR, '16-onboarding-step2.png') });

// Fill in care receiver info
const inputs = await p.locator('input[type="text"]').all();
if (inputs.length > 0) {
  await inputs[0].fill('Marlene van Wyk');
}
// Select first condition
const firstCondition = p.locator('button:has-text("hypertension")').first();
if (await firstCondition.count() > 0) await firstCondition.click();
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(OUT_DIR, '17-onboarding-step2-filled.png') });

// Click Continue → step 3 (personality)
await p.click('button:has-text("Continue")');
await p.waitForTimeout(800);
await p.screenshot({ path: path.join(OUT_DIR, '18-onboarding-step3.png') });

// Click Continue → step 4 (review/activate)
await p.click('button:has-text("Continue")');
await p.waitForTimeout(800);
await p.screenshot({ path: path.join(OUT_DIR, '19-onboarding-step4.png') });

await browser.close();
console.log('Done. 5 screenshots saved.');
