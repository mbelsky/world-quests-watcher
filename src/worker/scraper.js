import playwright from "playwright";

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
