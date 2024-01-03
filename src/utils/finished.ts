import { CommandInteraction, DefaultDeviceProperty } from "discord.js";


const finished = async(interaction: CommandInteraction) => {
    try {
        const promptMessage = 'Are you done with this channel? (yes/no) for delete this channel.';
        await interaction.channel?.send(promptMessage);
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({  filter, max: 1, time: 60000, errors: ['time'] });
        const confirm = collection?.first()?.content;
        if ( confirm && ['y', 'yes'].includes(confirm.toLowerCase()) ) {
            await interaction.channel?.delete();
        } else {
            await interaction.channel?.send('Alright, I will keep this channel.');
        } 
    } catch (e) {
        console.log(e); 
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }
}

export default finished;