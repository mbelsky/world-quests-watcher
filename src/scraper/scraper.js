import playwright from "playwright";

const browser = await playwright.chromium.launch();
const page = await browser.newPage();

await page.goto("https://www.wowhead.com/world-quests/legion/eu", {
  waitUntil: "domcontentloaded",
});

const wqListSelector = "#lv-lv-world-quests";

try {
  await page.waitForSelector(wqListSelector);
} catch (e) {
  const content = await page.content();

  throw new Error(`Wait for wq list selector failed. Page content: ${content}`);
}

const innerHtml = await page.innerHTML(wqListSelector);

await browser.close();

console.log(innerHtml);
