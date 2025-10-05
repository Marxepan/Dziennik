import React, { useState, useMemo } from 'react';
import type { Notes, NoteData, Mood } from '../types';

interface NotesListProps {
  notes: Notes;
  onNoteSelect: (date: Date) => void;
}

type ViewType = 'all' | 'falls';

const moodStyles: Record<Mood, { icon: string; color: string }> = {
    wspaniale: { icon: 'fa-face-laugh-beam', color: 'text-green-500' },
    dobrze: { icon: 'fa-face-smile', color: 'text-lime-500' },
    neutralnie: { icon: 'fa-face-meh', color: 'text-yellow-500' },
    źle: { icon: 'fa-face-frown', color: 'text-orange-500' },
    okropnie: { icon: 'fa-face-sad-tear', color: 'text-red-500' },
};

const NotesList: React.FC<NotesListProps> = ({ notes, onNoteSelect }) => {
  const [view, setView] = useState<ViewType>('all');

  const sortedNotes = useMemo(() => {
    return Object.entries(notes)
      .map(([date, data]: [string, NoteData]) => ({
        date: new Date(date),
        ...data,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (view === 'falls') {
      return sortedNotes.filter(note => note.isFall);
    }
    return sortedNotes;
  }, [sortedNotes, view]);

  const formatDate = (date: Date) => new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(date);

  const TabButton: React.FC<{
    label: string;
    viewType: ViewType;
    icon: string;
  }> = ({ label, viewType, icon }) => {
    const isActive = view === viewType;
    return (
      <button
        onClick={() => setView(viewType)}
        className={`flex-1 sm:flex-none py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isActive
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
        }`}
      >
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Moje Notatki</h3>
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl space-x-1">
          <TabButton label="Wszystkie" viewType="all" icon="fa-book-open" />
          <TabButton label="Upadki" viewType="falls" icon="fa-exclamation-triangle" />
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-sm transition-all duration-300 border-l-4 cursor-pointer ${
                note.isFall
                  ? 'border-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                  : 'border-teal-500 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
              onClick={() => onNoteSelect(note.date)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNoteSelect(note.date); }}
              aria-label={`Otwórz notatkę z dnia ${formatDate(note.date)}`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className={`font-semibold ${note.isFall ? 'text-red-800 dark:text-red-400' : 'text-teal-700 dark:text-teal-400'}`}>
                  {formatDate(note.date)}
                </p>
                {note.isFall && (
                  <span className="px-2 py-1 text-xs font-bold text-red-800 bg-red-200 dark:text-red-200 dark:bg-red-500/30 rounded-full">
                    UPADEK
                  </span>
                )}
              </div>
              
              {note.mood && (
                <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nastrój:</p>
                    <i className={`fas ${moodStyles[note.mood].icon} ${moodStyles[note.mood].color}`}></i>
                    <span className="capitalize text-sm font-medium text-slate-800 dark:text-slate-100">{note.mood}</span>
                </div>
              )}

              {note.text && <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.text}</p>}
              
              {note.triggers && note.triggers.length > 0 && (
                <div className={`pt-3 mt-3 border-t ${note.isFall ? 'border-red-200 dark:border-red-900' : 'border-teal-200 dark:border-teal-900'}`}>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Wpływ:</p>
                    <div className="flex flex-wrap gap-2">
                        {note.triggers.map(trigger => (
                            <span key={trigger} className="px-2.5 py-1 text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200 rounded-full">{trigger}</span>
                        ))}
                    </div>
                </div>
              )}

              {note.isFall && note.zik && (
                <div className={`mt-3 pt-3 border-t border-red-200 dark:border-red-900 space-y-3 ${!note.text && (!note.triggers || note.triggers.length === 0) ? 'mt-0 pt-0 border-none' : ''}`}>
                    {note.zik.trigger && (
                        <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Wyzwalacz:</p>
                            <p className="text-sm text-red-900 dark:text-red-300 whitespace-pre-wrap">{note.zik.trigger}</p>
                        </div>
                    )}
                    {note.zik.thoughts && (
                        <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Myśli:</p>
                            <p className="text-sm text-red-900 dark:text-red-300 whitespace-pre-wrap">{note.zik.thoughts}</p>
                        </div>
                    )}
                    {note.zik.feelings && (
                        <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Uczucia/Emocje:</p>
                            <p className="text-sm text-red-900 dark:text-red-300 whitespace-pre-wrap">{note.zik.feelings}</p>
                        </div>
                    )}
                     {note.zik.consequences && (
                        <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Konsekwencje:</p>
                            <p className="text-sm text-red-900 dark:text-red-300 whitespace-pre-wrap">{note.zik.consequences}</p>
                        </div>
                    )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-10">
            <i className="fas fa-feather-alt text-4xl mb-3"></i>
            <p className="font-semibold text-sm">
              {view === 'all'
                ? 'Brak notatek do wyświetlenia.'
                : 'Brak notatek z upadków.'}
            </p>
            <p className="text-xs">
              {view === 'all'
                ? 'Kliknij dzień w kalendarzu, aby dodać pierwszą notatkę.'
                : 'Wszystkie dni oznaczone jako upadek pojawią się tutaj.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;