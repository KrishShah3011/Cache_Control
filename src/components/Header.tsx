import React from 'react';
import { motion } from 'framer-motion';
import { Team } from '../types';
import { Trophy, Star } from 'lucide-react';

interface HeaderProps {
    leaderboard: Team[];
}

export const Header: React.FC<HeaderProps> = ({ leaderboard }) => {
    const top5 = leaderboard.slice(0, 5);
    const rest = leaderboard.slice(5);

    return (
        <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center px-6 shrink-0 overflow-hidden relative z-10 shadow-lg shadow-black/20">
            <div className="flex items-center gap-4 mr-8 shrink-0">
                <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    CACHE<span className="text-white">CONTROL</span>
                </h1>
            </div>

            {/* Top 5 Static */}
            <div className="flex items-center gap-4 border-r border-slate-800 pr-8 mr-8 shrink-0">
                {top5.map((team, index) => (
                    <div key={team.id} className="flex items-center gap-2 relative group">
                        <div className={`
              text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center
              ${index === 0 ? 'bg-yellow-500 text-black' :
                                index === 1 ? 'bg-slate-300 text-black' :
                                    index === 2 ? 'bg-amber-600 text-black' : 'bg-slate-800 text-slate-400'}
            `}>
                            {index + 1}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${index === 0 ? 'text-yellow-400' : 'text-slate-200'}`}>
                                {team.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                {team.score.toLocaleString()} pts
                            </span>
                        </div>
                        {team.isAdmin && <Star size={10} className="text-yellow-400 ml-1" fill="currentColor" />}
                    </div>
                ))}
            </div>

            {/* Ticker for the rest */}
            <div className="flex-1 overflow-hidden relative mask-linear-fade">
                <motion.div
                    className="flex items-center gap-8 whitespace-nowrap"
                    animate={{ x: [0, -100 * rest.length] }}
                    transition={{
                        ease: "linear",
                        duration: rest.length * 2, // Adjust speed based on length
                        repeat: Infinity
                    }}
                >
                    {[...rest, ...rest].map((team, i) => ( // Duplicate for seamless loop
                        <div key={`${team.id}-${i}`} className="flex items-center gap-2 text-slate-400 opacity-70">
                            <span className="font-mono text-xs text-slate-600">#{leaderboard.indexOf(team) + 1}</span>
                            <span className="text-sm font-medium">{team.name}</span>
                            <span className="text-xs text-slate-600 border-l border-slate-800 pl-2 ml-1">{team.score}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />
            </div>
        </header>
    );
};
