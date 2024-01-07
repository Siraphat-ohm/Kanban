import dayjs from "dayjs";

const isValidDateFormat = (msg_input: string): boolean => {
    const date = dayjs(msg_input, 'DD/MM/YYYY');
    const year = date.year();
    if ( year > 9999 || year < 1970 ){
        return false;
    }
    return date.isValid();
}

export default isValidDateFormat;