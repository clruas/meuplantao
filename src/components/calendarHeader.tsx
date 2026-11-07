import { ChevronLeft, ChevronRight, Grid3x3, Rows3 } from "lucide-react";
import { ViewMode } from "../utils/types";
import { cn } from "../utils/cn";

interface CalendarHeaderProps {
    viewMode: ViewMode
    onChangeViewMode: (mode: ViewMode) => void
    onNext: () => void
    onPrevious: () => void
    periodLabel: string
}

function HeaderButton({ selected, onClick, icon: Icon }){
    return <div 
        onClick={onClick}
        className={cn("transition-all p-4 text-mist-400 active:bg-neutral-300", selected && 'bg-neutral-200 text-orange-500')}
    >
        <Icon />
    </div>
}

export function CalendarHeader({ viewMode, onChangeViewMode, onNext, onPrevious, periodLabel }: CalendarHeaderProps){
    const isMonth = viewMode == ViewMode.Month
    return <>
        <div className="flex-1 flex items-center justify-between gap-2">
            <HeaderButton icon={ChevronLeft} onClick={onPrevious} />
            <span className={cn("font-bold text-mist-600", isMonth ? 'text-base' : 'text-sm')}>{periodLabel}</span>
            <HeaderButton icon={ChevronRight} onClick={onNext} />
        </div>
        <div className="flex">
            <HeaderButton selected={viewMode == 'month'} icon={Grid3x3} onClick={e=>onChangeViewMode('month')} />
            <HeaderButton selected={viewMode == 'week'} icon={Rows3} onClick={e=>onChangeViewMode('week')} />
        </div>
    </>
}