import type { CalendarDay } from "../types/common";
import { isShiftActiveOn } from "../utils/shiftRecurrence";
import { ShiftItem } from "./shiftIem";

interface ShiftItemListProps {
    mode: string
    day: CalendarDay
}

export function ShifItemList({ mode, day }: ShiftItemListProps){
    return <>
        {
            day.activeShifts.filter(shift => isShiftActiveOn(shift, day.date))
            .map(shift => <ShiftItem key={shift.id} mode="shift" { ...shift } />)
        }
        {
            day.coverages.sort((a, b) => (a.type > b.type) ? 1 : -1).map(cover => (
                <ShiftItem key={cover.id} mode="cover" {...cover } />
            )) 
        }
    </>
}