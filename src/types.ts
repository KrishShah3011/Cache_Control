export interface Team {
    id: string;
    name: string;
    isAdmin: boolean;
    score: number;
    avatarUrl?: string; // Placeholder for potential avatar
    color: string; // Hex color for the team
}

export interface CacheEntry {
    team: Team;
    lastAccessed: number; // Timestamp for LRU
    accessCount: number; // Counter for LFU
    enteredAt: number; // Timestamp for FIFO
}

export type CacheType = 'LRU' | 'LFU' | 'FIFO';

export interface LogEvent {
    id: string;
    timestamp: number;
    message: string;
    type: 'entry' | 'eviction' | 'hit' | 'admin_action' | 'info';
    cacheType?: CacheType;
    teamName?: string;
}

export interface CacheState {
    lru: CacheEntry[];
    lfu: CacheEntry[];
    fifo: CacheEntry[];
    logs: LogEvent[];
    leaderboard: Team[];
}

export interface CacheAction {
    type: 'ACCESS_TEAM' | 'ADD_TEAM' | 'CLEAR_LOGS';
    payload: {
        team?: Team;
        cacheType?: CacheType; // If we want to target a specific cache, otherwise we might simulate all? 
        // The prompt implies 3 separate caches acting somewhat independently but perhaps fed by a global stream?
        // "Three distinct cache containers... logic governing team entry and eviction... simulate Adaptive LRU, Segmented LFU, and FIFO"
        // implies we might just be feeding "Teams" into these caches. 
        // Let's assume a global stream of "Team Hits" updates all caches or we specifically add to one.
        // For "Competiton Dashboard", usually teams are competing. 
        // Let's assume 'ACCESS_TEAM' implies a team did something and tries to stay in the caches.
    };
}
