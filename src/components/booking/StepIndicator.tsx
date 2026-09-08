import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 overflow-x-auto scrollbar-thin px-1">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 min-w-fit">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors
                  ${done ? "bg-rose-600 text-white" : active ? "bg-rose-100 text-rose-700 border-2 border-rose-500" : "bg-blush-100 text-ink-500"}
                `}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[11px] whitespace-nowrap ${active ? "text-rose-700 font-semibold" : "text-ink-500"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 mb-4 ${done ? "bg-rose-500" : "bg-blush-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
