
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EarningsEvent, AppState, CACHE_KEY, CACHE_DURATION_MS } from './types';
import { fetchEarningsData } from './services/geminiService';
import Header from './components/Header';
import EarningsCard from './components/EarningsCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    events: [],
    sources: [],
    lastUpdated: null,
    isLoading: true, // Start loading to check cache immediately
    error: null,
  });

  // Helper to save to local storage
  const persistData = (events: EarningsEvent[], sources: string[], timestamp: number) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ events, sources, lastUpdated: timestamp }));
  };

  const loadData = useCallback(async (forceRefresh = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 1. Check Cache first (unless forced)
      if (!forceRefresh) {
        const cachedString = localStorage.getItem(CACHE_KEY);
        if (cachedString) {
          const { events, sources, lastUpdated } = JSON.parse(cachedString);
          const now = Date.now();
          
          // Check if cache is valid (less than 12 hours old)
          if (now - lastUpdated < CACHE_DURATION_MS) {
            console.log("Loading from cache");
            setState({
              events,
              sources: sources || [],
              lastUpdated,
              isLoading: false,
              error: null
            });
            return;
          }
        }
      }

      // 2. Fetch from API if cache invalid or forced
      console.log("Fetching fresh data from Gemini...");
      const { events: newEvents, sources: newSources } = await fetchEarningsData();
      const newTimestamp = Date.now();
      
      persistData(newEvents, newSources, newTimestamp);
      
      setState({
        events: newEvents,
        sources: newSources,
        lastUpdated: newTimestamp,
        isLoading: false,
        error: null
      });

    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to load earnings data."
      }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Group events by date
  // Explicitly typing the result prevents 'unknown' type inference on Object.entries(groupedEvents).map
  const groupedEvents: { [key: string]: EarningsEvent[] } = useMemo(() => {
    const groups: { [key: string]: EarningsEvent[] } = {};
    state.events.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });
    
    // Sort dates
    return Object.keys(groups).sort().reduce((obj, key) => {
      obj[key] = groups[key];
      return obj;
    }, {} as { [key: string]: EarningsEvent[] });
  }, [state.events]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      
      <Header 
        onRefresh={() => loadData(true)} 
        isLoading={state.isLoading}
        lastUpdated={state.lastUpdated}
        totalEvents={state.events.length}
      />

      <main className="max-w-3xl mx-auto px-4 pb-20">
        
        {/* Error State */}
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">
            <p>{state.error}</p>
            <button 
              onClick={() => loadData(true)}
              className="mt-2 text-sm underline hover:text-red-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State / Initial Loading without cache */}
        {state.isLoading && state.events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
            <div className="w-16 h-16 bg-slate-800 rounded-full mb-4"></div>
            <p>Analyzing Nasdaq Calendar...</p>
          </div>
        )}

        {/* Content */}
        {!state.isLoading && state.events.length === 0 && !state.error && (
             <div className="text-center py-20 text-slate-500">
                <p>No major earnings found for the next 30 days.</p>
             </div>
        )}

        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, events]) => {
            const dateObj = new Date(date);
            const isToday = new Date().toISOString().split('T')[0] === date;
            
            return (
              <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-baseline gap-3 mb-4 border-b border-slate-800 pb-2">
                  <h2 className={`text-xl font-bold ${isToday ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h2>
                  <span className="text-slate-500 font-mono text-sm">
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {events.map((event, idx) => (
                    <EarningsCard key={`${event.ticker}-${idx}`} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      {/* Footer Info */}
      <footer className="text-center py-8 text-slate-600 text-xs">
        <p>Data provided via AI analysis of public calendar sources.</p>
        <p className="mt-1">Not financial advice. Dates are subject to change.</p>
        {state.sources && state.sources.length > 0 && (
          <div className="mt-4 max-w-2xl mx-auto px-4">
             <p className="font-semibold mb-2">Sources:</p>
             <div className="flex flex-wrap justify-center gap-2">
                {state.sources.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline truncate max-w-[200px]">
                        {new URL(src).hostname}
                    </a>
                ))}
             </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
