import { ArrowRightLeft, BedDouble, Check, CheckCheck, Clock, Handshake, Hospital, Moon, Palmtree, Replace, ShieldPlus, Sun, Umbrella, User, UserPlus, UserX } from "lucide-react";
import { cn } from "../utils/cn";
import { format, getWeekLabels, isToday } from "../utils/dateHelpers";
import { ServicePeriod, ServiceStatus, ServiceType } from "../utils/types";
import { MonthDisplay } from "./serviceItem";

export function CalendarMonthGrid({ days, selectedDate, onSelectDate }){
    const labels = getWeekLabels()
    return <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 text-xs">
            {labels.map((label, i) => 
                <span key={i} className="uppercase text-[10px] text-mist-500 flex justify-center">{label}</span>
            )}
        </div>
        <div className="flex-1 grid grid-cols-7 border-neutral-100 border-l border-t">
            {days.map((day, idx) => {
                //const isToday = format(day.date, 'ddMM') == format(new Date(), 'ddMM')
                const today = isToday(day.date)
                const monthDay = day.date.getDate()
                const isSelected = day.date === selectedDate;
                return (
                    <div key={idx} className={cn('flex flex-col border-neutral-100 border-b border-r', isSelected && 'bg-mist-100')} onClick={e => onSelectDate(day.date)}>
                        <div className={cn('text-neutral-400 text-[10px] pl-0.5 pt-0.5', today && 'font-black text-orange-500')}>{monthDay}</div>
                        <div className="flex-1 flex flex-col gap-0.5 p-0.5">        
                            {/* <ShifItemList mode="month" day={day} /> */}
                            {day.items.map((item, idx) => <MonthDisplay key={idx} item={item} /> )}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
}