import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
//import { CoverageQuickAddSheet } from '../coverage/CoverageQuickAddSheet';
import type { CalendarDay } from '../../utils/calendarRange';
import type { Confirmation, ConfirmationStatus, ShiftType } from '../../types';

interface DayDetailSheetProps {
  day: CalendarDay;
  onClose: () => void;
  onGoToManagement: () => void;
}

const STATUS_LABELS: Record<ConfirmationStatus, string> = {
  completed: 'Realizado',
  absence: 'Falta',
  illness: 'Doença',
  swap: 'Troca',
  hospitalization: 'Internação',
};

const EDITABLE_STATUSES: ConfirmationStatus[] = [
  'completed',
  'absence',
  'illness',
  'swap',
  'hospitalization',
];

function opposite(type: ShiftType): ShiftType {
  return type === 'day' ? 'night' : 'day';
}

export function DayDetailSheet({ day, onClose, onGoToManagement }: DayDetailSheetProps) {
  const [coverageDraftType, setCoverageDraftType] = useState<ShiftType | null>(null);

  // cobertura só é oferecida quando existe exatamente 1 shift ativo e o
  // turno oposto ainda está livre — a única situação em que ela é válida (PRD 5.1)
  const freeType: ShiftType | null =
    day.activeShifts.length === 1 && !day.coverage ? opposite(day.activeShifts[0].type) : null;

  const isEmpty = day.activeShifts.length === 0 && !day.coverage;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-lg">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <h2 className="mb-3 text-sm font-semibold text-slate-800">{day.date}</h2>

        {isEmpty && (
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            Nenhum plantão neste dia.{' '}
            <button type="button" onClick={onGoToManagement} className="text-sky-600 underline">
              Ir para gerenciamento de plantões
            </button>
          </div>
        )}

        {day.activeShifts.map((shift) => {
          const confirmation = day.confirmations.find((c) => c.shiftId === shift.id);
          return (
            <div key={shift.id} className="mb-3 rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: shift.color }} />
                  <span className="text-sm font-medium text-slate-800">{shift.name}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {shift.type === 'day' ? 'Diurno' : 'Noturno'} · R$ {shift.value.toFixed(2)}
                </span>
              </div>

              {confirmation ? (
                <ConfirmationStatusEditor confirmation={confirmation} />
              ) : (
                <p className="mt-2 text-xs text-slate-400">
                  Previsto — ainda não efetivado (o status só pode ser alterado depois que a efetivação
                  automática gerar o registro deste dia).
                </p>
              )}
            </div>
          );
        })}

        {day.coverage && (
          <div className="mb-3 rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-slate-800">{day.coverage.name}</span>
              </div>
              <span className="text-xs text-slate-500">
                {day.coverage.type === 'day' ? 'Diurno' : 'Noturno'} · R$ {day.coverage.value.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {freeType && (
          <button
            type="button"
            onClick={() => setCoverageDraftType(freeType)}
            className="mt-2 w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white"
          >
            Registrar cobertura neste dia
          </button>
        )}
      </div>

      {coverageDraftType && (
        <CoverageQuickAddSheet
          date={day.date}
          type={coverageDraftType}
          onClose={() => setCoverageDraftType(null)}
        />
      )}
    </>
  );
}

function ConfirmationStatusEditor({ confirmation }: { confirmation: Confirmation }) {
  const updateConfirmationStatus = useAppStore((s) => s.updateConfirmationStatus);
  const [pendingStatus, setPendingStatus] = useState<ConfirmationStatus>(confirmation.status);
  const [countsAsEarnings, setCountsAsEarnings] = useState(confirmation.countsAsEarnings);
  const [swapName, setSwapName] = useState(confirmation.swapCoworkerName ?? '');
  const [error, setError] = useState<string | null>(null);

  const needsCountsChoice =
    pendingStatus === 'absence' || pendingStatus === 'illness' || pendingStatus === 'swap';
  const needsSwapName = pendingStatus === 'swap';

  function handleApply() {
    const result = updateConfirmationStatus(confirmation.id, {
      status: pendingStatus,
      countsAsEarnings: needsCountsChoice ? countsAsEarnings : undefined,
      swapCoworkerName: needsSwapName ? swapName : undefined,
    });
    if (!result.success) return setError(result.error);
    setError(null);
  }

  return (
    <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
      <select
        value={pendingStatus}
        onChange={(e) => setPendingStatus(e.target.value as ConfirmationStatus)}
        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
      >
        {EDITABLE_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      {needsCountsChoice && (
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={countsAsEarnings}
            onChange={(e) => setCountsAsEarnings(e.target.checked)}
          />
          Contar valor como ganho
        </label>
      )}

      {needsSwapName && (
        <input
          type="text"
          placeholder="Nome do colega"
          value={swapName}
          onChange={(e) => setSwapName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleApply}
        className="w-full rounded-md bg-slate-800 py-1.5 text-xs font-medium text-white"
      >
        Salvar status
      </button>
    </div>
  );
}