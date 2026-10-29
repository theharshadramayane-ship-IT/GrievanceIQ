import { useState, useEffect } from 'react';

export interface SLAState {
  remainingMs: number;
  totalMs: number;
  percentage: number;
  isOverdue: boolean;
  isWarning: boolean;
  display: string;
}

function formatDuration(ms: number): string {
  if (ms < 0) {
    const abs = Math.abs(ms);
    const h = Math.floor(abs / 3600000);
    const m = Math.floor((abs % 3600000) / 60000);
    const s = Math.floor((abs % 60000) / 1000);
    return `-${h}h ${m}m ${s}s`;
  }
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function useSLA(deadlineIso: string, totalMinutes: number): SLAState {
  const totalMs = totalMinutes * 60000;
  const [remainingMs, setRemainingMs] = useState(() => {
    return new Date(deadlineIso).getTime() - Date.now();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(new Date(deadlineIso).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  const percentage = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const isOverdue = remainingMs < 0;
  const isWarning = !isOverdue && percentage < 25;

  return {
    remainingMs,
    totalMs,
    percentage,
    isOverdue,
    isWarning,
    display: formatDuration(remainingMs),
  };
}

export function SLADisplay({ deadlineIso, totalMinutes, compact = false }: { deadlineIso: string; totalMinutes: number; compact?: boolean }) {
  const sla = useSLA(deadlineIso, totalMinutes);

  if (sla.isOverdue) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'} font-semibold text-red-600`}>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        {sla.display}
        <span className="badge bg-red-100 text-red-700 ml-1">⚠ Escalated</span>
      </div>
    );
  }

  if (sla.isWarning) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'} font-semibold text-orange-600`}>
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        {sla.display}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${compact ? 'text-xs' : 'text-sm'} font-medium text-green-600`}>
      <span className="w-2 h-2 rounded-full bg-green-500" />
      {sla.display}
    </div>
  );
}
