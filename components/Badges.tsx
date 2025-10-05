import React from 'react';
import { badges, Badge } from '../badges';

interface BadgesProps {
  longestStreak: number;
}

const BadgeItem: React.FC<{ badge: Badge; isEarned: boolean }> = ({ badge, isEarned }) => (
  <div className={`relative flex flex-col items-center p-2 text-center group ${!isEarned ? 'opacity-40' : ''}`}>
    <div className={`
      relative w-16 h-16 flex items-center justify-center rounded-full
      transition-all duration-300
      ${isEarned ? 'bg-amber-400 text-white shadow-lg' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
    `}>
      <i className={`fas ${badge.icon} text-2xl`}></i>
    </div>
    <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300 truncate w-16">{badge.name}</span>
    
    {/* Tooltip */}
    <div className="absolute bottom-full mb-2 w-48 p-2.5 text-sm text-white bg-slate-800 rounded-md shadow-lg pointer-events-none
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 transform -translate-x-1/2 left-1/2">
      <p className="font-bold">{badge.name} ({badge.days} dni)</p>
      <p className="text-xs text-slate-300 mt-1">{badge.description}</p>
      {isEarned && <p className="mt-1.5 text-xs uppercase font-bold text-amber-300 tracking-wider">Zdobyta</p>}
       <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
    </div>
  </div>
);


const Badges: React.FC<BadgesProps> = ({ longestStreak }) => {
  const nextBadge = badges.find(b => b.days > longestStreak);

  const formatDays = (days: number) => {
    if (days === 1) return 'dzień';
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
        return 'dni';
    }
    return 'dni';
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Twoje Odznaki</h3>
      
      {badges.length === 0 ? (
         <div className="flex flex-col items-center justify-center text-center text-slate-400 py-4">
            <i className="fas fa-award text-4xl mb-3"></i>
            <p className="font-semibold text-sm">Brak zdefiniowanych odznak.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-y-4 gap-x-2">
          {badges.map(badge => (
            <BadgeItem key={badge.days} badge={badge} isEarned={longestStreak >= badge.days} />
          ))}
        </div>
      )}

      {nextBadge && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Następny cel</h4>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
               <i className={`fas ${nextBadge.icon} text-xl`}></i>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{nextBadge.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Potrzeba {nextBadge.days - longestStreak} {formatDays(nextBadge.days - longestStreak)} więcej, aby odblokować.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;