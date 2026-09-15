// src/utils/periodLabel.ts
import { toDate } from './dateHelpers';
import type { PeriodRange, CalendarViewMode } from './periodRange';

const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function formatPeriodLabel(period: PeriodRange, mode: CalendarViewMode): string {
  const start = toDate(period.start);
  if (mode === 'month') {
    return `${MONTH_NAMES[start.getMonth()]} de ${start.getFullYear()}`;
  }
  const end = toDate(period.end);
  return `${start.getDate()}–${end.getDate()} de ${MONTH_NAMES[end.getMonth()]}`;
}