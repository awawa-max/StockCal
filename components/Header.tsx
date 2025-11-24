
import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: number | null;
  totalEvents: number;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onRefresh, 
    isLoading, 
    lastUpdated, 
    totalEvents,
    currentView,
    onViewChange
}) => {
  const formattedDate = lastUpdated 
    ? new Date(lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : 'Never';

  const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { 
        id: 'list', 
        label: 'Feed', 
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    },
    { 
        id: 'calendar', 
        label: 'Calendar', 
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
        id: 'analytics', 
        label: 'Trends', 
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
  ];

  return (
    <header className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 pb-2 pt-6 px-4 mb-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                MarketPulse AI
            </h1>
            <p className="text-slate-400 text-sm">Nasdaq Earnings • {totalEvents} Upcoming</p>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isLoading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20'
                    }`}
                >
                    {isLoading ? 'Scanning...' : 'Refresh Data'}
                </button>
                <p className="text-[10px] text-slate-600 hidden sm:block">
                    Updated: {formattedDate}
                </p>
            </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
            {views.map((view) => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                        currentView === view.id
                        ? 'bg-slate-800 text-slate-100 shadow-sm'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                >
                    {view.icon}
                    {view.label}
                </button>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
