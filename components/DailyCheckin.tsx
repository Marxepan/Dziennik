import React, { useState } from 'react';
import type { Mood } from '../types';

interface DailyCheckinProps {
  onSave: (mood: Mood, triggers: string[]) => void;
  onClose: () => void;
}

const moods: { key: Mood; label: string; icon: string; color: string; colorBg: string }[] = [
  { key: 'wspaniale', label: 'Wspaniale', icon: 'fa-face-laugh-beam', color: 'text-green-500', colorBg: 'hover:bg-green-100 dark:hover:bg-green-500/10' },
  { key: 'dobrze', label: 'Dobrze', icon: 'fa-face-smile', color: 'text-lime-500', colorBg: 'hover:bg-lime-100 dark:hover:bg-lime-500/10' },
  { key: 'neutralnie', label: 'Neutralnie', icon: 'fa-face-meh', color: 'text-yellow-500', colorBg: 'hover:bg-yellow-100 dark:hover:bg-yellow-500/10' },
  { key: 'źle', label: 'Źle', icon: 'fa-face-frown', color: 'text-orange-500', colorBg: 'hover:bg-orange-100 dark:hover:bg-orange-500/10' },
  { key: 'okropnie', label: 'Okropnie', icon: 'fa-face-sad-tear', color: 'text-red-500', colorBg: 'hover:bg-red-100 dark:hover:bg-red-500/10' },
];

const availableTriggers = ['Stres', 'Praca', 'Samotność', 'Nuda', 'Zmęczenie', 'Internet', 'Impreza', 'Inne'];

const DailyCheckin: React.FC<DailyCheckinProps> = ({ onSave, onClose }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const handleTriggerClick = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger) 
        : [...prev, trigger]
    );
  };

  const handleSave = () => {
    if (selectedMood) {
      onSave(selectedMood, selectedTriggers);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border-t-4 border-teal-500 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Codzienny Check-in</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Jak minął Twój dzień?</p>
        </div>
        <button 
            onClick={onClose} 
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Zamknij check-in na dziś"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">1. Jak się dziś czujesz?</label>
        <div className="flex justify-around items-start">
          {moods.map(mood => (
            <button
              key={mood.key}
              onClick={() => setSelectedMood(mood.key)}
              className={`flex flex-col items-center text-center p-2 rounded-lg group focus:outline-none transition-all duration-200 ${selectedMood === mood.key ? 'scale-110' : 'opacity-60 hover:opacity-100'} ${mood.colorBg}`}
              aria-pressed={selectedMood === mood.key}
              aria-label={mood.label}
            >
              <i className={`fas ${mood.icon} fa-3x ${mood.color} ${selectedMood === mood.key ? '' : 'grayscale-[50%] group-hover:grayscale-0'}`}></i>
              <span className={`mt-2 text-xs font-semibold ${selectedMood === mood.key ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedMood && (
          <div className="mt-6 animate-fade-in">
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">2. Co miało dziś na Ciebie wpływ? (opcjonalnie)</label>
             <div className="flex flex-wrap gap-2">
                {availableTriggers.map(trigger => (
                    <button
                        key={trigger}
                        onClick={() => handleTriggerClick(trigger)}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${selectedTriggers.includes(trigger) ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-100 hover:border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-700 dark:hover:border-slate-600'}`}
                        aria-pressed={selectedTriggers.includes(trigger)}
                    >
                        {trigger}
                    </button>
                ))}
             </div>
          </div>
      )}
      
      <button
        onClick={handleSave}
        disabled={!selectedMood}
        className="w-full mt-8 py-3 px-4 rounded-lg text-white font-bold bg-teal-500 hover:bg-teal-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none dark:disabled:bg-slate-600"
      >
        <i className="fas fa-check mr-2"></i> Zapisz na dziś
      </button>
    </div>
  );
};

export default DailyCheckin;