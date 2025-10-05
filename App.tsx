import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from './components/Calendar';
import NoteEditor from './components/NoteEditor';
import Stats from './components/Stats';
import GoalTracker from './components/GoalTracker';
import FallAnalysis from './components/FallAnalysis';
import ProgressChart from './components/ProgressChart';
import RelapseTimer from './components/RelapseTimer';
import NotesList from './components/NotesList';
import Badges from './components/Badges';
import ZIKAnalysisVisualization from './components/ZIKAnalysisVisualization';
import TreeOfFreedom from './components/TreeOfFreedom';
import Lifeline from './components/Lifeline';
import DailyCheckin from './components/DailyCheckin';
import type { Notes, NoteData, ZIKData, Mood } from './types';

// Helper function to get a YYYY-MM-DD key from a Date object, respecting the local timezone.
const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface HoveredNote {
  content: NoteData;
  position: { top: number; left: number };
}

const moodStyles: Record<Mood, { icon: string; color: string }> = {
    wspaniale: { icon: 'fa-face-laugh-beam', color: 'text-green-500' },
    dobrze: { icon: 'fa-face-smile', color: 'text-lime-500' },
    neutralnie: { icon: 'fa-face-meh', color: 'text-yellow-500' },
    źle: { icon: 'fa-face-frown', color: 'text-orange-500' },
    okropnie: { icon: 'fa-face-sad-tear', color: 'text-red-500' },
};

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingDate, setEditingDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Notes>({});
  const [goal, setGoal] = useState<number | null>(null);
  const [hoveredNote, setHoveredNote] = useState<HoveredNote | null>(null);
  const [chartView, setChartView] = useState<'weekly' | 'monthly' | 'all'>('monthly');
  const [showCheckin, setShowCheckin] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const todayKey = useMemo(() => getLocalDateKey(new Date()), []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (userPrefersDark) {
      setTheme('dark');
    }
  }, []);

  // Apply theme class to HTML element and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);


  // Load notes from localStorage and migrate old data structure
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('freedomJournalNotes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        
        // Migration logic
        Object.keys(parsedNotes).forEach(key => {
          const note = parsedNotes[key];
          if (typeof note === 'string') {
            // Handle very old format
            parsedNotes[key] = { text: note, isFall: false };
          } else if (note.isFall && typeof note.fallTrigger === 'string' && !note.zik) {
            // Migrate from fallTrigger to ZIK
            note.zik = {
              trigger: note.fallTrigger,
              thoughts: '',
              feelings: '',
              consequences: '',
            };
            delete note.fallTrigger;
          }
        });
        
        setNotes(parsedNotes);
        
        // Show checkin if not done/dismissed today
        const checkinDoneToday = parsedNotes[todayKey]?.mood;
        const checkinDismissed = sessionStorage.getItem('checkinDismissed') === todayKey;
        if (!checkinDoneToday && !checkinDismissed) {
            setShowCheckin(true);
        }

      } else {
        // No notes stored, show check-in for first time users
        const checkinDismissed = sessionStorage.getItem('checkinDismissed') === todayKey;
        if (!checkinDismissed) {
            setShowCheckin(true);
        }
      }
    } catch (error) {
      console.error("Failed to load and migrate notes from localStorage", error);
    }
  }, [todayKey]);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freedomJournalNotes', JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage", error);
    }
  }, [notes]);

  // Load goal from localStorage
  useEffect(() => {
    try {
      const storedGoal = localStorage.getItem('freedomJournalGoal');
      if (storedGoal) {
        const parsedGoal = parseInt(storedGoal, 10);
        if (!isNaN(parsedGoal) && parsedGoal > 0) {
            setGoal(parsedGoal);
        }
      }
    } catch (error) {
        console.error("Failed to load goal from localStorage", error);
    }
  }, []);

  // Save goal to localStorage
  useEffect(() => {
    try {
        if(goal === null) {
            localStorage.removeItem('freedomJournalGoal');
        } else {
            localStorage.setItem('freedomJournalGoal', String(goal));
        }
    } catch (error) {
        console.error("Failed to save goal to localStorage", error);
    }
  }, [goal]);
  
  const handleSaveCheckin = useCallback((mood: Mood, triggers: string[]) => {
    setNotes(prevNotes => {
      const newNotes = { ...prevNotes };
      const currentNote = newNotes[todayKey] || { text: '', isFall: false };
      const newNoteData: NoteData = { 
        ...currentNote, 
        mood,
        triggers,
      };
      newNotes[todayKey] = newNoteData;
      return newNotes;
    });
    setShowCheckin(false);
  }, [todayKey]);

  const handleCloseCheckin = useCallback(() => {
    sessionStorage.setItem('checkinDismissed', todayKey);
    setShowCheckin(false);
  }, [todayKey]);

  const handleSetGoal = useCallback((days: number) => {
    setGoal(days);
  }, []);
  
  const lastFallTimestamp = useMemo(() => {
    const fallTimestamps = Object.values(notes)
      .filter((note: NoteData) => note.isFall && note.fallTimestamp)
      .map((note: NoteData) => note.fallTimestamp as number);

    if (fallTimestamps.length === 0) {
      return null;
    }

    return Math.max(...fallTimestamps);
  }, [notes]);

  const statistics = useMemo(() => {
    const sortedDateKeys = Object.keys(notes).sort();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = sortedDateKeys.length;
    
    let streak = 0;
    const fallDates = sortedDateKeys
      .filter(key => notes[key].isFall)
      .map(key => new Date(key));
    const lastFallDate = fallDates.length > 0 ? new Date(Math.max(...fallDates.map(d => d.getTime()))) : null;


    if (lastFallDate) {
      const diffTime = today.getTime() - lastFallDate.getTime();
      streak = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } else {
      if (sortedDateKeys.length > 0) {
        const firstDate = new Date(sortedDateKeys[0]);
        const diffTime = today.getTime() - firstDate.getTime();
        streak = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      } else {
        streak = 0;
      }
    }
    
    if (total === 0) streak = 0;


    let longestStreak = 0;
    if (sortedDateKeys.length > 0) {
      const firstDate = new Date(sortedDateKeys[0]);
      let tempStreak = 0;
      for (let d = new Date(firstDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateKey = getLocalDateKey(d);
        const noteData = notes[dateKey];
        if (noteData && noteData.isFall) {
          tempStreak = 0;
        } else {
          tempStreak++;
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }
    } else {
      longestStreak = streak;
    }

    return {
      streak,
      total,
      longestStreak,
    };
  }, [notes]);
  
  const streaksData = useMemo(() => {
    const sortedDateKeys = Object.keys(notes).sort();
    if (sortedDateKeys.length === 0 && statistics.streak === 0) {
        return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDate = sortedDateKeys.length > 0 ? new Date(sortedDateKeys[0] + 'T00:00:00') : today;

    const allDates: string[] = [];
    for (let d = new Date(firstDate); d <= today; d.setDate(d.getDate() + 1)) {
        allDates.push(getLocalDateKey(d));
    }
    
    if (allDates.length === 0) {
        allDates.push(getLocalDateKey(today));
    }

    const streaksResult: { length: number; startDate: string; endDate: string; isOngoing: boolean }[] = [];
    let currentStreakStartDate: string | null = null;
    let currentStreakLength = 0;

    for (const dateKey of allDates) {
        if (currentStreakStartDate === null) {
            currentStreakStartDate = dateKey;
        }
        const isFall = notes[dateKey]?.isFall || false;

        if (isFall) {
            if (currentStreakLength > 0) {
                const endDate = new Date(dateKey + 'T00:00:00');
                endDate.setDate(endDate.getDate() - 1);
                streaksResult.push({
                    length: currentStreakLength,
                    startDate: currentStreakStartDate,
                    endDate: getLocalDateKey(endDate),
                    isOngoing: false,
                });
            }
            currentStreakStartDate = null;
            currentStreakLength = 0;
        } else {
            currentStreakLength++;
        }
    }

    if (currentStreakLength > 0 && currentStreakStartDate) {
        streaksResult.push({
            length: currentStreakLength,
            startDate: currentStreakStartDate,
            endDate: getLocalDateKey(today),
            isOngoing: true,
        });
    } else if (streaksResult.length === 0 && statistics.streak > 0) {
        // Handle case where there are no notes, but a streak exists (app just started)
        const startDate = new Date();
        startDate.setDate(today.getDate() - statistics.streak + 1);
        streaksResult.push({
            length: statistics.streak,
            startDate: getLocalDateKey(startDate),
            endDate: getLocalDateKey(today),
            isOngoing: true,
        });
    }

    return streaksResult;
}, [notes, statistics.streak]);


  const handleDateSelect = useCallback((date: Date) => {
    setEditingDate(date);
  }, []);
  
  const handleCloseEditor = useCallback(() => {
    setEditingDate(null);
  }, []);

  const handleSaveNote = useCallback((date: Date, text: string, zikData: ZIKData) => {
    const dateKey = getLocalDateKey(date);
    setNotes(prevNotes => {
      const newNotes = { ...prevNotes };
      const currentNote = newNotes[dateKey] || { text: '', isFall: false };
      const newNoteData: NoteData = { 
        ...currentNote, 
        text,
        zik: currentNote.isFall ? zikData : undefined,
      };
      // Prevent deleting a note that only has mood/triggers
      if (newNoteData.text.trim() === '' && !newNoteData.isFall && !newNoteData.mood && (!newNoteData.triggers || newNoteData.triggers.length === 0)) {
        delete newNotes[dateKey];
      } else {
        newNotes[dateKey] = newNoteData;
      }
      return newNotes;
    });
  }, []);

  const handleToggleFall = useCallback((date: Date) => {
    const dateKey = getLocalDateKey(date);
    setNotes(prevNotes => {
      const newNotes = { ...prevNotes };
      const currentNote = newNotes[dateKey] || { text: '', isFall: false };
      const isFalling = !currentNote.isFall;

      const newNoteData: NoteData = {
        ...currentNote,
        isFall: isFalling,
        fallTimestamp: isFalling ? Date.now() : undefined,
        zik: isFalling ? (currentNote.zik || { trigger: '', thoughts: '', feelings: '', consequences: '' }) : undefined,
      };
      
      // Cleanup old property just in case
      if ((newNoteData as any).fallTrigger) {
          delete (newNoteData as any).fallTrigger;
      }
      
      // Prevent deleting a note that only has mood/triggers
      if (newNoteData.text.trim() === '' && !newNoteData.isFall && !newNoteData.mood && (!newNoteData.triggers || newNoteData.triggers.length === 0)) {
         delete newNotes[dateKey];
      } else {
        newNotes[dateKey] = newNoteData;
      }
      return newNotes;
    });
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDateHover = useCallback((date: Date, target: HTMLElement) => {
    const dateKey = getLocalDateKey(date);
    const note = notes[dateKey];
    if (note && (note.text || note.zik || note.mood)) {
      const rect = target.getBoundingClientRect();
      setHoveredNote({
        content: note,
        position: {
          top: rect.top + window.scrollY - 10,
          left: rect.left + window.scrollX + rect.width / 2,
        },
      });
    }
  }, [notes]);

  const handleDateHoverEnd = useCallback(() => {
    setHoveredNote(null);
  }, []);
  
  const noteDataForSelectedDate = editingDate ? notes[getLocalDateKey(editingDate)] : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="relative w-full max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-teal-600 dark:text-teal-500">Dziennik Wolności</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Twoja droga do niezależności zaczyna się tutaj. Dzień po dniu.</p>
        <button 
          onClick={toggleTheme}
          className="absolute top-0 right-0 p-2 w-12 h-12 text-2xl rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label={`Przełącz na tryb ${theme === 'light' ? 'ciemny' : 'jasny'}`}
        >
          <i className={`fas transition-transform duration-300 ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
      </header>
      
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
          <Calendar
            currentDate={currentDate}
            notes={notes}
            onDateSelect={handleDateSelect}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDateHover={handleDateHover}
            onDateHoverEnd={handleDateHoverEnd}
          />
           <hr className="my-6 border-slate-200 dark:border-slate-700" />
           <ProgressChart 
              data={streaksData} 
              goal={goal} 
              view={chartView} 
              onSetView={setChartView} 
            />
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
            <NotesList notes={notes} onNoteSelect={handleDateSelect} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          {showCheckin && <DailyCheckin onSave={handleSaveCheckin} onClose={handleCloseCheckin} />}
          <TreeOfFreedom streak={statistics.streak} />
          <RelapseTimer lastFallTimestamp={lastFallTimestamp} />
          <Lifeline />
          <GoalTracker 
            goal={goal}
            currentStreak={statistics.streak}
            onSetGoal={handleSetGoal}
          />
          <Stats statistics={statistics} />
          <Badges longestStreak={statistics.longestStreak} />
          <FallAnalysis notes={notes} />
          <ZIKAnalysisVisualization notes={notes} />
        </div>
      </main>

      {editingDate && (
        <NoteEditor
          date={editingDate}
          noteData={noteDataForSelectedDate}
          onSave={handleSaveNote}
          onToggleFall={handleToggleFall}
          onClose={handleCloseEditor}
        />
      )}
      
      {hoveredNote && (
        <div
          className="fixed z-30 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl max-w-xs pointer-events-none animate-fade-in dark:border dark:border-slate-600"
          style={{
            top: hoveredNote.position.top,
            left: hoveredNote.position.left,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {hoveredNote.content.isFall && <p className="font-bold text-red-400 text-xs uppercase tracking-wider mb-1">Upadek</p>}
          {hoveredNote.content.text && <p className="whitespace-pre-wrap line-clamp-5">{hoveredNote.content.text}</p>}
          
          {(hoveredNote.content.zik || hoveredNote.content.mood || (hoveredNote.content.triggers && hoveredNote.content.triggers.length > 0)) && (hoveredNote.content.text || hoveredNote.content.isFall) && <hr className="my-1.5 border-slate-600 dark:border-slate-500" />}

          {hoveredNote.content.mood && (
            <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-xs text-slate-300">Nastrój:</span>
                <i className={`fas ${moodStyles[hoveredNote.content.mood].icon} ${moodStyles[hoveredNote.content.mood].color}`}></i>
                <span className="capitalize text-xs">{hoveredNote.content.mood}</span>
            </div>
           )}

          {hoveredNote.content.triggers && hoveredNote.content.triggers.length > 0 && (
            <div className="text-xs">
                <span className="font-semibold text-slate-300">Wpływ:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                    {hoveredNote.content.triggers.map(trigger => (
                        <span key={trigger} className="text-xs bg-slate-700 rounded px-1.5 py-0.5">{trigger}</span>
                    ))}
                </div>
            </div>
          )}

          {hoveredNote.content.isFall && hoveredNote.content.zik && (
            <>
              {(hoveredNote.content.mood || (hoveredNote.content.triggers && hoveredNote.content.triggers.length > 0)) && <hr className="my-1.5 border-slate-600 dark:border-slate-500" />}
              {hoveredNote.content.zik.trigger && <p className="text-xs text-slate-300 line-clamp-3"><span className="font-semibold">Wyzwalacz:</span> {hoveredNote.content.zik.trigger}</p>}
              {hoveredNote.content.zik.thoughts && <p className="text-xs text-slate-300 line-clamp-3 mt-1"><span className="font-semibold">Myśli:</span> {hoveredNote.content.zik.thoughts}</p>}
              {hoveredNote.content.zik.feelings && <p className="text-xs text-slate-300 line-clamp-3 mt-1"><span className="font-semibold">Uczucia:</span> {hoveredNote.content.zik.feelings}</p>}
              {hoveredNote.content.zik.consequences && <p className="text-xs text-slate-300 line-clamp-3 mt-1"><span className="font-semibold">Konsekwencje:</span> {hoveredNote.content.zik.consequences}</p>}
            </>
          )}
        </div>
      )}

      <footer className="w-full max-w-6xl mx-auto text-center mt-12 text-slate-400 dark:text-slate-500 text-sm">
        <p>Pamiętaj, każdy dzień to nowa szansa na postęp. Bądź dla siebie wyrozumiały.</p>
      </footer>
    </div>
  );
};

export default App;