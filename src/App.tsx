import React from 'react';
import { Header } from './components/Header';
import { CacheContainer } from './components/CacheContainer';
import { Footer } from './components/Footer';
import { useCacheSimulation } from './hooks/useCacheSimulation';

function App() {
    const { lru, lfu, fifo, logs, leaderboard } = useCacheSimulation();

    return (
        <div className="w-full h-screen flex flex-col bg-slate-950 text-white overflow-hidden font-sans">
            <Header leaderboard={leaderboard} />

            <main className="flex-1 flex flex-col overflow-y-auto p-6 gap-6 min-h-0 relative z-0">
                <div className="flex-1 max-w-7xl w-full flex flex-col gap-6 min-h-[400px]">
                    <CacheContainer
                        title="Sector Alpha"
                        type="LRU"
                        entries={lru}
                        color="text-blue-400"
                    />
                    <CacheContainer
                        title="Sector Beta"
                        type="LFU"
                        entries={lfu}
                        color="text-purple-400"
                    />
                    <CacheContainer
                        title="Sector Gamma"
                        type="FIFO"
                        entries={fifo}
                        color="text-emerald-400"
                    />
                </div>
            </main>

            <Footer logs={logs} />
        </div>
    );
}

export default App;
