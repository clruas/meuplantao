import { useState } from "react"
import { BottomTabBar } from "./components/bottomTabBar"

function Header(){

}

function MonthGrid(){

}

function WeekGrid(){

}

function CalendarTab(){
  return <>
    <div>
      <div>Setembro 2026</div>
    </div>
    <div>Summary</div>
    <div className="flex-1 overflow-y-scroll">
      { Array.from({ length: 50 }).map(item => <div>ops</div>)}
    </div>
    <div>Teste</div>
  </>
}

function ReportTab(){
  return <>
    <div>Report</div>
    <div className="flex-1 overflow-y-scroll">
      { Array.from({ length: 50 }).map(item => <div>ops</div>)}
    </div>
  </>
}

function UserTab(){
  return <>
    <div>User</div>
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
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'report' && <ReportTab />}
        {activeTab === 'user' && <UserTab />}
        <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>
    </>
  )
}

export default App