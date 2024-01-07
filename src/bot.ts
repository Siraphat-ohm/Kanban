import dotenv from 'dotenv';
import createClient from './client';
import { ActivityType, ChannelType, GuildBasedChannel } from 'discord.js';
import { handleCommands } from './commands/handleCommand';
import logger from './utils/common/logger';
import delay from './utils/common/delay';


dotenv.config();

const client = createClient();

client.on('ready', () => {
    client.user?.setActivity({
        name: 'FUCK',
        type: ActivityType.Playing
    });
    logger.info(`Logged in as ${client.user?.tag}!`) 
});

client.on('interactionCreate', async(interaction) => {
    if ( !interaction.isCommand() || !interaction.guild || !interaction.channel ) return;

    const channelName = `jot-${interaction.user.displayName}`;

    let cat ;

    cat = interaction.guild!.channels.cache.find( 
        ( c: GuildBasedChannel ) => {
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
        await interaction.reply(`Your jot channel: <#${channel.id}> has been created. Please click on the channel to join.`);
        await delay(3000);
        await interaction.deleteReply();

     }  else {
        if ( interaction.channel?.id !== foundChannel?.id ) {
            await interaction.reply(`Your jot channel: <#${foundChannel?.id}> is ${interaction.user}`);
            await delay(3000);
            await interaction.deleteReply();
        } else {
            const { commandName } = interaction;
            await handleCommands( commandName, interaction );
        }
    }
});

client.login(process.env.TOKEN);