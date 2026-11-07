import { Activity, CheckCheck, Clock, Hospital, Moon, Palmtree, Play, Replace, ShieldPlus, SquareLetterC, SquareLetterN, SquareLetterT, Sun, UserX } from "lucide-react"
import { cn } from "../utils/cn"
import { ServicePeriod, ServiceStatus, ServiceType } from "../utils/types"

function Icon({ size, name: Name, className = '' }){
    return <Name size={size} className={className} />
}

function TypeIcon({ type, period, size }) {
    const isDay = period == ServicePeriod.Day
    if(type == ServiceType.Normal)
        return <SquareLetterN size={size} />
    if(type == ServiceType.Swap)
        return <SquareLetterT size={size} />
    if(type == ServiceType.Coverage)
        return <SquareLetterC size={size} />
}

function PeriodIcon({ period }){
    return period == ServicePeriod.Day
        ? <Sun size={16} className="text-amber-400" />
        : <Moon size={16} className="text-white" />
}

function StatusIcon({ period, status }){
    if(status == ServiceStatus.Completed)
        return <CheckCheck size={16} className={cn(period == ServicePeriod.Day ? "text-emerald-400" : "text-emerald-400")} />
    if(status == ServiceStatus.Scheduled)
        return <Clock size={16} className={cn(period == ServicePeriod.Day ? "text-sky-300" : "text-sky-400")} />
    if(status == ServiceStatus.Absence)
        return <UserX size={16} className={cn(period == ServicePeriod.Day ? "text-red-400" : "text-red-400")} />
    if(status == ServiceStatus.Hospital)
        return <Hospital size={16} className={cn(period == ServicePeriod.Day ? "text-indigo-400" : "text-indigo-400")} />
    if(status == ServiceStatus.Pause)
        return <Palmtree size={16} className={cn(period == ServicePeriod.Day ? "text-lime-500" : "text-lime-500")} />
}

export function MonthDisplay({ item }){
    const { period, status, type } = item
    const isDay = period == ServicePeriod.Day
    const bgColor = isDay ? 'bg-slate-100' : 'bg-slate-300'
    return <div className={cn("flex-1 flex flex-col gap-1 rounded-sm p-0.5 text-black/40", bgColor)}>
        <div className="flex-1 flex justify-between">
            <PeriodIcon period={period} />
        </div>
        <div className="flex justify-end gap-1 items-center">
            <div className={cn("text-mist-400", isDay && "text-mist-400/50")}>
                <TypeIcon type={type} period={period} size={16} />
            </div>
            <StatusIcon period={period} status={status} />
        </div>
    </div>
}

export function WeekDisplay({ item }){
    const { period, status, type } = item
    const bgColor = period == ServicePeriod.Day ? 'bg-slate-100' : 'bg-slate-300'
    const typeNames = { coverage: 'cobertura', normal: 'normal', swap: 'troca' }
    return <div className={cn("flex-1 flex flex-col gap-1 rounded-sm p-1 text-black/40", bgColor)}>
        <div className="flex-1 flex justify-between">
            <PeriodIcon period={period} />
        </div>
        <div className="flex justify-end gap-2 items-center">
            <div className="flex items-center leading-1 border rounded-sm text-[9px] uppercase font-mono px-1 py-1.5 font-bold text-mist-400">{typeNames[type]}</div>
            <StatusIcon period={period} status={status} />
        </div>
    </div>
}

export function DetailDisplay({ item }){
    const { period, status, type } = item
    const bgColor = period == ServicePeriod.Day ? 'bg-slate-100' : 'bg-slate-400'
    return <div className={cn("flex-1 flex flex-col gap-1 rounded-sm p-0.5 text-black/40", bgColor)}>
        <div className="flex-1 flex justify-between">
            <PeriodIcon period={period} />
            <StatusIcon period={period} status={status} />
        </div>
        <div className="flex justify-end">
            <TypeIcon type={type} period={period} size={24} />
        </div>
    </div>
}