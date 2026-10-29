import { useState } from 'react';
import { useApp } from '@/store';
import { PipelineStepper } from '@/components/PipelineStepper';
import { ConfidenceBadge } from '@/components/Badges';
import { Building2, ChevronDown, ChevronUp, MapPin, User, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export function RoutingResult() {
  const { nlpResult, routingResult, activeComplaintId, setView } = useApp();
  const [expanded, setExpanded] = useState(false);

  if (!nlpResult || !routingResult) {
    return (
      <div className="card p-8 text-center">
        <p className="text-grey-500">No routing result available. Please submit a complaint first.</p>
        <button onClick={() => setView('submit')} className="btn-primary mt-4">
          Submit a Complaint
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-4 sm:p-6">
        <PipelineStepper currentStep={3} />
      </div>

      <div className="card p-6 sm:p-8 space-y-5 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-navy-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-grey-800">Routing Engine Result</h2>
            <p className="text-sm text-grey-500">Your complaint has been intelligently routed</p>
          </div>
        </div>

        {/* Complaint ID */}
        {activeComplaintId && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-50 border border-navy-200 text-navy-700 text-sm font-mono font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Complaint ID: {activeComplaintId}
          </div>
        )}

        {/* Routed to */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-navy-50 to-navy-100 border border-navy-200">
          <p className="text-sm text-navy-600 font-medium mb-2">Routed to:</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-800">{routingResult.department}</h3>
              <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-navy-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {routingResult.jurisdiction}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Officer: {routingResult.assignedOfficer}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-category tag */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-grey-500">Sub-Category:</span>
          <span className="badge bg-orange-50 text-orange-700 border border-orange-200">
            {routingResult.subCategory}
          </span>
          <ConfidenceBadge confidence={nlpResult.confidence} />
        </div>

        {/* Explainable AI accordion */}
        <div className="border border-grey-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-4 bg-grey-50 hover:bg-grey-100 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-grey-700">
              <Sparkles className="w-4 h-4 text-navy-500" />
              Why this department? (Explainable AI)
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-grey-500" /> : <ChevronDown className="w-4 h-4 text-grey-500" />}
          </button>
          {expanded && (
            <div className="p-4 space-y-3 animate-fade-in">
              {routingResult.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-grey-100">
                  <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-navy-600">{i + 1}</span>
                  </div>
                  <div>
                    <span className="badge bg-navy-50 text-navy-600 mb-1">{reason.module}</span>
                    <p className="text-sm text-grey-600 mt-1">{reason.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next steps */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setView('track')}
            className="btn-primary"
          >
            Track My Complaint
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('submit')}
            className="btn-secondary"
          >
            Submit Another Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
