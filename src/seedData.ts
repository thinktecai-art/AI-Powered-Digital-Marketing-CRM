import { Niche, Funnel, Asset, Contact } from './types';

export const SUPPORTED_NICHES: Niche[] = [
  { id: 'fashion', name: 'Fashion', description: 'Capsule wardrobes, sustainable threads, premium footwear & boutique styling curation' },
  { id: 'beauty', name: 'Beauty', description: 'Active botanicals, organic skincare routines, beauty bars & non-toxic cosmetics' },
  { id: 'fitness', name: 'Fitness', description: 'Functional bodybuilding, metabolic strength, desk-bound posture rehab & premium nutrition' },
  { id: 'real estate', name: 'Real estate', description: 'Off-market strategic listing sourcing, first-time home buying protection, commercial investment' },
  { id: 'insurance', name: 'Insurance', description: 'Sovereign family protection packages, custom medical security grids, landlord and asset risk safety' },
  { id: 'e-commerce', name: 'E-commerce', description: 'High-margin niche consumer electronics, organic lifestyle gear, pet nutrition memberships' },
  { id: 'saas', name: 'SaaS', description: 'AI business process scaling nodes, integrated lead converters, real-time client intake pipelines' },
  { id: 'coaching', name: 'Coaching', description: 'High-ticket executive mindset calibration, premium agency scaling retreats, design-thinking audits' },
  { id: 'local services', name: 'Local services', description: 'Precision landscape design, climate smart HVAC mechanics, eco-safe home sanitizing' }
];

// Perfect preset seed funnel for Coach Niche to satisfy ready-made requirement
export const SEED_FUNNEL: Funnel = {
  id: 'seed-funnel-1',
  nicheId: 'coaching',
  nicheName: 'Coaching',
  product: 'The 100k Sovereign Advisor Mastermind',
  avatar: 'Desire-driven consultants and independent agency operators charging hourly on retainer',
  painPoint: 'Exhausted by constant scope creep, pricing client pressure, and irregular revenue valleys',
  desiredOutcome: 'Package expertise into a $10k+ elite advisory retainer, signing premium clients client-first with no cold messaging',
  mainChannel: 'LinkedIn Premium Organic & Short-form Workshops',
  pricePoint: '$12,500 Premium Retainer',
  createdAt: '2026-06-17T12:00:00.000Z',
  status: 'Active'
};

export const SEED_ASSETS: Asset[] = [
  {
    id: 'asset-1',
    funnelId: 'seed-funnel-1',
    stageType: 'Awareness',
    assetType: 'Ad',
    title: 'LinkedIn Direct-Response Breakdown',
    content: `🔍 Tired of Pitching Retainers that Get Squashed in Price Wars?\n\nIf you are an independent expert charging hourly, your clients aren't buying your credentials—they're renting your anxiety.\n\nOur client-architected Mastermind teaches consultants how to extract their knowledge into a single high-ticket signature outcome. Sign three premium clients a month using organic LinkedIn workshops.\n\n👉 Stop trading hours for dollars. Claim the free Sovereign System breakdown blueprint.`,
    notes: 'Primary ad layout targeting premium consulting personas.',
    performanceMetrics: { views: 12400, clicks: 421, ctr: 3.4, conversions: 45 }
  },
  {
    id: 'asset-2',
    funnelId: 'seed-funnel-1',
    stageType: 'Lead Capture',
    assetType: 'LandingPage',
    title: 'Sovereign Advisor Blueprint Landing Page',
    content: `HEADING:\nAchieve $30k+ Months on 5 Hours of Weekly Client Delivery Without Ever Cold Pitching.\n\nSUBHEAD:\nUnlock the exact high-ticket pricing matrix used by over 350+ independent experts to package their skills, elevate retainers to five-figures, and scale comfortably with zero employee overhead.\n\nBENEFITS:\n• Stop Hourly Billing: Learn to price outcomes, not labor hours, doubling margins overnight.\n• The Zero Call Trap: Qualify clients thoroughly before booking so you only talk to high-intent executives.\n• Client Autopilot: Build a simple, recurring workshop sequence that positions you as the ultimate authority.\n\nCTA:\nUnveil My Consulting Blueprint For Free`,
    notes: 'High-contrast white background rendering. Includes minimalist email input fields.',
    performanceMetrics: { views: 450, clicks: 120, ctr: 26.6, conversions: 88 }
  },
  {
    id: 'asset-3',
    funnelId: 'seed-funnel-1',
    stageType: 'Nurture',
    assetType: 'Email',
    title: 'Nurture Sequence Email 1 - Pricing Paradigm',
    content: `Subject: Why hourly retainers are a tax on your proficiency 🧠\n\nHello Friend,\n\nIf you charge $150/hour, the faster you solve a client's problem, the less money you make. Think about that.\n\nYou are financially penalized for being fast and skilled.\n\nInside our free Mastermind guide, we teach a pricing method called Sovereign packaging. If you can fix a $100,000 leaking pipe in 20 minutes, you don't charge for the minutes—you charge for the dry basement.\n\nIn tomorrow's message, we will look at how to get clients to agree to outcomes without questioning your hours.\n\nTalk soon,\nThe Mastermind Team`,
    notes: 'Sent instantly upon subscription.',
    performanceMetrics: { views: 88, clicks: 54, ctr: 61.3, conversions: 12 }
  },
  {
    id: 'asset-4',
    funnelId: 'seed-funnel-1',
    stageType: 'Conversion',
    assetType: 'SalesPage',
    title: 'Long-Form Sales Copy for Mastermind Program',
    content: `HEADLINE:\nThe Fast‑Track Path to Premium Consulting Sovereign Leadership.\n\nAre you looking to break out of the delivery hamster wheel?\n\nYou've built a robust reputation, yet you're still trading your health for margin. The Sovereign Mastermind is a 60-day sprint where we work side-by-side to build your value stack, automate client acquisition, and install high-leverage delivery templates.\n\nGUARANTEE:\nIf you don't secure our fee in pre-qualified new pipeline within the first 45 days, we work with you for free until you do.\n\nCTA: Join the VIP Mastermind`,
    notes: 'Premium pitch. Includes pricing breakdown matrices.',
    performanceMetrics: { views: 92, clicks: 15, ctr: 16.3, conversions: 3 }
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Eleanor Vance',
    email: 'eleanor.v@consultvance.com',
    phone: '+1 (555) 381-0023',
    company: 'Vance Advisory Group',
    dealValue: 12500,
    tags: ['Hourly Trap', 'Webinar Lead'],
    funnelStage: 'Conversion',
    lastActivity: '2026-06-17T15:30:11.000Z',
    leadSource: 'LinkedIn Organic',
    notes: 'Highly motivated. Left a question on the pricing blueprint. Called to confirm the guarantee.'
  },
  {
    id: 'contact-2',
    name: 'Marcus Sterling',
    email: 'marcus@sterlingdev.io',
    phone: '+1 (312) 345-0988',
    company: 'Sterling Solutions',
    dealValue: 12500,
    tags: ['SaaS Owner', 'High Intent'],
    funnelStage: 'Lead Capture',
    lastActivity: '2026-06-17T17:45:00.000Z',
    leadSource: 'Google Ads',
    notes: 'Downloaded the Blueprint landing page magnet. Read the core FAQ sections.'
  },
  {
    id: 'contact-3',
    name: 'Dr. Sarah Jenkins',
    email: 'sjenkins@jenkinsclinical.org',
    phone: '+1 (415) 890-4422',
    company: 'Sarah Jenkins Care LLC',
    dealValue: 8500,
    tags: ['Health Consultant', 'Email Opened'],
    funnelStage: 'Nurture',
    lastActivity: '2026-06-17T10:15:00.000Z',
    leadSource: 'Facebook Ad',
    notes: 'Opened Nurture Email 1 and spent 4 minutes on the testimonial page.'
  },
  {
    id: 'contact-4',
    name: 'David Lawson',
    email: 'david@lawsonwealth.co',
    phone: '+1 (201) 776-9081',
    company: 'Lawson Private Group',
    dealValue: 15000,
    tags: ['VIP List', 'Booked Call'],
    funnelStage: 'Conversion',
    lastActivity: '2026-06-17T16:20:00.000Z',
    leadSource: 'Referral',
    notes: 'Booking scheduled for Thursday morning at 10 AM. Interested in premium 1-on-1 coaching.'
  },
  {
    id: 'contact-5',
    name: 'Clara Oswald',
    email: 'clara@souvenirs.com',
    phone: '+1 (646) 554-1234',
    company: 'Travel & Time Ltd',
    dealValue: 5000,
    tags: ['Fashion Capsule', 'Left Cart'],
    funnelStage: 'Retargeting',
    lastActivity: '2026-06-17T14:02:11.000Z',
    leadSource: 'Instagram Shop',
    notes: 'Abandoned check-out on Eco-Luxe Capsule. Retargeting ad clicked!'
  }
];
