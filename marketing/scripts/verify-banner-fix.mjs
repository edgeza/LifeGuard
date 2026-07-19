import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });

// Login first so we can hit the gated dashboard
await ctx.request.post('http://127.0.0.1:3010/api/care/auth/login', {
  data: { email: 'lerato@demo.lifeguard', password: 'demo1234' },
});

// Dashboard with cookie banner
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:3010/care/dashboard', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.screenshot({ path: 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens/dash-with-banner-fix.png' });
console.log('saved dashboard screenshot');
await browser.close();