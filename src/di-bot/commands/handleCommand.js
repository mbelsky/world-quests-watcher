import { regions } from "wqw-common/const.js";
import { Alerter } from "wqw-monitoring/alerter.js";
import { parseQuestId } from "../utils/parseQuestId.js";
import { getHandler } from "./getHandler.js";

function formatSubscriptions(subscriptions) {
  return subscriptions
    .sort()
    .map((s) => `— ${s}`)
    .join("\n");
}

async function printHelp({ message }) {
  await message.channel.send(
    `
Hi!

I watch for active World of Warcraft daily quests and send you notifications when they go available. I'll be useful if you don't like to miss a rare or a specific daily.

To start getting notifications do the following steps:

— Set your realm region with "!region eu/na" command
— Subscribe on notifications by quest ids with "!sub <firstQuestId> <secondQuestId> …" . You may find the quest ids at wowhead.

To stop getting notifications for a quest send "!unsub <questId>" or "!unsub-all" to won't be notified about any quest.

To list your active subscriptions use "!list"
`.trim()
  );
}

async function addSubscription({ message, usersManager }) {
  const quests = parseQuestId(message.cleanContent);

  if (quests.length === 0) {
    // TODO: send help message
    return;
  }

  const subscriptions = await usersManager.addQuests(message.author.id, quests);
  const subscriptionsList = formatSubscriptions(subscriptions);

  try {
    await message.channel.send(
      `I've updated your subscriptions:\n\n` + subscriptionsList
    );
  } catch (e) {
    Alerter.error("Failed to response on addSubscription", e);
  }
}

async function removeAllSubscription({ message, usersManager }) {
  await usersManager.removeAllQuests(message.author.id);

  try {
    await message.channel.send(`Your subscriptions list is empty now`);
  } catch (e) {
    Alerter.error("Failed to response on removeAllSubscription", e);
  }
}

async function removeSubscription({ message, usersManager }) {
  const quests = parseQuestId(message.cleanContent);

  if (quests.length === 0) {
    // TODO: send help message
    return;
  }

  const subscriptions = await usersManager.removeQuests(
    message.author.id,
    quests
  );
  const subscriptionsList = formatSubscriptions(subscriptions);

  const replyText = subscriptionsList
    ? `I've updated your subscriptions:\n\n${subscriptionsList}`
    : `Your subscriptions list is empty now`;

  try {
    await message.channel.send(replyText);
  } catch (e) {
    Alerter.error("Failed to response on removeSubscription", e);
  }
}

async function listSubscriptions({ message, usersManager }) {
  const subscriptions = await usersManager.listQuests(message.author.id);
  const subscriptionsList = formatSubscriptions(subscriptions);

  const replyText = subscriptionsList
    ? `Your subscriptions list:\n\n${subscriptionsList}`
    : `Your subscriptions list is empty`;

  try {
    await message.channel.send(replyText);
  } catch (e) {
    Alerter.error("Failed to response on listSubscriptions", e);
  }
}

async function setRegion({ message, usersManager }) {
  const [, rawRegion = ""] = message.cleanContent.split(" ");
  const region = rawRegion.toLowerCase();

  if (regions.includes(region)) {
    await usersManager.setRegion(message.author.id, region);

    try {
      await message.channel.send(`👍`);
    } catch (e) {
      Alerter.error("Failed to response on setRegion", e);
    }
  } else {
    const supportedRegions = regions.join(", ");

    await message.channel.send(
      `This regions is not supported. Please use one of these: ${supportedRegions}`
    );
  }
}

const handlerMap = {
  help: printHelp,
  list: listSubscriptions,
  region: setRegion,
  start: printHelp,
  sub: addSubscription,
  unsub: removeSubscription,
  "unsub-all": removeAllSubscription,
};

export async function handleCommand(ctx) {
  const { message } = ctx;

  const { cleanContent } = message;
  const handlerFn = getHandler(cleanContent, handlerMap);

  if (handlerFn) {
    await handlerFn(ctx);
  } else {
    // TODO: Reply with help
    await message.channel.send(`I don't know how to handle this 😭`);
  }
}
