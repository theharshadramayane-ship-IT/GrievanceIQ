import { useState } from 'react';
import { useApp } from '@/store';
import { PipelineStepper } from '@/components/PipelineStepper';
import { StatusBadge } from '@/components/Badges';
import { Search, CheckCircle2, Clock, AlertCircle, ThumbsUp, ThumbsDown, MessageSquare, RefreshCw, ArrowRight, X } from 'lucide-react';
import type { ComplaintStatus } from '@/types';

const TIMELINE_STEPS: { key: ComplaintStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { key: 'submission', label: 'Submitted', icon: CheckCircle2 },
  { key: 'nlp_processing', label: 'AI Processing', icon: Search },
  { key: 'routed', label: 'Routed', icon: ArrowRight },
  { key: 'in_progress', label: 'In Progress', icon: Clock },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2 },
];

export function TrackComplaint() {
  const { complaints, getComplaintById, submitFeedback, setView } = useApp();
  const [searchId, setSearchId] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAppealConfirm, setShowAppealConfirm] = useState(false);

  const selectedComplaint = selectedId ? getComplaintById(selectedId) : null;

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const found = complaints.find((c) => c.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) {
      setSelectedId(found.id);
    } else {
      // If not found, show the most recent complaint as demo
      setSelectedId(complaints[0]?.id ?? null);
    }
  };

  const handleFeedback = (feedback: 'satisfied' | 'not_satisfied') => {
    if (!selectedId) return;
    submitFeedback(selectedId, feedback);
    if (feedback === 'not_satisfied') {
      setShowAppealConfirm(true);
    }
  };

  // Determine current timeline step
  const getCurrentStep = (status: ComplaintStatus): number => {
    const map: Record<ComplaintStatus, number> = {
      submission: 0,
      nlp_processing: 1,
      routed: 2,
      in_progress: 3,
      resolved: 4,
      closed: 4,
      manual_review: 1,
      appealed: 2,
    };
    return map[status] ?? 0;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-4 sm:p-6">
        <PipelineStepper currentStep={6} />
      </div>

      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-grey-800">Track Your Complaint</h1>
        <p className="text-grey-500 mt-1 text-sm sm:text-base">Enter your complaint ID to see real-time status</p>
      </div>

      {/* Search bar */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. GRV-2026-001"
              className="input-field pl-10"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary">
            <Search className="w-4 h-4" />
            Track
          </button>
        </div>
        <p className="text-xs text-grey-400 mt-2">
          Try: GRV-2026-001, GRV-2026-002, GRV-2026-008 (resolved), or GRV-2026-010 (appealed)
        </p>
      </div>

      {/* Complaint status */}
      {selectedComplaint && (
        <div className="card p-6 sm:p-8 space-y-6 animate-fade-in-up">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-navy-700">{selectedComplaint.id}</span>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <p className="text-sm text-grey-500 mt-1">Filed by {selectedComplaint.citizenName} • {selectedComplaint.location}</p>
            </div>
            {selectedComplaint.appealCount && selectedComplaint.appealCount > 0 && (
              <span className="badge bg-orange-50 text-orange-700 border border-orange-200">
                <RefreshCw className="w-3 h-3" />
                Appeal #{selectedComplaint.appealCount}
              </span>
            )}
          </div>

          {/* Complaint text */}
          <div className="p-4 rounded-lg bg-grey-50 border border-grey-100">
            <p className="text-sm text-grey-700">{selectedComplaint.text}</p>
          </div>

          {/* Status Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-grey-700 mb-4">Status Timeline</h3>
            <div className="overflow-x-auto scrollbar-thin">
              <div className="flex items-center justify-between min-w-[500px] sm:min-w-0 py-2">
                {TIMELINE_STEPS.map((step, i) => {
                  const currentStep = getCurrentStep(selectedComplaint.status);
                  const isDone = i < currentStep;
                  const isActive = i === currentStep;
                  const Icon = step.icon;

                  return (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isDone
                            ? 'bg-green-500 border-green-500 text-white'
                            : isActive
                            ? 'bg-navy-600 border-navy-600 text-white scale-110 shadow-md'
                            : 'bg-grey-100 border-grey-300 text-grey-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                          isDone ? 'text-green-600' : isActive ? 'text-navy-700' : 'text-grey-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className="flex-1 mx-2 h-0.5 rounded-full bg-grey-200 relative overflow-hidden">
                          <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            isDone ? 'w-full bg-green-400' : isActive ? 'w-1/2 bg-navy-400' : 'w-0'
                          }`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Routing info */}
          {selectedComplaint.routing && (
            <div className="p-4 rounded-lg bg-navy-50 border border-navy-200">
              <p className="text-xs font-medium text-navy-600 uppercase tracking-wide mb-1">Routed to</p>
              <p className="font-semibold text-navy-800">{selectedComplaint.routing.department}</p>
              <p className="text-sm text-navy-600">
                {selectedComplaint.routing.subCategory} • Officer: {selectedComplaint.routing.assignedOfficer}
              </p>
            </div>
          )}

          {/* Manual review notice */}
          {selectedComplaint.status === 'manual_review' && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-50 border border-yellow-300">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Your complaint has been flagged for manual review by an officer. You will be notified once it is verified and routed.
              </p>
            </div>
          )}

          {/* Feedback widget — only when resolved */}
          {selectedComplaint.status === 'resolved' && !selectedComplaint.feedback && (
            <div className="p-5 rounded-xl bg-green-50 border border-green-200 animate-scale-in">
              <h3 className="font-semibold text-green-800 mb-1">Are you satisfied with the resolution?</h3>
              <p className="text-sm text-green-700 mb-4">Your feedback helps improve the system.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleFeedback('satisfied')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ThumbsUp className="w-5 h-5" />
                  Satisfied — Close
                </button>
                <button
                  onClick={() => handleFeedback('not_satisfied')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ThumbsDown className="w-5 h-5" />
                  Not Satisfied — Appeal
                </button>
              </div>
            </div>
          )}

          {/* Feedback already given */}
          {selectedComplaint.feedback === 'satisfied' && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700">
                Thank you for your feedback. This complaint has been closed.
              </p>
            </div>
          )}

          {selectedComplaint.feedback === 'not_satisfied' && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <ThumbsDown className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-orange-700">
                You appealed this complaint. It has been re-routed to an officer for review.
              </p>
            </div>
          )}

          {/* Appeal confirmation modal */}
          {showAppealConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in" onClick={() => setShowAppealConfirm(false)}>
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-grey-800">Appeal Submitted</h3>
                    <p className="text-sm text-grey-500">Your complaint has been re-routed</p>
                  </div>
                </div>
                <p className="text-sm text-grey-600 mb-4">
                  Your complaint <span className="font-mono font-semibold">{selectedComplaint.id}</span> has been re-opened and sent back to the Routing Engine (Stage 3). An officer will review it again with priority.
                </p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-navy-50 border border-navy-100 mb-4">
                  <MessageSquare className="w-4 h-4 text-navy-500" />
                  <p className="text-xs text-navy-600">SMS notification sent to {selectedComplaint.citizenContact}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowAppealConfirm(false); setView('dashboard'); }}
                    className="btn-primary flex-1"
                  >
                    View on Officer Dashboard
                  </button>
                  <button
                    onClick={() => setShowAppealConfirm(false)}
                    className="btn-ghost"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NLP details */}
          {selectedComplaint.nlpResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <DetailChip label="Intent" value={selectedComplaint.nlpResult.intent} />
              <DetailChip label="Urgency" value={selectedComplaint.nlpResult.urgency.toUpperCase()} />
              <DetailChip label="Confidence" value={`${selectedComplaint.nlpResult.confidence}%`} />
              <DetailChip label="Language" value={selectedComplaint.nlpResult.language} />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!selectedComplaint && (
        <div className="card p-12 text-center">
          <Search className="w-12 h-12 mx-auto mb-3 text-grey-300" />
          <p className="text-grey-500">Enter a complaint ID above to track its status.</p>
        </div>
      )}
    </div>
  );
}

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-grey-50 border border-grey-200">
      <p className="text-[10px] font-medium text-grey-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-grey-700 mt-0.5 truncate">{value}</p>
    </div>
  );
}
