import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:4173';

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
page.setDefaultTimeout(12000);

const shots = [];

// ── Login ───────────────────────────────────────────────────────────────────
await page.goto(BASE + '/');
await page.waitForLoadState('networkidle');
shots.push({ name: 'login', buf: await page.screenshot({ fullPage: false }) });

// fill credentials and login
await page.fill('input[type="text"]', 'admin');
await page.fill('input[type="password"]', 'admin');
await page.click('button[type="submit"]');
await page.waitForURL('**/dashboard', { timeout: 10000 });
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2500); // charts need extra time
shots.push({ name: 'dashboard', buf: await page.screenshot({ fullPage: false }) });

// ── Inventory ───────────────────────────────────────────────────────────────
await page.click('a[href="/inventory"]');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2500);
shots.push({ name: 'inventory', buf: await page.screenshot({ fullPage: false }) });

// open first row detail
await page.click('table tbody tr:first-child');
await page.waitForTimeout(1200);
shots.push({ name: 'inventory_detail', buf: await page.screenshot({ fullPage: false }) });

// close modal — click the backdrop overlay
await page.click('.fixed.inset-0.z-50', { position: { x: 50, y: 50 } });
await page.waitForTimeout(500);
const modalStillOpen = await page.locator('.fixed.inset-0.z-50').isVisible().catch(() => false);
if (modalStillOpen) await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// ── Map ─────────────────────────────────────────────────────────────────────
await page.click('a[href="/map"]');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);
shots.push({ name: 'map', buf: await page.screenshot({ fullPage: false }) });

// ── Maintenance ─────────────────────────────────────────────────────────────
await page.click('a[href="/maintenance"]');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2500);
shots.push({ name: 'maintenance', buf: await page.screenshot({ fullPage: false }) });

// ── Analytics ───────────────────────────────────────────────────────────────
await page.click('a[href="/analytics"]');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2500);
shots.push({ name: 'analytics', buf: await page.screenshot({ fullPage: false }) });

// ── Countries ────────────────────────────────────────────────────────────────
await page.click('a[href="/countries"]');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);
shots.push({ name: 'countries', buf: await page.screenshot({ fullPage: false }) });

// click first country
await page.click('.w-72 button:first-child');
await page.waitForTimeout(1000);
shots.push({ name: 'countries_detail', buf: await page.screenshot({ fullPage: false }) });

// ── Community ────────────────────────────────────────────────────────────────
await page.click('a[href="/community"]');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1500);
shots.push({ name: 'community', buf: await page.screenshot({ fullPage: false }) });

// click first post
await page.click('.space-y-3 > div:first-child');
await page.waitForTimeout(800);
shots.push({ name: 'community_detail', buf: await page.screenshot({ fullPage: false }) });

await browser.close();

// save all screenshots
for (const { name, buf } of shots) {
  const path = `C:\\Users\\오창민\\Desktop\\weapon-management-platform\\screenshot_${name}.png`;
  writeFileSync(path, buf);
  console.log(`✓ ${name} → ${path}`);
}
console.log('DONE');
