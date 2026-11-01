import { CalendarDays, CircleDollarSign, Settings, User } from "lucide-react"
import { cn } from "../utils/cn";

interface TabDefinition {
  id: string;
  label: string;
  icon: Icon;
}

export const APP_TABS: TabDefinition[] = [
  { id: 'calendar', label: 'Plantões', icon: CalendarDays },
  { id: 'report', label: 'Relatório', icon: CircleDollarSign },
  { id: 'user', label: 'Usuário', icon: User },
  { id: 'config', label: 'Configurações', icon: Settings }
];

export function BottomTabs({ activeTab, onSelectTab }){
  return <nav className="flex justify-between gap-1 bg-neutral-100">
    {APP_TABS.map((tab, idx) => <div
      key={idx}
      onClick={e => onSelectTab(tab.id)}
      className={cn(
        'flex-1 flex justify-center items-center py-4 transition-all',
        activeTab === tab.id ? 'bg-neutral-200 text-orange-500' : 'text-neutral-400'
      )}
    >
      <tab.icon />
    </div>)}
  </nav>
}