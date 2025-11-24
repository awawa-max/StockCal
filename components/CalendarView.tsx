
import React, { useState } from 'react';
import { EarningsEvent } from '../types';
import EarningsCard from './EarningsCard';

interface CalendarViewProps {
  events: EarningsEvent[];
  followedTickers: string[];
  onToggleFollow: (ticker: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, followedTickers, onToggleFollow }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, EarningsEvent[]>);

  // Calendar generation logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayIndex = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create array for grid cells (padding + days)
  const days = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - startingDayIndex + 1;
    if (dayNumber < 1) {
        // Previous month days (simplified logic, usually just leave empty or dimmed)
        return null;
    }
    if (dayNumber > daysInMonth) {
        // Next month days
        const nextMonthDate = new Date(year, month + 1, dayNumber - daysInMonth);
        return { 
            date: nextMonthDate, 
            dayStr: nextMonthDate.toISOString().split('T')[0],
            isCurrentMonth: false 
        };
    }
    
    const currentDate = new Date(year, month, dayNumber);
    // Adjust for timezone offset for accurate YYYY-MM-DD
    const offset = currentDate.getTimezoneOffset();
    const localDate = new Date(currentDate.getTime() - (offset*60*1000));
    const dayStr = localDate.toISOString().split('T')[0];

    return { 
        date: localDate, 
        dayStr: dayStr,
        isCurrentMonth: true 
    };
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((dayObj, idx) => {
            if (!dayObj) return <div key={idx} className="bg-slate-950/50 border-b border-r border-slate-800 min-h-[100px]" />;

            const dayEvents = eventsByDate[dayObj.dayStr] || [];
            const isToday = new Date().toISOString().split('T')[0] === dayObj.dayStr;
            const hasFollowed = dayEvents.some(e => followedTickers.includes(e.ticker));

            return (
              <div 
                key={dayObj.dayStr} 
                onClick={() => setSelectedDate(dayObj.dayStr)}
                className={`min-h-[100px] border-b border-r border-slate-800 p-2 cursor-pointer transition-colors relative
                    ${dayObj.isCurrentMonth ? 'bg-slate-900/30' : 'bg-slate-950/50'}
                    ${selectedDate === dayObj.dayStr ? 'bg-slate-800' : 'hover:bg-slate-800/50'}
                `}
              >
                <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>
                        {dayObj.date.getDate()}
                    </span>
                    {hasFollowed && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </div>

                <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map((ev, i) => (
                        <div key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded truncate border border-slate-700">
                            {ev.ticker}
                        </div>
                    ))}
                    {dayEvents.length > 3 && (
                        <div className="text-[10px] text-slate-500 text-center">+ {dayEvents.length - 3} more</div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail View */}
      {selectedDate && eventsByDate[selectedDate] && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                Events for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                <span className="text-sm font-normal text-slate-500 ml-auto">{eventsByDate[selectedDate].length} Companies</span>
            </h3>
            <div className="space-y-3">
                {eventsByDate[selectedDate].map(event => (
                    <EarningsCard 
                        key={event.ticker} 
                        event={event} 
                        isFollowing={followedTickers.includes(event.ticker)}
                        onToggleFollow={onToggleFollow}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
