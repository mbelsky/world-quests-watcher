import Discord from "discord.js";

async function onReady({ client, quests, users }) {
  async function sendHi(userId) {
    const user = new Discord.User(client, { id: userId });

    try {
      const dm = await user.createDM();
      await dm.send("hi!");
    } catch (e) {
      console.error(e);
    }
  }

  for await (const user of users) {
    await sendHi(user.id);
  }
}

export function notify({ quests, users }) {
  return new Promise((resolve) => {
    const client = new Discord.Client();

    client
      .on("ready", async () => {
        await onReady({ client, quests, users });

        client.destroy();

        resolve()
      })
      .login(process.env.DI_BOT_TOKEN);
  });
}
