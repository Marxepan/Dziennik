import React, { useState, useEffect } from 'react';

interface RelapseTimerProps {
  lastFallTimestamp: number | null;
}

// Helper function to format the time
const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const RelapseTimer: React.FC<RelapseTimerProps> = ({ lastFallTimestamp }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!lastFallTimestamp) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const duration = now - lastFallTimestamp;
      setElapsedTime(formatDuration(duration));
    }, 1000);

    // Initial calculation to avoid 1-second delay
    const initialDuration = Date.now() - lastFallTimestamp;
    setElapsedTime(formatDuration(initialDuration));

    return () => clearInterval(intervalId);
  }, [lastFallTimestamp]);

  // We only want to show this timer if a fall has been recorded.
  if (!lastFallTimestamp) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border-l-4 border-amber-400">
      <div className="flex items-center mb-3">
        <i className="fas fa-hourglass-half text-amber-500 text-xl mr-3"></i>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Czas od upadku</h3>
      </div>
      <div className="text-center my-2">
        <p className="text-5xl font-bold font-mono text-amber-600 dark:text-amber-500 tracking-wider">
          {elapsedTime}
        </p>
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
        Każda sekunda to krok w dobrą stronę. Wstań i walcz dalej.
      </p>
    </div>
  );
};

export default RelapseTimer;