import React, { useMemo } from 'react';
import type { Notes, NoteData } from '../types';

const AnalysisCategory: React.FC<{
  title: string;
  icon: string;
  data: [string, number][];
}> = ({ title, icon, data }) => {
  if (data.length === 0) {
    return null;
  }
  return (
    <div>
      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
        <i className={`fas ${icon} mr-2 text-teal-500 w-4 text-center`}></i>
        {title}
      </h4>
      <ul className="space-y-1">
        {data.map(([text, count]) => (
          <li key={text} className="flex justify-between items-center text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            <span className="text-slate-700 dark:text-slate-200 capitalize truncate pr-2">{text}</span>
            <span className="font-bold text-slate-500 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 text-xs rounded-full px-2 py-0.5">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FallAnalysis: React.FC<{ notes: Notes }> = ({ notes }) => {
  const { timeOfDayStats, zikStats, totalTimestampedFalls, totalZikFalls, totalFallNotes } = useMemo(() => {
    // Time of day stats
    const tod = {
      morning: { count: 0, label: 'Rano', icon: 'fa-sun' },
      afternoon: { count: 0, label: 'Popołudnie', icon: 'fa-cloud-sun' },
      evening: { count: 0, label: 'Wieczór', icon: 'fa-moon' },
      night: { count: 0, label: 'Noc', icon: 'fa-star' },
    };
    let fallsWithTimestamp = 0;

    // ZIK stats
    const triggerMap = new Map<string, number>();
    const thoughtsMap = new Map<string, number>();
    const feelingsMap = new Map<string, number>();
    const consequencesMap = new Map<string, number>();
    let fallsWithZik = 0;
    
    // Total fall notes count
    let fallNotesCount = 0;

    const addToMap = (map: Map<string, number>, value?: string) => {
      if (value && value.trim()) {
        const cleanedValue = value.trim().toLowerCase();
        map.set(cleanedValue, (map.get(cleanedValue) || 0) + 1);
      }
    };

    Object.values(notes).forEach((note: NoteData) => {
      if (!note.isFall) return;
      
      fallNotesCount++;

      if (note.fallTimestamp) {
        fallsWithTimestamp++;
        const hour = new Date(note.fallTimestamp).getHours();
        if (hour >= 6 && hour < 12) tod.morning.count++;
        else if (hour >= 12 && hour < 18) tod.afternoon.count++;
        else if (hour >= 18 && hour < 24) tod.evening.count++;
        else tod.night.count++;
      }

      if (note.zik) {
        fallsWithZik++;
        addToMap(triggerMap, note.zik.trigger);
        addToMap(thoughtsMap, note.zik.thoughts);
        addToMap(feelingsMap, note.zik.feelings);
        addToMap(consequencesMap, note.zik.consequences);
      }
    });

    const getTopEntries = (map: Map<string, number>, count = 3): [string, number][] => {
      return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, count);
    };

    return {
      timeOfDayStats: Object.values(tod),
      totalTimestampedFalls: fallsWithTimestamp,
      zikStats: {
        topTriggers: getTopEntries(triggerMap),
        topThoughts: getTopEntries(thoughtsMap),
        topFeelings: getTopEntries(feelingsMap),
        topConsequences: getTopEntries(consequencesMap),
      },
      totalZikFalls: fallsWithZik,
      totalFallNotes: fallNotesCount,
    };
  }, [notes]);

  const { topTriggers, topThoughts, topFeelings, topConsequences } = zikStats;
  const hasAnyData = totalFallNotes > 0;
  const zikCoveragePercentage = totalFallNotes > 0 ? Math.round((totalZikFalls / totalFallNotes) * 100) : 0;


  if (!hasAnyData) {
    return (
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Analiza Upadków</h3>
        <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-4">
            <i className="fas fa-chart-pie text-4xl mb-3"></i>
            <p className="font-semibold text-sm">Brak danych o upadkach do analizy.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Analiza Upadków</h3>
        
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300">Pokrycie analizą ZIK</h4>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">{zikCoveragePercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2" role="progressbar" aria-valuenow={zikCoveragePercentage} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${zikCoveragePercentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">Ukończono {totalZikFalls} z {totalFallNotes} analiz.</p>
        </div>

        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Analiza Pory Dnia</h4>
        {totalTimestampedFalls > 0 ? (
          <div className="space-y-4">
            {timeOfDayStats.map(stat => {
              const percentage = totalTimestampedFalls > 0 ? (stat.count / totalTimestampedFalls) * 100 : 0;
              return (
                <div key={stat.label}>
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <div className="font-semibold text-slate-600 dark:text-slate-300">
                            <i className={`fas ${stat.icon} mr-2 text-teal-500 w-4 text-center`}></i>
                            {stat.label}
                        </div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{stat.count}</div>
                    </div>
                    {/* FIX: Changed aria-valuemin and aria-valuemax to be numbers to fix type error. */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                        <div
                        className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2">Brak danych o porze dnia upadków.</p>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      <div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Analiza Wzorców</h4>
        {totalZikFalls > 0 ? (
          <div className="space-y-4">
            <AnalysisCategory title="Najczęstsze Wyzwalacze" icon="fa-bolt" data={topTriggers} />
            <AnalysisCategory title="Najczęstsze Myśli" icon="fa-brain" data={topThoughts} />
            <AnalysisCategory title="Najczęstsze Uczucia" icon="fa-heart-pulse" data={topFeelings} />
            <AnalysisCategory title="Najczęstsze Konsekwencje" icon="fa-arrow-trend-down" data={topConsequences} />
          </div>
        ) : (
           <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2">Uzupełnij analizę ZIK po upadku, aby zobaczyć wzorce.</p>
        )}
      </div>
    </div>
  );
};

export default FallAnalysis;