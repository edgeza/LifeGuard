import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox']
});

// Test at 1440 desktop width
for (const width of [1440, 1024, 768, 600]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:3010/');
  await p.waitForTimeout(500);
  const v = await p.viewportSize();
  const hamburger = p.locator('button[aria-label="Open menu"]').first();
  const hamVisible = (await hamburger.count() > 0) ? await hamburger.isVisible() : false;
  const login = p.locator('a[href="/login"]').first();
  const loginVisible = (await login.count() > 0) ? await login.isVisible() : false;
  await p.screenshot({ path: `C:/Users/juan/AppData/Local/Temp/lifeguard-screens/nav-${width}.png`, clip: { x: 0, y: 0, width: Math.min(width, 1440), height: 80 } });
  console.log(`width=${width} viewport=${JSON.stringify(v)} hamburger=${hamVisible} login=${loginVisible}`);
  await ctx.close();
}
await browser.close();