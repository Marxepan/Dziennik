import React from 'react';
import type { Notes, Mood } from '../types';

interface CalendarProps {
  currentDate: Date;
  notes: Notes;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateHover: (date: Date, target: HTMLElement) => void;
  onDateHoverEnd: () => void;
}

// Helper function to get a YYYY-MM-DD key from a Date object, respecting the local timezone.
const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const moodStyles: Record<Mood, { icon: string; color: string }> = {
    wspaniale: { icon: 'fa-face-laugh-beam', color: 'text-green-500' },
    dobrze: { icon: 'fa-face-smile', color: 'text-lime-500' },
    neutralnie: { icon: 'fa-face-meh', color: 'text-yellow-500' },
    źle: { icon: 'fa-face-frown', color: 'text-orange-500' },
    okropnie: { icon: 'fa-face-sad-tear', color: 'text-red-500' },
};

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  notes,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  onDateHover,
  onDateHoverEnd,
}) => {
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];
  const dayNames = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Monday is 0

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderDays = () => {
    const days = [];
    // Blank days for padding
    for (let i = 0; i < startDayIndex; i++) {
      days.push(<div key={`blank-${i}`} className="p-2"></div>);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = getLocalDateKey(date);
      const noteData = notes[dateKey];
      const hasNote = !!noteData?.text;
      const isFall = !!noteData?.isFall;
      const mood = noteData?.mood;

      const isToday = date.getTime() === today.getTime();

      const baseClasses = "relative flex items-center justify-center h-12 w-12 rounded-full cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500";
      let stateClasses = "";
      
      if (isFall) {
        stateClasses = "bg-red-500 text-white font-bold shadow-md hover:bg-red-600";
      } else if (isToday) {
        stateClasses = "bg-teal-600 text-white font-bold shadow-md";
      } else if (hasNote || noteData) { // also color if only fall is marked
        stateClasses = "bg-teal-100 text-teal-800 font-medium hover:bg-teal-200 dark:bg-teal-900/50 dark:text-teal-200 dark:hover:bg-teal-800/60";
      } else {
        stateClasses = "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50";
      }
      
      days.push(
        <div key={day} className="flex justify-center items-center">
          <button 
            onClick={() => onDateSelect(date)} 
            className={`${baseClasses} ${stateClasses}`}
            onMouseEnter={(e) => onDateHover(date, e.currentTarget)}
            onMouseLeave={onDateHoverEnd}
          >
            {day}
            {mood && (
              <i className={`fas ${moodStyles[mood].icon} absolute text-xs bottom-1 right-1 ${isFall ? 'text-white' : moodStyles[mood].color} opacity-90`}></i>
            )}
          </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <i className="fas fa-chevron-left text-teal-600 dark:text-teal-500"></i>
        </button>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          {monthNames[month]} {year}
        </h2>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <i className="fas fa-chevron-right text-teal-600 dark:text-teal-500"></i>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-medium text-slate-500 dark:text-slate-400 mb-2">
        {dayNames.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;