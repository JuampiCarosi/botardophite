const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { MessageActionRow, MessageButton } = require("discord.js");
const ytdl = require("ytdl-core");
const searchSong = require("../helpers/searchSong");
const autoPlay = require("../helpers/autoPlay");
const playedSongs = [];
const queue = [];
let playerStatus = "initial";
let player;
let connection;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Searches or reads url to play your favourite music!")
    .addStringOption((option) =>
      option.setName("song").setDescription("Enter a song").setRequired(true)
    ),

  async execute({ interaction, client }) {
    const channel = interaction.member.voice.channel;
    const toggle = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("toggle")
        .setLabel("Pause / Unpause")
        .setStyle("SECONDARY")
    );
    const reproduce = (song, type) => {
      const autoPlayHold = (queue[0].duration * 2000) / 3;
      // const autoPlayHold = 1;
      try {
        const stream = ytdl(song.url, {
          type: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1048576 * 32,
        });
        const resource = createAudioResource(stream);
        player.play(resource);
        interaction.editReply({
          content: `Playing  ${song.title} (${sec2min(song.duration)})`,
          components: [toggle],
        });
        setTimeout(async () => {
          if (queue.length === 1) {
            const autoUrl = await autoPlay.searchAutoPlay({
              queue,
              playedSongs,
            });
            queue.push(await searchSong.execute(autoUrl));
            playedSongs.push(queue[queue.length - 1]);
          }
        }, autoPlayHold);
      } catch (e) {
        console.log(e);

        if (queue.length === 0) interaction.editReply("No song provided !");
      }
    };

    await interaction.deferReply();
    queue.push(await searchSong.execute(interaction.options.getString("song")));
    playedSongs.push(
      await searchSong.execute(interaction.options.getString("song"))
    );
    console.log(queue);

    try {
      if (playerStatus === "initial") {
        connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        player = createAudioPlayer();
        connection.subscribe(player);
        reproduce(queue[0], "initial repoducer");

        client.on("interactionCreate", async (interaction) => {
          if (!interaction.isButton() && !interaction.isCommand()) return;

          if (interaction.customId === "toggle") {
            playerStatus === "playing" ? player.pause() : player.unpause();
            interaction.reply({
              content: `Music is now ${playerStatus}`,
            });
          }
          if (interaction.commandName === "skip") {
            const skip = client.commands.get(interaction.commandName);

            await skip.execute({ player, interaction });
            queue.shift();
            reproduce(queue[0]);
          }
        });
      } else if (playerStatus === "playing") {
        await interaction.editReply({
          content: `Queued ${queue[queue.length - 1].title}`,
          ephemeral: true,
        });
      } else if (playerStatus === "idle" && queue.length != 0) {
        reproduce(queue[0], "idle if");
      }
    } catch {
      interaction.editReply({
        content: "Join a voice channel !",
        ephemeral: true,
      });
    }

    player.on("stateChange", (oldState, newState) => {
      playerStatus = newState.status;
      console.log(`player is :${playerStatus}`);

      if (playerStatus === "idle") {
        queue.shift();
        if (queue.length != 0) reproduce(queue[0], "idle event");
      }
    });

    player.on("error", (error) => {
      console.log(error);
    });

    function sec2min(time) {
      const min = Math.floor(time / 60);
      let sec = Math.floor(time - min * 60);
      let naturalDisplay;
      if (sec.toString().length === 1) {
        sec = `0${sec}`;
      }
      sec ? (naturalDisplay = `${min}:${sec}`) : (naturalDisplay = `${min}m`);
      return naturalDisplay;
    }
  },
};
