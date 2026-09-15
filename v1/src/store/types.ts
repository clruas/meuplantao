import type { Shift, Confirmation, Coverage, ShiftPause, ShiftType, ISODateString } from '../types';

/**
 * Resultado padronizado de qualquer action que possa falhar por uma
 * regra de negócio esperada (conflito, turno ocupado, etc.) — nunca
 * por bug de programação, isso continua sendo exceção dentro da action.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Campos que o usuário informa ao criar um Shift — sem id/status, que o store controla */
export type ShiftInput = {
  name: string;
  type: ShiftType;
  value: number;
  startDate: ISODateString;
  color: string;
};

/** Campos editáveis de um Shift já existente (todos opcionais: edição parcial) */
export type ShiftEditableFields = Partial<Omit<Shift, 'id' | 'status'>>;

export type CoverageInput = {
  name: string;
  type: ShiftType;
  value: number;
  date: ISODateString;
};

export type ShiftPauseInput = {
  shiftId: string;
  startDate: ISODateString;
  endDate: ISODateString;
  reason?: string;
};

export type ConfirmationStatusChangeInput = {
  status: ConfirmationStatus;
  countsAsEarnings?: boolean;
  swapCoworkerName?: string;
};

export interface AppState {
  // --- dados persistidos ---
  shifts: Shift[];
  confirmations: Confirmation[];
  coverages: Coverage[];
  pauses: ShiftPause[];
  /** Cursor de catch-up por Shift — ver seção 1.4 do guia. Não é campo do Shift em si. */
  lastSyncByShift: Record<string, ISODateString>;

  // --- controle de hidratação (não persistido, ver seção 3.2) ---
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // --- actions de Shift ---
  addShift: (input: ShiftInput) => ActionResult<string>;
  updateShift: (id: string, changes: ShiftEditableFields) => ActionResult;
  closeShift: (id: string) => ActionResult;
  deleteShift: (id: string) => ActionResult;
  updateConfirmationStatus: (
    confirmationId: string,
    input: ConfirmationStatusChangeInput
  ) => ActionResult;

  // --- actions de Coverage e ShiftPause ---
  addCoverage: (input: CoverageInput) => ActionResult<string>;
  addShiftPause: (input: ShiftPauseInput) => ActionResult<string>;

  // --- catch-up ---
  runCatchUp: (now?: Date) => void;
}