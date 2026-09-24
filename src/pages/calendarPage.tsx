import { useState } from "react";
import { format, toDate, toISODate } from "../utils/dateHelpers";
import { CalendarHeader } from "../components/calendarHeader";
import { MONTH_NAMES, WEEKDAY_LABELS } from "../types/common";
import clsx from "clsx";
import { Sun } from "lucide-react";
import { getPeriodRange, shiftReferenceDate } from "../utils/periodRange";
import { PageHeader } from "../components/pageHeader";
import { CalendarMonthGrid } from "../components/calendarMonthgrid";
import { CalendarWeekGrid } from "../components/calendarWeekGrid";

function formatPeriodLabel(mode, period){
    const start = toDate(period.start);
    if (mode === 'month') {
        return `${MONTH_NAMES[start.getMonth()]} de ${start.getFullYear()}`;
    }
    const end = toDate(period.end);
    return `${format(start, 'dd.MMM').toUpperCase()} a ${format(end, 'dd.MMM').toUpperCase()}`
}

export function CalendarPage(){
    const [viewMode, setViewMode] = useState('month')
    const [referenceDate, setReferenceDate] = useState(() => toISODate(new Date()));

    const goNext = () => setReferenceDate(old => shiftReferenceDate(old, viewMode, 1))
    const goPrevious = () => setReferenceDate(old => shiftReferenceDate(old, viewMode, -1))

    const period = getPeriodRange(referenceDate, viewMode)

    //console.log('PAGE', viewMode, referenceDate, period)

    return <>
        <PageHeader>
            <CalendarHeader 
                viewMode={viewMode} 
                onChangeViewMode={setViewMode}
                onNext={goNext}
                onPrevious={goPrevious}
                periodLabel={formatPeriodLabel(viewMode, period)}
            />
        </PageHeader>
        <div className="flex-1">
            {viewMode == 'month' ? <CalendarMonthGrid /> : <CalendarWeekGrid /> }
        </div>
  </>
}

/*


{/* <div>Summary</div> * /}
        <div className="flex-1 overflow-y-scroll">
            {/* { Array.from({ length: 50 }).map(item => <div>ops</div>)} * /}
            <div className="grid grid-cols-7 text-xs">
                {WEEKDAY_LABELS.map((label, i) => <div key={i} className="flex p-1 text-[10px] text-neutral-600 items-center justify-center uppercase">{label}</div>)}
            </div>
            <div className="grid grid-cols-7 border-neutral-100 border-t text-neutral-500">
                { Array.from({ length: 42 }).map((i, idx) => {
                const day = format(new Date(), 'dd')
                return <div key={idx} className="h-20 p-0.5 text-xs border-neutral-100 border-r border-b flex flex-col">
                    <span className={clsx((idx) == day && 'font-bold text-orange-500')}>{idx+1}</span>
                    <div className="flex-1 flex flex-col gap-0.5">
                    { idx % 2 != 1 && <div className="bg-sky-300 rounded-sm flex-1 text-white text-xs p-1"><Sun size={16} /></div>}
                    {/* { idx % 2 != 1 && <div className="bg-blue-400 rounded-sm flex-1 text-white text-xs p-1"><Moon size={16} /></div>} * /}
                    {/* { idx == 17 && <div className="bg-slate-400 rounded-sm flex-1 text-white text-xs p-1">C</div>} * /}
                    {/* { idx == 27 && <div className="bg-slate-400 rounded-sm flex-1 text-white text-xs p-1">C</div>} * /}
                    {/* { idx == 5 && <div className="bg-slate-400 rounded-sm flex-1 text-white text-xs p-1">C</div>} * /}
                    </div>
                </div>
                })}
            </div>
        </div>
        <div>Teste</div>


*/