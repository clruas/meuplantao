import type { ShiftType, ISODateString } from './common';

/**
 * Plantão avulso, sem recorrência. A validação de "só pode existir
 * no turno oposto a um Shift existente no mesmo dia" é regra de
 * negócio (camada de cálculo), não pertence a este tipo.
 */
export interface Coverage {
  id: string;
  name: string;
  type: ShiftType;
  value: number;
  date: ISODateString;
}