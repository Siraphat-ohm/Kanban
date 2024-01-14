import { Client, GatewayIntentBits, Guild } from 'discord.js';

const createClient = () => {
    const client = new Client({ 
                        intents: [
                            GatewayIntentBits.Guilds,
                            GatewayIntentBits.GuildMessages,
                            GatewayIntentBits.MessageContent,
                            GatewayIntentBits.GuildMembers
                        ] 
    });
    return client;
};

export default createClient;