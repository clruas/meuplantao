import clsx from "clsx"
import { APP_TABS } from "../constants/tabs"

export function BottomTabBar({ activeTab, onSelectTab }){
  return <nav className="flex justify-between gap-1 bg-neutral-100">
    {APP_TABS.map((tab, idx) => <div
      key={idx}
      onClick={e => onSelectTab(tab.id)}
      className={clsx(
        'flex-1 flex justify-center items-center py-4 transition-all',
        activeTab === tab.id ? 'bg-neutral-200 text-orange-500' : 'text-neutral-500'
      )}
    >
      <tab.icon />
    </div>)}
  </nav>
}