import { Contact } from '../types';

/**
 * Calculates a dynamic, automated score (0 - 100) for a lead based on:
 * 1. Deal Value (up to 40 pts) - $250 value increments, capped at $10k equivalent
 * 2. Funnel Stage progression (up to 35 pts) - deeper stages indicate stronger buying signals
 * 3. Recent activity & number of logging interactions (up to 25 pts)
 */
export function calculateLeadScore(contact: Contact): number {
  let score = 0;

  // 1. Deal Value score (Capped at 40 points)
  // Highly valuable deals get boosted scores
  const valueScore = Math.min(40, Math.floor((contact.dealValue || 0) / 350));
  score += valueScore;

  // 2. Funnel Stage Intent score (Max 35 points)
  const stageWeights: Record<string, number> = {
    'Awareness': 5,
    'Lead Capture': 10,
    'Nurture': 18,
    'Retargeting': 22,
    'Conversion': 30,
    'Upsell': 35,
    'Retention': 33
  };
  score += stageWeights[contact.funnelStage] || 5;

  // 3. Logged Interaction frequency (Max 15 points)
  const logsCount = contact.activityLogs?.length || 0;
  const interactionScore = Math.min(15, logsCount * 3);
  score += interactionScore;

  // 4. Recency of last logged activity within 48h (Max 10 points)
  if (contact.lastActivity) {
    try {
      const lastActiveTime = new Date(contact.lastActivity).getTime();
      const diffMs = Date.now() - lastActiveTime;
      const hoursSince = diffMs / (1000 * 60 * 60);
      if (hoursSince <= 24) {
        score += 10;
      } else if (hoursSince <= 72) {
        score += 6;
      } else {
        score += 2;
      }
    } catch {
      score += 2;
    }
  } else {
    score += 2;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Helper to escape CSV cell contents safely to handle quotes, commas, and formatting
 */
function escapeCsvCell(cell: string | number | undefined | null): string {
  if (cell === null || cell === undefined) return '';
  const cellStr = String(cell);
  if (/[",\r\n]/.test(cellStr)) {
    return `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
}

/**
 * Packs the CRM Leads Portfolio into a high-fidelity RFC 4180 structural CSV string and
 * prompts browser download trigger
 */
export function downloadCRMLeadsCSV(contacts: Contact[]) {
  const headers = [
    'Lead ID',
    'Full Name',
    'Email Address',
    'Phone',
    'Company Name',
    'Lead Source',
    'Funnel Stage',
    'Deal Value ($)',
    'Lead Score (0-100)',
    'Total Touches',
    'Last Activity',
    'Tags',
    'Internal Notes'
  ];

  const rows = contacts.map(c => {
    const score = calculateLeadScore(c);
    const numTouches = c.activityLogs?.length || 0;
    const tagsStr = c.tags ? c.tags.join('; ') : '';
    
    return [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.company || 'N/A',
      c.leadSource,
      c.funnelStage,
      c.dealValue,
      score,
      numTouches,
      c.lastActivity,
      tagsStr,
      c.notes || ''
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(','))
  ].join('\r\n');

  // Trigger file download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `CRM_Funnel_Leads_Report_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
