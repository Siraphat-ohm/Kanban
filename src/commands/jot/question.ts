import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Jot } from "../../interfaces/jot.interface";
import dayjs from "dayjs";
import getUserInput from "../../utils/getUserInput";
import isValidDateFormat from "../../utils/isValidDateFormat";

export const subjectQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    const subjects = ['Math', 'Science', 'English', 'History'];
    if ( !isFirstAttempt ) await interaction.editReply('Please try again.')

    try {
        const subject = await getUserInput(interaction, 'What subject is this for? should be one of the following: Math, Science, English, History', 'reply');

        if (subject && subjects.includes(subject)) {
            msg_input.subject = subject;
        } else {
            await subjectQuestion(msg_input, interaction, false);
        }
    } catch (e) {
        console.log(e);
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }
}

export const descriptionQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    if ( !isFirstAttempt ) await interaction.editReply('Please try again. Enter a description.')

    try {
        const description = await getUserInput(interaction, 'What\'s the description?', 'followUp');

        if (description) {
            msg_input.description = description;
        } else {
            await descriptionQuestion(msg_input, interaction, false);
        }
    } catch (e) {
        console.log(e);
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }
}

// export const createAtQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    // const promptMessage = isFirstAttempt 
        // ? 'When was this created? format should be DD/MM/YY'
        // : 'Try again. Format should be DD/MM/YY';

    // await interaction.editReply(promptMessage);
    // try {
        // const filter = (m: any) => m.author.id === interaction.user.id;
        // const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        // const create_at = collection?.first()?.content;

        // if (create_at && dayjs(create_at).isValid()) {
            // msg_input.create_at = create_at;
            // await collection?.first()?.delete();
        // } else {
            // await collection?.first()?.delete();
            // await createAtQuestion(msg_input, interaction, false);
        // }
    // } catch (error) {
        // await interaction.followUp('Failed to get a valid response in time. Please try the command again.');
    // }
// }

export const dueDateQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    if ( !isFirstAttempt ) await interaction.editReply('Please try again.')

    try {
        const dueDate = await getUserInput(interaction, 'What\'s the due date? format should be DD/MM/YY', 'followUp');
        const isValid = isValidDateFormat(dueDate)
        const diff = dayjs(dueDate).diff(dayjs(), 'day') > 0;
        const dueDateDayjs = dayjs(dueDate).format('YYYY-MM-DD');
        
        if (dueDate && isValid && diff) {
            msg_input.dueDate = dueDateDayjs; 
        } else {
            await dueDateQuestion(msg_input, interaction, false);
        }
    } catch (e) {
        console.log(e);
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }
}

export const isExamQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean): Promise<void> => {
    if ( !isFirstAttempt ) await interaction.editReply('Please try again. enter (yes/no).')

    try {
        const isExam = await getUserInput(interaction, 'Is this an exam? (yes/no)', 'followUp');

        if (isExam && ['yes', 'no', 'y', 'n'].includes(isExam.toLowerCase())) {
            msg_input.isExam = true;
        } else {
            await isExamQuestion(msg_input, interaction, false);
        }
    } catch (e) {
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }
}

export const confirmQuestion = async (msg_input: Jot, interaction: CommandInteraction, isFirstAttempt: boolean) => {
    if ( !isFirstAttempt ) await interaction.editReply('Please try again. enter (yes/no).')

    try {
        const header = new EmbedBuilder().setTitle('Homeworks');
        const embeds = [header]
        const embed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .addFields([
                                {
                                    name: 'วิชา',
                                    value: msg_input.subject,
                                },
                                {
                                    name: 'รายละเอียด',
                                    value: msg_input.description,
                                },
                                {
                                    name: 'วันที่สร้าง - วันที่ส่ง',
                                    value: `${dayjs().format('DD/MM/YYYY')} - ${dayjs(msg_input.dueDate).format('DD/MM/YYYY')} `,
                                }
                            ]);
        embeds.push(embed);
        await interaction.channel?.send({ embeds: embeds });

        const confirm = await getUserInput(interaction, 'Is this correct? (yes/no)', 'followUp');

        if (confirm && ['yes', 'no', 'y', 'n'].includes(confirm.toLowerCase())) {
            return confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y';
        } else {
            await confirmQuestion(msg_input, interaction, false);
        }
    } catch (e) {
        console.log(e);
        await interaction.channel?.send('Failed to get a valid response in time. Please try the command again.');
    }
}