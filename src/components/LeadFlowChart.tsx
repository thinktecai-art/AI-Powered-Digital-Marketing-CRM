import React from 'react';
import { Contact, FunnelStageType } from '../types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LeadFlowChartProps {
  contacts: Contact[];
  activeContactId: string | null;
  selectedStageFilter: FunnelStageType | null;
  onSelectStageFilter: (stage: FunnelStageType | null) => void;
}

const STAGES: FunnelStageType[] = [
  'Awareness',
  'Lead Capture',
  'Nurture',
  'Conversion',
  'Retargeting',
  'Upsell',
  'Retention'
];

export function LeadFlowChart({
  contacts,
  activeContactId,
  selectedStageFilter,
  onSelectStageFilter
}: LeadFlowChartProps) {
  // Find current active contact
  const activeContact = contacts.find(c => c.id === activeContactId);
  const activeContactStage = activeContact?.funnelStage;

  // Calculate statistics per stage
  const stageStats = STAGES.reduce((acc, stage) => {
    const stageContacts = contacts.filter(c => c.funnelStage === stage);
    const totalValue = stageContacts.reduce((val, c) => val + (c.dealValue || 0), 0);
    acc[stage] = {
      count: stageContacts.length,
      value: totalValue
    };
    return acc;
  }, {} as Record<FunnelStageType, { count: number; value: number }>);

  // Total pipeline value
  const totalPipelineValue = contacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Interactive CRM Lead Flow Journey
          </h3>
          <p className="text-xs text-slate-500">
            {activeContact 
              ? `Visualizing path for lead "${activeContact.name}" (currently in ${activeContactStage} stage)`
              : 'Flow chart mapping lead density and conversion pipeline values side-by-side'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedStageFilter && (
            <button
              onClick={() => onSelectStageFilter(null)}
              className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
            >
              Clear Stage Filter
            </button>
          )}
          <div className="text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold text-slate-600 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            Total: <span className="text-slate-900 font-bold">${totalPipelineValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* SVG FLOW DIAGRAM CONTAINER */}
      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
        {/* Custom Keyframe Animations for flowing dashes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -24;
            }
          }
          .lead-flow-line-active {
            stroke-dasharray: 6, 6;
            animation: dash-flow 1.2s linear infinite;
          }
          .stage-pulse {
            animation: stage-pulse-keyframes 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes stage-pulse-keyframes {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.8;
            }
          }
        `}} />

        <div className="min-w-[840px] h-[160px] relative select-none px-4 py-2">
          {/* CONNECTOR PATHS BACKGROUND */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="inactiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {STAGES.map((stage, idx) => {
              if (idx === STAGES.length - 1) return null;
              
              // Calculate points
              const stepPercent = 100 / STAGES.length;
              const x1 = `${(idx + 0.5) * stepPercent}%`;
              const x2 = `${(idx + 1.5) * stepPercent}%`;
              const y = "50%";

              // Determine if this path has active movement (or if the selected user has passed through or is on this stage)
              const isFlowActive = activeContact 
                ? STAGES.indexOf(activeContactStage as FunnelStageType) >= idx
                : true; // Default flow moving everywhere when no contact is selected

              return (
                <g key={`link-${idx}`}>
                  {/* Thick background curve */}
                  <path 
                    d={`M ${x1} 80 Q ${(idx + 1) * stepPercent}% 80 ${x2} 80`}
                    fill="none"
                    stroke={isFlowActive ? "#d1fae5" : "#f1f5f9"}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                  {/* Glowing fluid flow line */}
                  <path 
                    d={`M ${x1} 80 Q ${(idx + 1) * stepPercent}% 80 ${x2} 80`}
                    fill="none"
                    stroke={isFlowActive ? "url(#activeGrad)" : "#cbd5e1"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    className={isFlowActive ? "lead-flow-line-active" : ""}
                  />
                </g>
              );
            })}
          </svg>

          {/* STAGE NODES */}
          <div className="absolute inset-0 flex justify-between items-center px-6">
            {STAGES.map((stage, idx) => {
              const stats = stageStats[stage];
              const isSelectedContactStage = activeContactStage === stage;
              const isFilterActive = selectedStageFilter === stage;
              
              return (
                <div 
                  key={stage}
                  onClick={() => onSelectStageFilter(isFilterActive ? null : stage)}
                  className="flex flex-col items-center justify-center text-center cursor-pointer group relative z-10"
                  style={{ width: `${100 / STAGES.length}%` }}
                >
                  {/* Pulsing halo ring for active contact */}
                  {isSelectedContactStage && (
                    <div className="absolute -top-1 w-14 h-14 bg-amber-400/20 border-2 border-amber-400/40 rounded-full stage-pulse animate-ping pointer-events-none" />
                  )}

                  {/* Stage Node Box */}
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
                      isSelectedContactStage
                        ? 'bg-amber-400 border-2 border-amber-500 text-emerald-950 scale-110 shadow-amber-200'
                        : isFilterActive
                          ? 'bg-emerald-600 border-2 border-emerald-700 text-white scale-105 ring-4 ring-emerald-100 shadow-emerald-200'
                          : stats.count > 0
                            ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 group-hover:bg-emerald-100 group-hover:scale-105'
                            : 'bg-slate-50 border-2 border-slate-200 text-slate-400 group-hover:bg-slate-100 group-hover:border-slate-300'
                    }`}
                  >
                    <span className="font-mono text-sm font-extrabold">
                      {stats.count}
                    </span>
                  </div>

                  {/* Stage Label */}
                  <div className="mt-2.5">
                    <span className={`text-[11px] font-bold block transition-colors leading-tight ${
                      isSelectedContactStage
                        ? 'text-amber-800'
                        : isFilterActive
                          ? 'text-emerald-700 font-extrabold'
                          : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                      {stage}
                    </span>
                    <span className={`text-[9px] font-mono font-semibold block mt-0.5 ${
                      isSelectedContactStage 
                        ? 'text-amber-700' 
                        : 'text-slate-400'
                    }`}>
                      ${stats.value.toLocaleString()}
                    </span>
                  </div>

                  {/* Tooltip on Hover showing details */}
                  <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] rounded-lg p-2.5 shadow-xl transition-all duration-200 pointer-events-none w-44 z-50 transform translate-y-2 group-hover:translate-y-0 text-left space-y-1">
                    <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-amber-400">Stage: {stage}</div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Leads:</span>
                      <span className="font-mono font-bold">{stats.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deal Value:</span>
                      <span className="font-mono font-bold text-emerald-400">${stats.value.toLocaleString()}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 border-t border-slate-700 pt-1 mt-1 font-sans italic text-center">
                      {isFilterActive ? "Click to clear filter" : "Click to view these prospects"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILTER NOTIFICATION HELPER */}
      {selectedStageFilter && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Currently filtering directory by <strong>{selectedStageFilter}</strong> stage. Select any node to change, or clear filter.</span>
          </div>
          <button
            onClick={() => onSelectStageFilter(null)}
            className="text-[10px] uppercase font-mono font-extrabold tracking-wider bg-white px-2 py-1 rounded border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all shadow-xs"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
