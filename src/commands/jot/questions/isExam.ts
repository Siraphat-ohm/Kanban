import { CommandInteraction } from 'discord.js';
import input from '../../../utils/interaction/input';

const isExam = async( c: CommandInteraction ): Promise<boolean> => {
    try {
        const answer = await input( c, 'Is this an exam?', 'followUp' );
        if ( answer && ['y', 'yes'].includes(answer.toLowerCase()) ) {
            return true;
        } else if ( answer && ['n', 'no'].includes(answer.toLowerCase()) ) {
            return false;
        } else {
            await c.followUp('Invalid input. Please try again.');
            return await isExam( c );
        }
    } catch (e) {
        throw e;
    }
}

export default isExam;