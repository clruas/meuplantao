import type { Confirmation, Coverage, ShiftPause, ISODateString } from '../types';
import { isDateWithinRange, daysBetween } from './dateHelpers';

export interface ShiftEarnings {
  realizedDays: number;
  total: number;
}

export interface EarningsSummary {
  total: number;
  byShift: Record<string, ShiftEarnings>;
  coverageDays: number;
  coverageTotal: number;
  absenceDays: number;
  illnessDays: number;
  swapDays: number;
  hospitalizationDays: number;
  pauseDays: number;
}

export function calculateEarningsForPeriod(
  confirmations: Confirmation[],
  coverages: Coverage[],
  pauses: ShiftPause[],
  start: ISODateString,
  end: ISODateString
): EarningsSummary {
  const summary: EarningsSummary = {
    total: 0,
    byShift: {},
    coverageDays: 0,
    coverageTotal: 0,
    absenceDays: 0,
    illnessDays: 0,
    swapDays: 0,
    hospitalizationDays: 0,
    pauseDays: 0,
  };

  for (const c of confirmations.filter((c) => isDateWithinRange(c.date, start, end))) {
    if (!summary.byShift[c.shiftId]) {
      summary.byShift[c.shiftId] = { realizedDays: 0, total: 0 };
    }

    // Defesa extra: internação NUNCA conta, mesmo que o dado venha de um JSON importado
    // com countsAsEarnings inconsistente (o backup/restore não passa pelas factories).
    const counts = c.status === 'hospitalization' ? false : c.countsAsEarnings;

    if (counts) {
      summary.total += c.value;
      summary.byShift[c.shiftId].total += c.value;
      summary.byShift[c.shiftId].realizedDays += 1;
    }

    if (c.status === 'absence') summary.absenceDays += 1;
    if (c.status === 'illness') summary.illnessDays += 1;
    if (c.status === 'swap') summary.swapDays += 1;
    if (c.status === 'hospitalization') summary.hospitalizationDays += 1;
  }

  for (const cov of coverages.filter((c) => isDateWithinRange(c.date, start, end))) {
    summary.coverageDays += 1;
    summary.coverageTotal += cov.value;
    summary.total += cov.value;
  }

  for (const pause of pauses) {
    // strings ISO ('yyyy-MM-dd') comparam corretamente com > e < porque o formato
    // já é ordenável lexicograficamente igual à ordem cronológica — não precisa converter pra Date aqui.
    const overlapStart = pause.startDate > start ? pause.startDate : start;
    const overlapEnd = pause.endDate < end ? pause.endDate : end;
    if (overlapStart <= overlapEnd) {
      summary.pauseDays += daysBetween(overlapStart, overlapEnd) + 1;
    }
  }

  return summary;
}