import { CommandInteraction } from "discord.js";

const ping = async (interaction: CommandInteraction) => {
    try {
        await interaction.reply({ content: 'Pong!' });
    } catch (e) {
        
    }
};

export default ping;