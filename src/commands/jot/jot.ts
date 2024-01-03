import { ChannelFlags, ChannelManager, ChannelType, CommandInteraction, OverwriteType, OverwrittenMimeTypes, PermissionOverwriteManager, PermissionOverwrites } from "discord.js";
import { Jot } from "../../interfaces/jot.interface";
import { confirmQuestion, createAtQuestion, descriptionQuestion, dueDateQuestion, isExamQuestion, subjectQuestion } from "./question";
import generateId from "../../utils/generateId";
import { prisma } from "../../utils/prisma";
import dayjs from "dayjs";

const jot = async (interaction: CommandInteraction) => {
    try {

        const msg_input = {} as Jot

        await subjectQuestion( msg_input, interaction, true );
        await descriptionQuestion( msg_input, interaction, true );
        await createAtQuestion( msg_input, interaction, true );
        await dueDateQuestion( msg_input, interaction, true );
        await isExamQuestion( msg_input, interaction, true );
        const confirm = await confirmQuestion( msg_input, interaction, true );
        if ( !confirm ) {
            await interaction.channel!.send('Cancelled');
            return;
        }
        await prisma.homework.create( {
            data: {
                id: generateId(),
                description: msg_input.description,
                subject: msg_input.subject,
                isExam: msg_input.is_exam,
                dueDate: new Date(dayjs(msg_input.due_date).format('YYYY-MM-DD'))
            }
        });

        await interaction.channel!.send('Homework created successfully!');

    } catch (e) {
        console.log(e);
        await interaction.channel!.send('Something went wrong. Please try again.');
    } 
};

export default jot;