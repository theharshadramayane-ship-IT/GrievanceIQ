import { useState, useMemo } from 'react';
import { useApp } from '@/store';
import { MOCK_DUPLICATE_GROUPS } from '@/mockData';
import { DuplicateGroupView, HotspotMap } from '@/stages/stage4-duplicates/DuplicateDetection';
import { SLADisplay } from '@/components/SLATimer';
import { UrgencyBadge, StatusBadge } from '@/components/Badges';
import type { Complaint, OfficerAction, Urgency } from '@/types';
import {
  LayoutDashboard, Inbox, CheckCircle2, AlertTriangle, Link2,
  Check, X, Clock, ChevronDown, ChevronUp,
  Building2, MapPin, User, Sparkles, AlertCircle, Search
} from 'lucide-react';

type SortKey = 'id' | 'urgency' | 'sla' | 'status';
type SortDir = 'asc' | 'desc';
type Tab = 'queue' | 'duplicates' | 'hotspots' | 'manual_review';

const URGENCY_ORDER: Record<Urgency, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export function OfficerDashboard() {
  const { complaints, officerAction, verifyManualReview, setActiveComplaintId, setView } = useApp();
  const [sortKey, setSortKey] = useState<SortKey>('urgency');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [activeTab, setActiveTab] = useState<Tab>('queue');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState<string>('all');

  // Summary stats
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => ['routed', 'in_progress', 'manual_review'].includes(c.status)).length;
    const resolvedToday = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
    const slaBreached = complaints.filter((c) => {
      const remaining = new Date(c.slaDeadline).getTime() - Date.now();
      return remaining < 0 && c.status !== 'closed' && c.status !== 'resolved';
    }).length;
    const manualReviewCount = complaints.filter((c) => c.status === 'manual_review').length;
    return { total, pending, resolvedToday, slaBreached, manualReviewCount };
  }, [complaints]);

  // Sorted complaints for the queue
  const sortedComplaints = useMemo(() => {
    const active = complaints.filter((c) => c.status !== 'closed');
    const deptFiltered = filterDept === 'all' ? active : active.filter((c) => c.routing?.department === filterDept);

    const sorted = [...deptFiltered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'id') cmp = a.id.localeCompare(b.id);
      else if (sortKey === 'urgency') {
        const ua = a.nlpResult?.urgency ?? 'low';
        const ub = b.nlpResult?.urgency ?? 'low';
        cmp = URGENCY_ORDER[ua] - URGENCY_ORDER[ub];
      } else if (sortKey === 'sla') {
        cmp = new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
      } else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    // Always put manual_review at top if sorting by urgency
    if (sortKey === 'urgency') {
      return sorted.sort((a, b) => {
        if (a.status === 'manual_review' && b.status !== 'manual_review') return -1;
        if (b.status === 'manual_review' && a.status !== 'manual_review') return 1;
        return 0;
      });
    }
    return sorted;
  }, [complaints, sortKey, sortDir, filterDept]);

  const departments = useMemo(() => {
    const depts = new Set(complaints.map((c) => c.routing?.department).filter(Boolean) as string[]);
    return ['all', ...Array.from(depts)];
  }, [complaints]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronDown className="w-3 h-3 text-grey-300" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-navy-500" /> : <ChevronDown className="w-3 h-3 text-navy-500" />;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-grey-800">Officer Dashboard</h1>
          <p className="text-sm text-grey-500">Priority queue, SLA monitoring & duplicate detection</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard icon={Inbox} label="Total Complaints" value={stats.total} color="navy" />
        <SummaryCard icon={Clock} label="Pending" value={stats.pending} color="orange" />
        <SummaryCard icon={CheckCircle2} label="Resolved" value={stats.resolvedToday} color="green" />
        <SummaryCard icon={AlertTriangle} label="SLA Breached" value={stats.slaBreached} color="red" />
      </div>

      {/* Manual review alert */}
      {stats.manualReviewCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-300 animate-fade-in-down">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-yellow-800">{stats.manualReviewCount} complaint(s) flagged for manual review</p>
            <p className="text-sm text-yellow-700">Low AI confidence — verify to route to the correct department.</p>
          </div>
          <button onClick={() => setActiveTab('manual_review')} className="btn-secondary text-sm">
            Review Now
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-grey-200 overflow-x-auto scrollbar-thin">
        <TabButton active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} icon={LayoutDashboard} label="Priority Queue" />
        <TabButton active={activeTab === 'manual_review'} onClick={() => setActiveTab('manual_review')} icon={AlertCircle} label="Manual Review" badge={stats.manualReviewCount} />
        <TabButton active={activeTab === 'duplicates'} onClick={() => setActiveTab('duplicates')} icon={Link2} label="Duplicates" />
        <TabButton active={activeTab === 'hotspots'} onClick={() => setActiveTab('hotspots')} icon={MapPin} label="Hotspots" />
      </div>

      {/* Queue tab */}
      {activeTab === 'queue' && (
        <div className="space-y-4 animate-fade-in">
          {/* Dept filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-grey-500 font-medium">Filter:</span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filterDept === dept
                    ? 'bg-navy-600 text-white'
                    : 'bg-grey-100 text-grey-600 hover:bg-grey-200'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          {/* Table — desktop */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="bg-grey-50 border-b border-grey-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-grey-600 cursor-pointer hover:bg-grey-100 transition-colors" onClick={() => handleSort('id')}>
                      <span className="flex items-center gap-1">ID <SortIcon column="id" /></span>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-grey-600">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-grey-600 cursor-pointer hover:bg-grey-100 transition-colors" onClick={() => handleSort('urgency')}>
                      <span className="flex items-center gap-1">Urgency <SortIcon column="urgency" /></span>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-grey-600 cursor-pointer hover:bg-grey-100 transition-colors" onClick={() => handleSort('sla')}>
                      <span className="flex items-center gap-1">SLA Timer <SortIcon column="sla" /></span>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-grey-600">Dup</th>
                    <th className="text-left px-4 py-3 font-semibold text-grey-600">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-grey-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedComplaints.map((c) => (
                    <ComplaintRow
                      key={c.id}
                      complaint={c}
                      expanded={expandedRow === c.id}
                      onToggle={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                      onAction={officerAction}
                      onTrack={() => { setActiveComplaintId(c.id); setView('track'); }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden space-y-3">
            {sortedComplaints.map((c) => (
              <MobileComplaintCard
                key={c.id}
                complaint={c}
                onAction={officerAction}
                onTrack={() => { setActiveComplaintId(c.id); setView('track'); }}
              />
            ))}
          </div>

          {/* Empty state */}
          {sortedComplaints.length === 0 && (
            <div className="card p-12 text-center">
              <Inbox className="w-12 h-12 mx-auto mb-3 text-grey-300" />
              <p className="text-grey-500">No complaints in this view.</p>
            </div>
          )}
        </div>
      )}

      {/* Manual review tab */}
      {activeTab === 'manual_review' && (
        <div className="space-y-3 animate-fade-in">
          {complaints.filter((c) => c.status === 'manual_review').length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-300" />
              <p className="text-grey-500">No complaints pending manual review.</p>
            </div>
          ) : (
            complaints.filter((c) => c.status === 'manual_review').map((c) => (
              <div key={c.id} className="card p-5 animate-fade-in-up">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-navy-700">{c.id}</span>
                      <StatusBadge status={c.status} />
                      {c.nlpResult && <span className="badge bg-yellow-50 text-yellow-700">Confidence: {c.nlpResult.confidence}%</span>}
                    </div>
                    <p className="text-sm text-grey-600 mt-1 line-clamp-2">{c.text}</p>
                    <p className="text-xs text-grey-400 mt-1">{c.citizenName} • {c.location}</p>
                  </div>
                </div>
                {c.nlpResult && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <DetailChip label="Intent" value={c.nlpResult.intent} />
                    <DetailChip label="Urgency" value={c.nlpResult.urgency.toUpperCase()} />
                    <DetailChip label="Sentiment" value={c.nlpResult.sentiment} />
                    <DetailChip label="Language" value={c.nlpResult.language} />
                  </div>
                )}
                <button onClick={() => verifyManualReview(c.id)} className="btn-success">
                  <Check className="w-4 h-4" />
                  Officer Verifies — Route to Department
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Duplicates tab */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-grey-800">Duplicate & Pattern Detection</h2>
            <span className="text-sm text-grey-500">— Semantic similarity, geo-clustering & root-cause analysis</span>
          </div>
          <DuplicateGroupView complaints={complaints} groups={MOCK_DUPLICATE_GROUPS} />
        </div>
      )}

      {/* Hotspots tab */}
      {activeTab === 'hotspots' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-grey-800">Geo-Clustered Hotspot Map</h2>
          </div>
          <HotspotMap />
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function SummaryCard({ icon: Icon, label, value, color }: { icon: typeof Inbox; label: string; value: number; color: 'navy' | 'orange' | 'green' | 'red' }) {
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

function TabButton({ active, onClick, icon: Icon, label, badge }: { active: boolean; onClick: () => void; icon: typeof Inbox; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
        active
          ? 'border-navy-600 text-navy-700'
          : 'border-transparent text-grey-500 hover:text-grey-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="badge bg-red-100 text-red-700 text-[10px] px-1.5 py-0">{badge}</span>
      )}
    </button>
  );
}

function ComplaintRow({
  complaint: c,
  expanded,
  onToggle,
  onAction,
  onTrack,
}: {
  complaint: Complaint;
  expanded: boolean;
  onToggle: () => void;
  onAction: (id: string, action: OfficerAction) => void;
  onTrack: () => void;
}) {
  return (
    <>
      <tr className={`border-b border-grey-100 hover:bg-grey-50 transition-colors ${expanded ? 'bg-grey-50' : ''}`}>
        <td className="px-4 py-3">
          <button onClick={onToggle} className="flex items-center gap-1.5 font-mono text-xs font-semibold text-navy-700 hover:text-navy-800">
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {c.id}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="text-xs text-grey-600">
            {c.routing ? (
              <>
                <p className="font-medium">{c.routing.subCategory}</p>
                <p className="text-[10px] text-grey-400">{c.routing.department}</p>
              </>
            ) : (
              <span className="text-grey-400 italic">Unrouted</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          {c.nlpResult ? <UrgencyBadge urgency={c.nlpResult.urgency} size="xs" /> : <span className="text-grey-400 text-xs">—</span>}
        </td>
        <td className="px-4 py-3">
          <SLADisplay deadlineIso={c.slaDeadline} totalMinutes={c.slaTotalMinutes} compact />
        </td>
        <td className="px-4 py-3">
          {c.duplicateGroupSize && c.duplicateGroupSize > 1 ? (
            <span className="badge bg-orange-50 text-orange-700 border border-orange-200 text-[10px]">
              <Link2 className="w-3 h-3" />
              {c.duplicateGroupSize}
            </span>
          ) : (
            <span className="text-grey-300 text-xs">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={c.status} />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
            {c.status === 'routed' && (
              <button onClick={() => onAction(c.id, 'accept')} className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors" title="Accept">
                Accept
              </button>
            )}
            {(c.status === 'routed' || c.status === 'in_progress') && (
              <>
                <button onClick={() => onAction(c.id, 'resolve')} className="px-2.5 py-1 rounded-md bg-navy-50 text-navy-700 hover:bg-navy-100 text-xs font-medium transition-colors" title="Resolve">
                  Resolve
                </button>
                <button onClick={() => onAction(c.id, 'forward')} className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-medium transition-colors" title="Forward">
                  Forward
                </button>
              </>
            )}
            {c.status === 'in_progress' && (
              <button onClick={() => onAction(c.id, 'reject')} className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-colors" title="Reject">
                Reject
              </button>
            )}
            {(c.status === 'resolved' || c.status === 'closed') && (
              <span className="text-xs text-grey-400 italic">No actions</span>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-grey-50 animate-fade-in">
          <td colSpan={7} className="px-4 py-4">
            <ExpandedDetail complaint={c} onTrack={onTrack} />
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedDetail({ complaint: c, onTrack }: { complaint: Complaint; onTrack: () => void }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Left: complaint details */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-grey-400 uppercase tracking-wide mb-1">Citizen</p>
          <p className="text-sm text-grey-700">{c.citizenName} • {c.citizenContact}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-grey-400 uppercase tracking-wide mb-1">Complaint</p>
          <p className="text-sm text-grey-600 p-3 rounded-lg bg-white border border-grey-100">{c.text}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-grey-500">
          <MapPin className="w-3.5 h-3.5" />
          {c.location}
        </div>
        {c.nlpResult && (
          <div className="grid grid-cols-2 gap-2">
            <DetailChip label="Intent" value={c.nlpResult.intent} />
            <DetailChip label="Sentiment" value={c.nlpResult.sentiment} />
            <DetailChip label="Entities" value={c.nlpResult.entities.join(', ')} />
            <DetailChip label="Confidence" value={`${c.nlpResult.confidence}%`} />
          </div>
        )}
      </div>
      {/* Right: routing details */}
      <div className="space-y-3">
        {c.routing ? (
          <>
            <div className="p-3 rounded-lg bg-navy-50 border border-navy-200">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-navy-600" />
                <span className="font-semibold text-navy-800 text-sm">{c.routing.department}</span>
              </div>
              <p className="text-xs text-navy-600">{c.routing.subCategory} • {c.routing.jurisdiction}</p>
              <p className="text-xs text-navy-600 mt-1 flex items-center gap-1"><User className="w-3 h-3" /> Officer: {c.routing.assignedOfficer}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-grey-500 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-navy-500" /> Explainable AI — Why this department?</p>
              {c.routing.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white border border-grey-100">
                  <span className="badge bg-navy-50 text-navy-600 text-[10px] flex-shrink-0">{r.module}</span>
                  <p className="text-xs text-grey-600">{r.detail}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-700">Not yet routed — pending manual review verification.</p>
          </div>
        )}
        <button onClick={onTrack} className="btn-ghost text-sm">
          <Search className="w-3.5 h-3.5" />
          View on Track Page
        </button>
      </div>
    </div>
  );
}

function MobileComplaintCard({
  complaint: c,
  onAction,
  onTrack,
}: {
  complaint: Complaint;
  onAction: (id: string, action: OfficerAction) => void;
  onTrack: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-xs font-semibold text-navy-700">{c.id}</span>
        <StatusBadge status={c.status} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        {c.nlpResult && <UrgencyBadge urgency={c.nlpResult.urgency} size="xs" />}
        {c.duplicateGroupSize && c.duplicateGroupSize > 1 && (
          <span className="badge bg-orange-50 text-orange-700 border border-orange-200 text-[10px]">
            <Link2 className="w-3 h-3" />
            {c.duplicateGroupSize} grouped
          </span>
        )}
      </div>
      <p className="text-sm text-grey-600 line-clamp-2 mb-2">{c.text}</p>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs text-grey-400">{c.routing?.subCategory ?? 'Unrouted'}</span>
        <SLADisplay deadlineIso={c.slaDeadline} totalMinutes={c.slaTotalMinutes} compact />
      </div>
      <button onClick={() => setExpanded(!expanded)} className="text-xs text-navy-600 font-medium mb-2">
        {expanded ? 'Hide details' : 'Show details'}
      </button>
      {expanded && (
        <div className="mb-3 animate-fade-in">
          <ExpandedDetail complaint={c} onTrack={onTrack} />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {c.status === 'routed' && (
          <button onClick={() => onAction(c.id, 'accept')} className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors">
            <Check className="w-3 h-3 inline mr-1" />Accept
          </button>
        )}
        {(c.status === 'routed' || c.status === 'in_progress') && (
          <>
            <button onClick={() => onAction(c.id, 'resolve')} className="px-3 py-1.5 rounded-md bg-navy-50 text-navy-700 hover:bg-navy-100 text-xs font-medium transition-colors">
              Resolve
            </button>
            <button onClick={() => onAction(c.id, 'forward')} className="px-3 py-1.5 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-medium transition-colors">
              Forward
            </button>
          </>
        )}
        {c.status === 'in_progress' && (
          <button onClick={() => onAction(c.id, 'reject')} className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-colors">
            <X className="w-3 h-3 inline mr-1" />Reject
          </button>
        )}
      </div>
    </div>
  );
}

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg bg-grey-50 border border-grey-200">
      <p className="text-[10px] font-medium text-grey-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-grey-700 mt-0.5 truncate">{value}</p>
    </div>
  );
}
