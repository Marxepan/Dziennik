import React, { useState, useMemo } from 'react';

interface StreakData {
  length: number;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
}

interface ProgressChartProps {
  data: StreakData[];
  goal: number | null;
  view: 'weekly' | 'monthly' | 'all';
  onSetView: (view: 'weekly' | 'monthly' | 'all') => void;
}

const ViewSwitcher: React.FC<Pick<ProgressChartProps, 'view' | 'onSetView'>> = ({ view, onSetView }) => {
  const buttonStyle = "px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500";
  const activeStyle = "bg-teal-600 text-white shadow";
  const inactiveStyle = "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

  return (
    <div className="flex justify-end items-center mb-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
      <button onClick={() => onSetView('weekly')} className={`${buttonStyle} ${view === 'weekly' ? activeStyle : inactiveStyle}`}>Tydzień</button>
      <button onClick={() => onSetView('monthly')} className={`${buttonStyle} ${view === 'monthly' ? activeStyle : inactiveStyle} mx-1`}>Miesiąc</button>
      <button onClick={() => onSetView('all')} className={`${buttonStyle} ${view === 'all' ? activeStyle : inactiveStyle}`}>Wszystko</button>
    </div>
  );
};

const ProgressChart: React.FC<ProgressChartProps> = ({ data, goal, view, onSetView }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: StreakData } | null>(null);

  const filteredData = useMemo(() => {
    if (view === 'all') return data;
    const now = new Date();
    const days = view === 'weekly' ? 7 : 30;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
    
    return data.filter(s => new Date(s.endDate) >= cutoffDate || s.isOngoing);
  }, [data, view]);

  const chartDimensions = {
    width: 500,
    height: 200,
    margin: { top: 20, right: 20, bottom: 30, left: 40 },
  };

  const { width, height, margin } = chartDimensions;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { bars, yAxisLabels, goalLine, yScale } = useMemo(() => {
    const calculatedMaxStreak = Math.max(...filteredData.map(d => d.length), goal || 0, 1);
    const maxStreak = Math.ceil(calculatedMaxStreak / 5) * 5 || 5;

    const yScale = (streak: number) => innerHeight - (streak / maxStreak) * innerHeight;

    const bandWidth = filteredData.length > 0 ? innerWidth / filteredData.length : 0;
    const barWidth = Math.max(1, Math.min(bandWidth * 0.7, 25));

    const bars = filteredData.map((d, i) => {
        const x = (i * bandWidth) + (bandWidth / 2) - (barWidth / 2);
        const y = yScale(d.length);
        return {
            x,
            y,
            width: barWidth,
            height: innerHeight - y,
            data: d
        };
    });

    const yAxisLabels = Array.from({ length: 3 }, (_, i) => {
        const value = (maxStreak / 2) * i;
        return { value, y: yScale(value) };
    }).map(label => ({ ...label, value: Math.round(label.value) }));
    
    const goalLine = (goal !== null && goal > 0 && goal <= maxStreak) ? { y: yScale(goal) } : null;

    return { bars, yAxisLabels, goalLine, yScale };
  }, [filteredData, goal, innerWidth, innerHeight]);

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('pl-PL', { month: 'short', day: 'numeric' }).format(new Date(dateString));

  if (data.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Historia Serii</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Wykres długości Twoich serii dni bez upadku.</p>
        <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-10 h-[200px] bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <i className="fas fa-chart-bar text-4xl mb-3"></i>
          <p className="font-semibold text-sm">Brak danych do narysowania wykresu.</p>
          <p className="text-xs">Zacznij prowadzić dziennik, aby zobaczyć swoje postępy.</p>
        </div>
      </div>
    );
  }
  
  const viewLabels = {
    weekly: 'w tym tygodniu',
    monthly: 'w tym miesiącu',
    all: 'w historii'
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Historia Serii</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Długość serii dni bez upadku.</p>
        </div>
        <ViewSwitcher view={view} onSetView={onSetView} />
      </div>

       {filteredData.length > 0 ? (
        <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto"
            role="img"
            aria-labelledby="chart-title"
        >
            <title id="chart-title">Wykres słupkowy pokazujący długość serii dni bez upadku.</title>
            <defs>
              <linearGradient id="ongoingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tw-color-teal-400)" />
                <stop offset="100%" stopColor="var(--tw-color-teal-600)" />
              </linearGradient>
               <linearGradient id="pastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tw-color-teal-300)" />
                <stop offset="100%" stopColor="var(--tw-color-teal-400)" />
              </linearGradient>
              <linearGradient id="pastGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tw-color-teal-600)" />
                <stop offset="100%" stopColor="var(--tw-color-teal-700)" />
              </linearGradient>
            </defs>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Y-Axis Grid Lines & Labels */}
                {yAxisLabels.map(({ value, y }) => (
                    <g key={value} className="text-slate-400 dark:text-slate-600">
                    <line x1={0} y1={y} x2={innerWidth} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,3" />
                    <text x={-8} y={y + 4} textAnchor="end" className="text-xs fill-current dark:text-slate-400">{value}</text>
                    </g>
                ))}
                
                {/* Goal Line */}
                {goalLine && (
                    <g className="opacity-80">
                        <line x1={0} y1={goalLine.y} x2={innerWidth} y2={goalLine.y} stroke="var(--tw-color-amber-400)" strokeWidth="1.5" strokeDasharray="4,4" />
                        <text x={innerWidth} y={goalLine.y - 5} textAnchor="end" className="text-xs font-bold fill-current text-amber-500" style={{ paintOrder: 'stroke', stroke: 'var(--tooltip-bg, white)', strokeWidth: '3px', strokeLinejoin: 'round' }}>
                            Cel: {goal}
                        </text>
                    </g>
                )}
                
                {/* Bars */}
                {bars.map((bar, i) => (
                    <rect
                        key={i}
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        className="fill-[url(#pastGradient)] dark:fill-[url(#pastGradientDark)] transition-all duration-300 ease-in-out"
                        style={bar.data.isOngoing ? { fill: 'url(#ongoingGradient)'} : {}}
                        onMouseMove={(e) => {
                            const svg = e.currentTarget.ownerSVGElement;
                            if (svg) {
                                const rect = svg.getBoundingClientRect();
                                setTooltip({
                                    x: e.clientX - rect.left,
                                    y: e.clientY - rect.top,
                                    data: bar.data,
                                });
                            }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        rx="2"
                    />
                ))}
            </g>
        </svg>
        ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-10 h-[200px] bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <i className="fas fa-calendar-times text-4xl mb-3"></i>
                <p className="font-semibold text-sm">Brak zakończonych serii {viewLabels[view]}.</p>
                <p className="text-xs">Kontynuuj swoją obecną passę!</p>
            </div>
        )}
      {tooltip && (
          <div
            className="absolute p-2.5 text-sm text-left text-white bg-slate-800 rounded-md shadow-lg pointer-events-none transition-transform duration-100"
            style={{ 
                left: `${tooltip.x}px`, 
                top: `${tooltip.y}px`,
                transform: `translate(-50%, -110%)`,
                minWidth: '150px',
             }}
          >
            <p className="font-bold text-base">{tooltip.data.length} {tooltip.data.length === 1 ? 'dzień' : (tooltip.data.length > 1 && tooltip.data.length < 5 ? 'dni' : 'dni')}</p>
            <p className="text-xs text-slate-300 whitespace-nowrap">
                {formatDate(tooltip.data.startDate)} - {tooltip.data.isOngoing ? 'teraz' : formatDate(tooltip.data.endDate)}
            </p>
            {tooltip.data.isOngoing && <p className="mt-1 text-xs uppercase font-bold text-teal-400">Trwa</p>}
          </div>
        )}
    </div>
  );
};

export default ProgressChart;