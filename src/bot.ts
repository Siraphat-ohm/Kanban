import dotenv from 'dotenv';
import createClient from './client';
import { ActivityType, ChannelType, ShardingManager } from 'discord.js';
import edit from './commands/edit/edit-homework';
import jot from './commands/jot/jot';
import listHomework from './commands/list-homework/list-homework';
import ping from './commands/ping';
import delay from './utils/delay';

dotenv.config();

const client = createClient();
// manage sharding

client.on('ready', () => {
    client.user?.setActivity({
        name: 'FUCK',
        type: ActivityType.Playing
    });
    console.log(`Logged in as ${client.user?.tag}!`);
});


client.on('interactionCreate', async(interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if ( !interaction.guild ) return;
    if ( !interaction.channel ) return;

    if ( commandName === 'stats' ){
    }

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
        await interaction.reply(`Your jot channel: <#${channel.id}> has been created. Please click on the channel to join.`);

    } else {

    if ( !interaction.guild ) return;

    if ( interaction.channel?.id !== foundChannel?.id ) {
        await interaction.reply(`Your jot channel: <#${foundChannel?.id}> is ${interaction.user}`);
        await delay(3000);
        await interaction.deleteReply();
    } else {
            
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
            case 'edit':
                edit(interaction);
                break;
            default:
                break;
        }

    }
        
}});


client.login(process.env.TOKEN);