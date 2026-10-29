import type { Urgency, ComplaintStatus } from '@/types';

const URGENCY_STYLES: Record<Urgency, { bg: string; text: string; border: string; label: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', label: 'CRITICAL' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', label: 'HIGH' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', label: 'MEDIUM' },
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', label: 'LOW' },
};

export function UrgencyBadge({ urgency, size = 'sm' }: { urgency: Urgency; size?: 'sm' | 'xs' }) {
  const s = URGENCY_STYLES[urgency];
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`badge ${s.bg} ${s.text} ${s.border} border ${sizeClass}`}>
      {s.label}
    </span>
  );
}

const STATUS_STYLES: Record<ComplaintStatus, { bg: string; text: string; label: string }> = {
  submission: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Submitted' },
  nlp_processing: { bg: 'bg-green-50', text: 'text-green-700', label: 'AI Processing' },
  routed: { bg: 'bg-navy-50', text: 'text-navy-700', label: 'Routed' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Progress' },
  resolved: { bg: 'bg-green-50', text: 'text-green-700', label: 'Resolved' },
  closed: { bg: 'bg-grey-100', text: 'text-grey-600', label: 'Closed' },
  manual_review: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Manual Review' },
  appealed: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Appealed' },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.submission;
  return (
    <span className={`badge ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const isHigh = confidence > 75;
  return (
    <span className={`badge ${isHigh ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
      {confidence}% {isHigh ? 'High' : 'Low'}
    </span>
  );
}
