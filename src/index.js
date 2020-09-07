const Discord = require("discord.js");
const client = new Discord.Client();
const HOT_KEY = "/";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (!msg.content.startsWith == HOT_KEY) return;

  const cutMsg = msg.content.slice(HOT_KEY.length).split(/ +/);
  const command = cutMsg.shift().toLowerCase();

  if (command === "gay") {
    msg.reply("no u");
  }
});
client.login("NzUyMzczMTE1MTkxMDMzODY3.X1WsEQ.6dil_34zfxzxoacO-yuDkMHGtoA");
