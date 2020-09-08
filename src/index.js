const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const HOT_KEY = "/";
let queue = [];

/* ------- Conexion con carpeta de comandos ------ */
const fs = require("fs");
const { resolve } = require("path");
const { connect } = require("http2");
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

/* ------- ADMINISTRADOR DE COMANDOS ------ */

/* ------- Chat------ */

client.on("message", async (msg) => {
  if (!msg.content.startsWith == HOT_KEY || !msg.guild || msg.author.bot)
    return;

  const args = msg.content.slice(HOT_KEY.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (msg.content === "gay") {
    client.commands.get("gay").execute(msg, args);
  } else if (msg.content === "no u gay") {
    client.commands.get("nougay").execute(msg, args);
  }

  /* ------- Voice & Music------ */

  addPlaylist(msg, args, yt, command);
});

/* ------- Funciones para el voice channel -------- */
async function addPlaylist(msg, args, yt, command) {
  if (command === "playlist") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();

      client.commands.get("playlist").execute(msg, args);
    } else {
      msg.reply("Unite a un canal primero bro");
    }
  } else if (command === "play") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
      client.commands.get("play").execute(msg, args, yt, connection);
    }
  } else if (command === "leave" || command === "stop") {
    const connectionExit = await msg.member.voice.channel.leave();
  }
}
