import type { CalendarViewMode, ISODateString } from "../types/common";
import { addDaysISO, toDate, toISODate } from "./dateHelpers";

export function shiftReferenceDate(
    reference: ISODateString,
    mode: CalendarViewMode,
    direction: 1 | -1
){
    const date = toDate(reference)
    if (mode === 'week') {
        return addDaysISO(reference, 7 * direction);
    }
    return toISODate(new Date(date.getFullYear(), date.getMonth() + direction, 1));
}

export function getPeriodRange(reference: ISODateString, mode: CalendarViewMode){
    const date = toDate(reference);
    const weekday = date.getDay(); // 0 = domingo
    const day = mode == 'month' ? 1 : date.getDate() - weekday
    const start = toISODate(new Date(date.getFullYear(), date.getMonth(), day));
    const end = mode == 'month' ? toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0)) : addDaysISO(start, 6);
    return { start, end }
}