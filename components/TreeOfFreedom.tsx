import React, { useState, useEffect } from 'react';

interface TreeOfFreedomProps {
  streak: number;
}

const colorPalettes = {
  spring: {
    seed: '#A0522D', sprout: '#006400', ground: '#8B4513',
    trunk: '#8B4513', leaves1: '#6B8E23', leaves2: '#9ACD32',
    trunkMedium: '#8B4513', leavesMedium1: '#556B2F', leavesMedium2: '#6B8E23',
    trunkLarge: '#8B4513', trunkLargeBranch: '#8B4513', leavesLarge1: '#228B22', leavesLarge2: '#32CD32', leavesLarge3: '#ADFF2F',
    trunkMature: '#664229', fruit: '#FF6347',
  },
  autumn: {
    seed: '#A0522D', sprout: '#DAA520', ground: '#8B4513',
    trunk: '#8B4513', leaves1: '#D2691E', leaves2: '#FF7F50',
    trunkMedium: '#8B4513', leavesMedium1: '#CD853F', leavesMedium2: '#D2691E',
    trunkLarge: '#8B4513', trunkLargeBranch: '#8B4513', leavesLarge1: '#D2691E', leavesLarge2: '#FF7F50', leavesLarge3: '#FFD700',
    trunkMature: '#664229', fruit: '#DC143C',
  },
  magic: {
    seed: '#483D8B', sprout: '#00FFFF', ground: '#2F255A',
    trunk: '#483D8B', leaves1: '#8A2BE2', leaves2: '#9932CC',
    trunkMedium: '#483D8B', leavesMedium1: '#9400D3', leavesMedium2: '#8A2BE2',
    trunkLarge: '#483D8B', trunkLargeBranch: '#483D8B', leavesLarge1: '#8A2BE2', leavesLarge2: '#9932CC', leavesLarge3: '#BA55D3',
    trunkMature: '#2F255A', fruit: '#00FFFF',
  },
};

type ColorTheme = keyof typeof colorPalettes;
type Colors = typeof colorPalettes[ColorTheme];

interface TreeStageProps {
  colors: Colors;
}

const TreeStage0: React.FC<TreeStageProps> = ({ colors }) => (
  <svg viewBox="0 0 100 100" className="w-full h-auto" aria-label="Nasiono">
    <path d={`M50 85 A 10 5 0 0 1 50 95 A 10 5 0 0 1 50 85`} fill={colors.seed} />
    <path d="M50 85 Q 55 75 60 80" stroke={colors.sprout} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M48 97 H 52" stroke={colors.ground} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TreeStage1: React.FC<TreeStageProps> = ({ colors }) => (
  <svg viewBox="0 0 100 100" className="w-full h-auto" aria-label="Mała sadzonka">
    <path d="M50 90 V 60" stroke={colors.trunk} strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="45" cy="60" rx="12" ry="8" fill={colors.leaves1} transform="rotate(-30 45 60)" />
    <ellipse cx="55" cy="60" rx="12" ry="8" fill={colors.leaves2} transform="rotate(30 55 60)" />
  </svg>
);

const TreeStage2: React.FC<TreeStageProps> = ({ colors }) => (
  <svg viewBox="0 0 100 100" className="w-full h-auto" aria-label="Młode drzewo">
    <path d="M50 90 V 40" stroke={colors.trunkMedium} strokeWidth="6" strokeLinecap="round"/>
    <path d="M50 70 L 35 55" stroke={colors.trunkMedium} strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 75 L 65 60" stroke={colors.trunkMedium} strokeWidth="4" strokeLinecap="round"/>
    <circle cx="50" cy="35" r="20" fill={colors.leavesMedium1}/>
    <circle cx="35" cy="48" r="15" fill={colors.leavesMedium2}/>
    <circle cx="65" cy="53" r="15" fill={colors.leavesMedium2}/>
  </svg>
);

const TreeStage3: React.FC<TreeStageProps> = ({ colors }) => (
  <svg viewBox="0 0 100 100" className="w-full h-auto" aria-label="Duże drzewo">
    <style>{`
      .canopy {
        animation: sway 7s ease-in-out infinite alternate;
        transform-origin: 50px 85px;
        will-change: transform;
      }
      @keyframes sway {
        from { transform: rotate(-1.5deg); }
        to { transform: rotate(1.5deg); }
      }
    `}</style>
    <path d="M50 90 V 30" stroke={colors.trunkLarge} strokeWidth="8" strokeLinecap="round"/>
    <path d="M50 70 L 30 50" stroke={colors.trunkLargeBranch} strokeWidth="5" strokeLinecap="round"/>
    <path d="M50 75 L 70 55" stroke={colors.trunkLargeBranch} strokeWidth="5" strokeLinecap="round"/>
    <path d="M50 50 L 65 40" stroke={colors.trunkLargeBranch} strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 55 L 35 45" stroke={colors.trunkLargeBranch} strokeWidth="4" strokeLinecap="round"/>
    <g className="canopy">
      <circle cx="50" cy="25" r="25" fill={colors.leavesLarge1}/>
      <circle cx="30" cy="40" r="20" fill={colors.leavesLarge2}/>
      <circle cx="70" cy="45" r="20" fill={colors.leavesLarge2}/>
      <circle cx="50" cy="40" r="18" fill={colors.leavesLarge3} opacity="0.7"/>
    </g>
  </svg>
);

const TreeStage4: React.FC<TreeStageProps> = ({ colors }) => (
  <svg viewBox="0 0 100 100" className="w-full h-auto" aria-label="Dojrzałe drzewo z owocami">
    <style>{`
      .canopy {
        animation: sway 7s ease-in-out infinite alternate;
        transform-origin: 50px 90px;
        will-change: transform;
      }
      @keyframes sway {
        from { transform: rotate(-1.5deg); }
        to { transform: rotate(1.5deg); }
      }
      .fruit {
        animation: pulse-glow ease-in-out infinite alternate;
        will-change: transform, opacity;
      }
      @keyframes pulse-glow {
        from { transform: scale(1); opacity: 0.8; }
        to { transform: scale(1.05); opacity: 1; }
      }
    `}</style>
    <path d="M50 95 V 25" stroke={colors.trunkMature} strokeWidth="12" strokeLinecap="round"/>
    <path d="M50 75 L 25 50" stroke={colors.trunkMature} strokeWidth="8" strokeLinecap="round"/>
    <path d="M50 80 L 75 55" stroke={colors.trunkMature} strokeWidth="8" strokeLinecap="round"/>
    <path d="M50 50 L 30 35" stroke={colors.trunkMature} strokeWidth="6" strokeLinecap="round"/>
    <path d="M50 55 L 70 40" stroke={colors.trunkMature} strokeWidth="6" strokeLinecap="round"/>
    <g className="canopy">
      <circle cx="50" cy="20" r="25" fill={colors.leavesLarge1}/>
      <circle cx="25" cy="40" r="22" fill={colors.leavesLarge2}/>
      <circle cx="75" cy="45" r="22" fill={colors.leavesLarge2}/>
      <circle cx="50" cy="35" r="20" fill={colors.leavesLarge3}/>
      <circle className="fruit" cx="30" cy="30" r="3.5" fill={colors.fruit} style={{animationDuration: '2.8s', animationDelay: '0s'}}/>
      <circle className="fruit" cx="45" cy="15" r="3.5" fill={colors.fruit} style={{animationDuration: '3.5s', animationDelay: '0.5s'}}/>
      <circle className="fruit" cx="60" cy="25" r="3.5" fill={colors.fruit} style={{animationDuration: '3.2s', animationDelay: '1s'}}/>
      <circle className="fruit" cx="70" cy="50" r="3.5" fill={colors.fruit} style={{animationDuration: '4s', animationDelay: '1.5s'}}/>
      <circle className="fruit" cx="20" cy="50" r="3.5" fill={colors.fruit} style={{animationDuration: '3.0s', animationDelay: '2s'}}/>
      <circle className="fruit" cx="80" cy="40" r="3.5" fill={colors.fruit} style={{animationDuration: '3.7s', animationDelay: '2.5s'}}/>
    </g>
  </svg>
);

const Stars: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
    <defs>
        <radialGradient id="star-gradient">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)"></stop>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"></stop>
        </radialGradient>
        <style>{`
            @keyframes twinkle {
                0% { opacity: 0.2; }
                50% { opacity: 1; }
                100% { opacity: 0.2; }
            }
            .star { animation: twinkle 3s infinite ease-in-out; }
        `}</style>
    </defs>
    {Array.from({ length: 30 }).map((_, i) => {
        const cx = Math.random() * 100;
        const cy = Math.random() * 80; // Avoid stars on the ground
        const r = Math.random() * 0.7 + 0.3;
        const delay = Math.random() * 3;
        return <circle key={i} className="star" cx={`${cx}%`} cy={`${cy}%`} r={`${r}%`} fill="url(#star-gradient)" style={{ animationDelay: `${delay}s` }} />;
    })}
  </svg>
);

const TreeOfFreedom: React.FC<TreeOfFreedomProps> = ({ streak }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('spring');

  useEffect(() => {
    try {
      const savedColorTheme = localStorage.getItem('treeColorTheme') as ColorTheme;
      if (savedColorTheme && colorPalettes[savedColorTheme]) {
        setColorTheme(savedColorTheme);
      }
    } catch (error) {
      console.error("Failed to load tree preferences from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('treeColorTheme', colorTheme);
    } catch (error) {
      console.error("Failed to save tree preferences to localStorage", error);
    }
  }, [colorTheme]);

  const currentColors = colorPalettes[colorTheme];

  const getTreeStage = () => {
    if (streak >= 90) return <TreeStage4 colors={currentColors} />;
    if (streak >= 30) return <TreeStage3 colors={currentColors} />;
    if (streak >= 7) return <TreeStage2 colors={currentColors} />;
    if (streak >= 1) return <TreeStage1 colors={currentColors} />;
    return <TreeStage0 colors={currentColors} />;
  };
  
  const getStageDescription = () => {
    if (streak >= 90) return "Twoje drzewo jest dojrzałe i owocuje. Jesteś inspiracją!";
    if (streak >= 30) return "Drzewo jest silne i dobrze zakorzenione. Tak trzymaj!";
    if (streak >= 7) return "Twoje drzewo rośnie stabilnie. Widać już pierwsze gałęzie.";
    if (streak >= 1) return "Zasiane nasiono wykiełkowało. Każdy dzień to więcej siły.";
    return "Zasiej nasiono wolności. Pierwszy dzień jest najważniejszy.";
  };

  const progressToNextStage = () => {
    if (streak >= 90) return 100;
    if (streak >= 30) return (streak / 90) * 100;
    if (streak >= 7) return (streak / 30) * 100;
    if (streak >= 1) return (streak / 7) * 100;
    return 0;
  };
  
  const formatDays = (days: number) => {
    if (days === 1) return 'Dzień';
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
        return 'Dni';
    }
    return 'Dni';
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg text-center overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Drzewo Wolności</h3>
        <button 
          onClick={() => setIsPanelOpen(!isPanelOpen)} 
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          aria-label="Dostosuj wygląd drzewa"
          aria-expanded={isPanelOpen}
        >
          <i className="fas fa-palette"></i>
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPanelOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Paleta kolorów</h4>
              <div className="flex justify-center gap-3">
                {Object.keys(colorPalettes).map(theme => (
                  <button 
                    key={theme} 
                    onClick={() => setColorTheme(theme as ColorTheme)}
                    className={`w-16 h-8 rounded-lg capitalize text-xs font-bold transition-all border-2 ${colorTheme === theme ? 'ring-2 ring-offset-2 ring-teal-500 border-teal-500' : 'border-transparent'}`}
                    style={{ 
                      background: `linear-gradient(45deg, ${colorPalettes[theme as ColorTheme].leaves1}, ${colorPalettes[theme as ColorTheme].leaves2})`,
                      color: theme === 'magic' ? 'white' : 'black',
                      textShadow: theme !== 'magic' ? '0px 0px 3px white' : '0px 0px 3px black'
                    }}
                    aria-pressed={colorTheme === theme}
                  >
                    {theme === 'spring' ? 'Wiosna' : theme === 'autumn' ? 'Jesień' : 'Magia'}
                  </button>
                ))}
              </div>
            </div>
        </div>
      </div>

      <div className="relative max-w-[200px] mx-auto my-4 h-48 flex items-center justify-center rounded-xl transition-colors duration-500 bg-sky-50 dark:bg-gradient-to-b from-slate-800 to-indigo-900">
        <div className="absolute inset-0 w-full h-full opacity-0 dark:opacity-100 transition-opacity duration-500">
            <Stars />
        </div>
        <div className="relative z-10 w-full h-full">
            {getTreeStage()}
        </div>
      </div>

      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{streak} {formatDays(streak)}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 h-10">{getStageDescription()}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5" role="progressbar" aria-valuenow={progressToNextStage()} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressToNextStage()}%` }}
          ></div>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-right mt-1">Postęp do następnego etapu</p>
    </div>
  );
};

export default TreeOfFreedom;