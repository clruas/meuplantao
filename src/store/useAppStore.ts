import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Shift } from "../types/common";

interface AppState {
    shifts: Shift
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            shifts: []
        }),
        {
            name: 'meu-plantao-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)