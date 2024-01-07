import { CommandInteraction } from "discord.js";

const ping = async (interaction: CommandInteraction) => {
    try {
        await interaction.reply('Pong!!');
    } catch (e) {
        console.log(e);
    }
};

export default ping;