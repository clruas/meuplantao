import { useEffect, useState } from "react";
import type { CalendarDay } from "../types/common";

interface DayDetailSheetProps {
    day: CalendarDay
    onClose: () => void
}

const TRANSITION_DURATION = 200; // precisa bater com o duration-300 do className

export function DayDetailSheet({ day, onClose }: DayDetailSheetProps){
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    function handleClose() {
        setIsVisible(false); // dispara a animação de saída
        setTimeout(onClose, TRANSITION_DURATION); // desmonta só depois dela terminar
    }

    return <>
        <div
            className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        />
        <div
            className={`fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-sm bg-white p-4 shadow-lg transition-transform duration-300 ease-out ${
                isVisible ? "translate-y-0" : "translate-y-full"
            }`}
        >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
            <h2 className="mb-3 text-sm font-semibold text-slate-800">{day.date}</h2>
            <div>
                
            </div>
        </div>
    </>
}

// import { useEffect, useState } from "react";
// import type { CalendarDay } from "../types/common";

// interface DayDetailSheetProps {
//     day: CalendarDay
//     onClose: () => void
// }

// export function DayDetailSheet({ day, onClose }: DayDetailSheetProps){
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         // roda no próximo frame, garantindo que o navegador registre
//         // o estado inicial (translate-y-full) antes de animar
//         const id = requestAnimationFrame(() => setIsVisible(true));
//         return () => cancelAnimationFrame(id);
//     }, []);

//     return <>
//         <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />
//         <div
//             className={`fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-sm bg-white p-4 shadow-lg transition-transform duration-300 ease-out ${
//                 isVisible ? "translate-y-0" : "translate-y-full"
//             }`}
//         >
//             <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
//             <h2 className="mb-3 text-sm font-semibold text-slate-800">{day.date}</h2>
//         </div>
//     </>
// }


// export function DayDetailSheet({ day, onClose }: DayDetailSheetProps){
//     return <>
//         <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />
//         <div className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-sm bg-white p-4 shadow-lg transition-all">
//             <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
//             <h2 className="mb-3 text-sm font-semibold text-slate-800">{day.date}</h2>
//         </div>
//     </>
// }