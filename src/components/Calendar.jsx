import React, { useState } from 'react';

const Calendar = ({ onSelectDate }) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate);

  const changeMonth = (change) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + change, 1);
    setCurrentMonth(newMonth);
  };

  const renderHeader = () => {
    const monthOptions = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    return (
      <div className="flex justify-between items-center p-2 bg-slate-500 text-white rounded-t">
        <button className="text-sm" onClick={() => changeMonth(-1)}>Anterior</button>
        <h2 className="text-lg font-bold">{monthOptions[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button className="text-sm" onClick={() => changeMonth(1)}>Próximo</button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="grid grid-cols-7 bg-slate-300 text-center">
        {dayLabels.map((label, index) => (
          <div className="py-2" key={index}>
            {label}
          </div>
        ))}
      </div>
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date)
    onSelectDate(date)
  };

  const renderCells = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const cells = [];
    const daysInMonth = (lastDay.getDate() - firstDay.getDate() + 1);
    const offset = firstDay.getDay();

    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isCurrentMonth = currentMonth.getMonth() === date.getMonth();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      console.log(selectedDate)
      cells.push(
        <div
          key={day}
          className={`flex justify-center items-center h-12 text-md calendar-day ${isCurrentMonth ? 'current-month' : ''} ${isSelected ? 'bg-red-400 rounded-full text-white font-bold' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    );
  };

  return (
    <div className="bg-slate-100 rounded">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default Calendar;

/*
import React, { useState } from 'react';

const Calendar = () => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate);

  const changeMonth = (change) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + change, 1);
    setCurrentMonth(newMonth);
  };

  const renderHeader = () => {
    const monthOptions = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    return (
      <div className="grid grid-cols-3">
        <button onClick={() => changeMonth(-1)}>Anterior</button>
        <h2>{monthOptions[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button onClick={() => changeMonth(1)}>Proximo</button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="grid grid-cols-7">
        {dayLabels.map((label, index) => (
          <div className="calendar-day" key={index}>
            {label}
          </div>
        ))}
      </div>
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderCells = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const cells = [];
    const daysInMonth = (lastDay.getDate() - firstDay.getDate() + 1);
    const offset = firstDay.getDay();

    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isCurrentMonth = currentMonth.getMonth() === date.getMonth();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      cells.push(
        <div
          key={day}
          className={`calendar-day ${isCurrentMonth ? 'current-month' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7">
        {cells}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
*/