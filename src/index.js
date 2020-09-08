const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const HOT_KEY = "/";
var queue = [];

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
  } else if (command === "skip") {
    queue.shift();
  }

  /* ------- Voice & Music------ */

  asyncCommands(msg, args, yt, command);
});

/* ------- Funciones para el voice channel -------- */
async function asyncCommands(msg, args, yt, command) {
  if (command === "playlist") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();

      client.commands.get("playlist").execute(msg, args, queue);
    } else {
      msg.reply("Unite a un canal primero bro");
    }
  } else if (command === "queue") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
      client.commands.get("queue").execute(msg, args, yt, connection, queue);
    }
  } else if (command === "leave" || command === "stop") {
    const connectionExit = await msg.member.voice.channel.leave();
  } else if (command === "play") {
    const connection = await msg.member.voice.channel.join();
    connection.play(yt(queue[0]));
  } else if (command === "skip") {
    queue.shift();
    const connection = await msg.member.voice.channel.join();
    console.log(queue[0]);
    connection.play(yt(queue[0]));
  }
}
