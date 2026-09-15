import type { Confirmation, ConfirmationStatus } from '../types';

export interface ApplyConfirmationStatusChangeInput {
  confirmation: Confirmation;
  /** Inclui 'completed' para permitir reverter uma marcação anterior — ver seção 1.1 */
  status: ConfirmationStatus;
  /** Obrigatório para 'absence' | 'illness' | 'swap'; ignorado (forçado) para 'hospitalization' e 'completed' */
  countsAsEarnings?: boolean;
  /** Obrigatório quando status é 'swap' */
  swapCoworkerName?: string;
}

/**
 * Aplica uma mudança manual de status a uma Confirmation JÁ EXISTENTE.
 * Nunca cria um registro novo (isso é papel de `createConfirmation`) e
 * nunca altera `id`, `shiftId`, `date`, `type` ou `value` — o snapshot
 * histórico do dia permanece intacto, só o status (e o que depende dele) muda.
 */
export function applyConfirmationStatusChange(
  input: ApplyConfirmationStatusChangeInput
): Confirmation {
  const { confirmation, status } = input;

  let countsAsEarnings: boolean;
  if (status === 'hospitalization') {
    // Regra de negócio: nunca é escolha do usuário, mesmo se o input tentar sobrescrever
    countsAsEarnings = false;
  } else if (status === 'completed') {
    countsAsEarnings = true;
  } else {
    if (input.countsAsEarnings === undefined) {
      throw new Error(`countsAsEarnings é obrigatório para status "${status}"`);
    }
    countsAsEarnings = input.countsAsEarnings;
  }

  if (status === 'swap' && !input.swapCoworkerName) {
    throw new Error('swapCoworkerName é obrigatório quando status é "swap"');
  }

  return {
    ...confirmation,
    status,
    countsAsEarnings,
    swapCoworkerName: status === 'swap' ? input.swapCoworkerName : undefined,
  };
}