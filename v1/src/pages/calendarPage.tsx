import { useState } from "react";
import { toISODate } from "../utils/dateHelpers";
import { getPeriodRange, shiftReferenceDate, type CalendarViewMode } from "../utils/periodRange";
import { useCalendarRange } from "../hooks/useCalendarRange";
import { CalendarHeader } from "../components/calendar/calendarHeader";
import { formatPeriodLabel } from "../utils/periodLabel";
import { MonthGrid } from "../components/calendar/monthGrid";
import { WeekGrid } from "../components/calendar/weekGrid";
import { useAppStore } from "../store/useAppStore";
import { DayDetailSheet } from "../components/calendar/dayDetailSheet";

export function CalendarPage(){
    const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
    const [referenceDate, setReferenceDate] = useState(() => toISODate(new Date()));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [addEntryDefaultDate, setAddEntryDefaultDate] = useState<string | null>(null);

    const period = getPeriodRange(referenceDate, viewMode)
    const days = useCalendarRange(period)
    
    const goNext = () => setReferenceDate((prev) => shiftReferenceDate(prev, viewMode, 1));
    const goPrevious = () => setReferenceDate((prev) => shiftReferenceDate(prev, viewMode, -1));

    //const swipeHandlers = useSwipeNavigation(goNext, goPrevious);
    const selectedDay = days.find((d) => d.date === selectedDate) ?? null;

    return (
        <div className="flex h-full flex-col">
            <CalendarHeader
                viewMode={viewMode}
                onChangeViewMode={setViewMode}
                onNext={goNext}
                onPrevious={goPrevious}
                periodLabel={formatPeriodLabel(period, viewMode)}
            />
            <div>Summary Bar</div>

            <button
                className="bg-blue-500 text-white m-2 p-2 rounded"
                onClick={() => {
                    const result = useAppStore.getState().addShift({
                    name: 'Plantão Daniel',
                    type: 'day',
                    value: 200,
                    startDate: '2026-09-01',
                    color: '#3498db',
                    });
                    console.log(result);
                }}
            >
                Criar plantão de teste
            </button>

            <div /*{...swipeHandlers}*/ className="flex-1 overflow-y-auto px-2 pb-24">
                {viewMode === 'month' ? (
                    <MonthGrid days={days} period={period} onSelectDay={setSelectedDate} />
                ) : (
                    <WeekGrid days={days} onSelectDay={setSelectedDate} />
                )}
            </div>
            <div>AddEntry</div>
            {selectedDay && (
                <DayDetailSheet
                    day={selectedDay}
                    onClose={() => setSelectedDate(null)}
                    onRequestCreate={() => {
                        setAddEntryDefaultDate(selectedDay.date);
                        setSelectedDate(null);
                    }}
                />
            )}
            {addEntryDefaultDate && (
                <AddEntrySheet defaultDate={addEntryDefaultDate} onClose={() => setAddEntryDefaultDate(null)} />
            )}
        </div>
    )
}