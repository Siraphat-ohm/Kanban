import { Client, GatewayIntentBits, Guild } from 'discord.js';
import { CLIENT_ID, GUILD_ID, TOKEN } from './utils/common/constant';
import { handleCommands, registerCommands } from './commands/handleCommand'

const createClient = () => {
    const client = new Client({ 
                        intents: [
                            GatewayIntentBits.Guilds,
                            GatewayIntentBits.GuildMessages,
                            GatewayIntentBits.MessageContent,
                            GatewayIntentBits.GuildMembers
                        ] 
    });

    registerCommands( TOKEN, CLIENT_ID, GUILD_ID );

    return client;
};

export default createClient;