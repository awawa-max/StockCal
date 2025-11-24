
import React from 'react';
import { EarningsEvent } from '../types';

interface AnalyticsViewProps {
  events: EarningsEvent[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ events }) => {
  // Stats calculation
  const totalEvents = events.length;
  const bmoCount = events.filter(e => e.time === 'BMO').length;
  const amcCount = events.filter(e => e.time === 'AMC').length;
  const tbdCount = events.filter(e => e.time === 'TBD').length;

  // Group by date for chart
  const dateCounts: Record<string, number> = {};
  events.forEach(e => {
    dateCounts[e.date] = (dateCounts[e.date] || 0) + 1;
  });
  
  // Sort dates and take top 14 (2 weeks) or full month for the chart
  const sortedDates = Object.keys(dateCounts).sort();
  const maxCount = Math.max(...Object.values(dateCounts), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Before Open</p>
                <p className="text-2xl font-bold text-yellow-500 mt-1">{bmoCount}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">After Close</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">{amcCount}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{totalEvents}</p>
            </div>
        </div>

        {/* Frequency Bar Chart */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Upcoming Reporting Frequency</h3>
            
            <div className="flex items-end justify-between h-48 gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {sortedDates.map(date => {
                    const count = dateCounts[date];
                    const heightPercent = (count / maxCount) * 100;
                    const dateObj = new Date(date);
                    
                    return (
                        <div key={date} className="flex flex-col items-center flex-1 min-w-[30px] group">
                             {/* Tooltip */}
                            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-slate-900 text-white px-2 py-1 rounded absolute -mt-8 pointer-events-none whitespace-nowrap border border-slate-700 z-10">
                                {dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}: {count}
                            </div>
                            
                            <div 
                                className="w-full bg-emerald-500/20 hover:bg-emerald-500/50 border-t border-x border-emerald-500/30 rounded-t transition-all duration-300 relative"
                                style={{ height: `${heightPercent}%` }}
                            >
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono hidden sm:block">
                                    {count}
                                </span>
                            </div>
                            
                            <div className="mt-2 h-8 flex items-center justify-center">
                                <span className="text-[10px] text-slate-500 -rotate-45 whitespace-nowrap origin-center translate-y-2">
                                    {dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-slate-500 mt-6">
                Number of companies reporting earnings per day over the next 30 days.
            </p>
        </div>

        {/* Future Trend Note */}
        <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl flex gap-4 items-start">
             <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
             </div>
             <div>
                 <h4 className="font-bold text-slate-200 text-sm">Trend Analysis</h4>
                 <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                     Based on the current 30-day window, reporting activity peaks in mid-earnings season. 
                     Historical data analysis indicates this sector distribution aligns with quarterly tech reporting cycles.
                 </p>
             </div>
        </div>
    </div>
  );
};

export default AnalyticsView;
