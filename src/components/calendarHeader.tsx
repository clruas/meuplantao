import { ChevronLeft, ChevronRight, Grid3x3, Rows3 } from "lucide-react"
import { CalendarViewMode } from "../types/common"
import clsx from "clsx"

export interface CalendarHeaderProps {
    viewMode: CalendarViewMode
    onChangeViewMode: (mode: CalendarViewMode) => void
    onNext: () => void
    onPrevious: () => void
    periodLabel: string
}

function HeaderButton({ selected, onClick, icon: Icon }){
    return (
        <div 
            onClick={onClick}
            className={clsx("transition-all p-4 active:bg-neutral-300", selected && 'bg-neutral-200 text-orange-500')}
        >
            <Icon />
        </div>
    )
}

export function CalendarHeader({ viewMode, onChangeViewMode, onNext, onPrevious, periodLabel }: CalendarHeaderProps){
    //return <div className="flex justify-between bg-neutral-100">
    return <>
      <div className="flex-1 flex items-center justify-between gap-2">
        <HeaderButton icon={ChevronLeft} onClick={onPrevious} />
        <span className="font-bold">{periodLabel}</span>
        <HeaderButton icon={ChevronRight} onClick={onNext} />
      </div>
      <div className="flex">
        <HeaderButton selected={viewMode == 'month'} icon={Grid3x3} onClick={e=>onChangeViewMode('month')} />
        <HeaderButton selected={viewMode == 'week'} icon={Rows3} onClick={e=>onChangeViewMode('week')} />
      </div>
    </>
    //</div>
}