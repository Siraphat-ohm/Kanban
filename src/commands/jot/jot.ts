import { CommandInteraction } from "discord.js";
import { Jot } from "../../interfaces/jot.interface";
import { confirmQuestion, descriptionQuestion, dueDateQuestion, isExamQuestion, roleQuestion, subjectQuestion } from "./question";
import finished from "../../utils/finished";
import { prisma } from "../../utils/prisma";
import dayjs from "dayjs";
import generateId from "../../utils/generateId";

const jot = async (interaction: CommandInteraction) => {
    try {

        const msg_input = {} as Jot

        const member = await interaction.guild?.members.fetch(interaction.user.id);

        const jot = member?.roles.cache.find(role => role.name === 'jot');
        if ( (jot?.name)?.toLowerCase() !== 'jot' ) {
            await interaction.channel!.send('You are not jot.');
            return;
        } else {

            await interaction.reply('Please answer the following questions.');

            const rolesId = await roleQuestion( interaction, true );
            await subjectQuestion( msg_input, interaction, true );
            await descriptionQuestion( msg_input, interaction, true );
            await dueDateQuestion( msg_input, interaction, true );
            await isExamQuestion( msg_input, interaction, true );
            const confirm = await confirmQuestion( msg_input, interaction, true );
            if ( !confirm ) {
                await interaction.channel!.send('Cancelled');
                return;
            } else {
                await prisma.homework.create( {
                    data: {
                        id: generateId(),
                        description: msg_input.description,
                        subject: msg_input.subject,
                        isExam: msg_input.isExam,
                        dueDate: new Date(dayjs(msg_input.dueDate).format('YYYY-MM-DD')),
                        role: {
                            connect: {
                                id: rolesId
                            }
                        },
                    }
                });
                await interaction.followUp('Home work created.');
                await finished(interaction);
            }
        }

    } catch (e) {
        console.log(e);
        await interaction.channel!.send('Something went wrong. Please try again.');
    } 
};

export default jot;