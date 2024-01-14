import { CommandInteraction, ThreadOnlyChannel } from 'discord.js';
import input from '../../../utils/interaction/input';


const confirm = async( c: CommandInteraction ): Promise<boolean> => {
    try {
        const confirm = await input( c, 'confirm (y/n)', 'followUp' ); 
        if ( confirm && [ 'y', 'yes'].includes(confirm.toLowerCase()) ) return true;
        else return false;
    } catch (e) {
        throw e;
    }
}

export default confirm;