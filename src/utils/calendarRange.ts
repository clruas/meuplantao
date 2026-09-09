import type { Shift, ShiftPause, Coverage, Confirmation, ISODateString } from '../types';
import { getShiftStatusForDate } from './recurrence';
import { addDaysISO, daysBetween } from './dateHelpers';

export interface CalendarDay {
  date: ISODateString;
  activeShifts: Shift[];         // 0, 1 ou 2 shifts previstos como ativos
  coverage?: Coverage;
  confirmations: Confirmation[]; // se já existir Confirmation real pra esse dia
}

export function buildCalendarRange(
  shifts: Shift[],
  pauses: ShiftPause[],
  coverages: Coverage[],
  confirmations: Confirmation[],
  start: ISODateString,
  end: ISODateString
): CalendarDay[] {
  const totalDays = daysBetween(start, end);
  const days: CalendarDay[] = [];

  for (let i = 0; i <= totalDays; i++) {
    const date = addDaysISO(start, i);
    const activeShifts = shifts.filter(
      (s) => s.status === 'active' && getShiftStatusForDate(s, pauses, date) === 'active'
    );

    days.push({
      date,
      activeShifts,
      coverage: coverages.find((c) => c.date === date),
      confirmations: confirmations.filter((c) => c.date === date),
    });
  }

  return days;
}