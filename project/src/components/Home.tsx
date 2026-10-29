import { useApp } from '@/store';
import { PipelineStepper } from '@/components/PipelineStepper';
import {
  ShieldCheck, FileText, Brain, Route, Copy, LayoutDashboard, CheckCircle2,
  ArrowRight, Sparkles, Zap, Search, Link2, RefreshCw
} from 'lucide-react';

export function Home() {
  const { setView } = useApp();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 text-white p-8 sm:p-12">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
            <span className="text-sm font-medium text-navy-100">Smart India Hackathon 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Grievance<span className="text-orange-400">IQ</span>
          </h1>
          <p className="text-base sm:text-lg text-navy-100 max-w-2xl mb-6">
            AI-based Public Grievance Intelligence & Routing System. From submission to resolution —
            a 6-stage pipeline that analyzes, routes, deduplicates, and resolves citizen complaints with explainable AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setView('submit')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FileText className="w-5 h-5" />
              Submit a Complaint
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-200 border border-white/20"
            >
              <LayoutDashboard className="w-5 h-5" />
              Officer Dashboard
            </button>
            <button
              onClick={() => setView('track')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all duration-200 border border-white/20"
            >
              <Search className="w-5 h-5" />
              Track Complaint
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-grey-800 mb-1">The 6-Stage AI Pipeline</h2>
        <p className="text-sm text-grey-500 mb-4">Every complaint flows through these stages — visible to citizens and officers in real time.</p>
        <PipelineStepper currentStep={7} />
      </div>

      {/* Stage cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StageCard
          num={1}
          color="orange"
          icon={FileText}
          title="Web Portal Submission"
          desc="Citizen-facing form with text input, photo/document upload, and auto location tagging."
          features={['Live word count', 'Drag & drop files', 'Geo-location detection']}
          onClick={() => setView('submit')}
        />
        <StageCard
          num={2}
          color="green"
          icon={Brain}
          title="AI/NLP Processing Engine"
          desc="Language detection, intent classification, entity extraction, sentiment & urgency analysis."
          features={['4 sub-modules', 'Confidence scoring', 'Manual review flagging']}
          onClick={() => setView('submit')}
        />
        <StageCard
          num={3}
          color="navy"
          icon={Route}
          title="Routing Engine"
          desc="Department mapping, sub-category tagging, jurisdiction check, and officer workload balancing."
          features={['Explainable AI panel', '4 routing reasons', 'Smart officer assignment']}
          onClick={() => setView('submit')}
        />
        <StageCard
          num={4}
          color="orange"
          icon={Copy}
          title="Duplicate & Pattern Detection"
          desc="Semantic similarity check, geo-clustering, duplicate merge with shared Case IDs, root-cause analysis."
          features={['Grouped complaints', 'Hotspot map', 'Root-cause patterns']}
          onClick={() => setView('dashboard')}
        />
        <StageCard
          num={5}
          color="green"
          icon={LayoutDashboard}
          title="Officer Dashboard"
          desc="Priority queue, live SLA timers with escalation alerts, and officer actions (accept/reject/resolve/forward)."
          features={['Live SLA countdown', 'Escalation alerts', 'Sortable queue']}
          onClick={() => setView('dashboard')}
        />
        <StageCard
          num={6}
          color="navy"
          icon={CheckCircle2}
          title="Resolution & Closure"
          desc="Status updates to citizens, feedback collection, and appeal loop-back to routing engine."
          features={['Status timeline', 'Feedback widget', 'Appeal re-routing']}
          onClick={() => setView('track')}
        />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <QuickStat icon={Zap} value="2.4s" label="Avg AI Processing" color="green" />
        <QuickStat icon={Sparkles} value="84%" label="Avg Confidence" color="navy" />
        <QuickStat icon={Link2} value="2" label="Duplicate Groups" color="orange" />
        <QuickStat icon={RefreshCw} value="128" label="Cases for Retraining" color="green" />
      </div>

      {/* CTA */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-navy-50 to-orange-50 border-navy-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-grey-800">Experience the full pipeline</h3>
            <p className="text-sm text-grey-500 mt-1">Submit a complaint and watch it flow through all 6 stages of AI processing.</p>
          </div>
          <button onClick={() => setView('submit')} className="btn-accent whitespace-nowrap">
            Start Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StageCard({
  num, color, icon: Icon, title, desc, features, onClick,
}: {
  num: number;
  color: 'orange' | 'green' | 'navy';
  icon: typeof FileText;
  title: string;
  desc: string;
  features: string[];
  onClick: () => void;
}) {
  const colorMap = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'hover:border-orange-300' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'hover:border-green-300' },
    navy: { bg: 'bg-navy-50', text: 'text-navy-600', border: 'hover:border-navy-300' },
  };
  const c = colorMap[color];
  return (
    <button
      onClick={onClick}
      className={`card p-5 text-left transition-all duration-200 hover:shadow-md ${c.border} group`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <div>
          <span className={`text-xs font-bold ${c.text}`}>STAGE {num}</span>
          <h3 className="font-semibold text-grey-800 leading-tight">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-grey-500 mb-3">{desc}</p>
      <ul className="space-y-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs text-grey-600">
            <CheckCircle2 className={`w-3 h-3 ${c.text}`} />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

function QuickStat({ icon: Icon, value, label, color }: { icon: typeof Zap; value: string; label: string; color: 'navy' | 'orange' | 'green' }) {
  const colorMap = {
    navy: 'text-navy-600',
    orange: 'text-orange-600',
    green: 'text-green-600',
  };
  return (
    <div className="card p-4 text-center">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${colorMap[color]}`} />
      <p className="text-2xl font-bold text-grey-800">{value}</p>
      <p className="text-xs text-grey-500 mt-0.5">{label}</p>
    </div>
  );
}
