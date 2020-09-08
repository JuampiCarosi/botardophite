const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const HOT_KEY = "/";
let queue = [];
let nowPlaying = false;

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
  const args = msg.content.slice(HOT_KEY.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (msg.content === "gay") {
    client.commands.get("gay").execute(msg, args);
  } else if (msg.content === "no u gay") {
    client.commands.get("nougay").execute(msg, args);
  }
  if (msg.content.split("")[0] !== HOT_KEY || !msg.guild || msg.author.bot)
    return;

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
  } else if (command === "play") {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
      const song = await client.commands.get("puppeteer").getLink(args);
      queue.push(song);
      // await client.commands
      //   .get("queue")
      //   .execute(msg, args, yt, connection, queue);
      if (!nowPlaying) {
        await connection.play(yt(queue[0].link, { type: "audioonly" }));
        queue.shift();
        nowPlaying = true;
        await msg.channel.send(`Playing ${song.title}`);
      } else {
        await msg.channel.send(`Added ${song.title} to queue`);
      }
    }
  } else if (command === "leave" || command === "stop") {
    const connectionExit = await msg.member.voice.channel.leave();
    nowPlaying = false;
  } else if (command === "skip") {
    const connection = await msg.member.voice.channel.join();
    await connection.play(yt(queue[0].link, { type: "audioonly" }));
    await msg.channel.send(`Playing ${queue[0].title}`);
    queue.shift();
  } else if (command === "list") {
    let message = "";
    queue.forEach((song, i) => {
      message += `${i + 1}) ${song.title} `;
    });
    await msg.channel.send(message);

    queue.shift();
  } else if (command === "clear") {
    queue = [];
    await msg.channel.send("Queue emptied");
  }

  console.log(queue);
}
