import Discord from "discord.js";

const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  const {author, channel, cleanContent, system} = message

  console.log(author, channel, cleanContent, system);

  if (client.user === author) {
    return
  }

  const {id, bot} = author

  if (message.content === "ping") {
    message.channel.send("pong");
  } else {
    message.channel.send("?");
  }
});

client.login(process.env.DI_BOT_TOKEN);
