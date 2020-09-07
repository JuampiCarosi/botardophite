const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const HOT_KEY = "/";
var connectionTest = "mid";

/* ------- Conexion con carpeta de comandos ------ */
const fs = require("fs");
const { resolve } = require("path");
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./src/commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/* ------- Comienzo del bot ------ */

client.login("NzUyMzczMTE1MTkxMDMzODY3.X1WsEQ.6dil_34zfxzxoacO-yuDkMHGtoA");
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/* ------- Administrador de comandos ------ */

client.on("message", async (msg) => {
  if (!msg.content.startsWith == HOT_KEY || !msg.guild) return;

  const cutMsg = msg.content.slice(HOT_KEY.length).split(/ +/);
  const command = cutMsg.shift().toLowerCase();

  if (command === "gay") {
    client.commands.get("gay").execute(msg, cutMsg);
  }

  followMsg(msg, yt, command);
});

async function playMusic(msg, yt, command) {
  if (command === "play") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
      connection.play(yt("https://www.youtube.com/watch?v=Dmqpcz0OfPw"));
    } else {
      msg.reply("Unite a un canal primero bro");
    }
  } else if (command === "stop") {
    const connectionExit = await msg.member.voice.channel.leave();
  }
}

async function followMsg(msg, yt, command) {
  connectionTest = await msg.member.voice.channel.join();
  const startPlaying = await joinChannel(msg, yt, command);
}
