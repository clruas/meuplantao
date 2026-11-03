import { cn } from "../utils/cn";
import { getWeekLabels } from "../utils/dateHelpers";

export function CalendarWeekGrid({ days, selectedDate, onSelectDate }){
    return <div className="flex-1 flex">
        <div className="flex-1 grid grid-rows-7 text-xs">
            {days.map((day, idx) => {
                const monthDay = day.date.getDate()
                const isToday = day.date.getDate() == new Date().getDate()
                const isSelected = day.date === selectedDate;
                return <div
                    key={idx}
                    onClick={e => onSelectDate(day.date)}
                    className={cn('flex border-neutral-100 border-b transition-all', isSelected && 'bg-neutral-100')} 
                >
                    <div className={cn("flex flex-col items-center justify-center p-2 w-10 border-neutral-100 border-r", isToday && 'font-black')}>
                        <div className={cn("uppercase text-[10px] text-neutral-300", isToday && 'text-orange-700/50')}>{getWeekLabels()[idx]}</div>
                        <div className={cn("text-xl text-neutral-600", isToday && 'text-orange-700')}>{monthDay}</div>
                    </div>
                    <div className="flex-1 flex p-0.5 gap-0.5">
                        {/* <ShifItemList mode="week" day={day} /> */}
                    </div>
                </div>
            })}
        </div>
    </div>
}