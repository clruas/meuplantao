import clsx from "clsx";
import { WEEKDAY_LABELS, type CalendarItemProps } from "../types/common";
import { toDate } from "../utils/dateHelpers";
import { getDate } from "date-fns";

export function CalendarItem({ day }: CalendarItemProps){
    const isToday = toDate(day.date).getDate() == new Date().getDate()
    const monthDay = getDate(toDate(day.date))
    return <div className={clsx('border-neutral-100 border-b border-r', isToday && 'bg-neutral-100')}>
        <div>
            <div className="uppercase text-[10px] text-neutral-400">{WEEKDAY_LABELS[0]}</div>
            <div>{monthDay}</div>
        </div>
    </div>
}