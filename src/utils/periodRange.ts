import type { CalendarViewMode, ISODateString, PeriodRange } from "../types/common";
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

export function getPeriodRange(reference: ISODateString, mode: CalendarViewMode) : PeriodRange {
    const date = toDate(reference);
    
    //const weekday = date.getDay(); // 0 = domingo
    //const day = mode == 'month' ? 1 : date.getDate() - weekday
    //const start = toISODate(new Date(date.getFullYear(), date.getMonth(), day));
    //const end = mode == 'month' ? toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0)) : addDaysISO(start, 6);
    
    if (mode === 'week') {
        const weekday = date.getDay(); // 0 = domingo
        const start = toISODate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday));
        return { start, end: addDaysISO(start, 6) };
    }
    
    // mode === 'month': já retorna alinhado ao grid (domingo da 1ª semana até sábado da última)
    const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDayDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const lastWeekday = lastDayDate.getDay();
    
    const start = toISODate(new Date(date.getFullYear(), date.getMonth(), 1 - firstWeekday));
    //const end = toISODate(new Date(date.getFullYear(), date.getMonth(), lastDayDate.getDate() + (6 - lastWeekday)));
    const end = addDaysISO(start, 41)
    
    //console.log(reference, mode, start, end)
    
    return { start, end }
}