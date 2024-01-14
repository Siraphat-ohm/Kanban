import { CommandInteraction, EmbedBuilder, GuildMemberRoleManager, InteractionResponse } from 'discord.js';
import logger from '../../utils/common/logger';
import generateId from '../../utils/common/generateId';
import * as questions from './questions'
import { prisma } from '../../utils/prismaClient';
import dayjs from 'dayjs';

const jot = async( c: CommandInteraction ) => {
    try {
        const { name, value } = c.options.get('subject')!
        console.log(c.options.get('subject')!);
        

        if ( value === '0' ) {
            await questions.otherSubject( c );
        }


        const description = await questions.description( c );
        const dueDate = await questions.dueDate( c );
        const isExam = await questions.isExam( c );

        const subject = await prisma.subject.findUniqueOrThrow({where: { id: value as string } });

        const embed = new EmbedBuilder()
                        .setTitle(subject?.name || '')
                        .setDescription(description)
                        .addFields(
                                {
                                    name: 'Due date',
                                    value: dayjs(dueDate).format('DD/MM/YYYY'),
                                    inline: true,
                                },
                                {
                                    name: 'Exam',
                                    value: isExam ? 'Yes' : 'No',
                                    inline: true,
                                }
                            )
                        .setColor('Aqua')
                        .setTimestamp()

        await c.followUp({ embeds: [embed] });

        const confirm = await questions.confirm( c );

        if ( confirm ){
            await prisma.task.create({ data: {
                id : generateId(),
                description,
                dueDate: new Date(dueDate),
                isExam,
                subjectId: value as string,
                guildId: c.guildId!,
            } });
            await c.followUp('Task created');
        } else { 
            await c.followUp('Task not created');
        }

    } catch (e:any) {
        console.log(e);
        await c.followUp('Something went wrong. Please try again later.');
    }
}

export default jot;