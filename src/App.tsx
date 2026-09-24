import { useState } from "react"
import { BottomTabBar } from "./components/bottomTabBar"
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Grid3x3, Moon, Rows3, Sun } from "lucide-react"
import clsx from "clsx";
import { CalendarViewMode } from "./types/common";
import { CalendarHeader } from "./components/calendarHeader";
import { toISODate } from "./utils/dateHelpers";
import { CalendarPage } from "./pages/calendarPage";

function CalendarMonthGrid(){

}

function CalendarWeekGrid(){

}

function ReportPage(){
  return <>
    <PageHeader>Report</PageHeader>
    <div className="flex-1 overflow-y-scroll">
      { Array.from({ length: 50 }).map(item => <div>ops</div>)}
    </div>
  </>
}

function UserPage(){
  return <>
    <PageHeader>User</PageHeader>
    <div className="flex-1 overflow-y-scroll">
      { Array.from({ length: 50 }).map(item => <div>ops</div>)}
    </div>
  </>
}

function App(){
  const [activeTab, setActiveTab] = useState('calendar')
  return (
    <>
      <div className="flex flex-col h-dvh">
        {activeTab === 'calendar' && <CalendarPage />}
        {activeTab === 'report' && <ReportPage />}
        {activeTab === 'user' && <UserPage />}
        <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>
    </>
  )
}

export default App