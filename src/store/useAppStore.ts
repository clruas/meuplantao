import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Shift } from "../types/common";
import { createShift, generatePendingConfirmations } from "../utils/factories";
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
                    return { confirmations, lastSyncByShift };
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
                
                //console.clear()
                //console.log('Rehydrate runned...')

                state?.setHasHydrated(true);               
                state?.runCatchUp();
            }
        }
    )
)