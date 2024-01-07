import { CommandInteraction } from 'discord.js';
import logger from '../../utils/common/logger';

const jot = async( c: CommandInteraction ) => {
    try {
        await c.followUp('test');
    } catch (e) {
        logger.error(e);
    }
}

export default jot;