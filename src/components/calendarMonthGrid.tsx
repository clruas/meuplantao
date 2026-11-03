import { getWeekLabels } from "../utils/dateHelpers";

//export function CalendarMonthGrid({ period, days, selectedDate, onSelectDay }:CalendarGridProps){
export function CalendarMonthGrid(){
    const labels = getWeekLabels()
    return <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 text-xs">
            {labels.map((label, i) => 
                <span key={i} className="uppercase text-[10px] text-mist-500 flex justify-center">{label}</span>
            )}
        </div>
        <div className="flex-1 grid grid-cols-7 border-neutral-100 border-l border-t">
            {/* {days.map((day, idx) => {
                const isToday = format(toDate(day.date), 'ddMM') == format(new Date(), 'ddMM') 
                const monthDay = getDate(toDate(day.date))
                const isSelected = day.date === selectedDate;

                return <div key={idx} className={clsx('flex flex-col border-neutral-100 border-b border-r', isSelected && 'bg-mist-100')} onClick={e => onSelectDay(day.date)}>
                    <div className={clsx('text-neutral-400 text-[10px] pl-0.5 pt-0.5', isToday && 'font-black text-orange-500')}>{monthDay}</div>
                    <div className="flex-1 flex flex-col gap-0.5 p-0.5">        
                        <ShifItemList mode="month" day={day} />
                    </div>
                </div>
            })} */}
        </div>
    </div>
}