import React from 'react';

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="flex items-center p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
    <div className="p-3 bg-teal-200 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded-full mr-4">
      <i className={`fas ${icon} fa-lg`}></i>
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  </div>
);

interface Statistics {
    streak: number;
    longestStreak: number;
    total: number;
}

interface StatsProps {
  statistics: Statistics;
}

const Stats: React.FC<StatsProps> = ({ statistics }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Twoje Postępy</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
         <StatCard icon="fa-fire" value={statistics.streak} label="Dni czystości (seria)" />
         <StatCard icon="fa-trophy" value={statistics.longestStreak} label="Najdłuższa seria" />
         <StatCard icon="fa-calendar-check" value={statistics.total} label="Dni z notatką" />
      </div>
    </div>
  );
};

export default Stats;