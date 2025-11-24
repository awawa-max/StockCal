import React from 'react';
import { EarningsEvent } from '../types';

interface EarningsCardProps {
  event: EarningsEvent;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ event }) => {
  const isBMO = event.time === 'BMO';
  const isAMC = event.time === 'AMC';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800 transition-colors duration-200 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm border border-slate-600 group-hover:border-emerald-500/50 transition-colors">
          {event.ticker.slice(0, 4)}
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-100">{event.ticker}</h3>
          <p className="text-sm text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">
            {event.companyName}
          </p>
        </div>
      </div>

      <div className="text-right">
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
    </div>
  );
};

export default EarningsCard;