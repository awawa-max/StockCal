
import React from 'react';
import { EarningsEvent } from '../types';

interface EarningsCardProps {
  event: EarningsEvent;
  isFollowing: boolean;
  onToggleFollow: (ticker: string) => void;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ event, isFollowing, onToggleFollow }) => {
  const isBMO = event.time === 'BMO';
  const isAMC = event.time === 'AMC';

  return (
    <div className={`bg-slate-800/50 border rounded-xl p-4 flex items-center justify-between hover:bg-slate-800 transition-all duration-200 group ${isFollowing ? 'border-emerald-500/30 bg-emerald-900/5' : 'border-slate-700'}`}>
      <div className="flex items-center gap-4">
        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border transition-colors ${
            isFollowing ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400' : 'bg-slate-700 border-slate-600 text-white group-hover:border-emerald-500/50'
        }`}>
          {event.ticker.slice(0, 4)}
          {isFollowing && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            {event.ticker}
          </h3>
          <p className="text-sm text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">
            {event.companyName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isBMO ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    isAMC ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    'bg-slate-600/10 text-slate-400 border border-slate-600/20'
                }`}>
                    {event.time}
                </span>
            </div>
            <p className="text-xs text-slate-500">Est. EPS: <span className="text-slate-300">{event.estimate}</span></p>
        </div>

        <button 
            onClick={() => onToggleFollow(event.ticker)}
            className={`p-2 rounded-full transition-all ${
                isFollowing 
                ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-400' 
                : 'bg-slate-700 text-slate-400 hover:text-emerald-400 hover:bg-slate-600'
            }`}
            title={isFollowing ? "Unfollow" : "Get Notifications"}
        >
            {isFollowing ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            )}
        </button>
      </div>
    </div>
  );
};

export default EarningsCard;
