import clsx from 'clsx';
import type { CalendarViewMode } from "../../utils/periodRange";

interface CalendarHeaderProps {
    viewMode: CalendarViewMode;
    onChangeViewMode: (mode: CalendarViewMode) => void
    onPrevious: () => void
    onNext: () => void
    periodLabel: string
}

export function CalendarHeader({
  viewMode,
  onChangeViewMode,
  onPrevious,
  onNext,
  periodLabel,
}: CalendarHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Período anterior"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        ◀
      </button>

      <span className="text-sm font-medium text-slate-800">{periodLabel}</span>

      <div className="flex items-center gap-2">
        <div className="flex rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onChangeViewMode('month')}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-medium',
              viewMode === 'month' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'
            )}
          >
            Mês
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('week')}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-medium',
              viewMode === 'week' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'
            )}
          >
            Semana
          </button>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Próximo período"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          ▶
        </button>
      </div>
    </header>
  );
}