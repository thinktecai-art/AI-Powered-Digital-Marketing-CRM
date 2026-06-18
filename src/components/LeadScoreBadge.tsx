import React from 'react';
import { Contact } from '../types';
import { calculateLeadScore } from '../utils/crmUtils';
import { Flame, Zap, Award } from 'lucide-react';

interface LeadScoreBadgeProps {
  contact: Contact;
}

export function LeadScoreBadge({ contact }: LeadScoreBadgeProps) {
  const score = calculateLeadScore(contact);

  let badgeColor = '';
  let badgeBg = '';
  let label = '';
  let icon = null;

  if (score >= 75) {
    badgeBg = 'bg-red-50 text-red-700 border-red-200/60';
    badgeColor = 'text-red-700';
    label = 'Hot Potential';
    icon = <Flame className="w-3.5 h-3.5 animate-pulse text-red-500 fill-red-500" />;
  } else if (score >= 50) {
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200/60';
    badgeColor = 'text-amber-700';
    label = 'Warm Lead';
    icon = <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />;
  } else {
    badgeBg = 'bg-slate-50 text-slate-600 border-slate-200/60';
    badgeColor = 'text-slate-500';
    label = 'Cold Nurture';
    icon = <span className="w-1.5 h-1.5 rounded-full bg-slate-400 block" />;
  }

  // VIP trigger for extremely high deal value clients
  const isVip = (contact.dealValue || 0) >= 12000;

  return (
    <div className="flex items-center gap-1.5">
      <div className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold border flex items-center gap-1 ${badgeBg}`}>
        {icon}
        <span>Score: {score}/100</span>
        <span className="text-slate-300 mx-0.5">|</span>
        <span className="font-mono text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      {isVip && (
        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-none px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono tracking-widest uppercase flex items-center gap-0.5 shadow-sm">
          <Award className="w-3 h-3 text-white" /> VIP
        </span>
      )}
    </div>
  );
}
