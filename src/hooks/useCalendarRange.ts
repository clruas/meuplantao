import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { addDays, differenceInCalendarDays } from "date-fns";
import { toISODate } from "../utils/dateHelpers";

function createDays(items, period){
    const totalDays = differenceInCalendarDays(period.end, period.start)
    const days = []
    for(let i = 0; i <= totalDays; i++){
        const date = addDays(period.start, i)
        days.push({ 
            date, 
            items: items.filter(item => {
                const key = item.swapDate ?? item.date
                return key == toISODate(date)
            }) 
        })
    }
    return days
}

export function useCalendarRange(period){
    const { services, items } = useAppStore()
    return useMemo(
        () => createDays(items, period),
        [services, items, period]
    )
}