import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import toObject from "dayjs/plugin/toObject";

dayjs.extend(duration);
dayjs.extend(toObject);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

const day = dayjs;
export default day;
