import type { ShiftType, ShiftStatus, ISODateString } from './common';

/**
 * Vínculo recorrente de plantão (escala 12x36).
 * Não representa um dia específico — isso é o `Confirmation`.
 */
export interface Shift {
  id: string;
  name: string;
  type: ShiftType;
  /** Valor atual do plantão; base para o snapshot em novas Confirmations */
  value: number;
  startDate: ISODateString;
  color: string;
  status: ShiftStatus;
}