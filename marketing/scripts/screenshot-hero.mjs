import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const p = await ctx.newPage();

p.on('pageerror', err => console.log('PAGE ERROR:', err.message));
p.on('console', msg => {
  if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
});

try {
  await p.goto('http://127.0.0.1:3010/', { waitUntil: 'networkidle', timeout: 30000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens/22-home-with-21st.png', fullPage: false });
  console.log('saved');
} catch (e) {
  console.log('error:', e.message);
  await p.screenshot({ path: 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens/22-error.png' });
}
await browser.close();