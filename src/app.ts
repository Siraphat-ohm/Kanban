import dotenv from 'dotenv';
import createClient from './client';
import { ActivityType } from 'discord.js';
dotenv.config();

const client = createClient();


client.on('ready', () => {
    client.user?.setActivity({
        name: 'FUCK',
        type: ActivityType.Playing
    });
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.TOKEN);