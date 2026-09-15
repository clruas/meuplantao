import type { Shift, ShiftPause, Confirmation, ISODateString } from '../types';
import { getShiftStatusForDate } from './recurrence';
import { addDaysISO, toDate } from './dateHelpers';
import { createConfirmation } from './factories';

export interface GenerateResult {
  confirmations: Confirmation[];
  newLastSync: ISODateString;
}

/** Horário em que o turno termina, como Date real (com hora) — usado só pro corte de catch-up */
function getShiftEndDateTime(shift: Shift, date: ISODateString): Date {
  const base = toDate(date);
  if (shift.type === 'day') {
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 19, 0, 0);
  }
  // noturno termina 07h do dia SEGUINTE ao início do plantão
  const nextDay = new Date(base);
  nextDay.setDate(nextDay.getDate() + 1);
  return new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 7, 0, 0);
}

export function generatePendingConfirmations(
  shift: Shift,
  pauses: ShiftPause[],
  lastSyncDate: ISODateString,
  now: Date
): GenerateResult {
  if (shift.status !== 'active') {
    return { confirmations: [], newLastSync: lastSyncDate };
  }

  const confirmations: Confirmation[] = [];
  let cursor = lastSyncDate;

  while (true) {
    const candidate = addDaysISO(cursor, 1);
    if (getShiftEndDateTime(shift, candidate) > now) break; // turno ainda não terminou, para aqui

    const status = getShiftStatusForDate(shift, pauses, candidate);
    if (status === 'active') {
      confirmations.push(
        createConfirmation({
          shiftId: shift.id,
          date: candidate,
          type: shift.type,
          value: shift.value,
          status: 'completed',
        })
      );
    }
    // 'off' e 'paused' não geram registro, mas o cursor avança do mesmo jeito

    cursor = candidate;
  }

  return { confirmations, newLastSync: cursor };
}