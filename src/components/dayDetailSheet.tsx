import { useEffect, useState } from "react";
import type { CalendarDay } from "../types/common";
import { format, toDate } from "../utils/dateHelpers";
import { Ban, Calendar, CalendarDays, CalendarPlus, CalendarSync, Check, ChevronLeft, DollarSign, Dot, Hospital, Moon, RefreshCw, SquarePen, Sun, X } from "lucide-react";
import clsx from "clsx";
import { cn } from "../utils/styles";

function Button1({ children }){
    return <button className="flex-1 bg-orange-500 flex items-center justify-center gap-2 rounded-sm p-2 text-white text-sm">{ children }</button>
}

function Button({ primary, label, onClick, className, icon: Icon }){
    return <button 
        className={cn(
            "bg-orange-500 flex items-center justify-center gap-2 rounded-sm px-2.5 py-1 text-sm text-white",
            primary && 'bg-white border border-orange-500 text-orange-500',
            className
        )}
        onClick={onClick}
    >
        {Icon && <Icon size={16} />}
        <span>{label}</span>
    </button>
}

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

    function handleNewShift(){ console.log('Novo plantao') }
    function handleNewCoverage(){ console.log('Nova cobertura') }

    const isEmpty = day.activeShifts.length === 0 && !day.coverage;
    
    // const date = {
    //     day: format(toDate(day.date), 'dd'),
    //     dayOfWeek: format(toDate(day.date), 'EEEEEE'),
    //     month: format(toDate(day.date), 'MM'),
    //     monthName: format(toDate(day.date), 'MMM').toUpperCase(),
    //     year: format(toDate(day.date), 'yyyy'),
    // }
    
    // console.clear()
    // console.log(day, date)
    console.log(isEmpty)


    return <>
        <div
            className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        />
        <div
            className={`fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-sm bg-white shadow-lg transition-transform duration-300 ease-out ${
                isVisible ? "translate-y-0" : "translate-y-full"
            }`}
        >

            <div className="flex items-center gap-2 px-2 py-3">
                <div className="text-neutral-600" onClick={handleClose}>
                    <ChevronLeft />
                </div>
                <div className="font-bold text-neutral-600 leading-6 text-xl flex-1 flex justify-center">
                    <span className="">{format(day.date, "dd 'de' MMMM")}</span>
                </div>
                <div className="text-white">
                    <Dot />
                </div>
            </div>

            { isEmpty && (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    Nenhum plantão neste dia.{' '}
                    <button type="button" onClick={onGoToManagement} className="text-sky-600 underline">
                        Ir para gerenciamento de plantões
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-2 px-2 pb-2">
                {}
            </div>

            <div className="flex gap-2 px-2 pb-2 h-12">
                <Button label="Novo plantão" icon={CalendarPlus} onClick={handleNewShift} className="flex-1" />
                <Button primary label="Nova cobertura" icon={CalendarSync} onClick={handleNewCoverage} className="flex-1" />
            </div>

        </div>
    </>
}


/////////////// BACKUP E TESTES

// const icons = [
//        <Check size={16} strokeWidth={2.5} />,
//        <Ban size={16} strokeWidth={2.5} />,
//        <RefreshCw size={16} strokeWidth={2.5} />,
//        <Hospital size={16} strokeWidth={2.5} />,
//        <Check size={16} strokeWidth={2.5} />,
//     ]
//     const colors = [
//         "text-indigo-500", "text-red-500", "text-blue-500", "text-neutral-500"
//     ]
        

{/* <div className="flex items-center gap-2">
                <div className="text-neutral-600" onClick={handleClose}><ChevronLeft /></div>
                <div className="flex">
                    <div className="font-bold text-neutral-600 leading-6 text-xl">{format(day.date, "dd 'de' MMMM")}</div>
                    <div className="text-sm text-neutral-500 leading-3">{format(day.date, "EEEE")}</div>
                </div>
                {/ * <div className="mr-2 p-2 text-neutral-600" onClick={handleClose}><X /></div> * /}
            </div> */}

{/*                 
{Array.from({ length: 5 }).map((item, idx) => {
    return <div key={idx} className="bg-slate-100 border-slate-200 border rounded flex items-center gap-3 p-2" onClick={e => console.log('OPS')}>
        <CalendarDays strokeWidth={1.5} />
        <span className="flex-1 text-neutral-600 text-sm">Plantao daniel</span>                            
        {[3].includes(idx) ? <div className="text-indigo-500"><Moon size={16} /></div> : <div className="text-yellow-400"><Sun size={16} /></div>}
        <div className={colors[idx]}>{icons[idx]}</div>
        <div className={`${[1, 2, 3, 4].includes(idx) ? 'text-neutral-300' : 'text-amber-500'}`}><DollarSign size={16} strokeWidth={2.5} /></div>
        {[4].includes(idx)
            ? <div className="flex items-center justify-center px-2 py-0.5 rounded-full bg-neutral-600 text-white text-[10px] uppercase min-w-16">fechado</div>
            : <div className="flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] uppercase min-w-16">ativo</div>
        }
    </div>
})}
 */}


{/* <div className="text-orange-600" onClick={e => console.log('Edita o plantao')}>
    <SquarePen size={16} />
</div> */}

{/*                 
<div className="rounded-sm border border-neutral-200 bg-neutral-100 p-2 flex flex-col gap-2">
    
    <div className="flex items-center justify-between text-neutral-600 text-sm">
        <div className="flex items-center gap-2">
            <div className="text-amber-400"><Sun size={16}/></div>
            <div>Plantao Daniel</div>
        </div>
        <div className="text-xs text-neutral-500">02/09/2026</div>
    </div>
    <div className="flex gap-2">
        <div className="flex items-center px-2 py-1 rounded-full bg-emerald-200 text-white text-xs">ativo</div>
        <div className="flex items-center px-2 py-1 rounded-full bg-blue-200 text-white text-xs">completado</div>
    </div>
</div>
<div className="rounded-sm border border-neutral-200 bg-neutral-100 p-2 flex flex-col gap-2">
    <CalendarSync size={16} />
    <div className="flex items-center justify-between text-neutral-600 text-sm">
        <div className="flex items-center gap-2">
            <div className="text-indigo-400"><Moon size={16}/></div>
            <div>Cobertura Fernanda</div>
        </div>
        <div className="text-xs text-neutral-500">02/09/2026</div>
    </div>
    <div className="flex gap-2">
        <div className="flex items-center px-2 py-1 rounded-full bg-emerald-200 text-black/40 text-xs">ativo</div>
        <div className="flex items-center px-2 py-1 rounded-full bg-amber-200 text-black/40 text-xs">falta</div>
    </div>
</div>
*/}


{/* 
<div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 my-2" />

<div className="flex justify-between px-1">
    <div className="flex flex-col justify-center items-center text-neutral-400">
        <div className="text-[10px] leading-2">{date.dayOfWeek.toUpperCase()}</div>
        <div className="font-black text-xl leading-5">{date.day}</div>
        <div className="text-[10px] leading-2">{date.monthName}</div>
    </div>
    <div className="flex gap-1">
        <Button>Novo Plantão</Button>
        <Button>Nova Cobertura</Button>
    </div>
</div>

<div className="m-1 flex flex-col gap-1">
    {day.activeShifts.map((shift, idx) => {

        return <div key={idx} className={clsx("flex items-center gap-1 p-1 rounded-sm", shift.type == 'day' ? 'bg-sky-300' : 'bg-indigo-300')}>
            <div className="text-white">{shift.type == 'day' ? <Sun size={16} /> : <Moon size={16} />}</div>
            <div>{shift.name}</div>
            <div>{shift.startDate}</div>
        </div>
    })}
</div>

 */}

{/* <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
<h2 className="mb-3 text-sm font-semibold text-slate-800">{day.date}</h2>
<div>
    
</div> */}


///////////////   VERSAO 1

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