import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, NavLink, useNavigate } from 'react-router-dom'
import { RecoilRoot, useRecoilState } from 'recoil'
import { InitDateState, ViewState } from '../store/data'
import Calendar from './Calendar'

function Layout(){
	return (
		<div>
			<div>
				<div>Inicio</div>
				<div>
					<NavLink to='list'>Lista</NavLink>
					<NavLink to='calendar'>Calendario</NavLink>
				</div>
			</div>
			<Outlet />
		</div>
	)
}

function Home(){
	const [date, setDate] = useState()
	const [initDate, setInitDate] = useRecoilState(InitDateState)
	const [view, setView] = useRecoilState(ViewState)
	const navigate = useNavigate()
	
	function init(){
		if(initDate)
			navigate(view)
	}

	function onSelectDate(date){
		setInitDate(date)
	}

	function onClick(e){

	}
	
	useEffect(init, [])
	
	return (
		<div className='p-4'>
			<div className='text-2xl text-center pb-6 pt-3 font-semibold'>MEU PLANTÃO</div>
			<Calendar onSelectDate={onSelectDate} />
			<div className='bg-slate-200 grid mt-4'>
				<button className='bg-sky-500 rounded p-3 text-white text-lg' onClick={onClick}>INICIAR CONTAGEM</button>
			</div>
		</div>
	)
}

function ListView(){
	return (
		<div className="text-3xl">
			<div>
				<div>Inicio: 01/11/2023</div>
				<div>lista</div>
				<div>Calendario</div>
			</div>
			<div>
				<div>2023</div>
				<div>
					<div>01/11/2023</div>
					<div>Plantão</div>
				</div>
				<div>
					<div>02/11/2023</div>
					<div>Folga</div>
				</div>
				<div>
					<div>03/11/2023</div>
					<div>Plantão</div>
				</div>
				<div>2024</div>
			</div>
		</div>
	)
}

function CalendarView(){
	return (
		<div>Calendario</div>
	)
}

function App() {
	return (
		<RecoilRoot>
			<Router>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route element={<Layout/>}>
						<Route path='list' element={<ListView />} />
						<Route path='calendar' element={<CalendarView />} />
					</Route>
				</Routes>
			</Router>
		</RecoilRoot>
	)
}

export default App