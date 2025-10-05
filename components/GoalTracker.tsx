import React, { useState, useEffect } from 'react';

interface GoalTrackerProps {
  goal: number | null;
  currentStreak: number;
  onSetGoal: (days: number) => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goal, currentStreak, onSetGoal }) => {
  const [inputValue, setInputValue] = useState('30');
  const [isEditing, setIsEditing] = useState(goal === null);

  useEffect(() => {
    if (goal !== null) {
      setInputValue(String(goal));
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [goal]);


  const handleSetGoal = () => {
    const numDays = parseInt(inputValue, 10);
    if (!isNaN(numDays) && numDays > 0) {
      onSetGoal(numDays);
      setIsEditing(false);
    }
  };

  const progress = goal ? Math.min((currentStreak / goal) * 100, 100) : 0;
  const goalReached = goal !== null && currentStreak >= goal;

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Ustaw swój cel</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Określ, ile dni czystości chcesz osiągnąć, aby utrzymać motywację.</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border-2 border-slate-200 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200"
            placeholder="Np. 30"
            min="1"
            aria-label="Cel dni"
          />
          <button
            onClick={handleSetGoal}
            className="py-2 px-6 rounded-lg text-white font-bold bg-teal-500 hover:bg-teal-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex-shrink-0"
          >
            Ustaw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Aktualny cel</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dni bez upadku</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="text-sm text-teal-600 dark:text-teal-500 hover:text-teal-800 dark:hover:text-teal-400 font-semibold">Zmień</button>
      </div>
      
      {goalReached && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-500/20 border-l-4 border-green-500 text-green-800 dark:text-green-200 rounded-r-lg" role="alert">
          <p className="font-bold">Gratulacje! Osiągnąłeś/aś cel!</p>
          <p className="text-sm">Ustaw nowy, aby kontynuować swoją podróż.</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={`relative h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-full ${goalReached ? 'bg-green-100 dark:bg-green-500/20' : 'bg-teal-100 dark:bg-teal-500/20'}`}>
           <svg className="absolute inset-0" viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="text-slate-200 dark:text-slate-700"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={goalReached ? 'text-green-500' : 'text-teal-500'}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <span className={`text-2xl font-bold ${goalReached ? 'text-green-700 dark:text-green-300' : 'text-teal-700 dark:text-teal-300'}`}>{currentStreak}</span>
        </div>
        <div className="w-full">
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentStreak} / {goal} dni</span>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">{Math.round(progress)}%</span>
            </div>
            {/* FIX: Changed aria-valuemin and aria-valuemax to be numbers to fix type error. */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${goalReached ? 'bg-green-500' : 'bg-teal-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;