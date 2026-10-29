import { useMemo } from 'react';
import { useApp } from '@/store';
import { MOCK_DUPLICATE_GROUPS } from '@/mockData';
import { BarChart3, Brain, RefreshCw, TrendingUp, Building2, Link2, Clock, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { UrgencyBadge } from '@/components/Badges';

export function Analytics() {
  const { complaints } = useApp();

  const stats = useMemo(() => {
    const byDept = new Map<string, number>();
    const byUrgency = { critical: 0, high: 0, medium: 0, low: 0 };
    let resolved = 0;
    let pending = 0;
    let slaBreached = 0;

    complaints.forEach((c) => {
      if (c.routing) {
        byDept.set(c.routing.department, (byDept.get(c.routing.department) ?? 0) + 1);
      }
      if (c.nlpResult) {
        byUrgency[c.nlpResult.urgency]++;
      }
      if (c.status === 'resolved' || c.status === 'closed') resolved++;
      else if (['routed', 'in_progress', 'manual_review'].includes(c.status)) pending++;

      const remaining = new Date(c.slaDeadline).getTime() - Date.now();
      if (remaining < 0 && c.status !== 'closed' && c.status !== 'resolved') slaBreached++;
    });

    return {
      byDept: Array.from(byDept.entries()).sort((a, b) => b[1] - a[1]),
      byUrgency,
      resolved,
      pending,
      slaBreached,
      total: complaints.length,
      duplicates: MOCK_DUPLICATE_GROUPS.length,
    };
  }, [complaints]);

  const maxDeptCount = Math.max(...stats.byDept.map((d) => d[1]), 1);
  const resolvedRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-navy-500" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-grey-800">Analytics & AI Insights</h1>
          <p className="text-sm text-grey-500">Performance metrics, department distribution & continuous learning</p>
        </div>
      </div>

      {/* Model Retraining Banner — Feedback Loop */}
      <div className="card p-5 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-green-800">Feedback Data: Continuous Learning Loop</h3>
              <span className="badge bg-green-200 text-green-800">Active</span>
            </div>
            <p className="text-sm text-green-700 mt-0.5">
              128 resolved cases queued for model retraining. Feedback from citizens improves routing accuracy and urgency detection.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-3xl font-bold text-green-700">128</p>
            <p className="text-xs text-green-600">cases queued</p>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard icon={Activity} label="Total Complaints" value={stats.total} color="navy" />
        <MetricCard icon={CheckCircle2} label="Resolution Rate" value={`${resolvedRate}%`} color="green" />
        <MetricCard icon={Clock} label="Pending" value={stats.pending} color="orange" />
        <MetricCard icon={AlertTriangle} label="SLA Breached" value={stats.slaBreached} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Department distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-navy-500" />
            <h3 className="font-semibold text-grey-800">Complaints by Department</h3>
          </div>
          <div className="space-y-2.5">
            {stats.byDept.map(([dept, count]) => (
              <div key={dept} className="flex items-center gap-3">
                <span className="text-xs text-grey-600 w-40 truncate flex-shrink-0">{dept}</span>
                <div className="flex-1 h-6 rounded-lg bg-grey-100 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-navy-500 transition-all duration-700 ease-out flex items-center justify-end pr-2"
                    style={{ width: `${(count / maxDeptCount) * 100}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency distribution */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-grey-800">Urgency Distribution</h3>
          </div>
          <div className="space-y-4">
            {(['critical', 'high', 'medium', 'low'] as const).map((level) => {
              const count = stats.byUrgency[level];
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const colors = {
                critical: 'bg-red-500',
                high: 'bg-orange-500',
                medium: 'bg-yellow-500',
                low: 'bg-green-500',
              };
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <UrgencyBadge urgency={level} size="xs" />
                    <span className="text-xs text-grey-500 font-medium">{count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-grey-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[level]} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Pipeline Performance */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-grey-800">AI/NLP Pipeline Performance</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <PipelineMetric label="Avg Confidence" value="84%" color="green" />
          <PipelineMetric label="Auto-Routed" value="92%" color="navy" />
          <PipelineMetric label="Manual Review" value="8%" color="orange" />
          <PipelineMetric label="Avg Processing" value="2.4s" color="navy" />
        </div>
      </div>

      {/* Duplicate detection summary */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-grey-800">Duplicate & Pattern Detection Summary</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <PipelineMetric label="Duplicate Groups" value={String(stats.duplicates)} color="orange" />
          <PipelineMetric label="Merged Cases" value={String(MOCK_DUPLICATE_GROUPS.reduce((acc, g) => acc + g.complaintIds.length, 0))} color="navy" />
          <PipelineMetric label="Root Causes Identified" value={String(stats.duplicates)} color="green" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: string | number; color: 'navy' | 'orange' | 'green' | 'red' }) {
  const colorMap = {
    navy: 'bg-navy-50 text-navy-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-grey-800 leading-none">{value}</p>
        <p className="text-xs text-grey-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function PipelineMetric({ label, value, color }: { label: string; value: string; color: 'navy' | 'orange' | 'green' }) {
  const colorMap = {
    navy: 'text-navy-600',
    orange: 'text-orange-600',
    green: 'text-green-600',
  };
  return (
    <div className="p-4 rounded-lg bg-grey-50 border border-grey-200 text-center">
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      <p className="text-xs text-grey-500 mt-1">{label}</p>
    </div>
  );
}
