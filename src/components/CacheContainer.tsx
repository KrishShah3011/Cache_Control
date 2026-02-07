import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CacheEntry, Team } from '../types';
import { Star, Database, Clock, Activity, ArrowRight } from 'lucide-react';

interface CacheContainerProps {
    title: string;
    type: 'LRU' | 'LFU' | 'FIFO';
    entries: CacheEntry[];
    color: string;
}

export const CacheContainer: React.FC<CacheContainerProps> = ({ title, type, entries, color }) => {
    const getIcon = () => {
        switch (type) {
            case 'LRU': return <Clock className="w-5 h-5" />;
            case 'LFU': return <Activity className="w-5 h-5" />;
            case 'FIFO': return <ArrowRight className="w-5 h-5" />;
            default: return <Database className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-slate-800/50 backdrop-blur-sm overflow-hidden shadow-xl">
            <div className={`p-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/80 z-10 backdrop-blur-md`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-opacity-20 ${color.replace('text-', 'bg-')} ${color}`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h2 className={`font-bold text-lg ${color}`}>{title}</h2>
                    </div>
                </div>
                <div className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-400">
                    {entries.length}/6
                </div>
            </div>

            <div className="flex-1 p-4 relative grid grid-rows-6 gap-2">
                <AnimatePresence mode="popLayout">
                    {entries.map((entry) => (
                        <motion.div
                            key={entry.team.id}
                            layout
                            initial={{ opacity: 0, scale: 0.5, filter: "brightness(2)" }}
                            animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
                            exit={{ opacity: 0, scale: 0.5, filter: "brightness(0.5)", transition: { duration: 0.3 } }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`
                                group relative flex items-center gap-3 px-4 rounded-xl w-full h-full
                                bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-${color.split('-')[1]}-500/30
                                transition-colors duration-200
                            `}
                        >
                            {/* Avatar/Color */}
                            <div
                                className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center text-sm font-black text-white/90 ring-2 ring-slate-700/50"
                                style={{ backgroundColor: entry.team.color }}
                            >
                                {entry.team.name.split(' ')[1]}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-100 text-base truncate">{entry.team.name}</span>
                                    {type === 'LFU' && (
                                        <span className="text-[10px] text-purple-400 font-mono">
                                            Freq: {entry.accessCount}
                                        </span>
                                    )}
                                </div>
                                {entry.team.isAdmin && (
                                    <div className="bg-yellow-500/20 p-1.5 rounded-full">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {/* Status Indicator */}
                            <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty Placeholders to maintain grid if < 6 */}
                {Array.from({ length: Math.max(0, 6 - entries.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-2 border-dashed border-slate-800/50 rounded-xl flex items-center justify-center opacity-30">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                    </div>
                ))}
            </div>
        </div>
    );
};
