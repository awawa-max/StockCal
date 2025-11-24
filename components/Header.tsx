import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: number | null;
  totalEvents: number;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, lastUpdated, totalEvents }) => {
  const formattedDate = lastUpdated 
    ? new Date(lastUpdated).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : 'Never';

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 pb-4 pt-6 px-4 mb-6">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            MarketPulse AI
          </h1>
          <p className="text-slate-400 text-sm">Nasdaq Earnings Calendar • Next 30 Days</p>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">Upcoming Events</p>
                <p className="text-lg font-mono font-bold text-white">{totalEvents}</p>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
            <div className="flex flex-col items-end">
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isLoading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 active:scale-95'
                    }`}
                >
                    {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scanning...
                    </>
                    ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </>
                    )}
                </button>
                <p className="text-[10px] text-slate-500 mt-1">
                    Last updated: {formattedDate}
                </p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;