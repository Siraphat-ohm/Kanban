import { CommandInteraction } from "discord.js";

const ping = async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
};

export default ping;