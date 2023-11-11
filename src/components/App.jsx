import { useEffect, useState, useRef, forwardRef  } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { addDays, eachDayOfInterval, isEqual, isAfter, format, isToday } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

function getDates(){
	const firstYear = parseInt(format(new Date(), 'y'))
	const lastYear = firstYear + 1
	const dates = eachDayOfInterval({ start: new Date(firstYear, 0, 1), end: new Date(lastYear, 11, 31) })
	const firstDay = localStorage.getItem('first-day')
	let id = 0
	let plantao = true
	console.clear()
	console.log(id, plantao)
	const days = dates.map(date => {
		id += 1
		let today = isToday(date)
		let fd = new Date(firstDay)
		let state = firstDay ? (date >= fd ? (plantao ? 'PLANTÃO' : 'FOLGA') : '') : ''
		if(date >= fd)
			plantao = !plantao
		return { id, date, today, state }
	})
	return days
}

const ListItem = forwardRef((props, ref) => {
	const { id, date, today, state } = props.item
	const todayColor = today ? 'text-blue-500' : 'text-black'
	const stateColor = state == 'FOLGA' ? 'text-green-600 font-bold' : 'text-rose-600'
	function handleClick(e){
		props.onClick(date)
	}
	return <div ref={ref} className='bg-white rounded flex items-center justify-stretch m-2 font-mono' onClick={handleClick}>
		<div className={`${todayColor} text-3xl font-bold px-1`}>{format(date, 'dd')}</div>
		<div className='flex flex-col text-center'>
			<div className='text-sm leading-[12px] px-1 uppercase text-center tracking-[0.08em]'>{format(date, 'MMM', { locale: ptBR })}</div>
			<div className='text-sm leading-[12px] px-1'>{format(date, 'yyyy')}</div>
		</div>
		<WeekDay value={date} />
		<div className={`${stateColor} text-3xl flex items-stretch flex-auto justify-center`}>{state}</div>
	</div>
})

function WeekDay({ value }){
	const day = format(value, 'EEEEEE', { locale: ptBR })
	const color = ['sab', 'dom'].includes(day) ? 'text-slate-300' : 'text-slate-500'
	return <div className={`${color} text-3xl font-bold px-1 uppercase`}>{day}</div>
}

function Home(){
	const [items, setItems] = useState(getDates())
	const ref = useRef()
	function handleClick(date){
		const day = date.toISOString()
		localStorage.setItem('first-day', day)
		setItems(getDates())
	}
	function clickToday(){
		ref.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
	}
	useEffect(()=>{
		ref.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
	}, [])
	return (
		<div className='supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh] bg-slate-100 grid'>
			<div className='h-10 flex items-center justify-center text-lg font-bold'>MEU PLANTÃO</div>
			<div className='overflow-y-scroll p-2'>
				{items.map(item => {
					const props = item.today ? { ref } : {}
					return <ListItem item={item} key={item.id} onClick={handleClick} {...props} />
				})}
			</div>
			<div className='px-4 py-2'>
				<button className='bg-blue-400 p-2 px-4 rounded font-bold text-white' onClick={clickToday}>Hoje</button>
			</div>
		</div>
	)
}

function App() {
	return (
		<RecoilRoot>
			<Router>
				<Routes>
					<Route path='/meuplantao' element={<Home />} />
				</Routes>
			</Router>
		</RecoilRoot>
	)
}

export default App