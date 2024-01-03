import { ChannelType, Client, GatewayIntentBits } from "discord.js";
import ping from "./commands/ping";
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from "./interfaces/command.interface";
import jot from "./commands/jot/jot";
import listHomework from "./commands/list-homework/list-homework";
import delay from "./utils/delay";
dotenv.config();

const commands: Command[] = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'jot',
        description: 'Jot down a note!',
    },
    {
        name: 'list-homework',
        description: 'List all homework',
    }
];

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID as string;

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
                            GatewayIntentBits.GuildMembers,
                            GatewayIntentBits.GuildMessages,
                            GatewayIntentBits.MessageContent
                        ] 
    });

    register_commands( TOKEN, CLIENT_ID, GUILD_ID, commands);

    client.on('interactionCreate', async(interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;

        const channelName = `jot-${interaction.user.id}`;

        let cat ;

        cat = interaction.guild!.channels.cache.find( 
            ( c: any ) => {
                return ( ( c.name as string ).toLowerCase() === 'jot' ) && c.type === ChannelType.GuildCategory
            }
        );
        
        if ( !cat?.id ) {
            cat = await interaction.guild!.channels.create({ name: 'jot', type: ChannelType.GuildCategory  });
        }

        const foundChannel = interaction.guild!.channels.cache.find(
            ( c: any ) => {
                return ( ( c.name as string ) === `${channelName}` ) && c.type === ChannelType.GuildText
            }
        );
        
        if ( !foundChannel?.id ) {
            const channel = await interaction.guild!.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: cat?.id,
                reason: `Jot channel for ${interaction.user.username}`,
                position: 0,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [ 'ViewChannel', 'SendMessages', 'ReadMessageHistory' ],
                    },
                    {
                        id: interaction.guild!.roles.everyone,
                        deny: [ 'ViewChannel' ],
                    }
                ],
            });
            await interaction.reply(`Your jot channel: <#${channel.id}> is ${interaction.user}`);
        } else {

        if ( !interaction.guild ) return;

        // if ( interaction.channel?.id !== foundChannel?.id ) {
            // await interaction.reply(`Your jot channel: <#${foundChannel?.id}> is ${interaction.user}`);
            // await delay(3000);
            // await interaction.deleteReply();
        // } else {
            switch (commandName) {
                case 'ping':
                    await ping(interaction);
                    break;
                case 'jot':
                    jot(interaction);
                    break;
                case 'list-homework':
                    listHomework(interaction);
                    break;
                default:
                    break;
            }
        // }
        
    }});

    return client;
};

export default createClient;