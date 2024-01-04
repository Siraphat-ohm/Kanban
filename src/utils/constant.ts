import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID as string;

export { TOKEN, CLIENT_ID, GUILD_ID}