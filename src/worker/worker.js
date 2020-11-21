import { db } from "wqw-common/firestore.js";
import { HtmlManager } from "wqw-common/HtmlManager.js";
import { QuestsManager } from "wqw-common/QuestsManager.js";
import { UsersManager } from "wqw-common/UsersManager.js";
import { notify } from "wqw-di-bot/di-notify.js";
import { Alerter } from "wqw-monitoring/alerter.js";
import { parseHtmlMap } from "./parseHtml.js";
import { questsMapToList } from "./questsMapToList.js";

async function getHtml() {
  const htmlManager = new HtmlManager(db);

  return await htmlManager.get();
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
