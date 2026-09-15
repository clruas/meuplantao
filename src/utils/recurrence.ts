import type { ISODateString, Shift, ShiftPause } from "../types";
import { daysBetween, isDateWithinRange } from "./dateHelpers";

export type DayStatus = 'active' | 'off' | 'paused'

export function getShiftStatusForDate(
    shift: Shift,
    pauses: ShiftPause[],
    date: ISODateString
): DayStatus {
    // const relevantPause = pauses.find(
    //     (p) => p.shiftId === shift.id && isDateWithinRange(date, p.startDate, p.endDate)
    // );
    // if (relevantPause) return 'paused';
    // const diff = daysBetween(shift.startDate, date);
    // // Math.abs evita que datas anteriores ao startDate invertam a paridade
    // // (diff negativo em JS não segue a mesma regra de par/ímpar que diff positivo)
    // return Math.abs(diff) % 2 === 0 ? 'active' : 'off';

    if (date < shift.startDate) {
        return 'off';
    }

    const isPaused = pauses.some((p) => isDateWithinRange(date, p.startDate, p.endDate));
    if (isPaused) {
        return 'paused';
    }

    const diff = daysBetween(shift.startDate, date);
    return Math.abs(diff) % 2 === 0 ? 'active' : 'off';
}