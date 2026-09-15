import clsx from 'clsx';
import { APP_TABS } from '../constants/tabs';

interface BottomTabBarProps {
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export function BottomTabBar({ activeTab, onSelectTab }: BottomTabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex h-16 border-t border-slate-200 bg-white">
      {APP_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelectTab(tab.id)}
          className={clsx(
            'flex flex-1 flex-col items-center justify-center gap-1 text-xs',
            'focus:outline-none focus:ring-2 focus:ring-sky-500',
            activeTab === tab.id ? 'text-sky-600' : 'text-slate-400'
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}