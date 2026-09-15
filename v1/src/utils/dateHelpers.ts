import { addDays, differenceInCalendarDays, format, isWithinInterval, parseISO, startOfDay } from "date-fns";
import type { ISODateString } from "../types";

export function toDate(iso: ISODateString): Date {
    return startOfDay(parseISO(iso))
}

export function toISODate(date: Date): ISODateString {
    return format(date, 'yyy-MM-dd')
}

/** Diferença em dias entre a e b (b - a). Pode ser negativa se b for anterior a a. */
export function daysBetween(a: ISODateString, b: ISODateString): number {
  return differenceInCalendarDays(toDate(b), toDate(a));
}

export function isDateWithinRange(date: ISODateString, start: ISODateString, end: ISODateString): boolean {
  return isWithinInterval(toDate(date), { start: toDate(start), end: toDate(end) });
}

export function addDaysISO(iso: ISODateString, amount: number): ISODateString {
  return toISODate(addDays(toDate(iso), amount));
}