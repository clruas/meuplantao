import { getDate } from "date-fns";
import { WEEKDAY_LABELS, type CalendarGridProps } from "../types/common";
import { toDate } from "../utils/dateHelpers";
import { Sun } from "lucide-react";
import { isShiftDay } from "../utils/shiftRecurrence";
import clsx from "clsx";
import { CalendarItem } from "./calendarItem";
import { useState } from "react";

export function CalendarWeekGrid({ period, days, selectedDate, onSelectDay }: CalendarGridProps){
    const [selected, setSelected] = useState(false)
    const handleClick = day => {
        return e => {
            onSelectDay(day.date)
        }
    }
    return <div className="flex-1 flex">
        <div className="flex-1 grid grid-rows-7 text-xs">
            {days.map((day, idx) => {
                const monthDay = getDate(toDate(day.date))
                const isToday = toDate(day.date).getDate() == new Date().getDate()
                const isSelected = day.date === selectedDate;
                return <div 
                    onClick={e => onSelectDay(day.date)}
                    className={clsx('flex border-neutral-100 border-b transition-all', isSelected && 'bg-neutral-100')} 
                >
                    <div className={clsx("flex flex-col items-center justify-center p-2 w-10 border-neutral-100 border-r", isToday && 'font-black')}>
                        <div className={clsx("uppercase text-[10px] text-neutral-300", isToday && 'text-orange-700/50')}>{WEEKDAY_LABELS[idx]}</div>
                        <div className={clsx("text-xl text-neutral-600", isToday && 'text-orange-700')}>{monthDay}</div>
                    </div>
                    <div className="flex-1 flex">
                        
                    </div>
                </div>
            })}
            {/* {days.map((day, idx) => <CalendarItem key={idx} day={day} /> )} */}
            {/* {days.map((day, idx) => {
                const monthDay = getDate(toDate(day.date))
                const isToday = toDate(day.date).getDate() == new Date().getDate()
                return <div key={day.date} className="flex">
                    <div className={clsx("flex flex-col items-center justify-center p-2 w-10 border-neutral-100 border-b border-r", isToday && 'font-black')}>
                        <div className="uppercase text-[10px] text-neutral-400">{WEEKDAY_LABELS[idx]}</div>
                        <div className="text-xl text-neutral-600">{monthDay}</div>
                    </div>
                    <div className="flex-1 border-neutral-100 border-b">
                        { 
                            isShiftDay(day.activeShifts[0].startDate, day.date) 
                            && day.date >= day.activeShifts[0].startDate
                            ? <div className="flex items-center gap-2 text-sky-500 rounded bg-sky-300 p-2">
                                <Sun size={16} />
                                <span>{day.activeShifts[0].name}</span>
                            </div>
                            : <div className="uppercase text-mauve-100 text-4xl font-black flex justify-center items-center h-full">
                                <span className="">folga</span>
                            </div>
                        }
                    </div>
                </div>
            })} */}
        </div>
        {/*
        <div className="grid grid-rows-7 text-xs">
            {WEEKDAY_LABELS.map((label, i) => 
                <div key={i} className="">{label}</div>
            )}
        </div>
        <div className="flex-1 grid grid-rows-7">
            {Array.from({ length: 7 }).map((i, idx) => <div className="border">{idx+1}</div>)}
        </div>
        */}
    </div>
}