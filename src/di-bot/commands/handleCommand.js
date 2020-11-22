import { regions } from "wqw-common/const.js";
import { Alerter } from "wqw-monitoring/alerter.js";
import { parseQuestId } from "../utils/parseQuestId.js";
import { getHandler } from "./getHandler.js";

async function printHelp({ message }) {}

async function addSubscription({ message, usersManager }) {
  const quests = parseQuestId(message.cleanContent);

  if (quests.length === 0) {
    // TODO: send help message
    return;
  }

  const subscriptions = await usersManager.addQuests(message.author.id, quests);
  const subscriptionsList = subscriptions.sort().map((s) => `— ${s}`).join("\n");

  try {
    await message.channel.send(
      `I've updated your subscriptions:\n\n` + subscriptionsList
    );
  } catch (e) {
    Alerter.error("Failed to response on addSubscription", e);
  }
}

async function removeSubscription({ message, usersManager }) {}

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
  region: setRegion,
  sub: addSubscription,
  unsub: removeSubscription,
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
