import { useState, useEffect, useCallback, useRef } from 'react';
import { Team, CacheEntry, LogEvent, CacheType } from '../types';

const CACHE_SIZE = 6;
const TEAMS_COUNT = 20;

// Generate dummy teams
const TEAMS: Team[] = Array.from({ length: TEAMS_COUNT }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Team ${i + 1}`,
    isAdmin: i === 0, // Team 1 is admin
    score: Math.floor(Math.random() * 1000),
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
}));

export const useCacheSimulation = () => {
    const [lru, setLru] = useState<CacheEntry[]>([]);
    const [lfu, setLfu] = useState<CacheEntry[]>([]);
    const [fifo, setFifo] = useState<CacheEntry[]>([]);
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [leaderboard, setLeaderboard] = useState<Team[]>(TEAMS);

    const addLog = useCallback((message: string, type: LogEvent['type'], cacheType?: CacheType, teamName?: string) => {
        setLogs(prev => {
            const newLog: LogEvent = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                message,
                type,
                cacheType,
                teamName,
            };
            return [newLog, ...prev].slice(0, 50); // Keep last 50 logs
        });
    }, []);

    const updateLRU = useCallback((team: Team) => {
        setLru(prev => {
            const existingIndex = prev.findIndex(item => item.team.id === team.id);
            let newCache = [...prev];

            if (existingIndex !== -1) {
                // Hit: Move to front
                const [entry] = newCache.splice(existingIndex, 1);
                entry.lastAccessed = Date.now();
                newCache.unshift(entry);
                addLog(`${team.name} hit in Sector Alpha`, 'hit', 'LRU', team.name);
            } else {
                // Miss: Add to front
                const newEntry: CacheEntry = {
                    team,
                    lastAccessed: Date.now(),
                    accessCount: 1,
                    enteredAt: Date.now()
                };
                newCache.unshift(newEntry);
                addLog(`${team.name} added to Sector Alpha`, 'entry', 'LRU', team.name);

                if (newCache.length > CACHE_SIZE) {
                    const evicted = newCache.pop();
                    if (evicted) addLog(`${evicted.team.name} evicted from Sector Alpha`, 'eviction', 'LRU', evicted.team.name);
                }
            }
            return newCache;
        });
    }, [addLog]);

    const updateLFU = useCallback((team: Team) => {
        setLfu(prev => {
            const existingIndex = prev.findIndex(item => item.team.id === team.id);
            let newCache = [...prev];

            if (existingIndex !== -1) {
                // Hit: Increment count and re-sort
                newCache[existingIndex] = {
                    ...newCache[existingIndex],
                    accessCount: newCache[existingIndex].accessCount + 1,
                    lastAccessed: Date.now()
                };
                addLog(`${team.name} hit in Sector Beta (freq: ${newCache[existingIndex].accessCount})`, 'hit', 'LFU', team.name);
            } else {
                // Miss: Add new entry
                const newEntry: CacheEntry = {
                    team,
                    lastAccessed: Date.now(),
                    accessCount: 1,
                    enteredAt: Date.now()
                };
                newCache.push(newEntry);
                addLog(`${team.name} added to Sector Beta`, 'entry', 'LFU', team.name);
            }

            // Sort by Frequency (desc), then Recency (desc)
            newCache.sort((a, b) => {
                if (a.accessCount === b.accessCount) {
                    return b.lastAccessed - a.lastAccessed;
                }
                return b.accessCount - a.accessCount;
            });

            if (newCache.length > CACHE_SIZE) {
                // In LFU, we usually evict the LEAST frequent. 
                // Our sort puts MOST frequent at top (0). So LEAST frequent is at end.
                const evicted = newCache.pop();
                if (evicted) addLog(`${evicted.team.name} evicted from Sector Beta`, 'eviction', 'LFU', evicted.team.name);
            }

            return newCache;
        });
    }, [addLog]);

    const updateFIFO = useCallback((team: Team) => {
        setFifo(prev => {
            if (prev.some(item => item.team.id === team.id)) {
                // FIFO doesn't change order on access usually, just maybe a 'hit' log?
                // But if strict FIFO Queue, accessing doesn't change position.
                addLog(`${team.name} hit in Sector Gamma`, 'hit', 'FIFO', team.name);
                return prev;
            }

            const newEntry: CacheEntry = {
                team,
                lastAccessed: Date.now(),
                accessCount: 1,
                enteredAt: Date.now()
            };

            // Add to END (Limit size by removing from FRONT)
            // Actually standard queue: Add to rear, remove from front.
            // Visuals: If we render Top=Front, we should Unshift to add? 
            // Let's assume list order: [0] is First In (Oldest). 
            // So detailed: Push to end. Evict [0] if full.

            const newCache = [...prev, newEntry];
            addLog(`${team.name} added to Sector Gamma`, 'entry', 'FIFO', team.name);

            if (newCache.length > CACHE_SIZE) {
                const evicted = newCache.shift();
                if (evicted) addLog(`${evicted.team.name} evicted from Sector Gamma`, 'eviction', 'FIFO', evicted.team.name);
            }
            return newCache;
        });
    }, [addLog]);

    const accessTeam = useCallback((teamId: string) => {
        const team = TEAMS.find(t => t.id === teamId);
        if (!team) return;

        // Simulate access in all 3 caches simultaneously for this 'Competition'
        updateLRU(team);
        updateLFU(team);
        updateFIFO(team);

        // Update Leaderboard score randomly
        setLeaderboard(prev => {
            return prev.map(t => t.id === teamId ? { ...t, score: t.score + 10 } : t)
                .sort((a, b) => b.score - a.score);
        })

    }, [updateLRU, updateLFU, updateFIFO]);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const randomTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];
            accessTeam(randomTeam.id);
        }, 2000); // Operation every 2 seconds

        return () => clearInterval(interval);
    }, [accessTeam]);

    return { lru, lfu, fifo, logs, leaderboard, teams: TEAMS };
};
