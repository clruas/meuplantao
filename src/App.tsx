import { useState } from "react"
import { BottomTabs } from "./components/bottomTabs"
import { CalendarPage } from "./pages/calendarPage"
import { ReportPage } from "./pages/reportPage"

function App(){
  const [activeTab, setActiveTab] = useState('calendar')
  return (
    <>
      <div className="flex flex-col h-dvh">
        {activeTab === 'calendar' && <CalendarPage />}
        {activeTab === 'report' && <ReportPage />}
        {/* 
        {activeTab === 'user' && <UserPage />}
        */}
        <BottomTabs activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>
    </>
  )
}

export default App