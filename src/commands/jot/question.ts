import { CommandInteraction } from "discord.js";
import { Jot } from "../../interfaces/jot.interface";
import dayjs from "dayjs";

export const subjectQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const subjects = ['Math', 'Science', 'English', 'History'];
    const promptMessage = isFirstAttempt 
        ? 'What subject is this for?'
        : 'Subject should be one of the following: Math, Science, English, History. Please try again.';

    await interaction[isFirstAttempt ? 'reply' : 'editReply'](promptMessage);

    try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const subject = collection?.first()?.content;

        if (subject && subjects.includes(subject)) {
            msg_input.subject = subject;
            await collection?.first()?.delete();
        } else {
            await collection?.first()?.delete();
            await subjectQuestion(msg_input, interaction, false);
        }
    } catch (error) {
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
}

export const descriptionQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const promptMessage = isFirstAttempt 
        ? 'What\'s the description?'
        : 'Description cannot be empty. Please try again.';

    await interaction.editReply(promptMessage);

    try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const description = collection?.first()?.content;

        if (description) {
            msg_input.description = description;
            await collection?.first()?.delete();
        } else {
            await collection?.first()?.delete();
            await descriptionQuestion(msg_input, interaction, false);
        }
    } catch (error) {
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
}

export const dueDateQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const promptMessage = isFirstAttempt 
        ? 'What\'s the due date?'
        : 'Due date cannot be empty. Please try again.';

    await interaction.editReply(promptMessage);

    try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const due_date = collection?.first()?.content;

        if (due_date && dayjs(due_date).isValid()) {
            msg_input.due_date = due_date;
            await collection?.first()?.delete();
        } else {
            await collection?.first()?.delete();
            await dueDateQuestion(msg_input, interaction, false);
        }
    } catch (error) {
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
}

export const isExamQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const promptMessage = isFirstAttempt 
        ? 'Is this an exam?'
        : 'Please answer yes or no.';

    await interaction.editReply(promptMessage);

    try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const is_exam = collection?.first()?.content;

        if (is_exam && ['yes', 'no', 'y', 'n'].includes(is_exam.toLowerCase())) {
            msg_input.is_exam = true;
            await collection?.first()?.delete();
        } else {
            await collection?.first()?.delete();
            await isExamQuestion(msg_input, interaction, false);
        }
    } catch (error) {
        await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    }
}