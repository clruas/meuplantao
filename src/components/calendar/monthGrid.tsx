import { format, toDate } from "date-fns"
import type { CalendarDay } from "../../utils/calendarRange"
import type { PeriodRange } from "../../utils/periodRange"
import { DayCell } from "./dayCell"

interface MonthGridProps {
    days: CalendarDay[]
    period: PeriodRange
    onSelectDay: (date: string) => void
}

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function MonthGrid({ days, period, onSelectDay} : MonthGridProps){
    const firstWeekday = toDate(period.start).getDay();
    const lastWeekday = toDate(period.end).getDay();

    const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => `lead-${i}`);
    const trailingBlanks = Array.from({ length: 6 - lastWeekday }, (_, i) => `trail-${i}`);

    console.log(firstWeekday, lastWeekday)

    return (
        <div className="">
            <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-slate-400">
                {WEEKDAY_LABELS.map((label, i) => (
                <span key={i}>{label}</span>
                ))}
            </div>
            {/* <div className="grid grid-cols-7">
                {days.map(day => {
                    return <DayCell day={day} isCurrentPeriod={false} onSelect={}/>
                })}
            </div> */}
            <div className="grid grid-cols-7 gap-1">
                {leadingBlanks.map((key) => (
                    <div key={key}>antes</div>
                ))}
                {days.map((day) => (
                    <DayCell key={day.date} day={day} isCurrentPeriod onSelect={onSelectDay} />
                ))}
                {trailingBlanks.map((key) => (
                    <div key={key}>depois</div>
                ))}
            </div>
        </div>
    )
}