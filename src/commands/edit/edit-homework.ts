import { CommandInteraction, EmbedBuilder } from "discord.js";
import { editQuestion, homeworkIdQuestion, selectQuestion } from "./question";
import { Edit } from "../../interfaces/edit.interface";
import { prisma } from "../../utils/prisma";
import finished from "../../utils/finished";

const edit = async (interaction: CommandInteraction) => {
    try {
        const msg_input = {} as Edit;
        await selectQuestion( msg_input, interaction, true);
        await homeworkIdQuestion( msg_input, interaction, true);
        await editQuestion( msg_input, interaction, true);

        //update homework
        const homework = await prisma.homework.findUnique({ where: { id: msg_input.homeworkId }});
        if ( homework ){
            const { homeworkId, ...updateData } = msg_input;
            await prisma.homework.update({ where: { id: msg_input.homeworkId }, data: { ...updateData }});
            await interaction.editReply('Homework updated');
        } else {
            await interaction.editReply('Homework not found');
        }

        await finished(interaction);


    } catch (e: any) {
        console.log(e);
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }    
};

export default edit;