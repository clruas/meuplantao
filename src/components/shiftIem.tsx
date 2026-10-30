import { ArrowRightLeft, CalendarSync, Moon, Sun } from "lucide-react"
import type { ShiftItemProps } from "../types/common"
import clsx from "clsx"
import { cn } from "../utils/styles"

export function ShiftItem(props){
    console.log(props)
    const { mode, type, name } = props
    return <div className={clsx(
        "@container flex-1 flex flex-col rounded-sm",
        type == 'day' ? (mode == 'cover' ? 'bg-amber-200' : 'bg-amber-100') : (mode == 'cover' ? 'bg-indigo-200' : 'bg-indigo-100')
    )}>
        <div 
            className={cn(
                'flex-1 flex gap-1 justify-between',
                '@min-[20px]:p-0.5',
                '@min-[80px]:p-1',
            )}
        >
            <div className="flex gap-1 text-xs text-black/40">
                {type == 'day' ? <Sun size={16} /> : <Moon size={16} /> }
            </div>
            <div className="flex-1 text-xs @max-[100px]:hidden">{name}</div>
            <div>
                {mode == 'cover' ? <ArrowRightLeft size={16} /> : ''}
            </div>
        </div>
        {/* <div className="flex justify-between p-0.5 items-center gap-1 @min-[300px]:m-2">
            <div className={clsx('text-xs text-black/40')}>
                {type == 'day' ? <Sun size={16} /> : <Moon size={16} /> }
            </div>
            <div className="flex-1 @max-[100px]:hidden text-xs text-black/75">
                {name}
            </div>
            <div className="text-xs text-black/30">
                {mode == 'cover' ? <ArrowRightLeft size={16} /> : ''}
            </div>
        </div> */}
    </div>
}

export function ShiftItem3(props){
    const { mode, type, name } = props
    return <div className={clsx(
        "@container flex-1 flex flex-col rounded-sm",
        type == 'day' ? (mode == 'cover' ? 'bg-amber-200' : 'bg-amber-100') : (mode == 'cover' ? 'bg-indigo-200' : 'bg-indigo-100')
    )}>
        <div className="flex justify-between p-0.5 items-center gap-1 @min-[300px]:m-2">
            <div className={clsx('text-xs text-black/40')}>
                {type == 'day' ? <Sun size={16} /> : <Moon size={16} /> }
            </div>
            <div className="flex-1 @max-[100px]:hidden text-xs text-black/75">
                {name}
            </div>
            <div className="text-xs text-black/30">
                {mode == 'cover' ? <ArrowRightLeft size={16} /> : ''}
                {/* {mode == 'cover' ? <ArrowRightLeft className="@min-[300px]:size-6 @max-[100px]:size-4" /> : ''} */}
            </div>
        </div>
    </div>
}

function ShiftItem2(props){
    const { mode, type, name } = props
    //return <div className={clsx("flex-1 flex flex-col gap-1 rounded-sm bg-gradient-to-br from-mist-100 to-mist-200 p-0.5", mode == 'cover' && 'from-mist-200 to-mist-300')}>
    return <div className={clsx("flex-1 flex flex-col gap-1 rounded-sm bg-amber-100", mode == 'cover' && 'bg-amber-300')}>
        <div className="flex justify-between">
            <div className={clsx('', type == 'day' ? 'text-amber-400' : 'text-indigo-300')}>
                {type == 'day' ? <Sun size={16} /> : <Moon size={16} /> }
            </div>
            <div className="text-xs text-mist-400">
                {mode == 'cover' ? <ArrowRightLeft size={16} /> : ''}
            </div>
        </div>
    </div>
}