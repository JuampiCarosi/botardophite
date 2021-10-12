const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current song"),
  async execute({ player, interaction }) {
    player.stop();
    interaction.reply({ content: "Skipping song", ephemeral: true });
  },
};
