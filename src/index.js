const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const HOT_KEY = "/";
let queue = [];
let nowPlaying = false;
let changeSong;
let songPlaying;

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
  let args = msg.content.slice(HOT_KEY.length).split(/ +/);
  const command = args.shift().toLowerCase();
  let argsString = "";
  args.forEach((arg) => {
    argsString += arg + " ";
  });
  args = argsString;

  if (msg.content === "gay") {
    client.commands.get("gay").execute(msg, args);
  } else if (msg.content === "no u gay") {
    client.commands.get("nougay").execute(msg, args);
  }
  if (msg.content.split("")[0] !== HOT_KEY || !msg.guild || msg.author.bot)
    return;

  if (command === "shuffle") {
    shuffle(queue);
    msg.channel.send(
      "Quedo mas revuelto que estomago despues de un buen Torito"
    );
  }

  /* ------- Voice & Music------ */

  asyncCommands(msg, args, yt, command);
});

/* ------- Funciones para el voice channel -------- */
async function asyncCommands(msg, args, yt, command) {
  const connection = await msg.member.voice.channel.join();

  if (command === "play") {
    if (msg.member.voice.channel) {
      if (args.length > 1) {
        const song = await client.commands
          .get("puppeteer")
          .getLink(args, args.includes("http") ? "link" : "name");
        queue.push(song);
        if (nowPlaying) msg.channel.send(`Nuevo temita ura ${song.title}`);
      }
      if (!nowPlaying) {
        reproduce({ connection, msg });
      }
    }
  } else if (command === "skip") {
    clearTimeout(changeSong);
    reproduce({ connection, msg });
  } else if (command === "playlist") {
    if (msg.member.voice.channel) {
      const list = await client.commands.get("playlist").execute(args, msg);
      queue.push(...list);
      reproduce({ connection, msg });
    } else {
      msg.reply("Unite a un canal primero bro");
    }
  } else if (command === "leave" || command === "stop") {
    await msg.member.voice.channel.leave();
    nowPlaying = false;
  } else if (command === "list") {
    try {
      let message = "Lista: \n";
      if (queue.length > 20) {
        [...queue].splice(0, 20).forEach((song, i) => {
          message += `${i + 1}) ${song.title} (${
            song.duration || "Stil fetching..."
          }s) \n`;
        });
        message += `${queue.length - 20} canciones mas`;
      } else {
        queue.forEach((song, i) => {
          message += `${i + 1}) ${song.title} (${
            song.duration || "Stil fetching..."
          }s) \n`;
        });
      }
      await msg.channel.send(message);
    } catch (error) {
      msg.channel.send(error);
    }
  } else if (command === "clear") {
    queue = [];
    await msg.channel.send("Mande todo a la mierda de uña");
  } else if (command === "pause") {
  }
}

async function reproduce({ connection, msg }) {
  nowPlaying = true;
  if (queue.length === 0) {
    msg.channel.send("Tirame un temita padreee");
    return;
  }

  songPlaying = yt(queue[0].link, { type: "audioonly" });
  if (msg.content === "/pause") {
    songPlaying.pause();
  }

  await connection.play(songPlaying);
  await msg.channel.send(`Escucha perri ${queue[0].title}`);

  changeSong = setTimeout(async () => {
    reproduce({ connection, msg });
    nowPlaying = false;
  }, parseInt(queue[0].duration * 1000));

  queue.shift();
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
