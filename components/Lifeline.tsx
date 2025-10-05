import React from 'react';

const Lifeline: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
      <div className="flex items-center mb-3">
        <i className="fas fa-life-ring text-indigo-600 dark:text-indigo-400 text-xl mr-3"></i>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Koło Ratunkowe</h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Czujesz silną pokusę? Przekieruj swoją uwagę natychmiast, zanim będzie za późno.
      </p>
      <a
        href="https://marxepan.github.io/PraktycznikV13/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full block text-center py-3 px-4 rounded-lg text-white font-bold bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <i className="fas fa-gamepad mr-2"></i>
        Zagraj w Grę
      </a>
    </div>
  );
};

export default Lifeline;