import Discord from "discord.js";
import { db } from "wqw-common/firestore.js";
import { UsersManager } from "wqw-common/UsersManager.js";
import { Alerter } from "wqw-monitoring/alerter.js";
import { handleCommand } from "./commands/handleCommand.js";

Alerter.instance;

const usersManager = new UsersManager(db);
const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

function hasAuthor(message) {
  return Boolean(message.author);
}

function isBotMessage(message) {
  return message.author?.bot;
}

function isBotSelfMessage(client, message) {
  return client.user === message.author;
}

function isDirectMessage(_, message) {
  return message.channel.type === "dm";
}

function isSystemMessage(_, message) {
  return message.system;
}

client.on("message", async (message) => {
  const { author, channel, cleanContent, system } = message;

  console.log(author, "channel id", channel.id, cleanContent, "system", system);

  if (
    isBotSelfMessage(client, message) ||
    isSystemMessage(client, message) ||
    !isDirectMessage(client, message) ||
    !hasAuthor(message)
  ) {
    return;
  }

  if (isBotMessage(message)) {
    try {
      await message.channel.send(`Sorry I don't with bots`);
    } catch (e) {
      Alerter.error("Failed to response a bot", e);
    }
    return;
  }

  try {
    await handleCommand({ client, message, usersManager });
  } catch (e) {
    Alerter.error(`Failed to handle user's message`, e, { message });

    try {
      await message.channel.send(
        `Failed to handle your message. Please, try again later`
      );
    } catch (e) {
      Alerter.error("Failed to response about failure", e);
    }
  }
});

client.login(process.env.DI_BOT_TOKEN);
