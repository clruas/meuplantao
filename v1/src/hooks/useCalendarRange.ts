import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { buildCalendarRange } from '../utils/calendarRange';
import type { PeriodRange } from '../utils/periodRange';

/** Liga o store ao motor de cálculo, recalculando só quando os dados ou o período mudam. */
export function useCalendarRange(period: PeriodRange) {
  const shifts = useAppStore((s) => s.shifts);
  const pauses = useAppStore((s) => s.pauses);
  const coverages = useAppStore((s) => s.coverages);
  const confirmations = useAppStore((s) => s.confirmations);

  return useMemo(
    () => buildCalendarRange(shifts, pauses, coverages, confirmations, period.start, period.end),
    [shifts, pauses, coverages, confirmations, period.start, period.end]
  );
}