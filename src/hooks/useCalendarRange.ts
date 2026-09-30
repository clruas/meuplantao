import { useMemo } from "react";
import type { CalendarDay, PeriodRange, Shift } from "../types/common";
import { useAppStore } from "../store/useAppStore";
import { addDaysISO, daysBetween } from "../utils/dateHelpers";

function buildCalendarRange(shifts: Shift[], period: PeriodRange){
    //console.log('Hook', period)
    const totalDays = daysBetween(period.start, period.end)
    const days = []
    for(let i = 0; i <= totalDays; i++){
        const date = addDaysISO(period.start, i)
        const activeShifts = shifts.filter(
            s => s.status === 'active' //&& getShiftStatusForDate(s, pauses, date) === 'active'
        );
        days.push({
            date,
            activeShifts
        })
    }
    return days
}

export function useCalendarRange(period: PeriodRange): CalendarDay[] {
    const shifts = useAppStore(s => s.shifts)
    return useMemo(
        () => buildCalendarRange(shifts, period),
        [shifts, period]
    )
}