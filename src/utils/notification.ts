import { Client, EmbedBuilder } from "discord.js";
import { prisma } from "./prisma";
import dayjs from "dayjs";

const TumKanban = async(c: Client) => {
    try {
        const threeDaysFromNow = dayjs().add(4, 'day');
        const homeworks = await prisma.homework.findMany({
            where: {
                dueDate: {
                    gte: new Date(),
                    lte: threeDaysFromNow.toDate()
                }
            },
            take: 5
        });

        // notification to user with dm embed
        const embeds = [] as EmbedBuilder[];
            const userDiscord = await c.users.fetch( '326363870887280642' ); 
            if ( !userDiscord ) return;
        homeworks.forEach( async(homework) => {

            const embed = new EmbedBuilder()
                                 .setTitle('Homework Reminder')
                                 .setDescription(`You have a homework due in ${dayjs(homework.dueDate).diff(dayjs(), 'day')} days!`)
                                 .addFields([
                                    {
                                        name: 'ชื่อวิชา',
                                        value: homework.subject
                                    },
                                    {
                                        name: 'รายละเอียด',
                                        value: homework.description
                                    },
                                    {
                                        name: 'วันที่สั่ง',
                                        value: dayjs(homework.dueDate).format('MM/DD/YYYY'),
                                        inline: true
                                    },
                                    {
                                        name: 'วันที่ส่ง',
                                        value: dayjs(homework.dueDate).format('MM/DD/YYYY'),
                                        inline: true
                                    }
                                 ])
                                 .setColor('#FF0000')
                                 .setTimestamp();
            embeds.push(embed);
        });
        // send dm
        await userDiscord.send({ embeds: embeds })


        console.log(homeworks);
        console.log('------------')
        

    } catch (e) {
        console.log(e);
    }
}

export default TumKanban;