import React, { useEffect, useRef } from 'react';
import { LogEvent } from '../types';
import { Terminal } from 'lucide-react';

interface FooterProps {
    logs: LogEvent[];
}

export const Footer: React.FC<FooterProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState(192); // Default h-48 (12rem * 16px = 192px)
    const isDragging = useRef(false);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            // Calculate new height: Window Height - Mouse Y
            // But since footer is at bottom, it's easier to just calculate delta or use window.innerHeight
            // Actually, `e.clientY` is position from top.
            // Footer top position = window.innerHeight - height.
            // So: newHeight = window.innerHeight - e.clientY;

            const newHeight = window.innerHeight - e.clientY;
            // Limit height
            const clampedHeight = Math.max(100, Math.min(newHeight, 600));
            setHeight(clampedHeight);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const startDrag = (e: React.MouseEvent) => {
        isDragging.current = true;
        document.body.style.cursor = 'ns-resize';
        e.preventDefault(); // Prevent text selection
    };

    return (
        <footer
            className="border-t border-slate-800 bg-slate-950 shrink-0 flex flex-col z-20 relative transition-none"
            style={{ height: `${height}px` }}
        >
            {/* Drag Handle */}
            <div
                className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-blue-500/50 z-50 group flex items-center justify-center -translate-y-1/2"
                onMouseDown={startDrag}
            >
                <div className="w-12 h-1 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors" />
            </div>

            <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2 shrink-0">
                <Terminal size={14} className="text-green-500" />
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">System Logs</span>
                <span className="ml-auto text-[10px] text-slate-600">
                    {height}px
                </span>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar bg-slate-950/50">
                <div className="flex flex-col gap-1">
                    {logs.slice().reverse().map((log) => (
                        <div key={log.id} className="flex items-start gap-4 hover:bg-slate-900/50 p-0.5 rounded px-2 transition-colors">
                            <span className="text-slate-600 shrink-0 select-none">
                                {(() => {
                                    const d = new Date(log.timestamp);
                                    return `${d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${d.getMilliseconds().toString().padStart(3, '0')}`;
                                })()}
                            </span>
                            <div className="flex items-center gap-2">
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
