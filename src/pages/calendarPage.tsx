import { useState } from "react";
import Page from "../components/page";
import { toISODate } from "../utils/dateHelpers";
import { ViewMode } from "../utils/types";
import { CalendarHeader } from "../components/calendarHeader";
import { addDays } from "date-fns";

// export interface PeriodRange {
//   start: ISODateString;
//   end: ISODateString;
// }

function getReferenceDate(referenceDate: Date, viewMode: ViewMode, direction: 1 | -1 ) {
    if (viewMode === 'week') {
        return addDays(referenceDate, 7 * direction);
    }
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + direction, 1)
}

function getPeriod(referenceDate: Date, viewMode: ViewMode) {
    // const date = toDate(reference);
    
    // if (mode === 'week') {
    //     const weekday = date.getDay(); // 0 = domingo
    //     const start = toISODate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekday));
    //     return { start, end: addDaysISO(start, 6) };
    // }
    
    // const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // const lastDayDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // const lastWeekday = lastDayDate.getDay();
    
    // const start = toISODate(new Date(date.getFullYear(), date.getMonth(), 1 - firstWeekday));
    // const end = addDaysISO(start, 41)
    
    // return { start, end }

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

export function CalendarPage(){
    const [viewMode, setViewMode] = useState(ViewMode.Month)
    const [referenceDate, setReferenceDate] = useState(() => new Date())
    //const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const goNext = () => setReferenceDate(old => getReferenceDate(old, viewMode, 1))
    const goPrevious = () => setReferenceDate(old => getReferenceDate(old, viewMode, -1))

    const period = getPeriod(referenceDate, viewMode)
    //const days = useCalendarRange(period)

    //const selectedDay = days.find((d) => d.date === selectedDate) ?? null;

    console.log(viewMode)
    console.log(toISODate(referenceDate))
    console.log(period)

    return <Page>
        <Page.Header>
            <CalendarHeader 
                viewMode={viewMode}
                onChangeViewMode={setViewMode}
                onNext={goNext}
                onPrevious={goPrevious}
                //periodLabel={formatPeriodLabel(viewMode, period)}
            />
        </Page.Header>
        <Page.Body className="flex-col">
            <div>{viewMode}</div>
            <div>{toISODate(referenceDate)}</div>
        </Page.Body>
        <Page.Footer>footer</Page.Footer>
    </Page>
}