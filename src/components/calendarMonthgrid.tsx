import { getDate } from "date-fns";
import { WEEKDAY_LABELS, type CalendarGridProps } from "../types/common";
import { format, toDate } from "../utils/dateHelpers";
import { Sun } from "lucide-react";
import { isShiftDay } from "../utils/shiftRecurrence";
import clsx from "clsx";
import { CalendarItem } from "./calendarItem";

export function CalendarMonthGrid({ period, days, selectedDate, onSelectDay }:CalendarGridProps){
    return <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 text-xs">
            {WEEKDAY_LABELS.map((label, i) => 
                <span key={i} className="uppercase text-[10px] text-neutral-400 flex justify-center">{label}</span>
            )}
        </div>
        <div className="flex-1 grid grid-cols-7 border-neutral-100 border-l border-t">
            {days.map((day, idx) => {
                //const today = new Date().getDate()
                const isToday = format(toDate(day.date), 'ddMM') == format(new Date(), 'ddMM') //toDate(day.date).getDate() == today
                const monthDay = getDate(toDate(day.date))
                const isSelected = day.date === selectedDate;
                // return <div key={idx} className={clsx('flex flex-col border-neutral-100 border-b border-r', isToday && 'bg-neutral-100')} onClick={e => onSelectDay(day.date)}>
                //     <div className={clsx('text-neutral-400 text-[10px] p-0.5', isToday && 'font-black')}>{monthDay}</div>
                return <div key={idx} className={clsx('flex flex-col border-neutral-100 border-b border-r', isSelected && 'bg-neutral-100')} onClick={e => onSelectDay(day.date)}>
                    <div className={clsx('text-neutral-400 text-[10px] p-0.5', isToday && 'font-black text-orange-700')}>{monthDay}</div>
                    <div className="flex-1 flex">
                        
                    </div>
                </div>
            })}
            {/* {days.map((day, idx) => <CalendarItem key={idx} day={day} /> )} */}
            {/* {days.map((day, idx) => {
                const monthDay = getDate(toDate(day.date))
                const isToday = toDate(day.date).getDate() == new Date().getDate()
                return <div key={idx} className="flex flex-col border-neutral-100 border-b border-r">
                    <div className="text-neutral-400 text-[10px] p-0.5">
                        <span className={clsx(isToday && 'font-black')}>{monthDay}</span>
                    </div>
                    { 
                        isShiftDay(day.activeShifts[0].startDate, day.date) 
                        && day.date >= day.activeShifts[0].startDate
                        ? <div className="flex-1 text-white rounded bg-sky-300 p-0.5">
                            <Sun size={16} />
                        </div>
                        : <div className="uppercase text-mauve-100 text-sm font-black flex justify-center items-center h-full">
                            <span className="">folga</span>
                        </div>
                    }
                </div>
            })} */}
            {/* {Array.from({ length: 42 }).map((i, idx) => <div key={idx} className="border">{idx+1}</div>)} */}
        </div>
    </div>
}