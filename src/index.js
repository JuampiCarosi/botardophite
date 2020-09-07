const Discord = require("discord.js");
const client = new Discord.Client();
const HOT_KEY = "/";

/* ------- Conexion con carpeta de comandos ------ */
const fs = require("fs");
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

client.on("message", (msg) => {
  if (!msg.content.startsWith == HOT_KEY) return;

  const cutMsg = msg.content.slice(HOT_KEY.length).split(/ +/);
  const command = cutMsg.shift().toLowerCase();

  if (command === "gay") {
    client.commands.get("gay").execute(msg, cutMsg);
  }
});
