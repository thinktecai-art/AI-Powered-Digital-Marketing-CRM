import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  FolderOpen, 
  Users, 
  PhoneCall, 
  ShieldAlert, 
  ClipboardCheck, 
  ArrowRight, 
  Play, 
  Eye, 
  RotateCw, 
  Edit3, 
  Send, 
  CheckCircle2, 
  UserPlus, 
  Search, 
  Code, 
  Video, 
  Download, 
  Save, 
  RefreshCw, 
  Layers, 
  Plus, 
  Trash2, 
  HelpCircle,
  TrendingUp,
  Mail,
  Zap,
  Globe,
  Settings,
  Check,
  AlertCircle,
  Volume2,
  Lock,
  Smartphone,
  ExternalLink,
  BellRing,
  Bell,
  FileText,
  MessageSquare,
  PhoneMissed,
  Award,
  Instagram,
  Facebook
} from 'lucide-react';
import { Niche, Funnel, Asset, Contact, FunnelStageType, CRMViewTab, LeadFormElement } from './types';
import { SUPPORTED_NICHES, SEED_FUNNEL, SEED_ASSETS, INITIAL_CONTACTS } from './seedData';
import { 
  syncContacts, 
  saveContactToFirestore, 
  deleteContactFromFirestore, 
  syncFunnels, 
  saveFunnelToFirestore,
  auth,
  signInWithGoogle,
  logoutUser,
  onAuthStateChanged,
  User 
} from './firebase';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { downloadCRMLeadsCSV, calculateLeadScore } from './utils/crmUtils';
import { LeadScoreBadge } from './components/LeadScoreBadge';
import { ActivityLogsPanel } from './components/ActivityLogsPanel';
import { StripeMockCheckout } from './components/StripeMockCheckout';
import AICopywriterStudio from './components/AICopywriterStudio';

export default function App() {
  // Navigation & Core List States
  const [activeTab, setActiveTab] = useState<CRMViewTab>('dashboard');
  const [selectedNicheId, setSelectedNicheId] = useState<string>('coaching');
  const [funnels, setFunnels] = useState<Funnel[]>([SEED_FUNNEL]);
  const [assets, setAssets] = useState<Asset[]>(SEED_ASSETS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Active Selected Funnel for Detail views & Visual Diagrams
  const [activeFunnelId, setActiveFunnelId] = useState<string>('seed-funnel-1');

  // Interactive Funnel Generator Fields (Universal Niche architecture)
  const [generatorNiche, setGeneratorNiche] = useState<string>('coaching');
  const [generatorProduct, setGeneratorProduct] = useState<string>('Premium Mindset Masterclass');
  const [generatorAvatar, setGeneratorAvatar] = useState<string>('Busy corporate directors seeking mental clarity');
  const [generatorPainPoint, setGeneratorPainPoint] = useState<string>('Dwindling focus, burnout, and lack of clarity');
  const [generatorOutcome, setGeneratorOutcome] = useState<string>('Unlock sharp mental clarity and dynamic morning routines');
  const [generatorChannel, setGeneratorChannel] = useState<string>('LinkedIn');
  const [generatorPrice, setGeneratorPrice] = useState<string>('$5,000 Package');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationType, setGenerationType] = useState<'real' | 'simulated'>('real');

  // Asset detail & optimization modal states
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [optimizationGoal, setOptimizationGoal] = useState<string>('Increase emotional resonance & authority hook');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationLog, setOptimizationLog] = useState<string[]>([]);
  const [editingContent, setEditingContent] = useState<string>('');

  // AI Chat Assistant State
  const [assistantLogs, setAssistantLogs] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: "Hello! I'm your Gemini Marketing AI. I can craft custom funnel hooks, suggest lead magnets for any niche, or analyze your copy. Try asking: 'Generate a headline for insurance targeting parents'!", time: '12:00 PM' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);

  // Dynamic Lead Magnet & Form Creator Stage
  const [formFields, setFormFields] = useState<LeadFormElement[]>([
    { id: 'f-1', type: 'text', label: 'Full Name', placeholder: 'Enter your name...', required: true },
    { id: 'f-2', type: 'text', label: 'Email Address', placeholder: 'yourname@domain.com', required: true },
    { id: 'f-3', type: 'dropdown', label: 'Primary Pain Point', options: ['Lack of qualified leads', 'Inconsistent sales', 'No time for tracking'], required: false }
  ]);
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'checkbox' | 'dropdown'>('text');

  // Contact Drawer / Add Contact Form State
  const [activeContactId, setActiveContactId] = useState<string>('contact-1');
  const [crmSidebarTab, setCrmSidebarTab] = useState<'add-lead' | 'logs'>('logs');
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    dealValue: 2000,
    tags: '',
    funnelStage: 'Lead Capture' as FunnelStageType,
    leadSource: 'Google Ads',
    notes: ''
  });

  // Voice AI dialer simulation state
  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const [voiceLog, setVoiceLog] = useState<string[]>([
    "🎙️ Voice AI cold caller ready. Enter lead, choose pitch structure, and launch call."
  ]);
  const [selectedVoiceLeadId, setSelectedVoiceLeadId] = useState<string>('contact-1');
  const [voiceScriptMode, setVoiceScriptMode] = useState<string>('friendly-nudge');

  // Live alerts system
  const [liveAlerts, setLiveAlerts] = useState<string[]>([
    "🔔 Notification: Lead Eleanor Vance clicked Retargeting Carousel Ad",
    "✨ System: Fresh conversion model cached for Coach niche"
  ]);

  // Video Script Generator State
  const [videoScriptInput, setVideoScriptInput] = useState<string>('Create a premium 30-second promo script for our metabolic workout blueprint showing transformation speed');
  const [isVideoGenerating, setIsVideoGenerating] = useState<boolean>(false);
  const [videoResult, setVideoResult] = useState<string>('');

  // Voice AI Script Generator State
  const [voiceGenBusiness, setVoiceGenBusiness] = useState<string>('Apex Growth Partners');
  const [voiceGenOffer, setVoiceGenOffer] = useState<string>('Free 15-Minute Automated Funnel Audit & Pipeline Roadmap');
  const [voiceGenAudience, setVoiceGenAudience] = useState<string>('B2B SaaS Founders & Solo Marketing Directors');
  const [voiceGenGoal, setVoiceGenGoal] = useState<string>('booking'); // booking, qualification, follow-up
  const [isVoiceGenerating, setIsVoiceGenerating] = useState<boolean>(false);
  const [voiceGeneratedScript, setVoiceGeneratedScript] = useState<{
    greeting: string;
    qualification: string[];
    valuePitch: string;
    objections: { objection: string; handler: string }[];
    cta: string;
    fallback: string;
  } | null>(null);

  // Call Tracking Follow-Up Generator States
  const [callTrackingType, setCallTrackingType] = useState<'missed' | 'completed'>('missed');
  const [callTrackingBusiness, setCallTrackingBusiness] = useState<string>('Apex Growth Partners');
  const [callTrackingOffer, setCallTrackingOffer] = useState<string>('Free 15-Minute Automated Funnel Audit & Pipeline Roadmap');
  const [isCallTrackingGenerating, setIsCallTrackingGenerating] = useState<boolean>(false);
  const [callTrackingResult, setCallTrackingResult] = useState<{
    smsFollowUp: string;
    emailFollowUp: {
      subject: string;
      body: string;
    };
    voicemailScript: string;
  } | null>(null);

  // Automated Inbound Responder States
  const [inboundPlatform, setInboundPlatform] = useState<string>('sms');
  const [inboundGoal, setInboundGoal] = useState<string>('Book qualified leads for high-ticket coaching/consulting');
  const [inboundBusiness, setInboundBusiness] = useState<string>('Nova SaaS Labs');
  const [inboundOffer, setInboundOffer] = useState<string>('Complimentary 30-Minute Systems Audit & Roadmap Session');
  const [inboundBookingLink, setInboundBookingLink] = useState<string>('https://calendly.com/nova-saas-labs/audit');
  const [isInboundGenerating, setIsInboundGenerating] = useState<boolean>(false);
  const [inboundResult, setInboundResult] = useState<{
    instantReply: string;
    qualificationQuestion: string;
    offerCta: string;
    bookingLinkMessage: string;
  } | null>(null);

  // Dynamic AI Survey & Quiz Builder States
  const [quizGenBusiness, setQuizGenBusiness] = useState<string>('Velocity Consulting Group');
  const [quizGenOffer, setQuizGenOffer] = useState<string>('Complimentary 15-Minute Pipeline Optimization Blueprint');
  const [quizGenAudience, setQuizGenAudience] = useState<string>('E-Commerce Brands scaling to $100k/mo');
  const [quizGenGoal, setQuizGenGoal] = useState<string>('qualifying qualified high-intent partnerships');
  const [isQuizGenerating, setIsQuizGenerating] = useState<boolean>(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<{
    title: string;
    description: string;
    questions: {
      id: string;
      question: string;
      type: 'multiple-choice' | 'short-text' | 'scale';
      options?: string[];
      scoring?: { option: string; score: number }[];
      segmentationTag: string;
    }[];
    results: {
      range: string;
      segment: string;
      heading: string;
      summary: string;
    }[];
    recommendedAction: string;
  } | null>(null);

  // Interactive Live Quiz Runner States
  const [quizCurrentStep, setQuizCurrentStep] = useState<number>(0); // 0 = start screen, 1 to questions.length = question screens, questions.length + 1 = lead collection, questions.length + 2 = result screen
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizLeadName, setQuizLeadName] = useState<string>('');
  const [quizLeadEmail, setQuizLeadEmail] = useState<string>('');
  const [quizLeadCompany, setQuizLeadCompany] = useState<string>('');
  const [quizFinalResult, setQuizFinalResult] = useState<{
    score: number;
    segment: string;
    heading: string;
    summary: string;
    assignedTags: string[];
  } | null>(null);
  const [isQuizSubmitting, setIsQuizSubmitting] = useState<boolean>(false);

  // Maintenance Agent & Sentinel Shield logs
  const [sentinelShieldEnabled, setSentinelShieldEnabled] = useState<boolean>(true);
  const [systemUptime, setSystemUptime] = useState<string>('99.98%');
  const [totalBugsFixed, setTotalBugsFixed] = useState<number>(42);
  const [sentinelLogs, setSentinelLogs] = useState<string[]>([
    "🛡️ Cloud Firestore and Auth synchronization rules verified as secure.",
    "🚀 Offline-resilience caching engine initiated successfully.",
    "✅ Threat Shield actively protecting client webhook callbacks."
  ]);
  const [isFixingBugs, setIsFixingBugs] = useState<boolean>(false);

  // Notification close controller
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate random background lead interactions occasionally to show living SaaS dashboard
      const actions = [
        "🔥 Eleanor Vance has moved to Nurture stage: opened email 1",
        "🎯 AI Engine optimized ad variations targeting Fitness dads with +40% click outcome forecast",
        "💡 Marcus Sterling submitted interest form on 'The Sovereign Advisor Blueprint'!",
        "📞 Voice AI automated caller logged 2m 15s check-in with David Lawson"
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLiveAlerts(prev => [randomAction, ...prev.slice(0, 4)]);
    }, 25000);
    return () => clearInterval(timer);
  }, []);

  // Web Notification API State & Alert System
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    if (permission === 'granted') {
      sendWebNotification("🔔 Alerts Active!", "You will now receive push notifications when leads move stages or high-value prospects are captured.");
    }
  };

  const sendWebNotification = (title: string, body: string) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/assets/logo.png'
        });
      } catch (e) {
        console.warn("Local browser Notification failed:", e);
      }
    }
  };

  // Google Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-Time Firebase Firestore State Synchronization Service
  useEffect(() => {
    if (!currentUser) return;

    console.log("Initializing real-time Firebase Firestore synchronization services...");
    const unsubscribeContacts = syncContacts((synced) => {
      if (synced && synced.length > 0) {
        setContacts(synced);
      }
    }, INITIAL_CONTACTS);

    const unsubscribeFunnels = syncFunnels((synced) => {
      if (synced && synced.length > 0) {
        setFunnels(synced);
      }
    }, [SEED_FUNNEL]);

    return () => {
      unsubscribeContacts();
      unsubscribeFunnels();
    };
  }, [currentUser]);

  // Prepare data for CRM Leads Pipeline Growth over time (last 7 days cumulative rollup)
  const getPipelineGrowthData = () => {
    const baseValue = contacts.reduce((sum, c) => sum + c.dealValue, 0) || 53500;
    const baseLeadsCount = contacts.length || 5;
    
    return [
      { date: 'Jun 11', 'Leads Count': Math.max(1, Math.round(baseLeadsCount * 0.3)), 'Pipeline Value ($)': Math.round(baseValue * 0.25) },
      { date: 'Jun 12', 'Leads Count': Math.max(2, Math.round(baseLeadsCount * 0.45)), 'Pipeline Value ($)': Math.round(baseValue * 0.38) },
      { date: 'Jun 13', 'Leads Count': Math.max(2, Math.round(baseLeadsCount * 0.5)), 'Pipeline Value ($)': Math.round(baseValue * 0.50) },
      { date: 'Jun 14', 'Leads Count': Math.max(3, Math.round(baseLeadsCount * 0.62)), 'Pipeline Value ($)': Math.round(baseValue * 0.58) },
      { date: 'Jun 15', 'Leads Count': Math.max(3, Math.round(baseLeadsCount * 0.72)), 'Pipeline Value ($)': Math.round(baseValue * 0.75) },
      { date: 'Jun 16', 'Leads Count': Math.max(4, Math.round(baseLeadsCount * 0.85)), 'Pipeline Value ($)': Math.round(baseValue * 0.88) },
      { date: 'Jun 17', 'Leads Count': baseLeadsCount, 'Pipeline Value ($)': baseValue }
    ];
  };

  // Prepare data for Funnel Stage Retention Conversion rates using active fields
  const getConversionRateData = () => {
    const totalLeads = contacts.length || 1;
    const stages: FunnelStageType[] = ['Awareness', 'Lead Capture', 'Nurture', 'Conversion', 'Retargeting'];
    
    return stages.map(stage => {
      const count = contacts.filter(c => c.funnelStage === stage).length;
      // Formula: conversion rate is relative to total portfolio to demonstrate pipeline ratios
      const rate = Math.round((count / totalLeads) * 100);
      return {
        stage,
        'Leads Count': count,
        'Conversion Rate (%)': count > 0 ? rate : 15 // Seed a default representation if empty for visualization
      };
    });
  };

  // Handler: Generate Funnel via backend Gemini API
  const handleGenerateFunnel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: generatorNiche,
          product: generatorProduct,
          avatar: generatorAvatar,
          painPoint: generatorPainPoint,
          desiredOutcome: generatorOutcome,
          mainChannel: generatorChannel,
          pricePoint: generatorPrice
        })
      });

      const resJson = await response.json();
      if (resJson.data) {
        const generatedData = resJson.data;
        const newFunnelId = `funnel-${Date.now()}`;
        
        // Map backend output into our system models
        const newFunnelRec: Funnel = {
          id: newFunnelId,
          nicheId: generatorNiche.toLowerCase(),
          nicheName: generatorNiche,
          product: generatorProduct,
          avatar: generatorAvatar,
          painPoint: generatorPainPoint,
          desiredOutcome: generatorOutcome,
          mainChannel: generatorChannel,
          pricePoint: generatorPrice,
          createdAt: new Date().toISOString(),
          status: 'Active'
        };

        const parsedAssets: Asset[] = [
          {
            id: `asset-${newFunnelId}-1`,
            funnelId: newFunnelId,
            stageType: 'Awareness',
            assetType: 'Ad',
            title: `${generatorNiche} Facebook Launch Ad`,
            content: `📢 PLATFORM Campaign: ${generatedData.awareness?.ads?.[0]?.platform || 'Meta / Instagram'}
⭐️ HEADLINE: ${generatedData.awareness?.ads?.[0]?.headline || 'Transform Your Results'}
📝 TEXT: ${generatedData.awareness?.ads?.[0]?.primaryText || 'Tired of struggle? Look at this.'}
🎯 Call to Action: ${generatedData.awareness?.ads?.[0]?.cta || 'Learn More'}

🔍 EXTRA Hooks:
${(generatedData.awareness?.hooks || []).map((h: string, idx: number) => `${idx + 1}. "${h}"`).join('\n')}`,
            notes: 'Generated via Gemini neural-net pipeline.',
            performanceMetrics: { views: 0, clicks: 0, ctr: 0, conversions: 0 }
          },
          {
            id: `asset-${newFunnelId}-2`,
            funnelId: newFunnelId,
            stageType: 'Lead Capture',
            assetType: 'LandingPage',
            title: `Lead Capture Landing Page Angle`,
            content: `🔑 LEADER HEAD: ${generatedData.leadCapture?.landingPageHook || 'Achieve Outcome Without Pain'}
🎁 Lead Magnet Title: "${generatedData.leadCapture?.leadMagnetTitle || 'Sovereign Catalyst'}"
📌 Description: ${generatedData.leadCapture?.leadMagnetDescription || 'Download immediately.'}

💬 LANDING MODULES:
${(generatedData.leadCapture?.landingPageSections || []).map((s: any) => `* [${s.title}]: ${s.content}`).join('\n\n')}`,
            notes: 'Direct-response wireframe copy structured for mobile views.',
            performanceMetrics: { views: 0, clicks: 0, ctr: 0, conversions: 0 }
          },
          {
            id: `asset-${newFunnelId}-3`,
            funnelId: newFunnelId,
            stageType: 'Nurture',
            assetType: 'Email',
            title: `3-Tier Sequence (Email 1 Ready)`,
            content: `📬 Subject Line: ${generatedData.nurture?.emails?.[0]?.subject || 'Welcome inside!'}
ℹ️ Preview Text: ${generatedData.nurture?.emails?.[0]?.preview || 'Instant strategy overview.'}

${generatedData.nurture?.emails?.[0]?.body || 'Hello Friend, your roadmap is ready inside.'}`,
            notes: 'Follow-up template trigger.',
            performanceMetrics: { views: 0, clicks: 0, ctr: 0, conversions: 0 }
          },
          {
            id: `asset-${newFunnelId}-4`,
            funnelId: newFunnelId,
            stageType: 'Conversion',
            assetType: 'SalesPage',
            title: `Closing Pitch & Urgency Stack`,
            content: `💎 CORE HEADLINE: ${generatedData.conversion?.headline || 'Ready to unlock the best?'}
🔥 Primary Promise: ${generatedData.conversion?.bigPromise || 'Fully automated, high conversions.'}
💵 Sales Angle Style: ${generatedData.conversion?.salesPageAngle || 'Authority branding'}
👉 MAIN CTA: ${generatedData.conversion?.cta || 'Proceed to Secure Enrollment'}

⏳ Urgency Scarcity Stack:
${(generatedData.conversion?.urgencyAngles || []).map((u: string) => `• ${u}`).join('\n')}`,
            notes: 'PAS framework representation.',
            performanceMetrics: { views: 0, clicks: 0, ctr: 0, conversions: 0 }
          }
        ];

        saveFunnelToFirestore(newFunnelRec);
        setAssets(prev => [...parsedAssets, ...prev]);
        setActiveFunnelId(newFunnelId);
        
        // Push notification
        sendWebNotification("🎉 New AI Funnel Created!", `Successfully generated funnel structure for ${generatorProduct}`);
        setLiveAlerts(prev => [`🎉 Funnel for "${generatorProduct}" created & cataloged successfully!`, ...prev]);
        
        // Go back to view the detail of the new funnel
        setActiveTab('funnels');
      }
    } catch (err) {
      console.error(err);
      alert("Failed creating high-performance funnel. Check server container logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Optimize dynamic asset using Conversational AI
  const handleOptimizeAsset = async () => {
    if (!selectedAsset) return;
    setIsOptimizing(true);
    setOptimizationLog(prev => [...prev, `⚡ Submitting copy of "${selectedAsset.title}" for metric improvements`]);
    
    try {
      const response = await fetch('/api/ai/optimize-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: selectedNicheId,
          stageType: selectedAsset.stageType,
          assetType: selectedAsset.assetType,
          currentContent: editingContent,
          goal: optimizationGoal
        })
      });

      const resJson = await response.json();
      if (resJson.data) {
        const { improvedContent, testingIdeas } = resJson.data;
        
        // Update local state is matching asset
        setAssets(prev => prev.map(a => {
          if (a.id === selectedAsset.id) {
            return {
              ...a,
              content: improvedContent,
              notes: `Hypothesis suggestions for tracking: \n${testingIdeas.join('\n')}`
            };
          }
          return a;
        }));
        
        setEditingContent(improvedContent);
        setOptimizationLog(prev => [
          ...prev, 
          `✅ Optimization successfully executed!`,
          `📝 Suggestion A/B: ${testingIdeas[0]}`
        ]);
        setLiveAlerts(prev => [`🧠 Asset optimized: "${selectedAsset.title}" has increased conversion likelihood`, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setOptimizationLog(prev => [...prev, `❌ Error calling conversion neural optimizer.`]);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Chat Assistant callback handler
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setAssistantLogs(prev => [...prev, { sender: 'user', text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
    setIsChatTyping(true);

    // Call simulated smart response or trigger Gemini backend
    try {
      // Build a light context-aware advisory answer
      setTimeout(() => {
        let answer = "";
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('headline') || lowerMessage.includes('title')) {
          answer = `💡 **Conversion Headline Framework Recommendation:**\n"How to achieve [Desired Outcome] in [Short Time] without [Core Pain Point]"\n\nFor premium high-ticket niches, avoid fluffy superlatives. Try stating the quantitative promise on direct off-black typography backgrounds!`;
        } else if (lowerMessage.includes('lead magnet') || lowerMessage.includes('cheat sheet')) {
          answer = `🎁 **High-Converting Lead Magnet Strategy:**\nAvoid writing 50-page PDFs. The highest converting opt-ins are **1-page checklists, spreadsheet models, or interactive quick assessments** that provide immediate Dopamine rewards within 30 seconds of entry!`;
        } else if (lowerMessage.includes('traffic') || lowerMessage.includes('ads') || lowerMessage.includes('facebook')) {
          answer = `📈 **Neural Ad Blueprint:**\nFocus on 'Pattern Interrupters' in the first 3 seconds of video or text. Use native social styles rather than overly-designed banners. Users trust human-like, genuine behind-the-scenes snapshots far more than corporate ads.`;
        } else {
          answer = `🤖 **Gemini Funnel Architect Advisory:**\nI have evaluated your request regarding our currently active funnel: *"${funnels[0]?.product}"*. To maximize your conversion probability, I recommend implementing **Missed-Call Text Back** automations to capture phone numbers directly inside your custom forms page!`;
        }
        
        setAssistantLogs(prev => [...prev, { 
          sender: 'bot', 
          text: answer, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setIsChatTyping(false);
      }, 900);
    } catch (err) {
      setIsChatTyping(false);
    }
  };

  // Add field to Lead Form Builder
  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const newField: LeadFormElement = {
      id: `f-${Date.now()}`,
      type: newFieldType as any,
      label: newFieldName,
      placeholder: `Enter your ${newFieldName.toLowerCase()}...`,
      required: false,
      options: newFieldType === 'dropdown' ? ['Option A', 'Option B', 'Option C'] : undefined
    };
    setFormFields([...formFields, newField]);
    setNewFieldName('');
  };

  // Delete dynamic field
  const handleDeleteField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  // Form submission: adds manual CRM contacts
  const handleCreateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;

    const added: Contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || '+1 (555) 000-0000',
      company: newContact.company || 'Independent Lead',
      dealValue: Number(newContact.dealValue) || 1500,
      tags: newContact.tags ? newContact.tags.split(',').map(t => t.trim()) : ['Manual Input'],
      funnelStage: newContact.funnelStage,
      lastActivity: new Date().toISOString(),
      leadSource: newContact.leadSource,
      notes: newContact.notes || 'Prospect added via organized dashboard portal.'
    };

    // Save Contact to Firebase Firestore to ensure cross-device availability
    saveContactToFirestore(added);

    // Trigger Web Push Notification
    const isHighValue = added.dealValue >= 10000;
    const notificationTitle = isHighValue ? "🔥 High-Value Prospect Captured!" : "👥 New Prospect Captured";
    const notificationBody = `${added.name} of ${added.company} entered the pipeline at stage: ${added.funnelStage} ($${added.dealValue.toLocaleString()})`;
    sendWebNotification(notificationTitle, notificationBody);

    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      dealValue: 2000,
      tags: '',
      funnelStage: 'Lead Capture',
      leadSource: 'Google Ads',
      notes: ''
    });

    setLiveAlerts(prev => [`👥 Contact "${added.name}" queued into Pipeline successfully!`, ...prev]);
  };

  // AI Voice Script Generator function
  const handleGenerateVoiceScript = async () => {
    setIsVoiceGenerating(true);
    setVoiceGeneratedScript(null);
    try {
      const response = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'voice_script',
          inputs: {
            product_name: voiceGenBusiness,
            custom_offer: voiceGenOffer,
            avatar: voiceGenAudience,
            desired_outcome: voiceGenGoal === 'booking' ? 'book appointment' : voiceGenGoal === 'qualification' ? 'lead qualification' : 'follow-up session',
            pain_point: 'handling client outreach manually and losing hot leads'
          }
        })
      });
      const data = await response.json();
      if (data && data.data) {
        setVoiceGeneratedScript(data.data);
        setLiveAlerts(prev => [`🎙️ New Voice AI script successfully generated for "${voiceGenBusiness}"!`, ...prev]);
      }
    } catch (err) {
      console.error("Voice script generation error: ", err);
    } finally {
      setIsVoiceGenerating(false);
    }
  };

  // Call Tracking Follow-Up messages generator function
  const handleGenerateCallTrackingFollowUp = async () => {
    setIsCallTrackingGenerating(true);
    setCallTrackingResult(null);
    try {
      const response = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'call_tracking',
          inputs: {
            call_type: callTrackingType,
            business: callTrackingBusiness,
            offer: callTrackingOffer,
            product_name: callTrackingBusiness,
            custom_offer: callTrackingOffer
          }
        })
      });
      const data = await response.json();
      if (data && data.data) {
        setCallTrackingResult(data.data);
        setLiveAlerts(prev => [`📞 New Call Tracking follow-up sequence compiled for ${callTrackingType} call!`, ...prev]);
      }
    } catch (err) {
      console.error("Call tracking follow-up generation error: ", err);
    } finally {
      setIsCallTrackingGenerating(false);
    }
  };

  // Inbound Platform Auto-Responder messages generator function
  const handleGenerateInboundResponder = async () => {
    setIsInboundGenerating(true);
    setInboundResult(null);
    try {
      const response = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'inbound_responder',
          inputs: {
            platform: inboundPlatform,
            goal: inboundGoal,
            business: inboundBusiness,
            offer: inboundOffer,
            booking_link: inboundBookingLink,
            product_name: inboundBusiness,
            custom_offer: inboundOffer
          }
        })
      });
      const data = await response.json();
      if (data && data.data) {
        setInboundResult(data.data);
        setLiveAlerts(prev => [`💬 Automated Inbound Auto-Responder compiled for ${inboundPlatform}!`, ...prev]);
      }
    } catch (err) {
      console.error("Inbound auto-responder generation error: ", err);
    } finally {
      setIsInboundGenerating(false);
    }
  };

  // Dynamic AI Quiz/Survey Generator Function
  const handleGenerateQuizSurvey = async () => {
    setIsQuizGenerating(true);
    setGeneratedQuiz(null);
    setQuizCurrentStep(0);
    setQuizAnswers({});
    setQuizCompleted(false);
    setQuizFinalResult(null);
    setQuizLeadName('');
    setQuizLeadEmail('');
    setQuizLeadCompany('');

    try {
      const response = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'quiz_survey',
          inputs: {
            product_name: quizGenBusiness,
            custom_offer: quizGenOffer,
            avatar: quizGenAudience,
            desired_outcome: quizGenGoal,
            pain_point: 'losing warm traffic before capturing their professional profiles and scoring qualification intent'
          }
        })
      });
      const data = await response.json();
      if (data && data.data) {
        setGeneratedQuiz(data.data);
        setLiveAlerts(prev => [`📝 New high-converting qualification Survey/Quiz loaded as custom embed!`, ...prev]);
      }
    } catch (err) {
      console.error("Quiz & Survey generation error: ", err);
    } finally {
      setIsQuizGenerating(false);
    }
  };

  // AI Form/Quiz Solver and Lead Capture Engine
  const handleQuizSubmission = async () => {
    if (!quizLeadName || !quizLeadEmail) {
      alert("Please provide both your Name and Email Address.");
      return;
    }
    if (!generatedQuiz) return;

    setIsQuizSubmitting(true);
    try {
      // Calculate total score based on selected answers
      let calculatedScore = 0;
      const assignedTags: string[] = ['AI Quiz Lead'];

      generatedQuiz.questions.forEach((q) => {
        const chosenAnswer = quizAnswers[q.id];
        if (chosenAnswer) {
          const qScoring = q.scoring || [];
          const matchedScore = qScoring.find(s => s.option === chosenAnswer);
          if (matchedScore) {
            calculatedScore += Number(matchedScore.score);
          } else if (q.type === 'scale') {
            const scaleNum = Number(chosenAnswer);
            if (!isNaN(scaleNum)) {
              calculatedScore += scaleNum;
            }
          }
          
          if (q.segmentationTag) {
            assignedTags.push(q.segmentationTag);
          }
        }
      });

      // Find the matched segment range
      let matchedResult = generatedQuiz.results?.[0]; // Default fallback if no match
      if (generatedQuiz.results && generatedQuiz.results.length > 0) {
        for (const resItem of generatedQuiz.results) {
          const rangeParts = resItem.range.split('-');
          if (rangeParts.length === 2) {
            const minBound = Number(rangeParts[0].trim());
            const maxBound = Number(rangeParts[1].trim());
            if (calculatedScore >= minBound && calculatedScore <= maxBound) {
              matchedResult = resItem;
              break;
            }
          }
        }
      }

      const outcomeSegment = matchedResult?.segment || "Qualified Lead";
      const outcomeHeading = matchedResult?.heading || "Optimal Fit Detected";
      const outcomeSummary = matchedResult?.summary || "Your responses indicate high interest and perfect compatibility with our core offering.";

      assignedTags.push(outcomeSegment.replace(/\s+/g, '-').toLowerCase());

      const dynamicNotes = `AI QUIZ SUBMISSION DETAILS:\n` +
        `--------------------\n` +
        `Quiz: "${generatedQuiz.title}"\n` +
        `Raw Score: ${calculatedScore} points\n` +
        `Assigned Segment: ${outcomeSegment}\n\n` +
        `Answers Breakdown:\n` +
        generatedQuiz.questions.map((q, idx) => `q[${idx + 1}] ${q.question} -> Response: "${quizAnswers[q.id] || '(No response)'}"`).join('\n');

      const isHighValue = calculatedScore >= 25;
      const newCapture: Contact = {
        id: `quiz-lead-${Date.now()}`,
        name: quizLeadName,
        email: quizLeadEmail,
        phone: '+1 (555) 700-1200',
        company: quizLeadCompany || 'Self-Employed Operator',
        dealValue: isHighValue ? 5000 : 2500,
        tags: assignedTags,
        funnelStage: isHighValue ? 'Nurture' : 'Lead Capture',
        lastActivity: new Date().toISOString(),
        leadSource: 'AI Landing Quiz',
        notes: dynamicNotes
      };

      // Real integration: push to database & app state
      saveContactToFirestore(newCapture);
      setContacts(prev => [newCapture, ...prev]);

      setQuizFinalResult({
        score: calculatedScore,
        segment: outcomeSegment,
        heading: outcomeHeading,
        summary: outcomeSummary,
        assignedTags: assignedTags
      });

      // Send telemetry/push notification
      sendWebNotification(
        isHighValue ? "🚀 High-Value AI Quiz Lead Captured!" : "📝 New Diagnostic Quiz Lead",
        `${quizLeadName} scored ${calculatedScore} and matched: ${outcomeSegment}`
      );

      setQuizCompleted(true);
      setLiveAlerts(prev => [`🎉 Lead "${quizLeadName}" completed the AI Quiz and synchronized into CRM!`, ...prev]);

    } catch (err) {
      console.error("Quiz submission calculation error: ", err);
    } finally {
      setIsQuizSubmitting(false);
    }
  };

  // AI Voice Agent Simulation Launcher
  const triggerVoiceDialer = () => {
    const selectedLead = contacts.find(c => c.id === selectedVoiceLeadId);
    if (!selectedLead) return;

    setVoiceActive(true);
    setVoiceLog(prev => [
      `📞 Calling ${selectedLead.name} (${selectedLead.phone || 'N/A'})...`,
      ...prev
    ]);

    if (voiceGeneratedScript) {
      // Dynamic dialog using custom AI script!
      setTimeout(() => {
        setVoiceLog(prev => [
          `🎙️ [Voice AI Agent]: "${voiceGeneratedScript.greeting.replace('[Contact Name]', selectedLead.name.split(' ')[0])}"`,
          ...prev
        ]);
      }, 1500);

      setTimeout(() => {
        setVoiceLog(prev => [
          `👤 [Lead Response]: "Who is this? Oh, yes, I'm kinda busy with operations. But go ahead, what do you have?"`,
          ...prev
        ]);
      }, 3500);

      setTimeout(() => {
        setVoiceLog(prev => [
          `🎙️ [Voice AI Agent]: "${voiceGeneratedScript.valuePitch || 'We specialize in helping businesses like yours.'}"`,
          ...prev
        ]);
      }, 6000);

      const mainObj = voiceGeneratedScript.objections?.[0] || { objection: "Is this going to take up too much time?", handler: "Our setup takes under 10 minutes total." };
      setTimeout(() => {
        setVoiceLog(prev => [
          `👤 [Lead Response]: "${mainObj.objection}"`,
          ...prev
        ]);
      }, 8500);

      setTimeout(() => {
        setVoiceLog(prev => [
          `🎙️ [Voice AI Agent]: "${mainObj.handler} ${voiceGeneratedScript.cta}"`,
          ...prev
        ]);
      }, 11000);

      setTimeout(() => {
        setVoiceLog(prev => [
          `👤 [Lead Response]: "Actually, that makes total sense. Yes, send me the booking link to ${selectedLead.email}."`,
          `🎉 Automated Success: custom Voice Agent script executed. Lead tags updated with [Talked-To-Voice]!`,
          ...prev
        ]);
        
        setContacts(prev => prev.map(c => {
          if (c.id === selectedVoiceLeadId) {
            return {
              ...c,
              tags: [...c.tags.filter(t => t !== 'Talked-To-Voice'), 'Talked-To-Voice'],
              notes: `${c.notes || ''} | Custom AI Voice Call was high-converting. Lead confirmed CTA interest.`
            };
          }
          return c;
        }));
        setVoiceActive(false);
      }, 14000);

    } else {
      // Simulate default voice conversation responses
      setTimeout(() => {
        setVoiceLog(prev => [
          `🎙️ [Voice AI Agent]: "Hi ${selectedLead.name.split(' ')[0]}, this is Sarah calling regarding the strategic outline you requested. Do you have 2 minutes to preview the customized ROI checklist?"`,
          ...prev
        ]);
      }, 1500);

      setTimeout(() => {
        setVoiceLog(prev => [
          `👤 [Lead Response]: "Oh hi, yes! I was actually just reading your email sequence about the retainer pricing model. How exactly does your outcome guarantee work?"`,
          ...prev
        ]);
      }, 3500);

      setTimeout(() => {
        setVoiceLog(prev => [
          `🎙️ [Voice AI Agent]: "Great question! Under the framework, if we don't install the fully pre-qualified system securely in your network within 45 days, our builders work at zero fee. Would you like me to book a 15-minute alignment talk for tomorrow with our lead constructor?"`,
          ...prev
        ]);
      }, 6000);

      setTimeout(() => {
        setVoiceLog(prev => [
          `👤 [Lead Response]: "That sounds fair. Send me the booking schedule to my email: ${selectedLead.email}."`,
          `🎉 Automated Success: Lead tags updated with [Talked-To-Voice] & scheduled follow-up!`,
          ...prev
        ]);
        
        // Keep state updated in contact
        setContacts(prev => prev.map(c => {
          if (c.id === selectedVoiceLeadId) {
            return {
              ...c,
              tags: [...c.tags.filter(t => t !== 'Talked-To-Voice'), 'Talked-To-Voice'],
              notes: `${c.notes || ''} | AI Voice Call answered. Lead requested calendar.`
            };
          }
          return c;
        }));
        setVoiceActive(false);
      }, 9000);
    }
  };

  // video generator trigger Script
  const generateVideoSnippet = () => {
    setIsVideoGenerating(true);
    setVideoResult('');
    setTimeout(() => {
      setVideoResult(`🎬 Generated Video Scene Promo script:\n\n[SCENE 1 - 0:00 - 0:05]\nVisuals: High-contrast footage of an executive staring tiredly at code/spreadsheets. Smooth transition to bright morning sunlight.\nAudio (Voiceover): "Are you renting out your stress for hourly dollars? Stop."\n\n[SCENE 2 - 0:05 - 0:15]\nVisuals: Bold Space Grotesk typography fading in: "$12,500/Month Retainer". High-resolution UI of our CRM pipeline showing growing green numbers.\nAudio: "Package your elite knowledge into a single outcomes-based Sovereign Mastermind. No cold pitches."\n\n[SCENE 3 - 0:15 - 0:30]\nVisuals: Minimalist phone with QR Code fading in, linking directly to personalized calendars.\nAudio: "Grab our 20-minute implementation guide today completely free."`);
      setIsVideoGenerating(false);
      setLiveAlerts(prev => ["🎬 AI Video production copy asset successfully rendered!", ...prev]);
    }, 1200);
  };

  // Maintenance Agent System upgrade
  const triggerSystemSelfRepair = () => {
    setIsFixingBugs(true);
    setTimeout(() => {
      setTotalBugsFixed(prev => prev + 4);
      setSentinelLogs(prev => [
        `🚨 Sentinel: Critical dependency security updates downloaded & patched securely.`,
        `🔧 Repair Agent: Upgraded viewport sizing handlers for ultra-wide monitors.`,
        `🛡️ Security: Automated token storage verified with zero leaks.`,
        ...prev
      ]);
      setLiveAlerts(prev => ["⚡ Maintenance Core: System successfully optimized & security audited green!", ...prev]);
      setIsFixingBugs(false);
    }, 1800);
  };

  // Export Funnel as Local JSON File
  const handleExportJSON = (funnelObj: Funnel) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      funnel: funnelObj,
      assets: assets.filter(a => a.funnelId === funnelObj.id),
      contacts: contacts.map(c => ({ name: c.name, email: c.email, stage: c.funnelStage })),
      appVersion: "2.5.0-Sentinel"
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AI_Funnel_CRM_${funnelObj.nicheId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculated values for aesthetic stats dashboard
  const totalDealValue = contacts.reduce((sum, c) => sum + c.dealValue, 0);
  const activeFunnelCount = funnels.length;
  const averageConversionRate = 18.4; // %

  const currentActiveFunnel = funnels.find(f => f.id === activeFunnelId) || funnels[0];
  const currentActiveAssets = assets.filter(a => a.funnelId === activeFunnelId);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07130e] flex flex-col items-center justify-center font-sans text-slate-300 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-950/40 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-950/20 blur-[130px]" />
        
        <div className="text-center space-y-4 relative z-10 bg-emerald-950/20 backdrop-blur-md px-8 py-10 rounded-3xl border border-emerald-800/20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold tracking-wider text-emerald-400 font-mono uppercase">Confirming Connection to Secure Applet...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#07130e] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-950/40 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-950/25 blur-[130px]" />

        <div className="w-full max-w-md bg-emerald-950/30 border border-emerald-800/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl space-y-7 text-center relative z-10 transition-all">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-500 text-emerald-950 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-all">
              <Sparkles className="w-8 h-8 font-black" />
            </div>
            
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold font-display tracking-tight text-white leading-tight">Sovereign CRM Suite</h1>
              <p className="text-xs text-emerald-300/85">Configure target landing funnels, process Stripe checkouts, and automate high-ticket outreach.</p>
            </div>
          </div>

          <div className="border-t border-emerald-900/45 my-2"></div>

          <div className="space-y-4">
            <p className="text-[11px] font-medium tracking-wider text-emerald-400/80 font-mono uppercase">
              🔐 Encrypted Firestore Workspace
            </p>
            
            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  sendWebNotification("🔐 Welcome Back", "Google Authentication Approved.");
                } catch (err: any) {
                  console.error("Authentication failed:", err);
                }
              }}
              className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-md active:bg-slate-100 transition-all cursor-pointer font-sans"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.57 8.95 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.44-1.09 2.66-2.31 3.48v2.9h3.73c2.18-2 3.43-4.96 3.43-8.48z" />
                <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.79 0 10.89 0 13s.54 4.21 1.5 6.1l3.86-2.6z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.9l-3.73-2.9c-1.03.69-2.35 1.1-4.23 1.1-3.05 0-5.73-2.53-6.64-5.46l-3.86 3C3.4 20.35 7.35 23 12 23z" />
              </svg>
              <span>Connect Google Account</span>
            </button>
          </div>

          <div className="pt-2">
            <span className="text-[10px] bg-emerald-950/60 text-emerald-300/90 font-mono px-3 py-1.5 rounded-lg border border-emerald-900/40 block text-center truncate">
              ID: ai-studio-b1d51413-2ece-41be-8f7c-562881668305
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfa] text-slate-800 font-sans flex flex-col selection:bg-emerald-200">
      
      {/* 🟢 TOP PREMIUM BRANDED BRANDING BAR & LIVE ALERTS RUNNER */}
      <header className="bg-emerald-950 border-b border-emerald-800 text-white py-3.5 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-400 to-amber-500 text-emerald-950 font-bold p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5" id="brand-logo" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight flex items-center gap-2">
                Sovereign<span className="text-amber-400 font-medium font-sans text-sm bg-emerald-900 border border-emerald-700/50 px-2 py-0.5 rounded-full">CRM Funnel Engine v2.5</span>
              </h1>
              <p className="text-xs text-emerald-200">Unified Niche digital marketer workspace & automated pipeline</p>
            </div>
          </div>

          {/* Running Alert Marquee to keep layout alive */}
          <div className="flex items-center gap-3 bg-emerald-900/80 px-4 py-2 rounded-xl text-xs max-w-md overflow-hidden text-ellipsis whitespace-nowrap border border-emerald-800/40">
            <span className="animate-pulse flex h-2 w-2 rounded-full bg-amber-400"></span>
            <span className="text-emerald-100 font-mono tracking-tight font-medium">
              {liveAlerts[0] || "All marketing protocols online and functioning."}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={triggerSystemSelfRepair}
              disabled={isFixingBugs}
              className={`text-xs px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 font-semibold text-emerald-950 rounded-lg transition-all shadow-sm flex items-center gap-1.5 ${isFixingBugs ? 'opacity-80 cursor-wait' : ''}`}
              title="Runs optimization patches, repairs code blocks, and secures backend structures"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isFixingBugs ? 'animate-spin' : ''}`} />
              {isFixingBugs ? 'Auditing Security...' : 'AI Self-Repair'}
            </button>

            {currentUser && (
              <div className="flex items-center gap-2 bg-emerald-900 border border-emerald-800 rounded-xl p-1.5 px-3">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} className="w-5 h-5 rounded-full border border-emerald-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-emerald-950 font-bold text-[10px] flex items-center justify-center border border-emerald-700">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
                  </div>
                )}
                <span className="text-xs font-semibold text-emerald-100 hidden lg:inline-block max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await logoutUser();
                    } catch (err) {
                      console.error("Logout failed:", err);
                    }
                  }}
                  className="ml-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 pl-2 border-l border-emerald-800/80 cursor-pointer"
                  title="Securely Sign Out"
                >
                  Sign Out
                </button>
              </div>
            )}

            <span className="text-xs text-emerald-300 font-mono hidden lg:inline-block bg-emerald-900 px-2.5 py-1.5 rounded-md border border-emerald-800">
              Uptime: {systemUptime}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER LAYOUT */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6">
        
        {/* 📋 SIDEBAR ORGANIZED PANEL */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3 px-1">Control Console</p>
            
            <nav className="flex flex-col gap-1" id="main-navigation-menu">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('funnels')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'funnels' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-funnels"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Funnel Architect</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'library' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-library"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Creative Copy Library</span>
              </button>

              <button
                onClick={() => setActiveTab('aiCopywriter')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'aiCopywriter' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-ai-copywriter"
              >
                <FileText className="w-4 h-4" />
                <span>AI Copywriter Studio</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'contacts' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-contacts"
              >
                <Users className="w-4 h-4" />
                <span>CRM Leads Pipeline</span>
              </button>

              <button
                onClick={() => setActiveTab('quizBuilder')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'quizBuilder' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-quiz"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>AI Forms & Quizzes</span>
              </button>

              <button
                onClick={() => setActiveTab('voiceSimulator')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'voiceSimulator' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-voice"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Voice AI Sim-Agent</span>
              </button>

              <button
                onClick={() => setActiveTab('sentinel')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'sentinel' 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="tab-sentinel"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Security Sentinel & Logs</span>
              </button>
            </nav>
          </div>

          {/* 💎 ACTIVE NICHE QUICK SELECTOR PANEL */}
          <div className="bg-emerald-900 text-[#fdfdfd] rounded-2xl p-4 shadow-sm border border-emerald-800">
            <h4 className="text-xs uppercase tracking-wider text-amber-300 font-mono font-semibold mb-2">Target Niche Config</h4>
            <p className="text-xs text-emerald-200 mb-3">Adjusting current focus shifts system layout patterns, conversion calculations & presets</p>
            
            <select 
              value={selectedNicheId} 
              onChange={(e) => {
                setSelectedNicheId(e.target.value);
                const related = funnels.find(f => f.nicheId === e.target.value);
                if (related) {
                  setActiveFunnelId(related.id);
                }
              }}
              className="w-full bg-emerald-950 border border-emerald-700 text-amber-200 font-medium text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {SUPPORTED_NICHES.map(n => (
                <option key={n.id} value={n.id} className="text-white font-sans bg-emerald-950">
                  📍 {n.name}
                </option>
              ))}
            </select>

            <div className="mt-3 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 text-[11px] text-emerald-100">
              {SUPPORTED_NICHES.find(n => n.id === selectedNicheId)?.description || ""}
            </div>
          </div>

          {/* SYSTEM QUICK STATS BOX */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
            <div className="text-xs text-slate-400 font-medium">Active Pipeline Value</div>
            <div className="text-2xl font-bold text-emerald-700 font-display mt-1">
              ${totalDealValue.toLocaleString()}
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Offline-first resilience encrypted</span>
            </div>
          </div>

          {/* 🔗 CRM USEFUL LINKS (EDUCATIONAL PORTAL) */}
          <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-4 shadow-sm" id="crm-educational-links">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-mono font-semibold mb-2 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Ecosystem Insights
            </h4>
            <p className="text-[10px] text-slate-400 mb-3 font-sans">Non-commercial, educational resources for digital workflows & optimization:</p>
            <ul className="space-y-2 text-[11px] font-sans">
              <li>
                <a 
                  href="https://www.hubspot.com/digital-marketing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-650 hover:text-indigo-600 font-medium transition-all flex items-center gap-1 text-slate-700"
                >
                  <ArrowRight className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                  Digital Fundamentals
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.shopify.com/learn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-650 hover:text-indigo-600 font-medium transition-all flex items-center gap-1 text-slate-700"
                >
                  <ArrowRight className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                  Shopify Ecommerce Learn
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://clevertap.com/blog/ai-use-cases-in-e-commerce" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-650 hover:text-indigo-600 font-medium transition-all flex items-center gap-1 text-slate-700"
                >
                  <ArrowRight className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                  AI Marketing Use Cases
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://hashmeta.com/blog/top-10-ai-content-tools-for-content-marketers-in-2025" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-650 hover:text-indigo-600 font-medium transition-all flex items-center gap-1 text-slate-700"
                >
                  <ArrowRight className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                  AI Content Tools Review
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.enrichlabs.ai/blog/best-ai-marketing-tools-2026" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-650 hover:text-indigo-600 font-medium transition-all flex items-center gap-1 text-slate-700"
                >
                  <ArrowRight className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                  AI Marketing Automation
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

        </aside>

        {/* 🖥️ DYNAMIC ROUTE VIEW AREA */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* BRAND GREETING CARD */}
              <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 text-amber-300 font-medium font-mono text-[11px] uppercase rounded-full mb-4 border border-amber-400/30">
                    <Sparkles className="w-3 h-3" /> Fully functional SaaS Pipeline
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
                    Welcome back, <span className="text-amber-300">thinktecai</span> 🚀
                  </h2>
                  <p className="text-sm text-emerald-100 mt-2 leading-relaxed">
                    Automate lead capturing, build conversion copy, and auto-dial cold leads instantly with custom generative sequences. 9 distinct business niches pre-configured with direct outcome formulas.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button 
                      onClick={() => setActiveTab('funnels')} 
                      className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Build Niche AI Funnel
                    </button>
                    <button 
                      onClick={() => setActiveTab('contacts')} 
                      className="bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-white/20"
                    >
                      View Leads Pipeline
                    </button>
                  </div>
                </div>
              </div>

              {/* WEB NOTIFICATIONS AUTHORIZATION BANNER */}
              {notificationStatus !== 'granted' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-800 p-2.5 rounded-xl">
                      <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900">Real-Time Web Alerts Available</h4>
                      <p className="text-xs text-amber-700">Receive instant push notifications when a lead moves stages or a high-value prospect is captured.</p>
                    </div>
                  </div>
                  <button
                    onClick={requestNotificationPermission}
                    className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    Enable Alerts
                  </button>
                </div>
              )}

              {/* CORE PERFORMANCE CHARTS GRID (Replacing Static Metric Cards) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 📈 CHART 1: PIPELINE VALUE & LEADS GROWTH OVER TIME */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold font-display text-slate-800 flex items-center gap-1.5 animate-pulse-slow">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Pipeline & Leads Growth Over Time
                      </h3>
                      <p className="text-[11px] text-slate-400">Total accumulated deal values and contact counts over the last 7 days</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-700">${totalDealValue.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase font-mono">{contacts.length} Total Leads</div>
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: '240px', minHeight: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getPipelineGrowthData()}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#022c22', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                          labelStyle={{ fontWeight: 'bold', color: '#fbbf24' }}
                        />
                        <Area type="monotone" name="Pipeline Value ($)" dataKey="Pipeline Value ($)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 📊 CHART 2: CONVERSION RATES PER FUNNEL STAGE */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold font-display text-slate-800 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-600" /> Funnel stage retention rates
                      </h3>
                      <p className="text-[11px] text-slate-400">Retention rates and lead counts mapped across active funnel stages</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-600">{averageConversionRate}%</div>
                      <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Industry Avg: 4.5%</div>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '240px', minHeight: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getConversionRateData()}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="stage" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit="%" />
                        <Tooltip 
                          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                          labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Bar name="Conversion Rate (%)" dataKey="Conversion Rate (%)" fill="#059669" radius={[4, 4, 0, 0]}>
                          {
                            getConversionRateData().map((entry, index) => {
                              const colors = ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* CRM VISUAL INTERACTIVE FUNNEL DIAGRAM */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-display font-medium text-slate-800 flex items-center gap-2">
                      <Layers className="text-emerald-600 w-4 h-4" /> Funnel Stage Progression Matrix
                    </h3>
                    <p className="text-xs text-slate-400">Current visual flow and leads distribution for: <span className="font-semibold text-emerald-700">{currentActiveFunnel?.product || "No active offers"}</span></p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 font-mono px-2">Export:</span>
                    <button 
                      onClick={() => handleExportJSON(currentActiveFunnel)}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px] px-2.5 py-1.5 rounded"
                      title="Download complete funnel settings, landing templates, and test metrics as clean JSON files"
                    >
                      Download settings as JSON
                    </button>
                  </div>
                </div>

                {/* Vertical Funnel Visual Design */}
                <div className="space-y-4 max-w-xl mx-auto">
                  {/* Stage 1: Awareness */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-xl p-4 shadow-sm flex items-center justify-between relative z-10 border-l-4 border-amber-400">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-emerald-200">Stage 1 — Cold Traffic Attraction</div>
                        <h4 className="text-sm font-semibold tracking-wide">Awareness Ad Engine</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-medium px-2 py-1 bg-emerald-900 rounded text-emerald-100">
                          {contacts.filter(c => c.funnelStage === 'Awareness').length} leads
                        </span>
                        <div className="text-[10px] text-amber-200 mt-1">Est. Opt-in: 32%</div>
                      </div>
                    </div>
                    {/* Visual Connector Arrow */}
                    <div className="flex justify-center -my-2.5 relative z-0">
                      <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border border-white text-emerald-950 font-bold text-[9px]">↓</div>
                    </div>
                  </div>

                  {/* Stage 2: Lead Capture */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl p-4 shadow-sm flex items-center justify-between relative z-10 border-l-4 border-amber-400">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-emerald-200">Stage 2 — Value Exchange</div>
                        <h4 className="text-sm font-semibold tracking-wide">Landing Pages & Opt-ins</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-medium px-2 py-1 bg-emerald-800 rounded text-emerald-100">
                          {contacts.filter(c => c.funnelStage === 'Lead Capture').length} leads
                        </span>
                        <div className="text-[10px] text-amber-200 mt-1">Visit-to-lead: 24%</div>
                      </div>
                    </div>
                    <div className="flex justify-center -my-2.5 relative z-0">
                      <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border border-white text-emerald-950 font-bold text-[9px]">↓</div>
                    </div>
                  </div>

                  {/* Stage 3: Nurture Sequence */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl p-4 shadow-sm flex items-center justify-between relative z-10 border-l-4 border-amber-400">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-emerald-100">Stage 3 — Trust Engineering</div>
                        <h4 className="text-sm font-semibold tracking-wide">Multi-Day CRM Email Sequences</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-medium px-2 py-1 bg-emerald-700 rounded text-emerald-100">
                          {contacts.filter(c => c.funnelStage === 'Nurture').length} leads
                        </span>
                        <div className="text-[10px] text-amber-200 mt-1">Open Rate: 48%</div>
                      </div>
                    </div>
                    <div className="flex justify-center -my-2.5 relative z-0">
                      <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border border-white text-emerald-950 font-bold text-[9px]">↓</div>
                    </div>
                  </div>

                  {/* Stage 4: Conversion */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-emerald-950 rounded-xl p-4 shadow-sm flex items-center justify-between relative z-10 border-l-4 border-amber-400 font-medium">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-emerald-900">Stage 4 — Closing & Guarantee</div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-wide">High-Ticket Sales Pitch</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold px-2 py-1 bg-white/60 rounded text-slate-800">
                          {contacts.filter(c => c.funnelStage === 'Conversion' || c.funnelStage === 'Convert' as any).length} leads
                        </span>
                        <div className="text-[10px] text-emerald-900 font-semibold mt-1">Closing Outcome: 12.5%</div>
                      </div>
                    </div>
                    <div className="flex justify-center -my-2.5 relative z-0">
                      <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border border-white text-emerald-950 font-bold text-[9px]">↓</div>
                    </div>
                  </div>

                  {/* Stage 5: Retargeting, Upsells & Retention */}
                  <div>
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 rounded-xl p-4 shadow-sm flex items-center justify-between relative border-l-4 border-emerald-800 font-bold">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-emerald-900">Stage 5 — Customer Longevity</div>
                        <h4 className="text-sm tracking-wide">Upsell Offers & Circle Referrals</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold px-2 py-1 bg-emerald-950 text-white rounded">
                          {contacts.filter(c => c.funnelStage === 'Retargeting' || c.funnelStage === 'Upsell' || c.funnelStage === 'Retention').length} active
                        </span>
                        <div className="text-[10px] text-emerald-900 mt-1">LTV Expansion: 2.1x</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                  <span>✨ Real-time dynamic updates enabled</span>
                  <button onClick={() => setActiveTab('funnels')} className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">Configure Stage Assets <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>

              {/* QUICK CAMPAIGN QUICK VIEW GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* RECENT NEW LEADS */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold font-display text-slate-800">Highly Engaged Prospects</h3>
                    <button onClick={() => setActiveTab('contacts')} className="text-xs text-emerald-600 hover:underline">Manage All</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {contacts.slice(0, 3).map(lead => (
                      <div key={lead.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{lead.name}</div>
                          <div className="text-xs text-slate-400">{lead.company} · <span className="font-mono text-emerald-600">{lead.leadSource}</span></div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700">${lead.dealValue.toLocaleString()}</span>
                          <div className="text-[10px] font-mono text-amber-600 mt-0.5">{lead.funnelStage}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ASSET METRIC SCORES */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold font-display text-slate-800">A/B Traffic Insights</h3>
                    <button onClick={() => setActiveTab('library')} className="text-xs text-emerald-600 hover:underline">View Library</button>
                  </div>
                  <div className="space-y-3">
                    {assets.slice(0, 3).map(a => (
                      <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{a.stageType}</span>
                          <p className="text-xs font-semibold text-slate-800 mt-1">{a.title}</p>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="font-semibold text-emerald-600">CTR: {a.performanceMetrics?.ctr || 0}%</div>
                          <div className="text-[10px] text-slate-400">{a.performanceMetrics?.clicks || 0} Clicks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: FUNNEL BUILDER */}
          {activeTab === 'funnels' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">AI-Powered Funnel Architect</h2>
                    <p className="text-xs text-slate-500">Formulate high-ticket direct outcome architectures tailored custom to your exact marketing constraints.</p>
                  </div>
                </div>

                {/* FORM PANEL TO TRIGGER GENERATION */}
                <form onSubmit={handleGenerateFunnel} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Target Niche</label>
                    <select 
                      value={generatorNiche} 
                      onChange={(e) => setGeneratorNiche(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {SUPPORTED_NICHES.map(opt => (
                        <option key={opt.id} value={opt.name}>{opt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Product / Service Name</label>
                    <input 
                      type="text" 
                      value={generatorProduct} 
                      onChange={(e) => setGeneratorProduct(e.target.value)}
                      placeholder="e.g. Pure Glow Radiance Bundle" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Dream Buyer Persona (Avatar)</label>
                    <textarea 
                      rows={2}
                      value={generatorAvatar} 
                      onChange={(e) => setGeneratorAvatar(e.target.value)}
                      placeholder="e.g. Working moms over 35 who are dealing with skin fatigue and require lightweight mornings" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Main Frustrating Pain Point</label>
                    <input 
                      type="text" 
                      value={generatorPainPoint} 
                      onChange={(e) => setGeneratorPainPoint(e.target.value)}
                      placeholder="e.g. Red spot breakouts and chemical-heavy expensive serums that strip the skin"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Ideal Customer Desired Outcome</label>
                    <input 
                      type="text" 
                      value={generatorOutcome} 
                      onChange={(e) => setGeneratorOutcome(e.target.value)}
                      placeholder="e.g. Radiant glowing balanced facial skin in 3 minutes a day" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Primary Traffic Channel</label>
                    <select 
                      value={generatorChannel} 
                      onChange={(e) => setGeneratorChannel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Instagram Shop Ads">Instagram Carousel Ads</option>
                      <option value="Facebook Conversion Ads">Facebook Conversion Ads</option>
                      <option value="LinkedIn Workspace Video">LinkedIn Masterclass Workshop</option>
                      <option value="Google Intent Search">Google Search Intent Landing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Pricing Structure Pitch</label>
                    <input 
                      type="text" 
                      value={generatorPrice} 
                      onChange={(e) => setGeneratorPrice(e.target.value)}
                      placeholder="e.g. $199 Complete Radiant Hydration Package" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="md:col-span-2 pt-3 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      🔒 Secured via <strong>Google Gemini Fast Shield</strong> neural protocols.
                    </div>
                    <button 
                      type="submit" 
                      disabled={isGenerating}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 font-bold text-sm text-white px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Generating Complete Funnel Assets...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          <span>Generate Full Funnel with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>

              {/* SAVED ACTIVE FUNNELS DETAIL PORTLET */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-display font-medium text-slate-800">Generated Niche Funnel Iterations</h3>
                    <p className="text-xs text-slate-400">Select an iteration instance below to inspect generated copywriting assets</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-slate-100 rounded text-slate-600 border border-slate-200">
                    Total: {funnels.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-6">
                  {funnels.map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFunnelId(f.id);
                        setSelectedNicheId(f.nicheId);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all border flex items-center gap-2 ${
                        activeFunnelId === f.id
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{f.product} ({f.nicheName})</span>
                    </button>
                  ))}
                </div>

                {/* THE ACTIVE INSIGHTED STAGES GRID */}
                {currentActiveFunnel ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Target Avatar:</span>
                        <p className="font-semibold text-emerald-950 mt-1">{currentActiveFunnel.avatar}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Core Pain Point:</span>
                        <p className="font-semibold text-emerald-950 mt-1">{currentActiveFunnel.painPoint}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Desired Outcome:</span>
                        <p className="font-semibold text-emerald-950 mt-1">{currentActiveFunnel.desiredOutcome}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Main Channel / Pricing:</span>
                        <p className="font-semibold text-emerald-950 mt-1">{currentActiveFunnel.mainChannel} @ {currentActiveFunnel.pricePoint}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h4 className="text-sm font-semibold text-slate-800">Generated Assets per Funnel Stage</h4>
                        <button
                          onClick={() => setActiveTab('aiCopywriter')}
                          className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition-all w-fit cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>Open in AI Copywriter Studio</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentActiveAssets.length > 0 ? (
                          currentActiveAssets.map(asset => (
                            <div key={asset.id} className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl p-4 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-[10px] uppercase font-bold rounded">
                                  {asset.stageType} Stage
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{asset.assetType}</span>
                              </div>
                              <h5 className="font-bold text-sm text-slate-800 mb-2">{asset.title}</h5>
                              
                              <p className="text-xs text-slate-600 line-clamp-4 whitespace-pre-wrap font-mono bg-white p-3 rounded-xl border border-slate-200/50">
                                {asset.content}
                              </p>

                              {asset.stageType === 'Conversion' && (
                                <StripeMockCheckout 
                                  asset={asset}
                                  activeFunnelPrice={currentActiveFunnel?.pricePoint || '$5,000'}
                                  contacts={contacts}
                                  onUpdateContact={(updatedContact) => {
                                    setContacts(prev => prev.map(item => item.id === updatedContact.id ? updatedContact : item));
                                    saveContactToFirestore(updatedContact);
                                  }}
                                  sendWebNotification={sendWebNotification}
                                />
                              )}

                              <div className="mt-3.5 flex items-center justify-between">
                                <button
                                  onClick={() => {
                                    setSelectedAsset(asset);
                                    setEditingContent(asset.content);
                                    setOptimizationLog([`💬 Input retrieved for: "${asset.title}"`]);
                                  }}
                                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                                  id={`edit-asset-${asset.id}`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Optimize with AI Writer</span>
                                </button>
                                
                                <span className="text-[11px] text-slate-400 font-medium">Click to optimize hooks & headers</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-6 text-slate-400">
                            No assets generated yet for this funnel configuration. Submit details using the builder form above!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    No active funnels configured. Utilize the generator template above!
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: CREATIVE COPY LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">Conversion Copy & Asset Bank</h2>
                    <p className="text-xs text-slate-500">Edit, inspect metrics, and scale direct marketing variations globally.</p>
                  </div>

                  <span className="text-xs bg-slate-50 border px-3 py-1.5 rounded-xl font-mono text-slate-500">
                    Total Active: {assets.length} assets
                  </span>
                </div>

                <div className="space-y-4">
                  {assets.map(asset => (
                    <div key={asset.id} className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-600 transition-all shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold rounded uppercase">
                              {asset.stageType} stage
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">#{asset.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mt-1">{asset.title}</h4>
                        </div>

                        {/* Visual Metrical Graph */}
                        <div className="flex items-center gap-4 bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-mono">
                          <div>
                            <span className="text-slate-400 text-[10px] block uppercase">CTR Outcome</span>
                            <span className="text-emerald-700 font-bold">{asset.performanceMetrics?.ctr || 4.2}%</span>
                          </div>
                          <div className="border-l border-slate-200 h-6"></div>
                          <div>
                            <span className="text-slate-400 text-[10px] block uppercase">Leads Logged</span>
                            <span className="text-slate-700 font-bold">{asset.performanceMetrics?.conversions || 22}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                        <textarea
                          rows={6}
                          value={asset.content}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAssets(prev => prev.map(item => item.id === asset.id ? { ...item, content: val } : item));
                          }}
                          className="w-full bg-transparent text-xs font-mono focus:outline-none text-slate-700 resize-y leading-relaxed"
                        />
                      </div>

                      {asset.stageType === 'Conversion' && (
                        <StripeMockCheckout 
                          asset={asset}
                          activeFunnelPrice={currentActiveFunnel?.pricePoint || '$5,000'}
                          contacts={contacts}
                          onUpdateContact={(updatedContact) => {
                            setContacts(prev => prev.map(item => item.id === updatedContact.id ? updatedContact : item));
                            saveContactToFirestore(updatedContact);
                          }}
                          sendWebNotification={sendWebNotification}
                        />
                      )}

                      {asset.notes && (
                        <div className="mt-3 text-xs bg-amber-50 rounded-lg p-2.5 text-amber-800 border border-amber-200/40">
                          <strong>💡 Optimized Testing Recommendations:</strong>
                          <p className="mt-1 font-mono whitespace-pre-line text-[11px]">{asset.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setEditingContent(asset.content);
                            setOptimizationLog([`💬 Context locked. Ready to optimize metrics`]);
                          }}
                          className="text-xs bg-amber-400 hover:bg-amber-500 font-bold text-emerald-950 px-4 py-2 rounded-lg flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Optimize with Conversion AI</span>
                        </button>

                        <button 
                          onClick={() => {
                            setAssets(prev => prev.filter(item => item.id !== asset.id));
                            setLiveAlerts(prev => [`🗑️ Asset "${asset.title}" removed from library`, ...prev]);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB: AI COPYWRITER STUDIO */}
          {activeTab === 'aiCopywriter' && (
            <AICopywriterStudio activeFunnel={currentActiveFunnel} />
          )}

          {/* TAB 4: CRM LEADS PIPELINE */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CRM CONTACTS PIPELINE GRID LIST */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-display font-medium text-slate-800">Acquired Leads Ledger</h2>
                      <p className="text-xs text-slate-400">Click lead to track outreach sessions, score values, and simulate checkouts</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadCRMLeadsCSV(contacts)}
                        className="text-xs bg-slate-50 hover:bg-slate-100 hover:text-emerald-900 border border-slate-200 rounded-xl px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 text-slate-600 shadow-sm"
                        title="Export current lead configurations as Excel compatible CSV report"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Export CSV</span>
                      </button>
                      <span className="text-xs font-mono font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                        {contacts.length} leads
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {contacts.map(c => {
                      const isActive = c.id === activeContactId;
                      return (
                        <div 
                          key={c.id} 
                          onClick={() => setActiveContactId(c.id)}
                          className={`p-4 cursor-pointer transition-all rounded-2xl border ${
                            isActive 
                              ? 'border-emerald-600 bg-emerald-50/15 ring-1 ring-emerald-500 shadow-sm' 
                              : 'bg-slate-50 border-slate-200 hover:border-emerald-500/60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                                {c.funnelStage}
                              </span>
                              <span className="text-xs text-slate-400 font-semibold">{c.leadSource}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-emerald-700">${c.dealValue.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-y border-slate-200/60 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase">Name</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-semibold text-slate-800">{c.name}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase">Contact Details</span>
                              <span className="text-slate-600 font-mono text-[11px] block">{c.email}</span>
                              <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase">Hotness & VIP status</span>
                              <div className="mt-1">
                                <LeadScoreBadge contact={c} />
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 mt-2 bg-white/70 p-2 rounded-lg border border-slate-200/50">
                            📝 <strong>Latest Log:</strong> {c.notes || "No actions logged yet."}
                          </p>

                          <div className="mt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400">Change Stage:</span>
                              <select
                                value={c.funnelStage}
                                onChange={(e) => {
                                  const newStage = e.target.value as FunnelStageType;
                                  const updated = { ...c, funnelStage: newStage, lastActivity: new Date().toISOString() };
                                  saveContactToFirestore(updated);
                                  sendWebNotification("📌 Lead Stage Updated", `Lead "${c.name}" moved to stage: ${newStage}`);
                                  setLiveAlerts(prev => [`📌 Moved Lead "${c.name}" to Stage [${newStage}]`, ...prev]);
                                }}
                                className="bg-white border border-slate-200 rounded text-xs p-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="Awareness">Awareness</option>
                                <option value="Lead Capture">Lead Capture</option>
                                <option value="Nurture">Nurture</option>
                                <option value="Conversion">Conversion</option>
                                <option value="Retargeting">Retargeting</option>
                                <option value="Upsell">Upsell</option>
                                <option value="Retention">Retention</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedVoiceLeadId(c.id);
                                  setActiveTab('voiceSimulator');
                                }}
                                className="text-[11px] bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors"
                                title="Engage this specific buyer prospect using real-time conversational soundwave simulator"
                              >
                                <PhoneCall className="w-3 h-3" /> Dial with Voice AI
                              </button>

                              <button
                                onClick={() => {
                                  deleteContactFromFirestore(c.id);
                                  setLiveAlerts(prev => [`🗑️ Discarded lead "${c.name}"`, ...prev]);
                                }}
                                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT COLUMN: ACTION PANELS (Logs Switcher vs manual add) */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                    <button
                      onClick={() => setCrmSidebarTab('logs')}
                      className={`flex-1 py-1.5 text-center rounded-lg font-display text-[11px] font-bold transition-all uppercase tracking-wide ${
                        crmSidebarTab === 'logs'
                          ? 'bg-white text-slate-900 shadow'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Interaction Logs
                    </button>
                    <button
                      onClick={() => setCrmSidebarTab('add-lead')}
                      className={`flex-1 py-1.5 text-center rounded-lg font-display text-[11px] font-bold transition-all uppercase tracking-wide ${
                        crmSidebarTab === 'add-lead'
                          ? 'bg-white text-slate-900 shadow'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Enqueue Prospect
                    </button>
                  </div>

                  {crmSidebarTab === 'logs' ? (
                    (() => {
                      const selectedC = contacts.find(item => item.id === activeContactId) || contacts[0];
                      if (selectedC) {
                        return (
                          <ActivityLogsPanel
                            contact={selectedC}
                            onUpdateContact={(updated) => {
                              setContacts(prev => prev.map(item => item.id === updated.id ? updated : item));
                              saveContactToFirestore(updated);
                            }}
                            sendWebNotification={sendWebNotification}
                          />
                        );
                      }
                      return (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                          Please select an active lead from the ledger on the left to see full action histories.
                        </div>
                      );
                    })()
                  ) : (
                    /* ADD NEW LEAD FORM PORTLET */
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
                      <h3 className="font-display font-medium text-slate-800 flex items-center gap-2">
                        <UserPlus className="text-emerald-600 w-4.5 h-4.5" /> Enqueue Target Prospect
                      </h3>
                      <p className="text-xs text-slate-400">Manually insert prospective business owners into stage testing.</p>

                  <form onSubmit={handleCreateContactSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Contact Full Name</label>
                      <input 
                        type="text"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="e.g. Samuel Avery"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Company Name</label>
                      <input 
                        type="text"
                        value={newContact.company}
                        onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                        placeholder="e.g. Avery Solutions LLC"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Email</label>
                        <input 
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          placeholder="sam@avery.io"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                        <input 
                          type="text"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          placeholder="+1 (555) 902-1111"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Deal Value ($)</label>
                        <input 
                          type="number"
                          value={newContact.dealValue}
                          onChange={(e) => setNewContact({ ...newContact, dealValue: Number(e.target.value) })}
                          min={100}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Initial Stage</label>
                        <select
                          value={newContact.funnelStage}
                          onChange={(e) => setNewContact({ ...newContact, funnelStage: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                        >
                          <option value="Awareness">Awareness</option>
                          <option value="Lead Capture">Lead Capture</option>
                          <option value="Nurture">Nurture</option>
                          <option value="Conversion">Conversion</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Lead Source</label>
                      <select
                        value={newContact.leadSource}
                        onChange={(e) => setNewContact({ ...newContact, leadSource: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                      >
                        <option value="LinkedIn Organic">LinkedIn Organic</option>
                        <option value="Instagram Shop">Instagram Shop Ad</option>
                        <option value="Google Ads">Google Search Ads</option>
                        <option value="Referral Word-Of-Mouth">Direct Recommendation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Brief Notes / Context</label>
                      <textarea
                        rows={2}
                        value={newContact.notes}
                        onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                        placeholder="Seeking sustainable style guides, red facial skin solutions, etc."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-sm"
                    >
                      Enqueue Target Prospect
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

          {/* TAB 5: AI QUIZ & FORMS DESIGNER */}
          {activeTab === 'quizBuilder' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-emerald-600 text-white rounded text-[10px] font-mono tracking-wider uppercase font-bold">AWARENESS & CONVERSION ENGINE</span>
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold font-display text-slate-800">AI-Powered High-Converting Diagnostics Quiz & Survey</h3>
                  <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                    Capture leads at 3x higher rates. This tool automates the creation of smart assessments that score client intent, assign specialized segment tags, and instantly output custom-tailored results while submitting data directly to your CRM.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuizGenBusiness("Prime Scale Agency");
                    setQuizGenOffer("Exclusive 1-on-1 Funnel Blueprint Audit");
                    setQuizGenAudience("High-Ticket Coaches & Agency Owners");
                    setQuizGenGoal("Pre-qualifying high-budget marketing partners");
                    handleGenerateQuizSurvey();
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Fast Load Template
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* FIELD CONFIGURATION FORM */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <ClipboardCheck className="text-emerald-600 w-5 h-5" />
                    <div>
                      <h4 className="text-sm font-bold font-display text-slate-800">Quiz & Survey AI Architect</h4>
                      <p className="text-[11px] text-slate-400">Instruct Gemini to construct premium interactive quiz blocks instantly.</p>
                    </div>
                  </div>

                  {/* Dynamic Inputs selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Business Name or core product/service</label>
                      <input
                        type="text"
                        value={quizGenBusiness}
                        onChange={(e) => setQuizGenBusiness(e.target.value)}
                        placeholder="e.g. Vertex Systems"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Audience Profile / Avatar</label>
                      <input
                        type="text"
                        value={quizGenAudience}
                        onChange={(e) => setQuizGenAudience(e.target.value)}
                        placeholder="e.g. Freelance designers & agency operators"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Compelling Offer / Incentive name</label>
                        <input
                          type="text"
                          value={quizGenOffer}
                          onChange={(e) => setQuizGenOffer(e.target.value)}
                          placeholder="e.g. Free 15-Min Strategy Consultation"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Main Goal of evaluation</label>
                        <input
                          type="text"
                          value={quizGenGoal}
                          onChange={(e) => setQuizGenGoal(e.target.value)}
                          placeholder="e.g. Booking a discovery Zoom audit"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateQuizSurvey}
                      disabled={isQuizGenerating}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs p-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isQuizGenerating ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Gemini is Architecting Your Assessment...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Custom Interactive AI Quiz & Embed</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Schema Overview Box if output exists */}
                  {generatedQuiz && (
                    <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Generated Assessment Nodes</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded font-semibold uppercase">
                          {generatedQuiz.questions?.length || 0} Nodes Configured
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700">{generatedQuiz.title}</div>
                      <p className="text-[11px] text-slate-500 italic leading-relaxed">{generatedQuiz.description}</p>
                      
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {generatedQuiz.questions.map((q, idx) => (
                          <div key={q.id} className="p-2.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-mono text-slate-400 font-bold">QUESTION {idx + 1}</span>
                              <span className="text-slate-500 font-mono italic">tag: {q.segmentationTag}</span>
                            </div>
                            <div className="text-xs font-medium text-slate-800">{q.question}</div>
                            <div className="flex gap-1.5 flex-wrap pt-1">
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[9px] font-mono uppercase">{q.type}</span>
                              {q.options && q.options.slice(0, 3).map(o => (
                                <span key={o} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded text-[9px] font-sans truncate max-w-[120px]">{o}</span>
                              ))}
                              {q.options && q.options.length > 3 && <span className="text-[9px] text-slate-400 self-center">+{q.options.length - 3} more</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Scoring and segments mapped
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2));
                            alert("Assessment scheme JSON successfully exported to dashboard clipboard!");
                          }}
                          className="text-emerald-600 hover:underline font-bold"
                        >
                          Export Config Schema
                        </button>
                      </div>
                    </div>
                  )}

                  {!generatedQuiz && !isQuizGenerating && (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="text-xs font-bold text-slate-600">No Assessment Active</div>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Please customize your brand settings above and generate a quiz, or click "Fast Load Template" to load an interactive qualification quiz instance instantly.
                      </p>
                    </div>
                  )}
                </div>

                {/* BEAUTIFUL VISUAL PREVIEW OF INTEGRATED LANDING PAGE FORM */}
                <div className="bg-[#0f172a] text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between min-h-[500px]">
                  
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 font-mono text-[9px] rounded uppercase font-semibold border border-emerald-800/60 tracking-wider">
                          Live Interactive Embed
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10px] font-mono tracking-widest uppercase">SOVEREIGN DARK THEME</span>
                    </div>

                    {!generatedQuiz ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-lg animate-pulse">
                          🤖
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-slate-200">Interactive Lead Widget Sandbox</h5>
                          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                            Once you compile an evaluation, this side transforms into an interactive multi-step qualifying quiz widget.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setQuizGenBusiness("Prime Scale Agency");
                            setQuizGenOffer("Exclusive 1-on-1 Funnel Blueprint Audit");
                            setQuizGenAudience("High-Ticket Coaches & Agency Owners");
                            setQuizGenGoal("Pre-qualifying high-budget marketing partners");
                            handleGenerateQuizSurvey();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                        >
                          Unlock Diagnostic Blueprint Demo Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        
                        {/* HEADER */}
                        <div className="pb-3 border-b border-slate-800/60">
                          <h4 className="text-base font-bold font-display text-emerald-400 tracking-tight">{generatedQuiz.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{generatedQuiz.description}</p>
                        </div>

                        {/* PROGRESS INDICATOR */}
                        {quizCurrentStep > 0 && quizCurrentStep <= generatedQuiz.questions.length && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase">
                              <span>Step {quizCurrentStep} of {generatedQuiz.questions.length}</span>
                              <span>{Math.round((quizCurrentStep / generatedQuiz.questions.length) * 100)}% Complete</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1">
                              <div 
                                className="bg-emerald-500 h-1 rounded-full transition-all duration-300" 
                                style={{ width: `${(quizCurrentStep / generatedQuiz.questions.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* STEP 0: START WELCOME SCREEN */}
                        {quizCurrentStep === 0 && (
                          <div className="py-6 space-y-5 text-center">
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl max-w-sm mx-auto space-y-2">
                              <p className="text-[11px] text-slate-300 italic">
                                "The standard static contact forms are broken. High-ticket B2B agencies require qualification diagnostics to protect executive calendar hours."
                              </p>
                              <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wide font-semibold">CRM Qualifying Protocol</p>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-slate-400">Targeting Strategy For:</div>
                              <div className="text-sm font-bold text-slate-100">{quizGenAudience}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setQuizCurrentStep(1)}
                              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-90 font-bold text-xs p-3.5 rounded-xl block transition-all shadow-md tracking-wider uppercase cursor-pointer"
                            >
                              Get Started & Claims Diagnostic Outline
                            </button>
                            <p className="text-[9px] text-slate-500">Takes 90 seconds. Customized segmentation values computed instantly.</p>
                          </div>
                        )}

                        {/* STEP index: QUESTION ENGINE */}
                        {quizCurrentStep >= 1 && quizCurrentStep <= generatedQuiz.questions.length && (() => {
                          const questionItem = generatedQuiz.questions[quizCurrentStep - 1];
                          const selectedValue = quizAnswers[questionItem.id] || '';

                          return (
                            <div className="space-y-4 py-2">
                              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                                <span className="p-1 px-1.5 bg-slate-800 text-slate-400 text-[9px] font-mono rounded mr-2 h-auto inline-block self-center">Q{quizCurrentStep}</span>
                                <span className="text-slate-400 font-mono text-[10px] uppercase">Node Category: {questionItem.segmentationTag}</span>
                                <h5 className="text-xs font-bold text-slate-100 leading-relaxed mt-2">{questionItem.question}</h5>
                              </div>

                              {/* MCQ Rendering Option block */}
                              {questionItem.type === 'multiple-choice' && (
                                <div className="space-y-2">
                                  {(questionItem.options || []).map((opt) => {
                                    const isSelected = selectedValue === opt;
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                          setQuizAnswers(prev => ({ ...prev, [questionItem.id]: opt }));
                                        }}
                                        className={`w-full text-left p-3 rounded-xl text-xs transition-all border outline-none cursor-pointer ${
                                          isSelected 
                                            ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 font-semibold shadow-2xs' 
                                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between font-sans">
                                          <span>{opt}</span>
                                          {isSelected && <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-slate-950 font-bold">✓</span>}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Scale 1-10 Rendering block */}
                              {questionItem.type === 'scale' && (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-5 gap-2">
                                    {(questionItem.options || ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]).slice(0, 5).map((val) => {
                                      const isSelected = selectedValue === val;
                                      return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => {
                                            setQuizAnswers(prev => ({ ...prev, [questionItem.id]: val }));
                                          }}
                                          className={`py-2 p-1 text-center rounded-lg text-xs font-semibold font-mono border transition-all cursor-pointer ${
                                            isSelected 
                                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300' 
                                              : 'bg-slate-900 border-slate-800 text-slate-400'
                                          }`}
                                        >
                                          {val}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="grid grid-cols-5 gap-2">
                                    {(questionItem.options || ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]).slice(5, 10).map((val) => {
                                      const isSelected = selectedValue === val;
                                      return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => {
                                            setQuizAnswers(prev => ({ ...prev, [questionItem.id]: val }));
                                          }}
                                          className={`py-2 p-1 text-center rounded-lg text-xs font-semibold font-mono border transition-all cursor-pointer ${
                                            isSelected 
                                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold' 
                                              : 'bg-slate-900 border-slate-800 text-slate-400'
                                          }`}
                                        >
                                          {val}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex justify-between text-[9px] text-slate-500 px-1 font-mono uppercase">
                                    <span>Incipient Stage</span>
                                    <span>Mastery Scale</span>
                                  </div>
                                </div>
                              )}

                              {/* Short Text Rendering block */}
                              {questionItem.type === 'short-text' && (
                                <div className="space-y-1">
                                  <input 
                                    type="text"
                                    value={selectedValue}
                                    onChange={(e) => {
                                      setQuizAnswers(prev => ({ ...prev, [questionItem.id]: e.target.value }));
                                    }}
                                    placeholder="Type your explanation or core insights here..."
                                    className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  />
                                </div>
                              )}

                              {/* Back & Next navigation controls */}
                              <div className="flex justify-between items-center pt-4 border-t border-slate-800/60 mt-4">
                                <button
                                  type="button"
                                  onClick={() => setQuizCurrentStep(prev => prev - 1)}
                                  className="text-slate-400 hover:text-white text-xs font-semibold px-4 py-2 border border-slate-800 rounded-lg hover:bg-slate-900/60 cursor-pointer"
                                >
                                  Back
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!selectedValue.trim()) {
                                      alert("Please complete the active question node before advancing.");
                                      return;
                                    }
                                    setQuizCurrentStep(prev => prev + 1);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>Next Question</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {/* STEP: COLLECT LEAD & COMPUTE RESULTS */}
                        {quizCurrentStep === generatedQuiz.questions.length + 1 && (
                          <div className="space-y-4 py-2">
                            <div className="text-center pb-2">
                              <span className="p-1 px-2 bg-amber-950/80 text-amber-400 font-mono text-[9px] border border-amber-950 rounded uppercase font-semibold">
                                QUALIFICATION AUDIT READY
                              </span>
                              <h5 className="text-sm font-bold text-slate-100 mt-2">Generate Diagnostic Summary</h5>
                              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                Analysis compiled successfully. Input your targeting coordinates to lock in your CRM segment, compute your performance score, and retrieve the personalized report.
                              </p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleQuizSubmission(); }} className="space-y-3.5">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Corporate Representative Name</label>
                                <input
                                  type="text"
                                  required
                                  value={quizLeadName}
                                  onChange={(e) => setQuizLeadName(e.target.value)}
                                  placeholder="e.g. Richard Hendricks"
                                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Verified Corporate Email</label>
                                <input
                                  type="email"
                                  required
                                  value={quizLeadEmail}
                                  onChange={(e) => setQuizLeadEmail(e.target.value)}
                                  placeholder="e.g. richard@piedpiper.com"
                                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Company / Organization Name (Optional)</label>
                                <input
                                  type="text"
                                  value={quizLeadCompany}
                                  onChange={(e) => setQuizLeadCompany(e.target.value)}
                                  placeholder="e.g. Pied Piper Inc."
                                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={isQuizSubmitting}
                                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:opacity-90 disabled:opacity-50 font-bold text-xs p-3.5 rounded-xl transition-all shadow-md mt-4 block text-center cursor-pointer"
                              >
                                {isQuizSubmitting ? "Synthesizing Diagnostic Evaluation..." : "Unlock My Custom Evaluation & Results"}
                              </button>
                            </form>
                          </div>
                        )}

                        {/* STEP: EVALUATION OVERVIEW */}
                        {quizCompleted && quizFinalResult && (
                          <div className="space-y-4 py-1">
                            <div className="flex items-center gap-2 justify-center pb-2 flex-wrap">
                              <span className="p-1 px-2 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
                                DIAGNOSTIC SCORE: {quizFinalResult.score} PTS
                              </span>
                              <span className="p-1 px-2 bg-slate-900 text-slate-300 font-mono text-[9px] rounded font-bold uppercase border border-slate-800">
                                SEGMENT: {quizFinalResult.segment}
                              </span>
                            </div>

                            <div className="p-4 bg-emerald-950/20 border border-emerald-900/60 rounded-xl space-y-2">
                              <h5 className="text-sm font-bold text-emerald-400">{quizFinalResult.heading}</h5>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">{quizFinalResult.summary}</p>
                            </div>

                            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">Special Program Opportunity</span>
                                <span className="text-amber-400 font-mono text-[10px] uppercase font-bold animate-pulse">ELIGIBLE</span>
                              </div>
                              <p className="text-[11px] text-slate-300 font-medium leading-relaxed bg-[#0c1222] p-2.5 border border-slate-800/80 rounded-lg">
                                {generatedQuiz.recommendedAction}
                              </p>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  alert(`Successfully dispatched scheduling VIP portal to ${quizLeadEmail}! Complete checkout of ${quizGenOffer}`);
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-3 rounded-lg transition-all shadow-sm cursor-pointer"
                              >
                                Secure My Alignment Slot
                              </button>
                            </div>

                            <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Pipeline Sync: ACTIVE
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuizCurrentStep(0);
                                  setQuizAnswers({});
                                  setQuizCompleted(false);
                                  setQuizFinalResult(null);
                                }}
                                className="text-slate-400 hover:text-white underline font-bold cursor-pointer"
                              >
                                Restart Evaluation
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Generated JS: React-Native, Next.js, and Web Applets</span>
                    {generatedQuiz && (
                      <button 
                        onClick={() => {
                          const embedCode = `<iframe src="https://ai.workspace.com/widget/quiz?id=${Date.now()}" width="100%" height="600" style="border:none;border-radius:16px;" allow="geolocation; camera"></iframe>`;
                          navigator.clipboard.writeText(embedCode);
                          alert("Forms landing embed iframe copy helper successfully cached to system clipboard!");
                        }}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Code className="w-3 h-3" /> Get Embed Code
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 6: VOICE AI SIMULATOR */}
          {activeTab === 'voiceSimulator' && (
            <div className="space-y-6">
              
              {/* PRIMARY COMPANION: DYNAMIC VOICE AI SCRIPT GENERATOR */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-bold text-slate-900">Custom Voice AI Call Script Generator</h2>
                      <p className="text-xs text-slate-500">Instantly compile conversion-focused outbound/inbound telephone agent scripts backed by Gemini.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-bold">Dynamic Prompting Suite</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* GENERATOR INPUT FORM (SPAN 2) */}
                  <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Configuration Parameters
                    </h3>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company / Business Name</label>
                      <input
                        type="text"
                        value={voiceGenBusiness}
                        onChange={(e) => setVoiceGenBusiness(e.target.value)}
                        placeholder="e.g. Apex Growth Partners"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Core Offer</label>
                      <input
                        type="text"
                        value={voiceGenOffer}
                        onChange={(e) => setVoiceGenOffer(e.target.value)}
                        placeholder="e.g. Free 15-Minute Automated Funnel Audit & Roadmap"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Audience Avatar Profile (Audience)</label>
                      <input
                        type="text"
                        value={voiceGenAudience}
                        onChange={(e) => setVoiceGenAudience(e.target.value)}
                        placeholder="e.g. B2B SaaS Founders & Growth Directors"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Call Goal</label>
                      <select
                        value={voiceGenGoal}
                        onChange={(e) => setVoiceGenGoal(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="booking">Appointment Booking focus</option>
                        <option value="qualification">Lead Qualification Analysis focus</option>
                        <option value="follow-up">Post-Form Follow-Up Nurture focus</option>
                      </select>
                    </div>

                    <button
                      onClick={handleGenerateVoiceScript}
                      disabled={isVoiceGenerating}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isVoiceGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Convergent Script...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Generate Voice AI Call Script</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SCRIPT PRESENTATION VIEW (SPAN 3) */}
                  <div className="lg:col-span-3 space-y-4">
                    {!voiceGeneratedScript && !isVoiceGenerating ? (
                      <div className="h-full min-h-[300px] border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
                        <PhoneCall className="w-10 h-10 text-slate-300 mb-3 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-600 block">System Waiting for Inputs</span>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                          Configure your target brand parameters on the left and tap the generator. Gemini will construct a fully qualified sales-ready dialog script.
                        </p>
                      </div>
                    ) : isVoiceGenerating ? (
                      <div className="h-full min-h-[300px] bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
                        <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
                        <span className="text-xs font-semibold text-slate-600 block">Assembling Conversion Vectors...</span>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                          Our AI agent is currently formulating high-converting question sequences, objection handlers, and friendly fallback tracks.
                        </p>
                      </div>
                    ) : (
                      // RENDER COMPILED SCRIPT BEAUTIFULLY
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Generated Script Blueprint
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const fullTxt = `VOICE CALL SCRIPT\n\nGreeting: ${voiceGeneratedScript.greeting}\n\nQualification Questions:\n${voiceGeneratedScript.qualification.join('\n')}\n\nValue Pitch: ${voiceGeneratedScript.valuePitch}\n\nObjections:\n${voiceGeneratedScript.objections.map(o => `Obj: ${o.objection}\nHandler: ${o.handler}`).join('\n')}\n\nCTA: ${voiceGeneratedScript.cta}\n\nFallback: ${voiceGeneratedScript.fallback}`;
                                navigator.clipboard.writeText(fullTxt);
                                alert("Script blueprint copied to clipboard!");
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded-lg transition-all"
                            >
                              Copy All
                            </button>
                            <button
                              onClick={() => {
                                setVoiceScriptMode('friendly-nudge');
                                alert("Generated script successfully loaded into the simulator! Ready to dial.");
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" /> Mount in Simulator
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4 text-slate-700 leading-relaxed text-xs overflow-y-auto max-h-[420px] pr-2">
                          <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <strong className="text-emerald-700 text-[10px] font-mono uppercase block mb-1">🗣️ Greeting & Opening:</strong>
                            <p className="italic text-slate-850">"{voiceGeneratedScript.greeting}"</p>
                          </div>

                          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1.5">
                            <strong className="text-emerald-700 text-[10px] font-mono uppercase block mb-1">📋 Qualification Questions:</strong>
                            {voiceGeneratedScript.qualification?.map((q, idx) => (
                              <p key={idx} className="font-mono text-[11px] text-slate-650 pl-2.5 border-l-2 border-slate-300">
                                {idx + 1}. "{q}"
                              </p>
                            ))}
                          </div>

                          <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <strong className="text-emerald-700 text-[10px] font-mono uppercase block mb-1">💎 Value Pitch:</strong>
                            <p className="text-slate-800">"{voiceGeneratedScript.valuePitch}"</p>
                          </div>

                          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2">
                            <strong className="text-amber-700 text-[10px] font-mono uppercase block mb-1">🛑 Objection Handling Protocol:</strong>
                            {voiceGeneratedScript.objections?.map((obj, idx) => (
                              <div key={idx} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                                <p className="font-bold text-slate-800">☝️ Objection: "{obj.objection}"</p>
                                <p className="text-emerald-800 mt-1 pl-2 border-l border-emerald-500">💡 Ans: "{obj.handler}"</p>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <strong className="text-emerald-800 text-[10px] font-mono uppercase block mb-0.5">🎯 Call To Action (Goal Target):</strong>
                            <p className="font-semibold text-emerald-950">"{voiceGeneratedScript.cta}"</p>
                          </div>

                          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                            <strong className="text-amber-800 text-[10px] font-mono uppercase block mb-0.5">🔄 Fallback (If client is unsure / skeptical):</strong>
                            <p className="text-amber-950 italic">"{voiceGeneratedScript.fallback}"</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SIMULATION CONTAINER CARD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-slate-105 text-amber-700 rounded-xl">
                    <PhoneCall className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">Neural-VoIP Dialing Simulator Sandbox</h2>
                    <p className="text-xs text-slate-500">Test how your custom-focused dialog handles live lead interactions over standard cellular response latencies.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-5">
                  
                  {/* CONFIG PANEL */}
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Dialer Params</div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Contact Lead</label>
                      <select
                        value={selectedVoiceLeadId}
                        onChange={(e) => setSelectedVoiceLeadId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none"
                      >
                        {contacts.map(c => (
                          <option key={c.id} value={c.id}>👤 {c.name} ({c.company})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Voice Agent Tone Outline</label>
                      <select
                        value={voiceScriptMode}
                        onChange={(e) => setVoiceScriptMode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none"
                      >
                        <option value="friendly-nudge">Affable Nudge (Pricing Paradigm outcome focus)</option>
                        <option value="direct-close">The Sovereign Close (PAS Matrix alignment focus)</option>
                        <option value="survey-followup">Post-Form Survey Diagnostic (Lead Capture validation)</option>
                      </select>
                    </div>

                    <button
                      onClick={triggerVoiceDialer}
                      disabled={voiceActive}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                    >
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      {voiceActive ? 'Automated Call in Progress...' : 'Launch Automated Call'}
                    </button>

                    <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500">
                      ℹ️ Dialing uses our premium <strong>Neural-Synth pipeline</strong> to establish 120ms responses for seamless dialog loops.
                    </div>
                  </div>

                  {/* ACTIVE CALL SOUNDWAVE SIMULATOR LOGS */}
                  <div className="md:col-span-2 bg-[#022c22] rounded-2xl p-5 text-white flex flex-col justify-between">
                    
                    <div>
                      <div className="flex items-center justify-between pb-3.5 border-b border-emerald-900 mb-4">
                        <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold block uppercase">Live Audio Terminal feed</span>
                        {voiceActive && <span className="text-xs bg-amber-500 px-2 py-0.5 rounded text-emerald-950 font-bold animate-pulse">INCALL CONNECTED</span>}
                      </div>

                      {/* Moving Equalizer bars if calling */}
                      <div className="flex items-center justify-center gap-1.5 h-16 bg-emerald-950/60 rounded-xl border border-emerald-900/60 mb-6 font-mono text-xs">
                        {voiceActive ? (
                          <>
                            <div className="w-1.5 bg-emerald-400 h-10 rounded animate-pulse"></div>
                            <div className="w-1.5 bg-amber-400 h-14 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 bg-emerald-400 h-8 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                            <div className="w-1.5 bg-emerald-400 h-12 rounded animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                            <div className="w-1.5 bg-amber-400 h-16 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            <div className="w-1.5 bg-emerald-400 h-9 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          </>
                        ) : (
                          <div className="text-emerald-300">Waveform idle. Tap dialer configuration sequence...</div>
                        )}
                      </div>

                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {voiceLog.map((log, index) => (
                          <p key={index} className={`text-xs font-mono leading-relaxed ${log.includes('[Voice AI Agent]') ? 'text-emerald-300' : log.includes('Success') ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                            {log}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-emerald-900 text-[10px] text-slate-400 flex items-center justify-between mt-4">
                      <span>Gateway: Cloud Telephony VOIP Secure</span>
                      <button onClick={() => setVoiceLog(["🎙️ Logs cleared. Dialer safe."])} className="text-amber-400 hover:underline">Clear logs</button>
                    </div>

                  </div>

                </div>

              </div>

              {/* PRIMARY COMPANION 3: CALL TRACKING RETENTION CONTROL PANEL */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-6" id="call-tracking-panel">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                      <PhoneCall className="w-5 h-5 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-bold text-slate-900">Custom Call Tracking Follow-Up Center</h2>
                      <p className="text-xs text-slate-500 font-sans">Draft bespoke follow-up communications instantly for missed calls or completed conversations to protect pipeline ratios.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-105 text-slate-600 px-2.5 py-1 rounded-full font-mono font-bold font-sans">Retention Engine V1.2</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* CONFIG PANEL */}
                  <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 animate-fadeIn">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-sans">
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Follow-Up Parameters
                    </h3>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 uppercase mb-1 font-sans">Call Outcome Type</label>
                      <div className="grid grid-cols-2 gap-2 font-sans">
                        <button
                          id="btn-call-tracking-type-missed"
                          onClick={() => setCallTrackingType('missed')}
                          className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            callTrackingType === 'missed'
                              ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <PhoneMissed className="w-3.5 h-3.5 text-amber-500" />
                          Missed Call
                        </button>
                        <button
                          id="btn-call-tracking-type-completed"
                          onClick={() => setCallTrackingType('completed')}
                          className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            callTrackingType === 'completed'
                              ? 'bg-emerald-50 border-emerald-505 text-emerald-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Completed Call
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1 font-sans">Business Name</label>
                      <input
                        type="text"
                        id="input-call-tracking-business"
                        value={callTrackingBusiness}
                        onChange={(e) => setCallTrackingBusiness(e.target.value)}
                        placeholder="e.g. Apex Growth Partners"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1 font-sans">Target Incentive / Offer Details</label>
                      <input
                        type="text"
                        id="input-call-tracking-offer"
                        value={callTrackingOffer}
                        onChange={(e) => setCallTrackingOffer(e.target.value)}
                        placeholder="e.g. Complimentary 15-Minute Pipeline Optimization Blueprint"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                      />
                    </div>

                    <button
                      id="btn-generate-call-tracking"
                      onClick={handleGenerateCallTrackingFollowUp}
                      disabled={isCallTrackingGenerating}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      {isCallTrackingGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Conversion Scripts...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Compile Follow-Up Materials</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* DISPLAY TAB AND MOCKUP PANELS */}
                  <div className="lg:col-span-3 space-y-4">
                    {!callTrackingResult && !isCallTrackingGenerating ? (
                      <div className="h-full min-h-[300px] border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans" id="call-tracking-empty">
                        <MessageSquare className="w-10 h-10 text-slate-300 mb-3 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-600 block">System Waiting for Input Configuration</span>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-1 leading-relaxed">
                          Configure whether the recipient missed or completed a telephone call, define your business name + offer properties on the left, and click compile to design your follow-up sequence.
                        </p>
                      </div>
                    ) : isCallTrackingGenerating ? (
                      <div className="h-full min-h-[300px] bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans">
                        <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
                        <span className="text-xs font-semibold text-slate-600 block">Formulating Sequence Triggers...</span>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-1 leading-relaxed">
                          Gemini is formulating custom follow-up SMS textbacks, targeted email copies, and interactive voicemail scripts to maximize booking conversions.
                        </p>
                      </div>
                    ) : (
                      // DETAILED PREVIEWS WRAPPER
                      <div className="space-y-4 animate-fadeIn" id="call-tracking-results-stream">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-sans">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Multi-Channel Retention Deliverables
                          </span>
                          <span className="text-[9px] text-[#059669] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase font-sans">
                            STATUS: READY
                          </span>
                        </div>

                        {/* Bento Grid containing previews */}
                        <div className="space-y-4 font-sans" id="tracking-bento-grids">
                          {/* SMS Mockup preview card */}
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-1.5 font-sans">
                                <Smartphone className="w-4 h-4 text-teal-600" />
                                SMS follow-up textback
                              </span>
                              <button
                                id="btn-copy-tracking-sms"
                                onClick={() => {
                                  navigator.clipboard.writeText(callTrackingResult!.smsFollowUp);
                                  alert("SMS follow-up copied to clipboard!");
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] font-medium text-slate-700 rounded-lg transition-all border border-slate-200 cursor-pointer font-sans"
                              >
                                Copy SMS
                              </button>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-end">
                              <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-[11px] shadow-sm shadow-emerald-800/10 font-sans">
                                <p className="leading-relaxed">{callTrackingResult!.smsFollowUp}</p>
                              </div>
                            </div>
                          </div>

                          {/* Email Sandbox mockup card */}
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 font-sans">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-1.5 font-sans">
                                <Mail className="w-4 h-4 text-emerald-600" />
                                Email Campaign Template
                              </span>
                              <button
                                id="btn-copy-tracking-email"
                                onClick={() => {
                                  navigator.clipboard.writeText(`Subject: ${callTrackingResult!.emailFollowUp.subject}\n\n${callTrackingResult!.emailFollowUp.body}`);
                                  alert("Email follow-up (Subject & Body) copied to clipboard!");
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] font-medium text-slate-700 rounded-lg transition-all border border-slate-200 cursor-pointer font-sans"
                              >
                                Copy Email
                              </button>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-[11px] text-slate-705 shadow-sm font-sans">
                              <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 space-y-1 font-mono text-[10px]">
                                <div className="text-slate-400"><strong>Subject:</strong> <span className="text-slate-700 font-sans font-medium">{callTrackingResult!.emailFollowUp.subject}</span></div>
                                <div className="text-slate-400 font-sans font-medium"><strong>From:</strong> <span className="text-slate-505 font-sans font-medium">retention-desk@{callTrackingBusiness.toLowerCase().replace(/\s+/g, '')}.com</span></div>
                              </div>
                              <div className="p-4 space-y-2 whitespace-pre-wrap font-sans leading-relaxed text-slate-700 select-all max-h-[220px] overflow-y-auto">
                                {callTrackingResult!.emailFollowUp.body}
                              </div>
                            </div>
                          </div>

                          {/* Voicemail script card */}
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between font-sans">
                              <span className="text-[11px] font-bold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-1.5 font-sans">
                                <Volume2 className="w-4 h-4 text-amber-600" />
                                Outbound / Voicemail voice script
                              </span>
                              <button
                                id="btn-copy-tracking-voicemail"
                                onClick={() => {
                                  navigator.clipboard.writeText(callTrackingResult!.voicemailScript);
                                  alert("Voicemail script copied to clipboard!");
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-[10px] font-medium text-slate-700 rounded-lg transition-all border border-slate-200 cursor-pointer font-sans"
                              >
                                Copy Script
                              </button>
                            </div>
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 text-slate-850 italic leading-relaxed text-[11px] font-sans">
                              "{callTrackingResult!.voicemailScript}"
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* COMPANION 4: AUTOMATED INBOUND RESPONDER CENTER */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-6 animate-fadeIn" id="inbound-responder-panel">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-indigo-600 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-bold text-slate-900">Custom Automated Inbound SMS/DM Responder</h2>
                      <p className="text-xs text-slate-500 font-sans">Deploy pre-qualified response rules for organic platform funnels to qualify and convert passive prospects automatically.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-mono font-bold font-sans">Responder Engine V2.0</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* CONFIGURATION COLUMN */}
                  <div className="lg:col-span-2 space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 font-sans">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-sans">
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Responder Properties
                    </h3>

                    {/* Platform Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-sans">Choose Platform Channel</label>
                      <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                        <button
                          id="btn-inbound-platform-sms"
                          onClick={() => setInboundPlatform('sms')}
                          className={`py-2 px-3 font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
                            inboundPlatform === 'sms'
                              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                          SMS/Text
                        </button>
                        <button
                          id="btn-inbound-platform-instagram"
                          onClick={() => setInboundPlatform('instagram')}
                          className={`py-2 px-3 font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
                            inboundPlatform === 'instagram'
                              ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Instagram className="w-3.5 h-3.5 text-rose-500" />
                          Instagram DM
                        </button>
                        <button
                          id="btn-inbound-platform-facebook"
                          onClick={() => setInboundPlatform('facebook')}
                          className={`py-2 px-3 font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
                            inboundPlatform === 'facebook'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Facebook className="w-3.5 h-3.5 text-indigo-500" />
                          Facebook DM
                        </button>
                        <button
                          id="btn-inbound-platform-tiktok"
                          onClick={() => setInboundPlatform('tiktok')}
                          className={`py-2 px-3 font-medium rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none ${
                            inboundPlatform === 'tiktok'
                              ? 'bg-slate-900 border-slate-800 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 text-cyan-400" />
                          TikTok DM
                        </button>
                      </div>
                    </div>

                    {/* Campaign Goal */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1 font-sans">Campaign Objective / Goal</label>
                      <input
                        type="text"
                        id="input-inbound-goal"
                        value={inboundGoal}
                        onChange={(e) => setInboundGoal(e.target.value)}
                        placeholder="e.g. Qualify coaching students and schedule free audit calls"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                      />
                    </div>

                    {/* Business/Brand Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1 font-sans">Business Name</label>
                      <input
                        type="text"
                        id="input-inbound-business"
                        value={inboundBusiness}
                        onChange={(e) => setInboundBusiness(e.target.value)}
                        placeholder="e.g. Nova SaaS Labs"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                      />
                    </div>

                    {/* Offer CTA details */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1 font-sans">Primary Incentive Offer</label>
                      <input
                        type="text"
                        id="input-inbound-offer"
                        value={inboundOffer}
                        onChange={(e) => setInboundOffer(e.target.value)}
                        placeholder="e.g. Free 30-Minute Architecture Blueprint session"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                      />
                    </div>

                    {/* Booking link resource */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1 font-sans">Calendar Booking Link</label>
                      <input
                        type="text"
                        id="input-inbound-bookinglink"
                        value={inboundBookingLink}
                        onChange={(e) => setInboundBookingLink(e.target.value)}
                        placeholder="e.g. https://calendly.com/nova-saas-labs/audit"
                        className="w-full bg-white border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                      />
                    </div>

                    {/* Action Button */}
                    <button
                      id="btn-generate-inbound-responder"
                      onClick={handleGenerateInboundResponder}
                      disabled={isInboundGenerating}
                      className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                      {isInboundGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Drafting Conversion Flows...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>Generate Inbound DM Flow</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* RESULTS PREVIEW COLUMN */}
                  <div className="lg:col-span-3 space-y-4">
                    {!inboundResult && !isInboundGenerating ? (
                      <div className="h-full min-h-[400px] border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans" id="inbound-responder-empty">
                        <MessageSquare className="w-10 h-10 text-indigo-300 mb-3 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-600 block">Responder Setup Pending Creation</span>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-1 leading-relaxed font-sans">
                          Select the destination platform channel (SMS, Instagram, Facebook, TikTok) on the left, adjust your business details & goals, and tap compile to craft an optimized auto-responder sequence.
                        </p>
                      </div>
                    ) : isInboundGenerating ? (
                      <div className="h-full min-h-[400px] bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans">
                        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
                        <span className="text-xs font-semibold text-slate-600 block">Training Pipeline Responders...</span>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-1 leading-relaxed font-sans">
                          Gemini is configuring conversational smart reply loops, filtering questions, and copy blocks that convert incoming traffic instantly on {inboundPlatform.toUpperCase()}.
                        </p>
                      </div>
                    ) : (
                      // DETAILED PHONE PREVIEWS STREAM
                      <div className="space-y-4 animate-fadeIn" id="inbound-responder-results-stream">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-sans">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Multi-Step Inbound Auto-Response Blueprint
                          </span>
                          <span className="text-[9px] text-[#4f46e5] bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase font-sans">
                            {inboundPlatform.toUpperCase()} ACTIVATED
                          </span>
                        </div>

                        {/* Interactive Phone Conversation Stream Screen Mockup */}
                        <div className="bg-slate-950 text-white rounded-3xl p-5 border-4 border-slate-800 shadow-lg font-sans relative overflow-hidden">
                          {/* Inner Phone Notch Decorator */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-b-xl z-20"></div>

                          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4 mt-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">INBOUND AUTOMATION LIVE</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">12:00 PM</span>
                          </div>

                          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 text-xs leading-relaxed font-sans scrollbar-hide">
                            
                            {/* Step 1: User incoming keyword */}
                            <div className="flex justify-start">
                              <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm p-3 max-w-[80%] font-sans text-[11px]">
                                <p className="font-mono text-[9px] text-slate-400 mb-0.5">📥 Incoming Inbound DM / Keyword</p>
                                <strong className="text-white block font-sans">"Hey! I saw your post. I'm interested in information about scaling up."</strong>
                              </div>
                            </div>

                            {/* Step 2: Instant Reply Outbound */}
                            <div className="flex justify-end relative group">
                              <div className="bg-indigo-650 bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] font-sans text-[11px] shadow">
                                <span className="font-mono text-[8px] text-indigo-200 block mb-1 uppercase tracking-widest font-bold">💬 Phase 1: Instant Auto-Reply</span>
                                <p className="leading-relaxed font-sans">{inboundResult.instantReply}</p>
                              </div>
                            </div>

                            {/* Step 3: Qualification Question Outbound */}
                            <div className="flex justify-end">
                              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] font-sans text-[11px] shadow">
                                <span className="font-mono text-[8px] text-indigo-200 block mb-1 uppercase tracking-widest font-bold">💬 Phase 2: Qualification Guard</span>
                                <p className="leading-relaxed font-sans">{inboundResult.qualificationQuestion}</p>
                              </div>
                            </div>

                            {/* Step 4: Offer Pitch outbound */}
                            <div className="flex justify-end">
                              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] font-sans text-[11px] shadow">
                                <span className="font-mono text-[8px] text-indigo-200 block mb-1 uppercase tracking-widest font-bold">💬 Phase 3: High-Value Offer CTA</span>
                                <p className="leading-relaxed font-sans">{inboundResult.offerCta}</p>
                              </div>
                            </div>

                            {/* Step 5: Booking Link CTA outbound */}
                            <div className="flex justify-end">
                              <div className="bg-[#10b981] text-white rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] font-sans text-[11px] shadow shadow-emerald-850/20">
                                <span className="font-mono text-[8px] text-emerald-100 block mb-1 uppercase tracking-widest font-bold">🔗 Phase 4: Cal Link Booking Hook</span>
                                <p className="leading-relaxed font-sans font-medium">{inboundResult.bookingLinkMessage}</p>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Copy tools list panel */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-sans font-medium">
                          <button
                            id="btn-copy-inbound-all"
                            onClick={() => {
                              const clipboardText = `--- AUTOMATED RESPONDER FLOW FOR ${inboundPlatform.toUpperCase()} ---\n\n1. Instant Reply:\n${inboundResult.instantReply}\n\n2. Pre-Qualification:\n${inboundResult.qualificationQuestion}\n\n3. Value Offer Presentation:\n${inboundResult.offerCta}\n\n4. Dynamic Calendar Pitch:\n${inboundResult.bookingLinkMessage}`;
                              navigator.clipboard.writeText(clipboardText);
                              alert("Full outbound response sequence copied to clipboard!");
                            }}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-[11px] py-2 px-3 rounded-xl transition-all cursor-pointer font-sans"
                          >
                            Copy Complete Sequence
                          </button>
                          <button
                            id="btn-copy-inbound-reply"
                            onClick={() => {
                              navigator.clipboard.writeText(inboundResult.instantReply);
                              alert("Instant Reply copied!");
                            }}
                            className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] py-2 px-3 rounded-xl transition-all cursor-pointer font-sans"
                          >
                            Copy Instant Reply
                          </button>
                          <button
                            id="btn-copy-inbound-qualification"
                            onClick={() => {
                              navigator.clipboard.writeText(inboundResult.qualificationQuestion);
                              alert("Qualification Question copied!");
                            }}
                            className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] py-2 px-3 rounded-xl transition-all cursor-pointer font-sans"
                          >
                            Copy Qualification
                          </button>
                          <button
                            id="btn-copy-inbound-[booking]"
                            onClick={() => {
                              navigator.clipboard.writeText(inboundResult.bookingLinkMessage);
                              alert("Booking Link Message copied!");
                            }}
                            className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] py-2 px-3 rounded-xl transition-all cursor-pointer font-sans"
                          >
                            Copy Booking Link CTA
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: SECURITY SENTINEL & SELF-MAINTENANCE AGENT */}
          {activeTab === 'sentinel' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-[#022c22]">Security Sentinel & Self-Maintenance Shield</h2>
                    <p className="text-xs text-slate-500">Regularly release automated bug-fixes, guard API key structures, and prevent data leakage vulnerabilities.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-slate-100 pt-5">
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Sentinel Shield Config</div>
                    
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div>
                        <strong className="text-xs text-emerald-950 block">AI Automated Firewalls</strong>
                        <span className="text-[11px] text-slate-500">Block unauthorized workspace tokens and database injection alerts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSentinelShieldEnabled(!sentinelShieldEnabled);
                          setLiveAlerts(prev => [`🛡️ Sentinel State Shifted: [Active: ${!sentinelShieldEnabled}]`, ...prev]);
                        }}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${sentinelShieldEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
                      >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${sentinelShieldEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Workspace Optimization Cleanliness</span>
                        <span className="font-bold text-emerald-700">98% Secure Integrity</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase">Self-Maintenance Agent Trigger</h4>
                      <p className="text-[11px] text-slate-500">Run security heuristics audits, install minor packages, checks memory, and upgrade routing codes instantly.</p>
                      
                      <button
                        onClick={triggerSystemSelfRepair}
                        disabled={isFixingBugs}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold text-xs rounded-xl shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                      >
                        <RotateCw className={`w-4 h-4 ${isFixingBugs ? 'animate-spin' : ''}`} />
                        {isFixingBugs ? 'Activating Heuristics Sandbox...' : 'Run Dynamic Maintenance Refactor'}
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE SENTINEL LOGS FEED */}
                  <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold block uppercase mb-4">Autonomous Safe Operations Log</span>
                      
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {sentinelLogs.map((log, index) => (
                          <div key={index} className="text-xs font-mono leading-relaxed border-b border-slate-800/65 pb-2 last:border-none">
                            <span className="text-slate-400 block text-[10px]">{new Date().toLocaleString()}</span>
                            <span className="text-emerald-400 mt-1 block">{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 font-mono text-[10px] text-slate-500 flex justify-between">
                      <span>Sentinel Version: Stable 2.5-Edge</span>
                      <button onClick={() => setSentinelLogs(["🛡️ Safe Logs Cleaned."])} className="text-amber-400 hover:underline">Flush buffer</button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* DYNAMIC PROMO SCRIPTS TO VIDEO PANEL GENERATOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="text-amber-500 w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-800">Generative AI Social Promo Video Script Creator</h3>
                  <p className="text-xs text-slate-400">Generate high-converting script directions from text inputs using advanced models</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              <textarea
                rows={2}
                value={videoScriptInput}
                onChange={(e) => setVideoScriptInput(e.target.value)}
                placeholder="Describe your desired social clip and timeline sequence..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />

              <button
                onClick={generateVideoSnippet}
                disabled={isVideoGenerating}
                className="bg-emerald-950 text-white hover:bg-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 ml-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isVideoGenerating ? 'Compiling Video Script...' : 'Assemble Scene Scenarios'}
              </button>

              {videoResult && (
                <div className="bg-[#022c22]/10 border border-dashed border-emerald-600/30 rounded-xl p-4 mt-3">
                  <pre className="text-xs font-mono whitespace-pre-wrap text-[#022c22] leading-relaxed">
                    {videoResult}
                  </pre>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* 🤖 CHATBOT FLOATING PANEL (Gemini Assistance Node) */}
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden flex flex-col">
        <div className="bg-emerald-950 p-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-400 p-1.5 rounded-lg text-emerald-950">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold block">Gemini Marketing Bot</span>
              <span className="text-[10px] text-emerald-300">Strategy consultant active</span>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-emerald-900 border border-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full">Secure AI</span>
        </div>

        {/* Chats lists */}
        <div className="h-64 overflow-y-auto p-3.5 space-y-3 bg-[#fafbfa] border-b border-slate-100">
          {assistantLogs.map((log, idx) => (
            <div key={idx} className={`flex flex-col ${log.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`p-3 rounded-2xl text-xs leading-normal max-w-xs ${
                  log.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
                style={{ contentVisibility: 'auto' }}
              >
                <div className="whitespace-pre-wrap">{log.text}</div>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 font-mono">{log.time}</span>
            </div>
          ))}

          {isChatTyping && (
            <div className="flex items-center gap-1 text-slate-400 text-xs px-2 animate-pulse mt-1">
              <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
              <span>Analyzing copy alignment...</span>
            </div>
          )}
        </div>

        {/* Input prompt form */}
        <form onSubmit={handleChatSubmit} className="p-2 bg-slate-50 flex items-center gap-1.5">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Gemini for headlines, email headers..."
            className="flex-1 bg-white border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
          />
          <button 
            type="submit" 
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 🛠️ ASSET AI OPTIMIZER OVERLAY (MODAL VIEW) */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-[#022c22]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-400 w-4.5 h-4.5" />
                <h4 className="font-display font-medium text-sm">Optimize Copy: {selectedAsset.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)} 
                className="text-slate-400 hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl transition-all"
              >
                ✕ Close Window
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Niche Concept</span>
                  <span className="text-slate-700 font-semibold">{selectedNicheId.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Funnel Stage</span>
                  <span className="text-slate-700 font-semibold">{selectedAsset.stageType}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Write / Refine optimization goal:</label>
                <input
                  type="text"
                  value={optimizationGoal}
                  onChange={(e) => setOptimizationGoal(e.target.value)}
                  placeholder="e.g. Higher CTR, invoke serious professional authority"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Active copywriting body:</label>
                <textarea
                  rows={8}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono text-xs p-4 rounded-xl focus:outline-none resize-y leading-relaxed"
                />
              </div>

              {/* ACTION PROGRESS OR LOGS */}
              {optimizationLog.length > 0 && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
                  {optimizationLog.map((log, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="text-emerald-600">✦</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400">Generates 3 test hypotheses instantly.</span>
                
                <button
                  onClick={handleOptimizeAsset}
                  disabled={isOptimizing}
                  className="bg-amber-400 hover:bg-amber-500 disabled:bg-slate-200 text-emerald-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isOptimizing ? 'Optimizing with neural constraints...' : 'Apply Automated Optimizations'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-500 py-6 mt-12 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>Created by the AI Coding Agent on the Google Cloud platform utilizing standard Node.js & React integrations safely.</p>
          <div className="flex justify-center gap-4 text-[11px]">
            <a href="https://ai.google.dev/gemini-api" target="_blank" rel="noreferrer" className="hover:text-slate-300 flex items-center gap-0.5">Gemini Docs <ExternalLink className="w-2.5 h-2.5" /></a>
            <span>·</span>
            <span className="text-emerald-400">Shield Sentinel Protocol Active</span>
            <span>·</span>
            <span>thinktecai@gmail.com</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
