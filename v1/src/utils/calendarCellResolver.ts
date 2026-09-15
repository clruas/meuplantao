import type { CalendarDay } from './calendarRange';
import type { ShiftType } from '../types';
import { COVERAGE_COLOR } from '../constants/colors';

/**
 * Metade de uma célula do calendário, já resolvida para exibição.
 * `isException` sinaliza status fora do padrão (falta, doença, troca,
 * internação) para a UI aplicar o indicador visual leve (ver seção 3.2)
 * — sem inventar uma cor nova por status.
 */
export interface CellHalf {
  key: string;
  type: ShiftType;
  color: string;
  isException: boolean;
  label: string;
}

/** Resultado pronto para o componente `DayCell` desenhar, sem lógica própria. */
export interface ResolvedDayCell {
  date: string;
  halves: CellHalf[]; // 0, 1 ou 2 metades
  hasConflictWarning: boolean; // sinaliza os raros dias com 3+ ativos (dado inconsistente vindo de backup, ver guia do motor)
}

/**
 * Decide como pintar um dia: inteira (1 metade) ou dividida (2 metades),
 * dando prioridade à Confirmation real sobre a previsão de recorrência
 * quando ela existir (regra registrada no guia do motor de cálculo).
 */
export function resolveDayCell(day: CalendarDay): ResolvedDayCell {
  const halves: CellHalf[] = [];

  for (const shift of day.activeShifts) {
    const confirmation = day.confirmations.find((c) => c.shiftId === shift.id);
    halves.push({
      key: shift.id,
      type: shift.type,
      color: shift.color, // sempre a cor ATUAL do shift, nunca snapshot
      isException: confirmation ? confirmation.status !== 'completed' : false,
      label: shift.name,
    });
  }

  if (day.coverage) {
    halves.push({
      key: day.coverage.id,
      type: day.coverage.type,
      color: COVERAGE_COLOR,
      isException: false,
      label: day.coverage.name,
    });
  }

  return {
    date: day.date,
    halves: halves.slice(0, 2), // máx. 2 metades visíveis — ver hasConflictWarning abaixo
    hasConflictWarning: halves.length > 2,
  };
}