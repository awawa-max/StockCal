
export interface EarningsEvent {
  ticker: string;
  companyName: string;
  date: string; // YYYY-MM-DD
  time: 'BMO' | 'AMC' | 'TBD'; // Before Market Open, After Market Close, To Be Determined
  estimate?: string;
  marketCap?: string;
}

export interface FollowedStock {
  ticker: string;
  notifyOnDay: boolean;
  notifyOneDayBefore: boolean;
}

export type ViewMode = 'list' | 'calendar' | 'analytics';

export interface AppState {
  events: EarningsEvent[];
  sources: string[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
  followedStocks: FollowedStock[];
  currentView: ViewMode;
}

export const CACHE_KEY = 'nasdaq_earnings_cache_v3'; // Bumped version
export const SETTINGS_KEY = 'nasdaq_earnings_settings_v1';
export const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours
