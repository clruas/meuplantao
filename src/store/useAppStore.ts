import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Shift } from "../types/common";
import { createCoverage, createShift, generatePendingConfirmations } from "../utils/factories";
import { addDaysISO } from "../utils/dateHelpers";

interface AppState {
    shifts: Shift
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

            runCatchUp: (now = new Date()) => {
                set(prev => {
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
                    const shifts = [
                        createShift({ name: 'Plantao daniel', type: 'day', value: 200, startDate: '2026-09-29' }),
                        //createShift({ name: 'HU', type: 'day', value: 200, startDate: '2026-10-02' }),
                    ]
                    const coverages = [
                        //createCoverage({ name: 'Cobertura fernanda', type: 'night', value: 200, date: '2026-10-04' }),
                        //createCoverage({ name: 'Cobertura texto grande', type: 'night', value: 200, date: '2026-10-10' }),
                        //createCoverage({ name: 'Cobertura noite', type: 'night', value: 200, date: '2026-10-14' }),
                        //createCoverage({ name: 'Cobertura dia', type: 'day', value: 200, date: '2026-10-14' }),
                        //createCoverage({ name: 'Cobertura noite', type: 'night', value: 200, date: '2026-10-11' }),
                        //createCoverage({ name: 'Cobertura noite', type: 'night', value: 200, date: '2026-10-23' }),
                        createCoverage({ name: 'Cobertura Tamires - Eleicao', type: 'day', value: 200, date: '2026-10-04' }),
                        createCoverage({ name: 'Cobertura Tamires', type: 'day', value: 200, date: '2026-10-26' }),
                        createCoverage({ name: 'Cobertura Tamires', type: 'day', value: 200, date: '2026-11-01' }),
                    ]

                    //const shifts = []
                    //console.log(shifts)
                    return { confirmations, lastSyncByShift, coverages };
                })
            },
        }),
        {
            name: 'meu-plantao-storage',
            storage: createJSONStorage(() => localStorage),
            version: 0,
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Falha ao reidratar o estado do Meu Plantão:', error);
                    return;
                }
                console.log('STATE:', state)
                state?.setHasHydrated(true);               
                state?.runCatchUp();
            }
        }
    )
)