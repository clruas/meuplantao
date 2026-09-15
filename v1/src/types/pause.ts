import type { ISODateString } from './common';

/**
 * Período de férias/pausa vinculado a um Shift.
 * Não gera registros diários — relatórios cruzam datas sob demanda.
 */
export interface ShiftPause {
  id: string;
  shiftId: string;
  startDate: ISODateString;
  endDate: ISODateString;
  reason?: string;
}