import Discord from "discord.js";

const client = new Discord.Client();

async function onReady() {
  async function sendHi(userId) {
    const user = new Discord.User(client, { id: userId });
    
    try {
      const dm = await user.createDM();
      await dm.send("hi!");
    } catch (e) {
      console.error(e)
    }
  }

  for await (const userId of ["776608508920987678"]) {
    await sendHi(userId);
  }

  client.destroy()
}

client.on("ready", onReady).login(process.env.DI_BOT_TOKEN);
