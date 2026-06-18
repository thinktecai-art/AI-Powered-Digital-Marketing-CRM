import React, { useState } from 'react';
import { Contact, ActivityLog } from '../types';
import { 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  AlertCircle, 
  Plus, 
  Clock, 
  User, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Target
} from 'lucide-react';
import { calculateLeadScore } from '../utils/crmUtils';

interface ActivityLogsPanelProps {
  contact: Contact;
  onUpdateContact: (contact: Contact) => void;
  sendWebNotification: (title: string, body: string) => void;
}

export function ActivityLogsPanel({ contact, onUpdateContact, sendWebNotification }: ActivityLogsPanelProps) {
  const [logType, setLogType] = useState<ActivityLog['type']>('Call');
  const [logNotes, setLogNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback defaults for pre-existing records lacking explicit log details
  const getLogsWithFallbacks = (): ActivityLog[] => {
    const defaultLogs: ActivityLog[] = [
      {
        id: 'default-log-1',
        type: 'System',
        notes: `Prospect entered pipeline through [${contact.leadSource}] channel.`,
        timestamp: new Date(new Date(contact.lastActivity).getTime() - 2 * 3600000).toISOString()
      },
      {
        id: 'default-log-2',
        type: 'Email',
        notes: contact.notes || 'Sent introduction collateral regarding pricing plan structures.',
        timestamp: contact.lastActivity
      }
    ];

    return contact.activityLogs || defaultLogs;
  };

  const logsList = getLogsWithFallbacks().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getLogIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-blue-500" />;
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Meeting':
        return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      case 'Proposal':
        return <FileText className="w-3.5 h-3.5 text-purple-500" />;
      case 'Payment':
        return <CreditCard className="w-3.5 h-3.5 text-pink-500 animate-bounce" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const currentScore = calculateLeadScore(contact);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNotes.trim()) return;

    setIsSubmitting(true);
    const newLogItem: ActivityLog = {
      id: `log-${Date.now()}`,
      type: logType,
      notes: logNotes.trim(),
      timestamp: new Date().toISOString()
    };

    const currentLogs = contact.activityLogs || getLogsWithFallbacks();
    const updatedLogs = [...currentLogs, newLogItem];

    const updatedContact: Contact = {
      ...contact,
      lastActivity: newLogItem.timestamp,
      notes: `${logType}: ${newLogItem.notes}`, // Elevate as latest notes summary too
      activityLogs: updatedLogs
    };

    // Update in parent (which triggers Firestore sync)
    onUpdateContact(updatedContact);

    // Reset and alert
    setLogNotes('');
    setIsSubmitting(false);

    // Fire sound or Web Notification for client action tracker
    sendWebNotification(
      `📝 Interaction Tracked for ${contact.name}`,
      `Logged: "${newLogItem.notes.slice(0, 50)}..."`
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block h-4">Selected Lead Metadata</span>
          <h3 className="font-display font-bold text-slate-900 text-base">{contact.name}</h3>
        </div>
        
        <div className="text-right">
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono block">
            {contact.company || 'Private Lead'}
          </span>
        </div>
      </div>

      {/* Dynamic Score Tracker inside feed */}
      <div className="p-3.5 bg-gradient-to-br from-emerald-950 to-slate-900 rounded-2xl text-white flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-300 font-medium uppercase font-mono block">Scoring Strength</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xl font-bold font-display">{currentScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="text-emerald-400 font-bold block">
            {currentScore >= 75 ? '⚡ High Conversion Intent' : currentScore >= 50 ? '🔥 Warm Lead' : '❄️ Nurture Plan'}
          </span>
          <span className="text-[10px] text-slate-400">Calculated automatically</span>
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> Interaction Timeline
        </h4>

        <div className="max-h-[220px] overflow-y-auto pr-1 space-y-4 relative border-l border-slate-100 pl-3.5 mt-2 scrollbar-thin">
          {logsList.map((log) => (
            <div key={log.id} className="relative group">
              {/* Circular timeline node */}
              <div className="absolute -left-[23px] top-1.5 bg-white border border-slate-200 rounded-full p-0.5 z-10 shadow-sm group-hover:scale-110 transition-transform">
                {getLogIcon(log.type)}
              </div>
              
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 space-y-1 hover:bg-slate-50/90 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[9px] uppercase font-bold text-slate-400 bg-white border px-1.5 py-0.2 rounded">
                    {log.type}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{log.notes}</p>
                <div className="text-[9px] text-slate-400 text-right uppercase">
                  {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM TO ADD A NEW LOG */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-emerald-600" /> Log New Outreach & Event
        </h4>

        <form onSubmit={handleCreateLog} className="space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            {(['Call', 'Email', 'Meeting', 'Proposal'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLogType(type)}
                className={`py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition-all border text-center ${
                  logType === type
                    ? 'bg-emerald-900 border-emerald-950 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="e.g. Discussed subscription proposal, sent follow-up video script..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !logNotes.trim()}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            Log Session Outreach
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
