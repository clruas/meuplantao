import { Check, Clock, Moon, Sun, Umbrella } from "lucide-react";
import { cn } from "../utils/cn";
import { getWeekLabels, isToday } from "../utils/dateHelpers";
import { ServicePeriod, ServiceStatus } from "../utils/types";
import { WeekDisplay } from "./serviceItem";

export function CalendarWeekGrid({ days, selectedDate, onSelectDate }){
    return <div className="flex-1 flex">
        <div className="flex-1 grid grid-rows-7 text-xs">
            {days.map((day, idx) => {
                const monthDay = day.date.getDate()
                const today = isToday(day.date)
                const isSelected = day.date === selectedDate;
                return <div
                    key={idx}
                    onClick={e => onSelectDate(day.date)}
                    className={cn('flex border-neutral-100 border-b transition-all', isSelected && 'bg-neutral-100')} 
                >
                    <div className={cn("flex flex-col items-center justify-center p-2 w-10 border-neutral-100 border-r", today && 'font-black')}>
                        <div className={cn("uppercase text-[10px] text-neutral-300", today && 'text-orange-700/50')}>{getWeekLabels()[idx]}</div>
                        <div className={cn("text-xl text-neutral-600", today && 'text-orange-700')}>{monthDay}</div>
                    </div>
                    <div className="flex-1 flex p-0.5 gap-0.5">
                        {day.items.map((item, idx) => <WeekDisplay key={idx} item={item} /> )}
                    </div>
                </div>
            })}
        </div>
    </div>
}