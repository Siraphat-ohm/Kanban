import { Client, GatewayIntentBits } from "discord.js";
import { REST, Routes } from 'discord.js';
import { Command } from "./interfaces/command.interface";
import { CLIENT_ID, GUILD_ID, TOKEN } from './utils/constant'


const commands: Command[] = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
        cooldown: 5,
    },
    {
        name: 'jot',
        description: 'Jot down a note!',
        cooldown: 120
    },
    {
        name: 'list-homework',
        description: 'List all homework',
        cooldown: 5
    },
    {
        name: 'edit',
        description: 'Edit a note!',
        cooldown: 120
    },
    {
        name: 'test',
        description: 'Test command',
        cooldown: 5
    }
];


const register_commands = (TOKEN: string, CLIENT_ID: string, GUILD_ID: string, commands: Command[]) => {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        (async () => {
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands },
            );
            
            for (const command of commands) {
                console.log(`Successfully registered command ${command.name}`);
            }
            
        })();
    } catch (e) {
        console.error(e);
    }
}

const createClient = () => {
    const client = new Client({ 
                        intents: [
                            GatewayIntentBits.Guilds,
                            GatewayIntentBits.GuildMessages,
                            GatewayIntentBits.MessageContent,
                            GatewayIntentBits.GuildMembers
                        ] 
    });

    register_commands( TOKEN, CLIENT_ID, GUILD_ID, commands);

    return client;
};

export default createClient;