import type { Shift } from "../types";
import { daysBetween } from "./dateHelpers";

export function getConflictBetween(shiftA: Shift, shiftB: Shift): boolean {
  if (shiftA.type !== shiftB.type) return false; // dia+noite nunca conflita
  const diff = daysBetween(shiftA.startDate, shiftB.startDate);
  return diff % 2 === 0; // mesma paridade = colidem em todo dia ativo
}

export function wouldCreateConflict(existingShifts: Shift[], candidate: Shift): boolean {
  return existingShifts
    .filter((s) => s.status === 'active')
    .some((s) => getConflictBetween(s, candidate));
}