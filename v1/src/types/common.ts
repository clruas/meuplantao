/** Turno do plantão: diurno (07h–19h) ou noturno (19h–07h) */
export type ShiftType = 'day' | 'night';

/** Situação do vínculo de plantão (não da ocorrência diária) */
export type ShiftStatus = 'active' | 'closed';

/** Situação de um dia já efetivado */
export type ConfirmationStatus =
  | 'completed'
  | 'absence'
  | 'illness'
  | 'swap'
  | 'hospitalization';

/** Data simples no formato ISO, ex: '2026-09-06' (sem hora) */
export type ISODateString = string;