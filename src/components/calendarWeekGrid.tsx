//export function CalendarWeekGrid({ period, days, selectedDate, onSelectDay }: CalendarGridProps){
export function CalendarWeekGrid(){
    //const [selected, setSelected] = useState(false)
    //const handleClick = day => {
    //    return e => {
    //        onSelectDay(day.date)
    //    }
    //}
    return <div className="flex-1 flex">week
        <div className="flex-1 grid grid-rows-7 text-xs">
            {/* 
            {days.map((day, idx) => {
                const monthDay = getDate(toDate(day.date))
                const isToday = toDate(day.date).getDate() == new Date().getDate()
                const isSelected = day.date === selectedDate;
                return <div
                    key={idx}
                    onClick={e => onSelectDay(day.date)}
                    className={clsx('flex border-neutral-100 border-b transition-all', isSelected && 'bg-neutral-100')} 
                >
                    <div className={clsx("flex flex-col items-center justify-center p-2 w-10 border-neutral-100 border-r", isToday && 'font-black')}>
                        <div className={clsx("uppercase text-[10px] text-neutral-300", isToday && 'text-orange-700/50')}>{WEEKDAY_LABELS[idx]}</div>
                        <div className={clsx("text-xl text-neutral-600", isToday && 'text-orange-700')}>{monthDay}</div>
                    </div>
                    <div className="flex-1 flex p-0.5 gap-0.5">
                        <ShifItemList mode="week" day={day} />
                    </div>
                </div>
            })}
            */}
        </div>
    </div>
}