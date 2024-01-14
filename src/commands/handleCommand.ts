import { CommandInteraction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import logger from '../utils/common/logger';
import verifyRoles from '../utils/common/verifyRole';
import jot from './jot'
import { prisma } from '../utils/prismaClient';
import { CLIENT_ID, TOKEN } from '../utils/common/constants';

const buildCommand = async(GUILD_ID: string) => {
    const subjects = await prisma.subject.findMany({
        where: { guildId: GUILD_ID }
    });
    const commands = [
            new SlashCommandBuilder()
                .setName('ping')
                .setDescription('reply pong'),
            new SlashCommandBuilder()
                .setName('jot')
                .setDescription('reply jot')
                .addStringOption( (opt) => 
                    opt.setName('subject')
                        .setDescription('Select subject')
                        .setRequired(true)
                        .addChoices(
                            ...subjects.map( subject => ({ 
                                name: subject.name, 
                                value: subject.id.toString()
                            })),
                            { name: 'อื่นๆ', value: '0' }
                        ) 
                )
    ]
    console.log('register commands success')

    return commands;
}

export const registerCommands = async(TOKEN: string, CLIENT_ID: string, GUILD_ID: string) => {

    try {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        (async () => {
            const commands = await buildCommand(GUILD_ID)
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands  },
            );

            for ( const command of commands ) {
                logger.info(`register ${command.name} completed in guild ${GUILD_ID}`)            
            }
        })();

    } catch (e) {
        console.error(e);
    }
}

export const handleCommands = async( command: string, c: CommandInteraction ) => {
    try {
        switch (command) {
            case 'ping':
            registerCommands(TOKEN, CLIENT_ID, c.guildId!);
                await c.reply('pong');
                break;
            case 'jot':
                if ( verifyRoles(c, [ 'jot' ]) ) {
                    await c.reply('Jot kanban :D')
                    await jot(c);
                    break;
                }
                await c.channel?.send('You are not allowed to use this command');
                break;
            default: 
                break;
        }
    } catch (e) {
        console.log(e);
    }
}