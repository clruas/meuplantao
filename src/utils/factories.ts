import type {
  Shift,
  Confirmation,
  Coverage,
  ShiftPause,
  ShiftType,
  ConfirmationStatus,
} from '../types';

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

export function createCoverage(input: {
  name: string;
  type: ShiftType;
  value: number;
  date: string;
}): Coverage {
  if (input.value < 0) {
    throw new Error('Valor da cobertura não pode ser negativo');
  }
  return {
    id: crypto.randomUUID(),
    ...input,
  };
}

export function createShiftPause(input: {
  shiftId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): ShiftPause {
  if (input.endDate < input.startDate) {
    throw new Error('Data de fim da pausa não pode ser anterior à data de início');
  }
  return {
    id: crypto.randomUUID(),
    ...input,
  };
}