import { useEffect, useState } from 'react';
import { useApp } from '@/store';
import { PipelineStepper } from '@/components/PipelineStepper';
import { Check, AlertTriangle, Brain, Languages, Tag, Search, Gauge, ArrowRight, RefreshCw } from 'lucide-react';

const STEPS = [
  { label: 'Detecting language...', icon: Languages },
  { label: 'Classifying intent...', icon: Tag },
  { label: 'Extracting entities...', icon: Search },
  { label: 'Analyzing sentiment & urgency...', icon: Gauge },
];

export function NLPProcessing() {
  const { pendingSubmission, processComplaint, nlpResult, routingResult, confirmRouting, setView, setActiveComplaintId } = useApp();
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showConfidence, setShowConfidence] = useState(false);
  const [showManualReview, setShowManualReview] = useState(false);

  useEffect(() => {
    if (!pendingSubmission) {
      setView('submit');
      return;
    }

    // Animate steps one by one
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCompletedSteps(i + 1);
        }, (i + 1) * 600)
      );
    });

    // Process after all steps
    timers.push(
      setTimeout(() => {
        processComplaint();
        setShowConfidence(true);
      }, STEPS.length * 600 + 400)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nlpResult && showConfidence) {
      if (nlpResult.flaggedForReview) {
        setShowManualReview(true);
      } else {
        // Auto-continue to Stage 3 after showing confidence
        const t = setTimeout(() => {
          const newId = `GRV-2026-${String(Date.now()).slice(-3)}`;
          confirmRouting(newId);
          setView('routing_result');
        }, 2000);
        return () => clearTimeout(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nlpResult, showConfidence]);

  if (!pendingSubmission) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-4 sm:p-6">
        <PipelineStepper currentStep={2} />
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Brain className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-grey-800">AI/NLP Processing Engine</h2>
            <p className="text-sm text-grey-500">Analyzing your complaint through 4 NLP sub-modules</p>
          </div>
        </div>

        {/* Processing steps */}
        <div className="space-y-3 mb-6">
          {STEPS.map((step, i) => {
            const isDone = i < completedSteps;
            const isProcessing = i === completedSteps && !showConfidence;
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isDone
                    ? 'bg-green-50 border-green-200'
                    : isProcessing
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-grey-50 border-grey-200 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-green-500' : isProcessing ? 'bg-yellow-400' : 'bg-grey-300'
                }`}>
                  {isDone ? (
                    <Check className="w-5 h-5 text-white animate-check-pop" />
                  ) : isProcessing ? (
                    <RefreshCw className="w-4 h-4 text-white animate-spin-slow" />
                  ) : (
                    <Icon className="w-4 h-4 text-grey-500" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isDone ? 'text-green-700' : isProcessing ? 'text-yellow-700' : 'text-grey-500'
                }`}>
                  {step.label}
                </span>
                {isDone && <span className="ml-auto text-green-600 text-sm">✓</span>}
              </div>
            );
          })}
        </div>

        {/* Confidence diamond */}
        {showConfidence && nlpResult && (
          <div className="animate-fade-in-up space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className={`px-6 py-4 rounded-2xl border-2 shadow-lg ${
                  nlpResult.flaggedForReview
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-green-50 border-green-400'
                }`}>
                  <div className="text-center">
                    <p className="text-xs font-medium text-grey-500 uppercase tracking-wide mb-1">Confidence Score</p>
                    <p className={`text-4xl font-bold ${
                      nlpResult.flaggedForReview ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {nlpResult.confidence}%
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      nlpResult.flaggedForReview ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {nlpResult.flaggedForReview ? 'Low Confidence' : 'High Confidence'}
                    </p>
                  </div>
                </div>
                {/* Pulsing rings */}
                {!nlpResult.flaggedForReview && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-pulse-ring" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </div>
            </div>

            {/* NLP Results Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultChip label="Language" value={nlpResult.language} />
              <ResultChip label="Intent" value={nlpResult.intent} />
              <ResultChip label="Sentiment" value={nlpResult.sentiment} />
              <ResultChip label="Urgency" value={nlpResult.urgency.toUpperCase()} />
            </div>

            {/* High confidence → auto route */}
            {!nlpResult.flaggedForReview && (
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium animate-fade-in">
                <span>Auto-routing to Stage 3 — Routing Engine</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}

            {/* Low confidence → manual review */}
            {nlpResult.flaggedForReview && showManualReview && (
              <div className="animate-fade-in-up space-y-4">
                <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-50 border border-yellow-300">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800">Flagged for Manual Review</p>
                    <p className="text-sm text-yellow-700">
                      The AI confidence score is below 75%. An officer will verify this complaint before routing.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      const newId = `GRV-2026-${String(Date.now()).slice(-3)}`;
                      confirmRouting(newId);
                      setView('routing_result');
                    }}
                    className="btn-accent"
                  >
                    View Routing Status
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveComplaintId(null);
                      setView('dashboard');
                    }}
                    className="btn-secondary"
                  >
                    Go to Officer Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-grey-50 border border-grey-200">
      <p className="text-[10px] font-medium text-grey-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-grey-700 mt-0.5 truncate">{value}</p>
    </div>
  );
}
