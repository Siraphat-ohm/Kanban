import { CommandInteraction, Embed, EmbedBuilder } from "discord.js";
import { prisma } from "../../utils/prisma";
import dayjs from "dayjs";
import finished from "../../utils/finished";

const listHomework = async(interaction: CommandInteraction) => {
    try {
        const homeworks = await prisma.homework.findMany({ take: 5}); 
        
        if ( !(homeworks.length === 0) ) {
            const header = new EmbedBuilder().setTitle('Homeworks');
            const embeds = [header]
            for (const homework of homeworks) {
                // random color
                const embed = new EmbedBuilder()
                                    .setColor('#0099ff')
                                    .addFields([
                                        {
                                            name: 'วิชา',
                                            value: homework.subject,
                                            inline: true,
                                        },
                                        {
                                            name: 'รายละเอียด',
                                            value: homework.description,
                                        },
                                        {
                                            name: 'วันที่สั่ง',
                                            value: dayjs(homework.createAt.toString()).format('DD/MM/YYYY'),
                                            inline: true,
                                        },
                                        {
                                            name: 'วันที่ส่ง',
                                            value: dayjs(homework.dueDate.toString()).format('DD/MM/YYYY'),
                                            inline: true,
                                        }
                                    ]);
                embeds.push(embed);
            }
            await interaction.channel?.send({ embeds: embeds });
            await finished(interaction);
        } else {
            await interaction.channel?.send('No homework found');
            await finished(interaction);
        }
        
    } catch (e) {
        console.log(e);
    }
}

export default listHomework;