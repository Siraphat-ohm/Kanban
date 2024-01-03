import dotenv from 'dotenv';
import createClient from './client';
dotenv.config();

const client = createClient();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.TOKEN);