import { useState } from "react";
import Page from "../components/page";
import { format, toISODate } from "../utils/dateHelpers";
import { ViewMode } from "../utils/types";
import { CalendarHeader } from "../components/calendarHeader";
import { addDays, isEqual } from "date-fns";
import { CalendarMonthGrid } from "../components/calendarMonthGrid";
import { CalendarWeekGrid } from "../components/calendarWeekGrid";
import '../store/useAppStore.ts'
import { useCalendarRange } from "../hooks/useCalendarRange.ts";

interface Period {
    start: Date
    end: Date
}

function getReferenceDate(referenceDate: Date, viewMode: ViewMode, direction: 1 | -1 ) {
    if (viewMode === 'week') {
        return addDays(referenceDate, 7 * direction);
    }
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + direction, 1)
}

function getPeriod(referenceDate: Date, viewMode: ViewMode): Period {
    if(viewMode == ViewMode.Week){
        const weekday = referenceDate.getDay(); // 0 = domingo
        const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - weekday);
        return { start, end: addDays(start, 6) };
    }
    const firstWeekday = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1).getDay();
    const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1 - firstWeekday)
    const end = addDays(start, 41)
    return { start, end }
}

function formatPeriodLabel(viewMode: ViewMode, period: Period){
    if (viewMode === ViewMode.Month) {
        return format(addDays(period.start, 7), "MMMM 'de' y")
    } else {
        return `${format(period.start, 'dd/MM/yy')} a ${format(period.end, 'dd/MM/yy')}`
    }
}

export function CalendarPage(){
    const [viewMode, setViewMode] = useState(ViewMode.Month)
    const [referenceDate, setReferenceDate] = useState(() => new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const goNext = () => setReferenceDate(old => getReferenceDate(old, viewMode, 1))
    const goPrevious = () => setReferenceDate(old => getReferenceDate(old, viewMode, -1))

    const period = getPeriod(referenceDate, viewMode)
    const days = useCalendarRange(period)

    //const selectedDay = days.find(d => d.date === selectedDate) ?? null;
    const selectedDay = days.find(d => isEqual(d.date, selectedDate)) ?? null;

    //console.log(viewMode)
    //console.log(toISODate(referenceDate))
    //console.log(period)
    console.clear()
    //console.log(days)
    //console.log(days, selectedDate, selectedDay)
    //console.log(selectedDate, selectedDay)

    return <Page>
        <Page.Header>
            <CalendarHeader 
                viewMode={viewMode}
                onChangeViewMode={setViewMode}
                onNext={goNext}
                onPrevious={goPrevious}
                periodLabel={formatPeriodLabel(viewMode, period)}
            />
        </Page.Header>
        <Page.Body className="flex-col">
            {viewMode == ViewMode.Month
                ? <CalendarMonthGrid days={days} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                : <CalendarWeekGrid days={days} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            }
        </Page.Body>
        <Page.Footer>
            <div>Rodape</div>
        </Page.Footer>
        {selectedDay  && (
            //<DayDetailSheet day={selectedDay} onClose={e=>setSelectedDate(null)} />
            <div>detalhes</div>
        )}
    </Page>
}