export type FunnelStageType = 
  | 'Awareness' 
  | 'Lead Capture' 
  | 'Nurture' 
  | 'Conversion' 
  | 'Retargeting' 
  | 'Upsell' 
  | 'Retention';

export interface Niche {
  id: string;
  name: string;
  description: string;
}

export interface Funnel {
  id: string;
  nicheId: string;
  nicheName: string;
  product: string;
  avatar: string;
  painPoint: string;
  desiredOutcome: string;
  mainChannel: string;
  pricePoint: string;
  createdAt: string;
  status: 'Active' | 'Draft' | 'Generating';
}

export interface Asset {
  id: string;
  funnelId: string;
  stageType: FunnelStageType;
  assetType: 'Ad' | 'Email' | 'LandingPage' | 'SalesPage' | 'Upsell' | 'Retention' | 'Webinar' | 'Survey';
  title: string;
  content: string;
  notes?: string;
  performanceMetrics?: {
    views?: number;
    clicks?: number;
    ctr?: number;
    conversions?: number;
  };
}

export interface ActivityLog {
  id: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Proposal' | 'System' | 'Payment';
  notes: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  dealValue: number;
  tags: string[];
  funnelStage: FunnelStageType;
  lastActivity: string;
  leadSource: string;
  notes?: string;
  activityLogs?: ActivityLog[];
}

export interface LeadFormElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'dropdown' | 'submit';
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export type CRMViewTab = 
  | 'dashboard' 
  | 'funnels' 
  | 'library' 
  | 'contacts' 
  | 'quizBuilder' 
  | 'voiceSimulator' 
  | 'sentinel'
  | 'aiCopywriter'
  | 'subscription';
