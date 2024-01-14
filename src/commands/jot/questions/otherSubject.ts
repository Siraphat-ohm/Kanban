import { CommandInteraction } from 'discord.js';
import input from '../../../utils/interaction/input';

const otherSubject = async( c: CommandInteraction ) => {
    try {
        const subject = await input(c, 'Please enter new subject', 'followUp')
        await c.followUp(subject);
    } catch (e) {
        throw e;
    }
}

export default otherSubject;