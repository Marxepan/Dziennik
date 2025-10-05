import React, { useState, useEffect, useCallback } from 'react';
import type { NoteData, ZIKData, Mood } from '../types';

interface NoteEditorProps {
  date: Date;
  noteData: NoteData | undefined;
  onSave: (date: Date, text: string, zikData: ZIKData) => void;
  onToggleFall: (date: Date) => void;
  onClose: () => void;
}

const moodStyles: Record<Mood, { icon: string; color: string }> = {
    wspaniale: { icon: 'fa-face-laugh-beam', color: 'text-green-500' },
    dobrze: { icon: 'fa-face-smile', color: 'text-lime-500' },
    neutralnie: { icon: 'fa-face-meh', color: 'text-yellow-500' },
    źle: { icon: 'fa-face-frown', color: 'text-orange-500' },
    okropnie: { icon: 'fa-face-sad-tear', color: 'text-red-500' },
};

const ZIKTextarea: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}> = ({ id, label, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-red-700 dark:text-red-400 mb-2">{label}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50 dark:text-slate-200 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow duration-200 resize-none"
            rows={2}
        />
    </div>
);

const NoteEditor: React.FC<NoteEditorProps> = ({ date, noteData, onSave, onToggleFall, onClose }) => {
  const [text, setText] = useState('');
  const [trigger, setTrigger] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [feelings, setFeelings] = useState('');
  const [consequences, setConsequences] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const isFall = noteData?.isFall || false;
  const mood = noteData?.mood;
  const triggers = noteData?.triggers;

  useEffect(() => {
    setText(noteData?.text || '');
    setTrigger(noteData?.zik?.trigger || '');
    setThoughts(noteData?.zik?.thoughts || '');
    setFeelings(noteData?.zik?.feelings || '');
    setConsequences(noteData?.zik?.consequences || '');
  }, [noteData]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 200); // Match animation duration
  }, [onClose]);

  const handleSaveAndClose = () => {
    onSave(date, text, { trigger, thoughts, feelings, consequences });
    handleClose();
  };
  
  const handleToggleFall = () => {
      onToggleFall(date);
  };
  
  // Handle Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);


  const formattedDate = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  return (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center p-4 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-editor-title"
    >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70" onClick={handleClose}></div>

        {/* Modal Panel */}
        <div className={`relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-transform duration-200 ${isClosing ? 'scale-95' : 'scale-100'}`}>
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Zamknij edytor notatek"
            >
                <i className="fas fa-times fa-lg"></i>
            </button>

            <h3 id="note-editor-title" className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Notatka z dnia</h3>
            <p className="text-teal-600 dark:text-teal-500 font-semibold mb-6">{formattedDate}</p>
            
            {(mood || (triggers && triggers.length > 0)) && (
                 <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 space-y-3">
                    {mood && (
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Zanotowany nastrój:</p>
                            <div className="flex items-center gap-2">
                                <i className={`fas ${moodStyles[mood].icon} fa-lg ${moodStyles[mood].color}`}></i>
                                <span className="font-medium capitalize text-slate-800 dark:text-slate-100">{mood}</span>
                            </div>
                        </div>
                    )}
                    {triggers && triggers.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Zanotowane czynniki:</p>
                            <div className="flex flex-wrap gap-2">
                                {triggers.map(trigger => (
                                    <span key={trigger} className="px-2.5 py-1 text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200 rounded-full">{trigger}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <textarea
                id="note-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Jak się dzisiaj czujesz? Jakie myśli Ci towarzyszyły? Zapisz swoje postępy..."
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-500 transition-shadow duration-200 resize-none"
                rows={5}
                autoFocus
            />

            {isFall && (
                <div className="mt-4 space-y-4">
                    <ZIKTextarea 
                        id="zik-trigger"
                        label="Wyzwalacz"
                        value={trigger}
                        onChange={(e) => setTrigger(e.target.value)}
                        placeholder="Co zapoczątkowało chęć?"
                    />
                     <ZIKTextarea 
                        id="zik-thoughts"
                        label="Myśli"
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        placeholder="Jakie myśli pojawiły się w Twojej głowie?"
                    />
                     <ZIKTextarea 
                        id="zik-feelings"
                        label="Uczucia/Emocje"
                        value={feelings}
                        onChange={(e) => setFeelings(e.target.value)}
                        placeholder="Jakie emocje Ci towarzyszyły?"
                    />
                     <ZIKTextarea 
                        id="zik-consequences"
                        label="Konsekwencje"
                        value={consequences}
                        onChange={(e) => setConsequences(e.target.value)}
                        placeholder="Jakie były natychmiastowe i długofalowe skutki?"
                    />
                </div>
            )}


            <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                    onClick={handleToggleFall}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${isFall ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 focus:ring-slate-400'}`}
                >
                    {isFall ? (
                        <>
                            <i className="fas fa-check mr-2"></i> Upadek oznaczony
                        </>
                    ) : (
                        <>
                            <i className="fas fa-exclamation-triangle mr-2"></i> Oznacz upadek
                        </>
                    )}
                </button>
                <button
                    onClick={handleSaveAndClose}
                    className="w-full py-3 px-4 rounded-lg text-white font-bold bg-teal-500 hover:bg-teal-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    <i className="fas fa-save mr-2"></i> Zapisz i zamknij
                </button>
            </div>
        </div>
    </div>
  );
};

export default NoteEditor;