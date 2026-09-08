import type { ShiftType, ConfirmationStatus, ISODateString } from './common';

/**
 * Ocorrência concreta de um dia, gerada a partir de um Shift.
 * `value` e `type` são snapshot no momento da efetivação —
 * nunca recalculados a partir do Shift de origem depois de criados.
 */
export interface Confirmation {
  id: string;
  shiftId: string;
  date: ISODateString;
  type: ShiftType;
  value: number;
  status: ConfirmationStatus;
  /**
   * Se este dia conta como ganho nos relatórios.
   * - status 'completed'        → sempre true
   * - status 'hospitalization'  → sempre false (regra de negócio, não é escolha do usuário)
   * - status 'absence' | 'illness' | 'swap' → escolha do usuário, caso a caso
   */
  countsAsEarnings: boolean;
  /** Obrigatório apenas quando status === 'swap' */
  swapCoworkerName?: string;
}