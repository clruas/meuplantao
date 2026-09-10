import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { createShift, createCoverage, createShiftPause } from '../utils/factories';
import { wouldCreateConflict } from '../utils/conflictDetection';
import { canCreateCoverage } from '../utils/coverageValidation';
import { generatePendingConfirmations } from '../utils/confirmationGenerator';
import { addDaysISO } from '../utils/dateHelpers';

import type { AppState, ShiftInput, ShiftEditableFields, CoverageInput, ShiftPauseInput } from './types';
import type { Shift } from '../types';

/** Devolve a mensagem de erro de qualquer exceção lançada pelas factories */
function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : 'Erro inesperado.';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      shifts: [],
      confirmations: [],
      coverages: [],
      pauses: [],
      lastSyncByShift: {},
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addShift: (input) => {
        let candidate: Shift;
        try {
          candidate = createShift(input);
        } catch (error) {
          return { success: false, error: messageFrom(error) };
        }

        const activeShifts = get().shifts.filter((s) => s.status === 'active');
        if (wouldCreateConflict(activeShifts, candidate)) {
          return {
            success: false,
            error: 'Este plantão colide com outro já ativo no mesmo turno e paridade de dias.',
          };
        }

        set((prev) => ({
          shifts: [...prev.shifts, candidate],
          // cursor começa um dia antes do início, para o catch-up já
          // incluir o próprio dia de início na primeira rodada (ver 1.4)
          lastSyncByShift: {
            ...prev.lastSyncByShift,
            [candidate.id]: addDaysISO(candidate.startDate, -1),
          },
        }));

        return { success: true, data: candidate.id };
      },

      updateShift: (id, changes) => {
        const current = get().shifts.find((s) => s.id === id);
        if (!current) {
          return { success: false, error: 'Plantão não encontrado.' };
        }

        const updated: Shift = { ...current, ...changes };

        // só revalida conflito se a mudança puder afetar colisão (ver 3.4)
        const affectsConflict = 'type' in changes || 'startDate' in changes;
        if (affectsConflict && updated.status === 'active') {
          const others = get().shifts.filter((s) => s.id !== id && s.status === 'active');
          if (wouldCreateConflict(others, updated)) {
            return {
              success: false,
              error: 'Esta alteração geraria conflito com outro plantão já ativo.',
            };
          }
        }

        set((prev) => ({
          shifts: prev.shifts.map((s) => (s.id === id ? updated : s)),
        }));
        return { success: true, data: undefined };
      },

      closeShift: (id) => {
        const exists = get().shifts.some((s) => s.id === id);
        if (!exists) {
          return { success: false, error: 'Plantão não encontrado.' };
        }
        set((prev) => ({
          shifts: prev.shifts.map((s) => (s.id === id ? { ...s, status: 'closed' } : s)),
        }));
        return { success: true, data: undefined };
      },

      deleteShift: (id) => {
        const exists = get().shifts.some((s) => s.id === id);
        if (!exists) {
          return { success: false, error: 'Plantão não encontrado.' };
        }
        set((prev) => {
          const { [id]: _removedCursor, ...restLastSync } = prev.lastSyncByShift;
          return {
            shifts: prev.shifts.filter((s) => s.id !== id),
            confirmations: prev.confirmations.filter((c) => c.shiftId !== id),
            pauses: prev.pauses.filter((p) => p.shiftId !== id), // ver 3.5
            lastSyncByShift: restLastSync,
          };
        });
        return { success: true, data: undefined };
      },

      addCoverage: (input: CoverageInput) => {
        const { shifts, pauses, coverages } = get();
        const validation = canCreateCoverage(shifts, pauses, coverages, input.date, input.type);
        if (!validation.allowed) {
          return {
            success: false,
            error: validation.reason ?? 'Cobertura não permitida para este turno/dia.',
          };
        }

        try {
          const coverage = createCoverage(input);
          set((prev) => ({ coverages: [...prev.coverages, coverage] }));
          return { success: true, data: coverage.id };
        } catch (error) {
          return { success: false, error: messageFrom(error) };
        }
      },

      addShiftPause: (input: ShiftPauseInput) => {
        const shiftExists = get().shifts.some((s) => s.id === input.shiftId);
        if (!shiftExists) {
          return { success: false, error: 'Plantão de origem não encontrado.' };
        }

        try {
          const pause = createShiftPause(input);
          set((prev) => ({ pauses: [...prev.pauses, pause] }));
          return { success: true, data: pause.id };
        } catch (error) {
          return { success: false, error: messageFrom(error) };
        }
      },

      runCatchUp: (now = new Date()) => {
        set((prev) => {
          const activeShifts = prev.shifts.filter((s) => s.status === 'active');
          let confirmations = prev.confirmations;
          const lastSyncByShift = { ...prev.lastSyncByShift };

          for (const shift of activeShifts) {
            const shiftPauses = prev.pauses.filter((p) => p.shiftId === shift.id);
            const lastSync = lastSyncByShift[shift.id] ?? addDaysISO(shift.startDate, -1);

            const { confirmations: newOnes, newLastSync } = generatePendingConfirmations(
              shift,
              shiftPauses,
              lastSync,
              now
            );

            if (newOnes.length > 0) {
              confirmations = [...confirmations, ...newOnes];
            }
            lastSyncByShift[shift.id] = newLastSync;
          }

          return { confirmations, lastSyncByShift };
        });
      },
    }),
    {
      name: 'meu-plantao-storage',
      storage: createJSONStorage(() => localStorage),
      version: 0, // ver seção 1.3 — sem migrate ainda, é cedo
      // dispara depois que o estado salvo é carregado, síncrono ou não (ver 1.2)
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Falha ao reidratar o estado do Meu Plantão:', error);
          return;
        }
        // usar `state` (não a variável useAppStore) evita depender da
        // ordem de inicialização do módulo — ver explicação na seção 1.2
        state?.setHasHydrated(true);
        state?.runCatchUp();
      },
    }
  )
);