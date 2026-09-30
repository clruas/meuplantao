
export const CalendarViewMode = 'month' | 'week'

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export type ISODateString = string;

export const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export interface PeriodRange {
  start: ISODateString;
  end: ISODateString;
}

export interface Shift {
  id: string
  name: string
  startDate: ISODateString;
  color: string
}

export interface CalendarDay {
  date: ISODateString
  activeShifts: Shift[]
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