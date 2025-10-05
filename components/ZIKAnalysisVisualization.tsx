import React, { useMemo, useState } from 'react';
import type { Notes, NoteData } from '../types';

// A set of common Polish stop words to filter out from the analysis to improve relevance.
const POLISH_STOP_WORDS = new Set([
  'i', 'a', 'w', 'na', 'z', 'do', 'jest', 'się', 'nie', 'to', 'o', 'ale', 'że', 'co', 'tak',
  'po', 'dla', 'mnie', 'ciebie', 'on', 'ona', 'ono', 'oni', 'one', 'ja', 'ty', 'my', 'wy',
  'mną', 'tobą', 'nim', 'nią', 'nami', 'wami', 'ich', 'jego', 'jej', 'nasz', 'wasz', 'być',
  'mam', 'masz', 'ma', 'mamy', 'macie', 'mają', 'był', 'była', 'było', 'byli', 'były',
  'będę', 'będziesz', 'będzie', 'będziemy', 'będziecie', 'będą', 'już', 'też', 'oraz',
  'gdy', 'kiedy', 'albo', 'lub', 'bo', 'ponieważ', 'przez', 'bez', 'od', 'aż', 'żeby',
  'bardzo', 'dużo', 'mało', 'zawsze', 'nigdy', 'często', 'rzadko', 'jak', 'gdzie', 'kto',
  'coś', 'nic', 'wszystko', 'ktoś', 'jakiś', 'jakaś', 'jakieś', 'sobie', 'swoje', 'swój',
  'swoja', 'swojego', 'który', 'która', 'które', 'którzy', 'tego', 'temu', 'tym', 'nad',
  'pod', 'przy', 'przed', 'za', 'więc', 'gdyż', 'jeśli', 'by', 'czy', 'oto', 'tam', 'tu',
  'tutaj', 'jako', 'ze', 'może', 'mój', 'moja', 'moje'
]);

/**
 * Processes an array of texts into a sorted list of word frequencies.
 * It cleans the text, removes stop words and short words.
 * @param texts - Array of strings to analyze.
 * @param minLength - Minimum length of a word to be included.
 * @returns An array of tuples [word, count], sorted by count descending.
 */
function getWordFrequencies(texts: string[], minLength = 3): [string, number][] {
    const wordMap = new Map<string, number>();
    texts.forEach(text => {
        if (!text || typeof text !== 'string') return;
        const words = text
            .toLowerCase()
            .replace(/[,.!?()"„”\-]/g, '') // Remove common punctuation
            .split(/\s+/);

        words.forEach(word => {
            if (word && word.length >= minLength && !POLISH_STOP_WORDS.has(word)) {
                wordMap.set(word, (wordMap.get(word) || 0) + 1);
            }
        });
    });
    return Array.from(wordMap.entries()).sort((a, b) => b[1] - a[1]);
}

interface ColorClass {
  text: string;
  bg: string;
  hoverBg: string;
}

// Sub-component to render a collapsible horizontal bar chart for a category.
const CollapsibleCategoryChart: React.FC<{ 
  title: string; 
  data: [string, number][]; 
  icon: string; 
  colorClass: ColorClass;
}> = ({ title, data, icon, colorClass }) => {
    const [isOpen, setIsOpen] = useState(true);
    const topData = data.slice(0, 5);

    if (topData.length === 0) {
        return null;
    }

    const maxCount = topData.length > 0 ? topData[0][1] : 1;

    return (
        <div className="py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="w-full flex justify-between items-center text-left py-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
              aria-expanded={isOpen}
              aria-controls={`zik-category-${title.replace(/\s+/g, '-')}`}
            >
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    <i className={`fas ${icon} mr-3 w-4 text-center ${colorClass.text}`}></i>
                    {title}
                </h4>
                <i className={`fas fa-chevron-down text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div
              id={`zik-category-${title.replace(/\s+/g, '-')}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
            >
              <ul className="space-y-3 pl-1">
                  {topData.map(([word, count]) => (
                      <li key={word} className="group" aria-label={`${word}, wystąpień: ${count}`}>
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize truncate pr-2" title={word}>
                                  {word}
                              </span>
                              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                  {count}
                              </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={maxCount}>
                              <div
                                  className={`${colorClass.bg} ${colorClass.hoverBg} h-2.5 rounded-full transition-all duration-300 ease-out`}
                                  style={{ width: `${(count / maxCount) * 100}%` }}
                              ></div>
                          </div>
                      </li>
                  ))}
              </ul>
            </div>
        </div>
    );
};


// Main component for ZIK analysis visualization.
const ZIKAnalysisVisualization: React.FC<{ notes: Notes }> = ({ notes }) => {
    const { triggers, thoughts, feelings, consequences, hasData } = useMemo(() => {
        const fallNotes = Object.values(notes).filter((note: NoteData) => note.isFall && note.zik);
        
        if (fallNotes.length === 0) {
            return { triggers: [], thoughts: [], feelings: [], consequences: [], hasData: false };
        }

        const triggerTexts = fallNotes.map((n: NoteData) => n.zik!.trigger);
        const thoughtTexts = fallNotes.map((n: NoteData) => n.zik!.thoughts);
        const feelingTexts = fallNotes.map((n: NoteData) => n.zik!.feelings);
        const consequenceTexts = fallNotes.map((n: NoteData) => n.zik!.consequences);

        const triggers = getWordFrequencies(triggerTexts);
        const thoughts = getWordFrequencies(thoughtTexts);
        const feelings = getWordFrequencies(feelingTexts);
        const consequences = getWordFrequencies(consequenceTexts);
        
        const hasData = triggers.length > 0 || thoughts.length > 0 || feelings.length > 0 || consequences.length > 0;

        return { triggers, thoughts, feelings, consequences, hasData };
    }, [notes]);

    if (!hasData) {
        return null; // Don't render if there's no ZIK data at all
    }
    
    const colorClasses = {
        triggers: { text: 'text-amber-500', bg: 'bg-amber-400', hoverBg: 'group-hover:bg-amber-500' },
        thoughts: { text: 'text-sky-500', bg: 'bg-sky-400', hoverBg: 'group-hover:bg-sky-500' },
        feelings: { text: 'text-rose-500', bg: 'bg-rose-400', hoverBg: 'group-hover:bg-rose-500' },
        consequences: { text: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-400 dark:bg-slate-500', hoverBg: 'group-hover:bg-slate-500 dark:group-hover:bg-slate-400' },
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Wizualna Analiza ZIK</h3>
                <div className="space-y-1">
                    <CollapsibleCategoryChart title="Najczęstsze Wyzwalacze" icon="fa-bolt" data={triggers} colorClass={colorClasses.triggers} />
                    <CollapsibleCategoryChart title="Najczęstsze Myśli" icon="fa-brain" data={thoughts} colorClass={colorClasses.thoughts} />
                    <CollapsibleCategoryChart title="Najczęstsze Uczucia" icon="fa-heart-pulse" data={feelings} colorClass={colorClasses.feelings} />
                    <CollapsibleCategoryChart title="Najczęstsze Konsekwencje" icon="fa-arrow-trend-down" data={consequences} colorClass={colorClasses.consequences} />
                </div>
            </div>
        </div>
    );
};

export default ZIKAnalysisVisualization;