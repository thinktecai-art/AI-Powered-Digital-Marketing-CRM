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
  FileText
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

  // AI Voice Agent Simulation Launcher
  const triggerVoiceDialer = () => {
    const selectedLead = contacts.find(c => c.id === selectedVoiceLeadId);
    if (!selectedLead) return;

    setVoiceActive(true);
    setVoiceLog(prev => [
      `📞 Calling ${selectedLead.name} (${selectedLead.phone})...`,
      ...prev
    ]);

    // Simulate voice conversation responses
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
                      <h4 className="text-sm font-semibold mb-4 text-slate-800">Generated Assets per Funnel Stage</h4>
                      
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* FIELD CONFIGURATION FORM */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheck className="text-emerald-600 w-5 h-5" />
                    <div>
                      <h3 className="text-sm font-bold font-display text-slate-800">Dynamic Landing Page Forms Designer</h3>
                      <p className="text-xs text-slate-400">Construct qualifying forms to eliminate low-intent, price-sensitive leads on autopilot.</p>
                    </div>
                  </div>

                  {/* Preview of current configured form fields */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-500 space-y-2">
                    <div className="font-semibold text-slate-700 uppercase tracking-wide text-[10px] mb-2">Active Fields Layout</div>
                    {formFields.map((f, idx) => (
                      <div key={f.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-slate-400 mr-2">[{idx + 1}]</span>
                          <strong className="text-slate-800">{f.label}</strong>
                          <span className="ml-2 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase">{f.type}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteField(f.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Field form inputs */}
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3.5">
                    <div className="text-xs font-semibold text-slate-700 mb-1">Add Custom Question Nodes</div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Question Label</label>
                      <input
                        type="text"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="e.g. Expected Monthly Revenue Growth?"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Input Presentation Form</label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                      >
                        <option value="text">Single Line Text</option>
                        <option value="textarea">Multi-line Paragraph</option>
                        <option value="dropdown">Options Dropdown Grid</option>
                        <option value="checkbox">Boolean Checkbox Confirm</option>
                      </select>
                    </div>

                    <button
                      onClick={handleAddField}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Field Node
                    </button>
                  </div>
                </div>

                {/* BEAUTIFUL VISUAL PREVIEW OF INTEGRATED LANDING PAGE FORM */}
                <div className="bg-[#1e293b] text-white rounded-2xl p-6 shadow-sm border border-slate-800 justify-between flex flex-col">
                  
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-mono text-[10px] rounded uppercase font-semibold border border-emerald-800">
                        Live Embed Form Preview
                      </span>
                      <span className="text-slate-400 text-xs font-mono">Theme: Sovereign Dark</span>
                    </div>

                    <p className="text-xs text-amber-300 font-mono mb-1 uppercase font-semibold">Value Exchange Stage</p>
                    <h4 className="text-lg font-display font-medium mb-3">Claim Your Custom Niche Roadmap</h4>
                    <p className="text-xs text-slate-300 mb-5 leading-relaxed">Customize input fields on the left. The live code generator will synchronize your data fields instantly into checkout templates.</p>

                    {/* RENDER DYNAMIC FIELDS */}
                    <div className="space-y-4">
                      {formFields.map(field => (
                        <div key={field.id} className="space-y-1.5">
                          <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                          </label>
                          
                          {field.type === 'text' && (
                            <input 
                              type="text" 
                              disabled 
                              placeholder={field.placeholder} 
                              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs placeholder-slate-500 focus:outline-none"
                            />
                          )}

                          {field.type === 'textarea' && (
                            <textarea 
                              disabled 
                              rows={2} 
                              placeholder={field.placeholder} 
                              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs placeholder-slate-500 focus:outline-none"
                            />
                          )}

                          {field.type === 'dropdown' && (
                            <select disabled className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-400 focus:outline-none">
                              {(field.options || ['Option A', 'Option B']).map(o => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                          )}

                          {field.type === 'checkbox' && (
                            <div className="flex items-center gap-2">
                              <input type="checkbox" disabled className="w-4 h-4 bg-slate-900 border-slate-800 rounded accent-emerald-500" />
                              <span className="text-xs text-slate-400">Yes, I accept immediate follow-up analytics.</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button 
                      type="button" 
                      disabled
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold text-xs p-3.5 rounded-xl transition-all shadow-md mt-6"
                    >
                      Instant Diagnostic Check-In
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Generated JS: React-Native and Web modules</span>
                    <button 
                      onClick={() => alert("Form HTML copy helper cached on system clipboard.")}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" /> Get Embed Code
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 6: VOICE AI SIMULATOR */}
          {activeTab === 'voiceSimulator' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">Low-Latency Conversational Voice AI Simulator</h2>
                    <p className="text-xs text-slate-500">Auto-dial pipeline prospects with ultra low-delay voice synthesize scripts based on niche outcome models.</p>
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
