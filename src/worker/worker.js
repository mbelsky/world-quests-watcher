import { db } from "wqw-common/firestore.js";
import { QuestsManager } from "wqw-common/QuestsManager.js";
import { UsersManager } from "wqw-common/UsersManager.js";
import { notify } from "wqw-di-bot/di-notify.js";
import { Alerter } from "wqw-monitoring/alerter.js";
import { parseHtmlMap } from "./parseHtml.js";
import { questsMapToList } from "./questsMapToList.js";
import { launchChromium, scrap } from "./scraper.js";
import { scrapWorldQuests } from "./scrapWorldQuests.js";

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

function htmlToList(htmlMap) {
  try {
    const questsMap = parseHtmlMap(htmlMap);
    return questsMapToList(questsMap);
  } catch (e) {
    Alerter.error("Failed map html to quests", e, { htmlMap });

    return [];
  }
}

async function getUsers() {
  const usersManager = new UsersManager(db);
  return await usersManager.get();
}

async function doYourJob() {
  const questsManager = new QuestsManager(db);
  await questsManager.delete();

  const htmlMap = await getHtml();
  const quests = htmlToList(htmlMap);

  if (quests.length === 0) {
    Alerter.warn(`quest list is empty`, { htmlMap });
    return;
  }

  try {
    await questsManager.create(quests);
  } catch (e) {
    Alerter.warn("Failed to create quests", e, { quests });
  }

  const users = await getUsers();

  await notify({ quests, users });
}

await doYourJob();
