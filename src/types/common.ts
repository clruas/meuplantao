
export const CalendarViewMode = 'month' | 'week'

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export type ISODateString = string;

export const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export interface PeriodRange {
  start: ISODateString;
  end: ISODateString;
}

/** Turno do plantão: diurno (07h–19h) ou noturno (19h–07h) */
export type ShiftType = 'day' | 'night';

/** Situação do vínculo de plantão (não da ocorrência diária) */
export type ShiftStatus = 'active' | 'closed';

export interface Shift {
  id: string
  name: string
  type: ShiftType
  value: number
  startDate: ISODateString;
  color: string
  status: ShiftStatus
}

export interface Coverage {
  id: string;
  name: string;
  type: ShiftType;
  value: number;
  date: ISODateString;
}

export type ConfirmationStatus =
  | 'completed'
  | 'absence'
  | 'illness'
  | 'swap'
  | 'hospitalization';

export interface Confirmation {
  id: string;
  shiftId: string;
  date: ISODateString;
  type: ShiftType;
  value: number;
  status: ConfirmationStatus;
  countsAsEarnings: boolean;
  swapCoworkerName?: string;
}

export interface CalendarDay {
  date: ISODateString;
  activeShifts: Shift[];
  coverage?: Coverage;
  confirmations: Confirmation[];
}

export interface CalendarGridProps {
  period: PeriodRange,
  days: CalendarDay[]
  selectedDate: ISODateString
  onSelectDay: (date: string) => void
}

export interface CalendarItemProps {
  day: CalendarDay
}

export interface ShiftItemProps {
  day: CalendarDay
}