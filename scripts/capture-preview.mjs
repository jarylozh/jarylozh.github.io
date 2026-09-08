import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright";

const TARGET = "https://dev.vaultofcards.io/marketplace?game=Pokemon%20TCG";
const OUT_DIR = "public/previews";
const NAME = "vault-of-cards";

const SIZE = { width: 800, height: 500 };
const SCROLL_STEPS = 72;
const SCROLL_STEP_MS = 55;

await mkdir(OUT_DIR, { recursive: true });
await rm(".playwright-video", { recursive: true, force: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: SIZE,
  deviceScaleFactor: 1,
  recordVideo: { dir: ".playwright-video", size: SIZE },
  reducedMotion: "no-preference",
});

const page = await context.newPage();

const startedAt = Date.now();

await page.goto(TARGET, { waitUntil: "networkidle", timeout: 60_000 });
await page.waitForTimeout(900);

// Poster frame for the <video> element, taken before anything moves.
await page.screenshot({
  path: `${OUT_DIR}/${NAME}.jpg`,
  type: "jpeg",
  quality: 72,
});

await page.evaluate(
  async ({ steps, stepMs }) => {
    const distance = document.body.scrollHeight - window.innerHeight;
    for (let step = 0; step <= steps; step++) {
      window.scrollTo(0, (distance * step) / steps);
      await new Promise((resolve) => setTimeout(resolve, stepMs));
    }
  },
  { steps: SCROLL_STEPS, stepMs: SCROLL_STEP_MS }
);

await page.waitForTimeout(300);

const listing = page.locator('a[href^="/listing/"]').nth(2);
await listing.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await listing.hover();
await page.waitForTimeout(350);

const href = await listing.getAttribute("href");
await listing.click();
await page.waitForURL("**/listing/**", { timeout: 30_000 });
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1000);

const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

const video = page.video();
await context.close();

if (video) await video.saveAs(`${OUT_DIR}/${NAME}.webm`);
await browser.close();
await rm(".playwright-video", { recursive: true, force: true });

console.log(`clicked ${href}`);
console.log(`recorded roughly ${seconds}s`);
console.log(`wrote ${OUT_DIR}/${NAME}.webm and ${NAME}.jpg`);
