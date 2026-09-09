import type { Coverage, ISODateString, Shift, ShiftPause, ShiftType } from "../types";
import { getShiftStatusForDate } from "./recurrence";

export function canCreateCoverage(
  shifts: Shift[], pauses: ShiftPause[], coverages: Coverage[], date: ISODateString, type: ShiftTypeype
): { allowed: boolean; reason?: string } {
  const oppositeType: ShiftType = type === 'day' ? 'night' : 'day';
  const activeToday = shifts.filter((s) => s.status === 'active' && getShiftStatusForDate(s, pauses, date) === 'active');

  const hasOpposite = activeToday.some((s) => s.type === oppositeType);
  if (!hasOpposite) return { allowed: false, reason: 'Nenhum plantão ativo no turno oposto' };

  const sameTypeSlotTaken = activeToday.some((s) => s.type === type);
  if (sameTypeSlotTaken) return { allowed: false, reason: 'Turno já ocupado por plantão fixo' };

  const duplicateCoverage = coverages.some((c) => c.date === date && c.type === type);
  if (duplicateCoverage) return { allowed: false, reason: 'Já existe cobertura nesse turno/dia' };

  return { allowed: true };
}