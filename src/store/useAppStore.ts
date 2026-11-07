import { isBefore, isEqual } from "date-fns"
import { create } from "zustand"

type Service = any
type ServiceItem = any

interface AppState {
    services: Service[]
    items: ServiceItem[]

    addServiceRaw: (service: Service) => void
    addItemRaw: (item: ServiceItem) => void
    reset: () => void
}

const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Plantão Daniel',
    period: 'day',
    value: 200,
    startDate: '2026-10-01',
    lastMonth: '2026-11',
    closeDate: null,
    status: 'active',
  },
];

const DANIEL_DATES = [
  //'2026-10-01', '2026-10-03', '2026-10-05', '2026-10-07', '2026-10-09',
  '2026-10-01', '2026-10-03',
  '2026-10-11', '2026-10-13', '2026-10-15', '2026-10-17', '2026-10-19',
  //'2026-10-21', '2026-10-23', '2026-10-25', '2026-10-27', '2026-10-29',
  '2026-10-21', '2026-10-23', '2026-10-25', '2026-10-29',
  '2026-10-31', '2026-11-02', '2026-11-04', '2026-11-06', 
  '2026-11-08', '2026-11-10', '2026-11-12', '2026-11-14', 
  '2026-11-16', '2026-11-18', '2026-11-20', '2026-11-22', 
  '2026-11-24', '2026-11-26', '2026-11-28', '2026-11-30', 
];

const danielItems: ServiceItem[] = DANIEL_DATES.map((date) => ({
  id: `i-s1-${date}`,
  serviceId: 's1',
  type: 'normal',
  date,
  period: 'day',
  swapDate: null,
  value: 200,
  status: isBefore(date, new Date()) ? 'completed' : 'scheduled',
  info: '',
}));

danielItems.push(
{
    id: `i-cov-2026-10-05`,
    serviceId: 's1',
    type: 'swap',
    date: '2026-10-05',
    period: 'day',
    swapDate: '2026-10-04',
    value: 200,
    status: 'completed',
    info: ''
},
{
    id: `i-cov-2026-10-07`,
    serviceId: 's1',
    type: 'normal',
    date: '2026-10-07',
    period: 'night',
    swapDate: null,
    value: 200,
    status: 'hospital',
    info: ''
},
{
    id: `i-cov-2026-10-09`,
    serviceId: 's1',
    type: 'normal',
    date: '2026-10-09',
    period: 'day',
    swapDate: null,
    value: 200,
    status: 'pause',
    info: ''
},
{
    id: `i-cov-2026-10-27`,
    serviceId: 's1',
    type: 'normal',
    date: '2026-10-27',
    period: 'day',
    swapDate: null,
    value: 200,
    status: 'absence',
    info: ''
})

const coverageItems: ServiceItem[] = ['2026-10-31', '2026-11-01'].map((date) => ({
  id: `i-cov-${date}`,
  serviceId: null, // cobertura avulsa, sem serviço
  type: 'coverage',
  date,
  period: 'night',
  swapDate: null,
  value: 150,
  status: 'completed',
  info: `Cobertura do dia ${date}`,
}));

coverageItems.push({
    id: `i-cov-2026-11-01`,
    serviceId: null, // cobertura avulsa, sem serviço
    type: 'coverage',
    date: '2026-11-01',
    period: 'day',
    swapDate: null,
    value: 200,
    status: 'completed',
    info: 'Cobertura do dia 2026-11-01'
},
{
    id: `i-cov-2026-10-28`,
    serviceId: null, // cobertura avulsa, sem serviço
    type: 'coverage',
    date: '2026-10-28',
    period: 'night',
    swapDate: null,
    value: 200,
    status: 'absence',
    info: 'Cobertura do dia 2026-10-28'
},
{
    id: `i-cov-2026-11-07`,
    serviceId: null, // cobertura avulsa, sem serviço
    type: 'coverage',
    date: '2026-11-07',
    period: 'night',
    swapDate: null,
    value: 200,
    status: 'scheduled',
    info: 'Cobertura do dia 2026-11-07'
})

const ITEMS = [...danielItems, ...coverageItems]

export const useAppStore = create<AppState>()(
    (set) => ({
        services: [...SERVICES],
        items: [...ITEMS],

        addServiceRaw: service => set(prev => ({ services: [...prev.services, service] })),
        addItemRaw: item => set(prev => ({ items: [...prev.items, item] })),
        reset: () => set({ services: [], items: [] })
    })
)

if(import.meta.env.DEV) {
    (window as any).store = useAppStore
}


/*
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
                state?.setHasHydrated(true);               
                state?.runCatchUp();
            }
        }
    )
)

*/