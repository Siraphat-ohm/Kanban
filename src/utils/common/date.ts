import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

const isValidDateFormat = (msg_input: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = msg_input.match(regex);

    if (!match) return false;

    const [_, day, month, year] = match.map(Number);

    // JavaScript counts months from 0 to 11, so subtract 1 from the month
    const date = new Date(year, month - 1, day);

    // Check if the date is valid and components match (to avoid cases like 31/02/2020)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}


const formatDate = ( date: string ): Date => {
    const split = date.split('/');
    const [ day, month, year ] = split;
    // minus 1 because month is 0 indexed
    return new Date(Number(year), Number(month)-1, Number(day))
}

export { isValidDateFormat, formatDate};