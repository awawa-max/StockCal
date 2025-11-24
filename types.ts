
export interface EarningsEvent {
  ticker: string;
  companyName: string;
  date: string; // YYYY-MM-DD
  time: 'BMO' | 'AMC' | 'TBD'; // Before Market Open, After Market Close, To Be Determined
  estimate?: string;
  marketCap?: string;
}

export interface AppState {
  events: EarningsEvent[];
  sources: string[]; // Added to store search grounding URLs
  lastUpdated: number | null; // Timestamp
  isLoading: boolean;
  error: string | null;
}

export const CACHE_KEY = 'nasdaq_earnings_cache_v2'; // Bumped version for new structure
export const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours
