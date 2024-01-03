import { CommandInteraction } from "discord.js";

const getUserInput = async(interaction: CommandInteraction, prompt: string): Promise<string> => {
    await interaction.followUp(prompt);
    const filter = (m: any) => m.author.id === interaction.user.id;
    const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
    const userInput = collection?.first()?.content || '';
    await collection?.first()?.delete();
    return userInput;
}

export default getUserInput;