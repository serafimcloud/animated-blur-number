// Records the demo "ticking" into a webm with Playwright, then you convert it
// to public/demo.gif with ffmpeg (see README "Recording the GIF").
//
//   npm i -D playwright && npx playwright install chromium
//   DEMO_URL=http://localhost:3000 node scripts/record-demo.mjs
//
// Deterministic tick sequence so the clip always reads well.

import { chromium } from "playwright";

const URL = process.env.DEMO_URL || "http://localhost:3000";
const OUT_DIR = "recording";
const W = 1000;
const H = 600;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  recordVideo: { dir: OUT_DIR, size: { width: W, height: H } },
});
const page = await context.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector(".an-root");

// Slightly stronger blur + duration so the effect reads in a small GIF.
await page.evaluate(() => {
  const setRange = (id, val) => {
    const el = document.getElementById(id);
    const setter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(el),
      "value"
    ).set;
    setter.call(el, String(val));
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  setRange("blur", 14);
  setRange("duration", 800);
});

await page.waitForTimeout(600);
const ticks = ["inc137", "inc9", "inc1k", "inc137", "inc1", "inc137", "inc9", "inc137"];
for (const id of ticks) {
  await page.click(`#${id}`);
  await page.waitForTimeout(950);
}
await page.waitForTimeout(500);

await context.close(); // finalizes the video file
await browser.close();
console.log(`Done. Video in ./${OUT_DIR}/ - convert it with ffmpeg (see README).`);
