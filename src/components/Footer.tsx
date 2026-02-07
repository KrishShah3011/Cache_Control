import React, { useEffect, useRef } from 'react';
import { LogEvent } from '../types';
import { Terminal } from 'lucide-react';

interface FooterProps {
    logs: LogEvent[];
}

export const Footer: React.FC<FooterProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    return (
        <footer className="h-48 border-t border-slate-800 bg-slate-950 shrink-0 flex flex-col z-20 relative">
            <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                <Terminal size={14} className="text-green-500" />
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">System Logs</span>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar bg-slate-950/50">
                <div className="flex flex-col gap-1">
                    {logs.slice().reverse().map((log) => (
                        <div key={log.id} className="flex items-start gap-4 hover:bg-slate-900/50 p-0.5 rounded px-2 transition-colors">
                            <span className="text-slate-600 shrink-0 select-none">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
                            </span>
                            <div className="flex items-center gap-2">
                                {/* Badge */}
                                { /* Cache Type Badge Removed */}

                                <span className={`
                    ${log.type === 'entry' ? 'text-green-400' :
                                        log.type === 'eviction' ? 'text-red-400' :
                                            log.type === 'hit' ? 'text-blue-300' : 'text-slate-300'}
                 `}>
                                    {log.type.toUpperCase()}
                                </span>

                                <span className="text-slate-300">
                                    {log.message.replace(log.teamName || '', '')}
                                    {log.teamName && <span className="font-bold text-white ml-1">{log.teamName}</span>}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
        </footer>
    );
};
