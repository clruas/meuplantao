import type { Confirmation, ISODateString } from "../types/common";
import { addDaysISO, toDate, daysBetween } from "./dateHelpers";

export function createShift(input: {
  name: string;
  type: ShiftType;
  value: number;
  startDate: string;
  color: string;
}): Shift {
  if (input.value < 0) {
    throw new Error('Valor do plantão não pode ser negativo');
  }
  return {
    id: crypto.randomUUID(),
    status: 'active',
    ...input,
  };
}

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

export function createConfirmation(input: {
  shiftId: string;
  date: string;
  type: ShiftType;
  value: number;
  status: ConfirmationStatus;
  countsAsEarnings?: boolean;
  swapCoworkerName?: string;
}): Confirmation {
  let countsAsEarnings: boolean;

  if (input.status === 'hospitalization') {
    // Regra de negócio: nunca é escolha do usuário, mesmo se o input tentar sobrescrever
    countsAsEarnings = false;
  } else if (input.status === 'completed') {
    countsAsEarnings = true;
  } else {
    if (input.countsAsEarnings === undefined) {
      throw new Error(
        `countsAsEarnings é obrigatório para status "${input.status}"`
      );
    }
    countsAsEarnings = input.countsAsEarnings;
  }

  if (input.status === 'swap' && !input.swapCoworkerName) {
    throw new Error('swapCoworkerName é obrigatório quando status é "swap"');
  }

  return {
    id: crypto.randomUUID(),
    shiftId: input.shiftId,
    date: input.date,
    type: input.type,
    value: input.value,
    status: input.status,
    countsAsEarnings,
    swapCoworkerName: input.swapCoworkerName,
  };
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