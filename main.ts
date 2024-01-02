import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();


const client = new Client({ 
                    intents: [
                        GatewayIntentBits.Guilds,
                        GatewayIntentBits.GuildMembers,
                        GatewayIntentBits.GuildMessages,
                        GatewayIntentBits.MessageContent
                    ] 
                });

client.on('ready', (c) => {
    console.log(`Logged in as ${c.user?.tag}!`);
});

client.on('messageCreate', (msg) => {
    console.log(msg);
    
});


client.login(process.env.TOKEN);