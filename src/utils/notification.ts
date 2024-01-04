import { Client, EmbedBuilder } from "discord.js";
import { prisma } from "./prisma";
import dayjs from "dayjs";

const TumKanban = async (c: Client, guildId: string) => {
    try {
        const guild = await c.guilds.fetch(guildId);
        const threeDaysFromNow = dayjs().add(4, 'day');
        const homeworks = await prisma.homework.findMany({
            select: {
                subject: true,
                description: true,
                dueDate: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            where: {
                dueDate: {
                    gte: new Date(),
                    lte: threeDaysFromNow.toDate()
                },
            },

        });

        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                homework: {
                    select: {
                        subject: true,
                        description: true,
                        dueDate: true,
                    },
                    
                },
                
             },
            where: {
                homework: {
                    some: {
                        dueDate: {
                            gte: new Date(),
                            lte: threeDaysFromNow.toDate()
                        },
                    },
                },
            }
        });

        for ( const { id, homework } of roles ){
            const embeds = [] as EmbedBuilder[];
            const role = guild.roles.cache.get(id);
            await guild.members.fetch();
            const users = guild.members.cache.filter((member) => { return member.roles.cache.has(role!.id) });
            for ( const { subject, description, dueDate } of homework ){
                const userNames = users.map((user) => { return user.user.username }).join(', ');
                if (!role) return;
                const embed = new EmbedBuilder()
                    .setTitle(subject)
                    .setDescription(description)
                    .addFields({ name: 'Due Date', value: dueDate.toString() },
                            { name: 'Assigned to', value: userNames || 'No users with this role' })
                    .setColor('#0099ff');
                embeds.push(embed);
            }

            for (const [_, user] of users) {
                if ( user.user.bot ) continue;
                const dmChannel = await user.createDM();
                await dmChannel.send({ embeds: embeds });
            }
        }


    } catch (e) {
        console.log(e);
    }
}

export default TumKanban;
