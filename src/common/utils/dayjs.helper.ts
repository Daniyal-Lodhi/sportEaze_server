const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

export const LOCAL_TZ = 'Asia/Karachi'; // your timezone

export function formatToLocalDateTime(date: Date | string, format = 'YYYY-MM-DD HH:mm:ss', timeZone = LOCAL_TZ): string {
    return dayjs(date).tz(timeZone).format(format);
}

export default dayjs;
