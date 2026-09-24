import { addDays, format as frmt, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale"
import type { ISODateString } from "../types/common";

export function toISODate(date: Date): ISODateString {
    return format(date, 'yyy-MM-dd')
}

export function toDate(iso: ISODateString): Date {
    return startOfDay(parseISO(iso))
}

export function addDaysISO(iso: ISODateString, amount: number): ISODateString {
  return toISODate(addDays(toDate(iso), amount));
}

export function format(date, formatStr){
    return frmt(date, formatStr, { locale: ptBR })
}