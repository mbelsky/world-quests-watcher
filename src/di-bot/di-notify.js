import Discord from "discord.js";
import { makeActiveQuestsMessage } from "wqw-common/makeActiveQuestsMessage.js";
import { mapQuestsByRegion } from "wqw-common/mapQuests.js";
import { Alerter } from "wqw-monitoring/alerter.js";

async function onReady({ client, quests, users }) {
  async function notifyUser(id, message) {
    const user = new Discord.User(client, { id });

    try {
      const dm = await user.createDM();
      await dm.send(message);
    } catch (e) {
      Alerter.error("Failed to notify a user", e, { id });
    }
  }

  const questsMap = mapQuestsByRegion(quests);

  for (const user of users) {
    const { id, region, subscriptions = [] } = user;

    if (!region || subscriptions.length === 0) {
      continue;
    }

    const regionQuestsMap = questsMap[region] || {};

    const userActiveQuests = subscriptions
      .map((questId) => {
        return regionQuestsMap[questId];
      })
      .filter(Boolean);

    const message = makeActiveQuestsMessage(userActiveQuests);

    if (message) {
      await notifyUser(id, message);
    }
  }
}

export function notify({ quests, users }) {
  return new Promise((resolve) => {
    const client = new Discord.Client();

    client
      .on("ready", async () => {
        await onReady({ client, quests, users });

        client.destroy();

        resolve();
      })
      .login(process.env.DI_BOT_TOKEN);
  });
}
