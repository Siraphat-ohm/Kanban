import { CommandInteraction, EmbedBuilder } from "discord.js";
import { prisma } from "../../utils/prisma";
import { Edit } from "../../interfaces/edit.interface";
import getUserInput from "../../utils/getUserInput";

export const selectQuestion = async (msg_input: Edit, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const subjects = ['Math', 'Science', 'English', 'History'];
    const promptMessage = isFirstAttempt 
        ? 'What subject is this for ? should be one of the following: Math, Science, English, History'
        : 'Subject should be one of the following: Math, Science, English, History. Please try again.';

    await interaction[isFirstAttempt ? 'reply' : 'editReply'](promptMessage);

    try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const subject = collection?.first()?.content;

        if (subject && subjects.includes(subject)) {
            msg_input.subject = subject;
            await collection?.first()?.delete();
            const homeworks = await prisma.homework.findMany({ where: { subject } });
            if ( homeworks.length >= 25 ){
                // this is limit of discord embed, so we can't send more than 25 fields
                // I will fix this later
                await interaction.editReply('บอทกูแตก');
                return;
            }
            const homeworksEmbed = new EmbedBuilder()
                .setTitle(`Homeworks for ${subject}`)
                .setColor('#0099ff')
                .addFields( homeworks.map( hw => { 
                    return { 
                        name: `${hw.description} - id:${hw.id}`, 
                        value: `${hw.createAt.toLocaleDateString()} - ${hw.dueDate.toLocaleDateString()}` 
                    }
                 }));

            await interaction.editReply({ embeds: [homeworksEmbed] });

        } else {
            await collection?.first()?.delete();
            await selectQuestion(msg_input, interaction, false);
        }
    } catch (error) {
        console.log(error);
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
}

export const homeworkIdQuestion = async (msg_input: Edit, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const promptMessage = isFirstAttempt 
        ? 'What is the homework id ?'
        : 'Homework id is invalid. Please try again.'

    await interaction.followUp(promptMessage);

    try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const homeworkId = collection?.first()?.content;
        const homework = await prisma.homework.findUnique({ where: { id: homeworkId } });
        if ( homework ){
            msg_input.homeworkId = homeworkId;
            await collection?.first()?.delete();
            await interaction.followUp('Homework found.');
        } else {
            await collection?.first()?.delete();
            await homeworkIdQuestion(msg_input, interaction, false);
        }
    } catch (error) {
        console.log(error);
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
}


async function updateSubject(msg_input: Edit, interaction: CommandInteraction) {
    const subjects = ['Math', 'Science', 'English', 'History'];
    const subject = await getUserInput(interaction, 'Enter new subject. Should be one of the following: Math, Science, English, History');
    if (subjects.includes(subject)) {
        msg_input.subject = subject;
        await interaction.followUp('Subject updated.');
    } else {
        await editQuestion(msg_input, interaction, false);
    }
}

async function updateDescription(msg_input: Edit, interaction: CommandInteraction) {
    const description = await getUserInput(interaction, 'Enter new description');
    msg_input.description = description;
    await interaction.followUp('Description updated.');
}

async function updateDueDate(msg_input: Edit, interaction: CommandInteraction) {
    const dueDate = await getUserInput(interaction, 'Enter new due date. Format: YYYY-MM-DD');
    msg_input.dueDate = new Date(dueDate);
    await interaction.followUp('Due date updated.');
}

export const editQuestion = async (msg_input: Edit, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    if (!isFirstAttempt) {
        await interaction.followUp('Invalid option selected.');
    }

    try {
        const option = await getUserInput(interaction, 'Enter your choice: subject, description, or dueDate');
        switch (option) {
            case 'subject':
                await updateSubject(msg_input, interaction);
                break;
            case 'description':
                await updateDescription(msg_input, interaction);
                break;
            case 'dueDate':
                await updateDueDate(msg_input, interaction);
                break;
            default:
                await interaction.followUp('Invalid option selected.');
                await editQuestion(msg_input, interaction, false);
        }

        const confirm = await getUserInput(interaction, 'Do you want to edit anything else? (yes/no)');
        if ( confirm && ['y', 'yes'].includes(confirm.toLowerCase()) ){
            await editQuestion(msg_input, interaction, true);
        } else {
            await interaction.followUp('Edit completed.');
        }
    } catch (error) {
        console.error(error);
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
};

