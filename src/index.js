const Discord = require("discord.js");
const client = new Discord.Client();
const yt = require("ytdl-core");
const HOT_KEY = ".";
let queue = [];
let autoPlay = "on";
let nowPlaying = false;
let changeSong;
let songPlaying;
let firstMessage = true;
const playedSongs = [];
let KEYS = {};

if (process.env.Discord) {
  KEYS = {};
  KEYS.discord = process.env.Discord;
} else {
  KEYS = require("./keys.js");
}

/* ------- Heroku ------ */
// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT} ...... `);
// });

/* ------- Conexion con carpeta de comandos ------ */
const fs = require("fs");
const { resolve } = require("path");
const { connect } = require("http2");
const { search } = require("ffmpeg-static");
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./src/commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/* ------- Comienzo del bot ------ */

client.login(KEYS.discord);
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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
  } else if (command === "autoplay") {
    if (args.trimEnd().trimStart() === "on") {
      autoPlay = "on";
      msg.channel.send("Autoplay set to on");
    } else if (args.trimEnd().trimStart() === "off") {
      autoPlay = "off";
      msg.channel.send("Autoplay set to off");
    }
  }

  /* ------- Voice & Music------ */

  asyncCommands(msg, args, yt, command);
});

/* ------- Funciones para el voice channel -------- */
async function asyncCommands(msg, args, yt, command) {
  try {
    const connection = await msg.member.voice.channel.join();
    if (command === "play") {
      if (firstMessage) {
        firstMessage = false;
        msg.channel.send(`Autoplay is ${autoPlay}`);
      }
      play(args, msg, connection);
    } else if (command === "skip") {
      clearTimeout(changeSong);
      nowPlaying = false;
      reproduce({ connection, msg });
    } else if (command === "playlist") {
      if (msg.member.voice.channel) {
        const list = await client.commands
          .get("playlist")
          .execute(args, msg, KEYS);
        queue.push(...list);
        reproduce({ connection, msg, KEYS });
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
              sec2min(song.duration) || "Stil fetching..."
            }) \n`;
          });
          message += `${queue.length - 20} canciones mas`;
        } else {
          queue.forEach((song, i) => {
            message += `${i + 1}) ${song.title} (${
              sec2min(song.duration) || "Stil fetching..."
            }) \n`;
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
  } catch (error) {
    console.log(error);
    msg.channel.send("Unite a un canal");
  }
}

async function reproduce({ connection, msg }) {
  try {
    if (queue.length === 0) {
      msg.channel.send("Tirame un temita padreee");
      return;
    }

    songPlaying = yt(queue[0].link, { type: "audioonly" });

    if (!nowPlaying) {
      await connection.play(songPlaying);
      await msg.channel.send(`Escucha perri ${queue[0].title}`);
      nowPlaying = true;
    }

    if (nowPlaying && autoPlay === "on") {
      const nextAutoUrl = await client.commands
        .get("autoplay")
        .searchAutoPlay(queue, playedSongs);

      const autoPlayHold = (queue[0].duration * 1000) / 3;

      setTimeout(() => {
        if (queue.length === 0) {
          play(nextAutoUrl, msg, connection);
          msg.channel.send("Queuing song from auto play");
        }
      }, autoPlayHold);
    }

    changeSong = setTimeout(async () => {
      nowPlaying = false;
      reproduce({ connection, msg });
    }, parseInt(queue[0].duration * 1000));

    queue.shift();
  } catch (error) {
    console.log(error);
    await msg.channel.send("Tirame uno pa");
    return;
  }
}

async function play(args, msg, connection) {
  if (msg.member.voice.channel) {
    if (args.length > 1) {
      const song = await client.commands
        .get("puppeteer")
        .getLink(queue, args, args.includes("http") ? "link" : "name");
      //   min2sec(song);
      queue.push(song);
      playedSongs.push(song.link);
      if (nowPlaying) msg.channel.send(`Nuevo temita ura ${song.title}`);
    }
    if (!nowPlaying) {
      reproduce({ connection, msg });
    }
  }
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
function min2sec(song) {
  const timeArr = song.duration.split(":");
  const min = timeArr[0] * 60;
  const sec = timeArr[1];
  song.duration = parseInt(min) + parseInt(sec);
}

function sec2min(time) {
  const min = Math.floor(time / 60);
  let sec = Math.floor(time - min * 60);
  console.log(sec.toString().length);
  let naturalDisplay;
  if (sec.toString().length === 1) {
    sec = `0${sec}`;
  }
  console.log();
  sec ? (naturalDisplay = `${min}:${sec}`) : (naturalDisplay = `${min}m`);
  return naturalDisplay;
}
