import { CommandInteraction } from 'discord.js';
import input from '../../../utils/interaction/input';
import { isValidDateFormat, formatDate } from '../../../utils/common/date';

const dueDate = async (c: CommandInteraction): Promise<string> => {
    try {
        let isValid = false;
        let formattedDate;
        await c.followUp('What is the due date? (Format: DD/MM/YYYY)');

        while (!isValid) {
            const date = await input(c, '', 'followUp');
            isValid = isValidDateFormat(date);
            if (!isValid) {
                await c.followUp('Invalid date. Please try again. format: DD/MM/YYYY');
            } else {
                formattedDate = formatDate(date);
            }
        }

        return formattedDate?.toString() || '';
    } catch (e) {
        throw e;
    }
};

export default dueDate;