import { Check } from 'lucide-react';

export interface StepDef {
  num: number;
  label: string;
  color: 'orange' | 'green' | 'navy';
}

const DEFAULT_STEPS: StepDef[] = [
  { num: 1, label: 'Submission', color: 'orange' },
  { num: 2, label: 'AI/NLP', color: 'green' },
  { num: 3, label: 'Routing', color: 'navy' },
  { num: 4, label: 'Dedup', color: 'orange' },
  { num: 5, label: 'Dashboard', color: 'green' },
  { num: 6, label: 'Resolution', color: 'navy' },
];

const COLOR_MAP = {
  orange: { active: 'bg-orange-500 border-orange-500 text-white', done: 'bg-orange-100 border-orange-300 text-orange-700', idle: 'bg-grey-100 border-grey-300 text-grey-500' },
  green: { active: 'bg-green-500 border-green-500 text-white', done: 'bg-green-100 border-green-300 text-green-700', idle: 'bg-grey-100 border-grey-300 text-grey-500' },
  navy: { active: 'bg-navy-600 border-navy-600 text-white', done: 'bg-navy-100 border-navy-300 text-navy-700', idle: 'bg-grey-100 border-grey-300 text-grey-500' },
};

export function PipelineStepper({ currentStep, steps = DEFAULT_STEPS }: { currentStep: number; steps?: StepDef[] }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <div className="flex items-center justify-between min-w-[600px] sm:min-w-0 py-2">
        {steps.map((step, i) => {
          const colors = COLOR_MAP[step.color];
          const isDone = step.num < currentStep;
          const isActive = step.num === currentStep;
          const state = isDone ? 'done' : isActive ? 'active' : 'idle';
          const stateColors = colors[state];

          return (
            <div key={step.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive ? 'scale-110 shadow-md' : ''
                  } ${stateColors}`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${isActive ? 'text-grey-800' : isDone ? 'text-grey-600' : 'text-grey-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 rounded-full bg-grey-200 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      isDone ? 'w-full bg-green-400' : isActive ? 'w-1/2 bg-orange-400' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
