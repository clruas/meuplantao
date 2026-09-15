import { addDaysISO, toDate, toISODate } from './dateHelpers';
import type { ISODateString } from '../types';

export type CalendarViewMode = 'month' | 'week';

export interface PeriodRange {
  start: ISODateString;
  end: ISODateString;
}

/** Devolve o intervalo [início, fim] do mês/semana que contém `reference`. */
export function getPeriodRange(reference: ISODateString, mode: CalendarViewMode): PeriodRange {
  const date = toDate(reference);
  if (mode === 'week') {
    const weekday = date.getDay(); // 0 = domingo
    const start = toISODate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday));
    return { start, end: addDaysISO(start, 6) };
  }
  const start = toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
  const end = toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  return { start, end };
}

/** Move a data de referência um período inteiro para frente (+1) ou para trás (-1). */
export function shiftReferenceDate(
  reference: ISODateString,
  mode: CalendarViewMode,
  direction: 1 | -1
): ISODateString {
  const date = toDate(reference);
  if (mode === 'week') {
    return addDaysISO(reference, 7 * direction);
  }
  return toISODate(new Date(date.getFullYear(), date.getMonth() + direction, 1));
}

/**
 * Devolve o intervalo que cobre TODAS as semanas que tocam o mês de
 * `reference` — incluindo os dias do mês anterior/seguinte que
 * completam a primeira e a última semana. É o intervalo usado só
 * para MONTAR O GRID visualmente; o resumo financeiro continua usando
 * getPeriodRange (mês exato), não este aqui.
 *
 * Em vez de calcular números de semana (ex: semana 36, 37...), chega
 * no mesmo resultado de forma mais direta: descobre o dia da semana do
 * primeiro e do último dia do mês, e desloca para trás/frente até cair
 * num domingo/sábado — o efeito final é idêntico a "pegar todas as
 * semanas que tocam o mês", só sem precisar de uma lib de números de semana.
 */
export function getMonthGridRange(reference: ISODateString): PeriodRange {
  const monthPeriod = getPeriodRange(reference, 'month');
  const firstWeekday = toDate(monthPeriod.start).getDay(); // 0 = domingo
  const lastWeekday = toDate(monthPeriod.end).getDay();

  return {
    start: addDaysISO(monthPeriod.start, -firstWeekday),
    end: addDaysISO(monthPeriod.end, 6 - lastWeekday),
  };
}