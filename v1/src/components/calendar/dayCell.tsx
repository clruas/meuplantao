import clsx from 'clsx';
import { resolveDayCell, type ResolvedDayCell } from '../../utils/calendarCellResolver';
import type { CalendarDay } from '../../utils/calendarRange';

interface DayCellProps {
  day: CalendarDay;
  isCurrentPeriod: boolean;
  onSelect: (date: string) => void;
}

export function DayCell({ day, isCurrentPeriod, onSelect }: DayCellProps) {
  const cell: ResolvedDayCell = resolveDayCell(day);
  const dayNumber = Number(day.date.slice(-2));

  return (
    <button
      type="button"
      onClick={() => onSelect(day.date)}
      className={clsx(
        'relative flex h-14 w-full flex-col overflow-hidden rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-sky-500',
        !isCurrentPeriod && 'opacity-40'
      )}
    >
      <span className="absolute left-1 top-1 z-10 text-xs font-medium text-slate-700">{dayNumber}</span>

      {cell.halves.length === 0 && <div className="h-full w-full bg-slate-100" />}

      {cell.halves.length === 1 && (
        <div
          className={clsx('h-full w-full', cell.halves[0].isException && 'opacity-60')}
          style={{ backgroundColor: cell.halves[0].color }}
        />
      )}

      {cell.halves.length === 2 && (
        <div className="flex h-full w-full">
          {cell.halves.map((half) => (
            <div
              key={half.key}
              className={clsx('h-full w-1/2', half.isException && 'opacity-60')}
              style={{ backgroundColor: half.color }}
            />
          ))}
        </div>
      )}
    </button>
  );
}