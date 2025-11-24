
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EarningsEvent, AppState, CACHE_KEY, CACHE_DURATION_MS, FollowedStock, ViewMode } from './types';
import { fetchEarningsData } from './services/geminiService';
import Header from './components/Header';
import EarningsCard from './components/EarningsCard';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';

const FOLLOWED_KEY = 'nasdaq_followed_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    events: [],
    sources: [],
    lastUpdated: null,
    isLoading: true,
    error: null,
    followedStocks: [],
    currentView: 'list',
  });

  // --- Data Persistence ---
  
  const persistData = (events: EarningsEvent[], sources: string[], timestamp: number) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ events, sources, lastUpdated: timestamp }));
  };

  const persistFollowed = (followed: FollowedStock[]) => {
    localStorage.setItem(FOLLOWED_KEY, JSON.stringify(followed));
  };

  // --- Notification Logic ---

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
  };

  const checkNotifications = useCallback((events: EarningsEvent[], followed: FollowedStock[]) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const today = new Date().toISOString().split('T')[0];
    
    // Simple helper to add days
    const addDays = (dateStr: string, days: number) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    };
    
    // Check for each followed stock
    followed.forEach(stock => {
        const event = events.find(e => e.ticker === stock.ticker);
        if (!event) return;

        // Notify on Day
        if (stock.notifyOnDay && event.date === today) {
            new Notification(`Earnings Alert: ${event.ticker}`, {
                body: `${event.ticker} (${event.companyName}) reports earnings TODAY ${event.time}.`,
                icon: '/favicon.ico' // Assuming standard favicon
            });
        }

        // Notify One Day Before
        // Logic: If Today + 1 day === Event Date
        const tomorrow = addDays(today, 1);
        if (stock.notifyOneDayBefore && event.date === tomorrow) {
             new Notification(`Upcoming Earnings: ${event.ticker}`, {
                body: `${event.ticker} reports tomorrow, ${event.date}.`,
            });
        }
    });
  }, []);

  // --- Data Loading ---

  const loadData = useCallback(async (forceRefresh = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
        // Load followed stocks first
        const savedFollowed = localStorage.getItem(FOLLOWED_KEY);
        const initialFollowed = savedFollowed ? JSON.parse(savedFollowed) : [];

      // 1. Check Cache
      if (!forceRefresh) {
        const cachedString = localStorage.getItem(CACHE_KEY);
        if (cachedString) {
          const { events, sources, lastUpdated } = JSON.parse(cachedString);
          const now = Date.now();
          
          if (now - lastUpdated < CACHE_DURATION_MS) {
            setState({
              events,
              sources: sources || [],
              lastUpdated,
              isLoading: false,
              error: null,
              followedStocks: initialFollowed,
              currentView: 'list'
            });
            // Check notifications on load
            checkNotifications(events, initialFollowed);
            return;
          }
        }
      }

      // 2. Fetch API
      const { events: newEvents, sources: newSources } = await fetchEarningsData();
      const newTimestamp = Date.now();
      
      persistData(newEvents, newSources, newTimestamp);
      
      setState(prev => {
          const newState = {
            ...prev,
            events: newEvents,
            sources: newSources,
            lastUpdated: newTimestamp,
            isLoading: false,
            error: null,
            followedStocks: initialFollowed
          };
          checkNotifications(newEvents, initialFollowed);
          return newState;
      });

    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to load earnings data."
      }));
    }
  }, [checkNotifications]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Interaction Handlers ---

  const toggleFollow = async (ticker: string) => {
    // Request permission on first follow interaction
    if (Notification.permission === "default") {
        await requestNotificationPermission();
    }

    setState(prev => {
        const exists = prev.followedStocks.find(s => s.ticker === ticker);
        let newFollowed;
        
        if (exists) {
            newFollowed = prev.followedStocks.filter(s => s.ticker !== ticker);
        } else {
            // Default settings: Notify on day and day before
            newFollowed = [...prev.followedStocks, { ticker, notifyOnDay: true, notifyOneDayBefore: true }];
        }
        
        persistFollowed(newFollowed);
        return { ...prev, followedStocks: newFollowed };
    });
  };

  const followedTickers = useMemo(() => state.followedStocks.map(s => s.ticker), [state.followedStocks]);

  // Group events for list view
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: EarningsEvent[] } = {};
    state.events.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });
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
        currentView={state.currentView}
        onViewChange={(view) => setState(prev => ({ ...prev, currentView: view }))}
      />

      <main className="max-w-3xl mx-auto px-4 pb-20">
        
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">
            <p>{state.error}</p>
            <button onClick={() => loadData(true)} className="mt-2 text-sm underline hover:text-red-300">Try Again</button>
          </div>
        )}

        {state.isLoading && state.events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
            <div className="w-16 h-16 bg-slate-800 rounded-full mb-4"></div>
            <p>Analyzing Nasdaq Calendar...</p>
          </div>
        )}

        {!state.isLoading && state.events.length === 0 && !state.error && (
             <div className="text-center py-20 text-slate-500"><p>No data available.</p></div>
        )}

        {/* --- VIEW ROUTER --- */}
        {!state.isLoading && state.events.length > 0 && (
            <>
                {state.currentView === 'list' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {Object.entries(groupedEvents).map(([date, events]) => {
                        const dateObj = new Date(date);
                        const isToday = new Date().toISOString().split('T')[0] === date;
                        
                        return (
                        <div key={date}>
                            <div className="flex items-baseline gap-3 mb-4 border-b border-slate-800 pb-2">
                            <h2 className={`text-xl font-bold ${isToday ? 'text-emerald-400' : 'text-slate-200'}`}>
                                {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                            </h2>
                            <span className="text-slate-500 font-mono text-sm">
                                {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            {isToday && <span className="ml-auto text-[10px] uppercase font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">Today</span>}
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                            {events.map((event, idx) => (
                                <EarningsCard 
                                    key={`${event.ticker}-${idx}`} 
                                    event={event} 
                                    isFollowing={followedTickers.includes(event.ticker)}
                                    onToggleFollow={toggleFollow}
                                />
                            ))}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                )}

                {state.currentView === 'calendar' && (
                    <CalendarView 
                        events={state.events} 
                        followedTickers={followedTickers}
                        onToggleFollow={toggleFollow}
                    />
                )}

                {state.currentView === 'analytics' && (
                    <AnalyticsView events={state.events} />
                )}
            </>
        )}
      </main>
      
      {/* Footer Info */}
      <footer className="text-center py-8 text-slate-600 text-xs border-t border-slate-900 mt-12">
        <p>MarketPulse AI • Powered by Gemini • Nasdaq Data</p>
        <p className="mt-2 max-w-lg mx-auto opacity-70">
            Notifications are handled via your browser. Ensure you have allowed permissions to receive alerts for followed stocks.
        </p>
        {state.sources && state.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {(state.sources as string[]).slice(0, 3).map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="text-emerald-500/50 hover:text-emerald-500 hover:underline truncate max-w-[150px]">
                        Source {i+1}
                    </a>
                ))}
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
