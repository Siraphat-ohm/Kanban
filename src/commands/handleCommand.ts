import { CommandInteraction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import logger from '../utils/common/logger';
import jot from './jot'

const commands = [
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('reply pong'),
        new SlashCommandBuilder()
            .setName('jot')
            .setDescription('reply jot')

]

export const registerCommands = (TOKEN: string, CLIENT_ID: string, GUILD_ID: string) => {

    try {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        (async () => {
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands },
            );
        })();

        for ( const command of commands ) {
            logger.info(`register ${command.name} completed`)            
        }

    } catch (e) {
        console.error(e);
    }
}

export const handleCommands = async( command: string, c: CommandInteraction ) => {
    try {
        switch (command) {
            case 'ping':
                await c.reply('pong');
                break;
            case 'jot':
                await jot(c);
                break;
            default: 
                break;
        }
    } catch (e) {
        console.log(e);
    }
}