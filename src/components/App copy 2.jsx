import { useEffect, useState, useRef, forwardRef  } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { addDays, eachDayOfInterval, isEqual, isAfter, format, isToday } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

function getDates(){
	//localStorage.setItem('first-day', '2023-11-02T03:00:00.000Z')
	//localStorage.removeItem('first-day')

	/*
	MOSTRAR OS ULTIMOS DOIS ANOS O ANO ATUAL E O PROXIMO
	AO CLICAR EM UMA DATA MARCAR COMO A DATAINICIAL
	MARCAR A DATA INICIAL
	SCROLLAR SEMPRE PARA A DATA INICIAL
	SCROLLAR A DATA INICIAL NA TELA SE ELA FOR IGUAL AO DIA ATUAL, SENAO, SCROLLAR SEMPRE PARA A DATA ATUAL
	*/

	/*
	const firstDay = localStorage.getItem('first-day')
	const start = firstDay ? new Date(firstDay) : new Date()
	const dates = eachDayOfInterval({ start: start, end: addDays(start, 364) })
	
	let plantao = false
	let id = 0
	const days = dates.map(date => {
		let state = 'none'
		if(firstDay){
			if(isEqual(date, start)){
				state = 'PLANTÃO'
				plantao = true
			}
			if(isAfter(date, start)){
				plantao = !plantao
				state = plantao ? 'PLANTÃO' : 'FOLGA'
			}
		}
		id += 1
		return { id, state, date }
	})

	return days
	*/
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
	const { i, date, today, state } = props.item
	const todayColor = today ? 'text-blue-500' : 'text-black'
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
		<div className='text-3xl font-bold flex items-stretch flex-auto justify-center'>{state}</div>
	</div>
})

function WeekDay({ value }){
	const day = format(value, 'EEEEEE', { locale: ptBR })
	const color = ['sab', 'dom'].includes(day) ? 'text-slate-300' : 'text-slate-500'
	return <div className={`${color} text-3xl font-bold px-1 uppercase`}>{day}</div>
}

function Home(){
	//const dates = getDates()
	const [items, setItems] = useState(getDates())
	const ref = useRef()
	function handleClick(date){
		const day = date.toISOString()
		localStorage.setItem('first-day', day)
		setItems(getDates())
	}
	useEffect(()=>{
		ref.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
	}, [])
	return (
		<div className='h-screen bg-slate-100'>
			<div>MEU PLANTÃO</div>
			<div className='h-[calc(100vh_-_40px)] overflow-y-scroll p-2'>
				{items.map(item => {
					const props = item.today ? { ref } : {}
					return <ListItem item={item} key={item.id} onClick={handleClick} {...props} />
					/*
					const props = item.today ? { ref } : {}
					return <div className='bg-white rounded flex items-center justify-stretch m-2 font-mono' key={item.id} onClick={handleClick(item)} {...props}>
						<div className='text-3xl font-bold px-1'>{format(item.date, 'dd')}</div>
						<div className='flex flex-col text-center'>
							<div className='text-sm leading-[12px] px-1 uppercase text-center tracking-[0.08em]'>{format(item.date, 'MMM', { locale: ptBR })}</div>
							<div className='text-sm leading-[12px] px-1'>{format(item.date, 'yyyy')}</div>
						</div>
						<WeekDay value={item.date} />
						<div className='text-3xl font-bold flex items-stretch flex-auto justify-center'>{item.state}</div>
					</div>
					*/
				})}
			</div>
		</div>
	)
}

function App() {
	return (
		<RecoilRoot>
			<Router>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</Router>
		</RecoilRoot>
	)
}

export default App