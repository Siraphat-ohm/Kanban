import { CommandInteraction, ThreadOnlyChannel } from 'discord.js';
import input from '../../../utils/interaction/input';


const description = async( c: CommandInteraction ): Promise<string> => {
    try {
        const description = await input( c, 'What is the description of the jot?', 'followUp' ); 
        return description;
    } catch (e) {
        throw e;
    }
}

export default description;