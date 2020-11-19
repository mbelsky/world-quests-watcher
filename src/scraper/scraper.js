import playwright from "playwright-chromium";
import { addons, regions } from "wqw-common/const.js";
import { db } from "wqw-common/firestore.js";
import { HtmlManager } from "wqw-common/HtmlManager.js";
import { Alerter } from "wqw-monitoring/alerter.js";

const urlTemplate = `https://www.wowhead.com/world-quests/{addon}/{region}`;

export async function scrapWorldQuests(scrapFn) {
  const htmlMap = {};

  for (const region of regions) {
    for (const addon of addons) {
      const url = urlTemplate
        .replace(/{addon}/, addon)
        .replace(/{region}/, region);

      const html = await scrapFn(url);

      htmlMap[`${region}-${addon}`] = html;
    }
  }

  return htmlMap;
}

const wqListSelector = "#lv-lv-world-quests";

export async function launchChromium() {
  return await playwright.chromium.launch();
}

export async function scrap(browser, url) {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  try {
    await page.waitForSelector(wqListSelector);
  } catch (e) {
    const content = await page.content();

    throw new Error(
      `Wait for wq list selector failed. Page content: ${content}`
    );
  }

  const innerHtml = await page.innerHTML(wqListSelector);
  return innerHtml;
}

async function getHtml() {
  const browser = await launchChromium();

  const htmlMap = await scrapWorldQuests(scrap.bind(null, browser));

  try {
    await browser.close();
  } catch (e) {
    Alerter.error("Failed to close browser", e);
  }

  return htmlMap;
}

(async function main() {
  Alerter.instance;

  const htmlManager = new HtmlManager(db);
  await htmlManager.delete();

  const htmlMap = await getHtml();
  await htmlManager.create(htmlMap);
})();
