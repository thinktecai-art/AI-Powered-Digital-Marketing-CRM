import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Mail, 
  Megaphone, 
  ShoppingBag, 
  Star, 
  HelpCircle, 
  FileText, 
  Check, 
  Copy, 
  ArrowRight, 
  Video, 
  Camera, 
  BarChart3, 
  Layers, 
  RefreshCw, 
  Send, 
  AlertTriangle, 
  Eye, 
  Search,
  CheckCircle2,
  Lock,
  MessageSquare,
  Volume2,
  Calendar,
  Clock,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { Funnel } from '../types';

interface AICopywriterStudioProps {
  activeFunnel: Funnel | null | undefined;
  userSubscription?: {
    plan: string;
    status: string;
    expiresAt: string;
    price: string;
    billingPeriod: string;
  };
  setActiveTab?: (tab: string) => void;
}

type CopyToolType = 
  | 'seo' 
  | 'social' 
  | 'email' 
  | 'ads' 
  | 'pdp' 
  | 'visual' 
  | 'social_proof' 
  | 'support' 
  | 'analytics_story' 
  | 'orchestrator'
  | 'communication'
  | 'sales_enablement'
  | 'reputation_cx'
  | 'operations'
  | 'webinar_funnel'
  | 'conversational_chat'
  | 'social_calendar'
  | 'outreach_scripts'
  | 'nurture_sequence'
  | 'onboarding_content'
  | 'community_execution'
  | 'call_tracking';

export default function AICopywriterStudio({ activeFunnel, userSubscription, setActiveTab }: AICopywriterStudioProps) {
  const [generationsCount, setGenerationsCount] = useState(() => {
    const saved = localStorage.getItem('sovereign_generations_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const trackGeneration = () => {
    const nextCount = generationsCount + 1;
    setGenerationsCount(nextCount);
    localStorage.setItem('sovereign_generations_count', nextCount.toString());
  };
  // Inputs matching requirements
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [avatar, setAvatar] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [tone, setTone] = useState('conversion-focused, emotional, and sensory');
  
  // Tool-specific sub inputs
  const [customOffer, setCustomOffer] = useState('Get $50 off your starter capsule with code luxurycode50 this week!');
  const [platformFocus, setPlatformFocus] = useState('TikTok and Instagram Reels');
  const [storeType, setStoreType] = useState('Direct-to-Consumer Organic Boutique');
  const [regions, setRegions] = useState('North America & United Kingdom');
  const [shippingTime, setShippingTime] = useState('3 to 5 business days');
  const [returnWindow, setReturnWindow] = useState('30-day wear & love trial');

  // New tool states
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'sms' | 'linkedin'>('email');
  const [onboardingUserType, setOnboardingUserType] = useState<'agency' | 'client'>('client');
  const [callType, setCallType] = useState<'missed' | 'completed'>('missed');
  const [communityType, setCommunityType] = useState('Sovereign consultants & agency partners');
  const [communityGoal, setCommunityGoal] = useState('double monthly appointment volume and client retention');

  // Metrics sub inputs (for analytics)
  const [trafficSocial, setTrafficSocial] = useState(6200);
  const [trafficSearch, setTrafficSearch] = useState(2400);
  const [trafficDirect, setTrafficDirect] = useState(900);
  const [emailOpenRate, setEmailOpenRate] = useState(22.4);
  const [emailClickRate, setEmailClickRate] = useState(3.6);
  const [adCtr, setAdCtr] = useState(1.8);
  const [adCpa, setAdCpa] = useState(48.5);
  const [pdpConversion, setPdpConversion] = useState(1.4);

  // States
  const [selectedTool, setSelectedTool] = useState<CopyToolType>('seo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [generationOutput, setGenerationOutput] = useState<any>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showMetricsPanel, setShowMetricsPanel] = useState(true);

  // Email client state
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);

  // Instagram carousel slide state
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0);

  // Support template toggle
  const [activeSupportTemplate, setActiveSupportTemplate] = useState<'order' | 'return'>('order');

  // Webinar email sub-tab
  const [webinarEmailTab, setWebinarEmailTab] = useState<'confirm' | '1hour' | '10min'>('confirm');

  // Interactive Chatbot widget states
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [chatAnswers, setChatAnswers] = useState<Record<string, { optionText: string; optionIndex: string }>>({});
  const [activePreShowOffer, setActivePreShowOffer] = useState(false);
  const [chatConfigTab, setChatConfigTab] = useState<'phone' | 'config'>('phone');

  // Sync with active funnel selections
  useEffect(() => {
    if (activeFunnel) {
      setProductName(activeFunnel.product || '');
      setCategory(activeFunnel.nicheName || '');
      setAvatar(activeFunnel.avatar || '');
      setPainPoint(activeFunnel.painPoint || '');
      setDesiredOutcome(activeFunnel.desiredOutcome || '');
    }
  }, [activeFunnel]);

  // Reset chatbot interactive preview when tools change or generation restarts
  useEffect(() => {
    setCurrentChatIndex(0);
    setChatAnswers({});
    setActivePreShowOffer(false);
  }, [selectedTool, generationOutput]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const executeGeneration = async () => {
    const isTrial = !userSubscription || userSubscription.plan === 'Free Trial';
    if (isTrial && generationsCount >= 3) {
      setErrorText("Trial Limit Reached: Your 7-day free trial is strictly limited to 3 content generations. Upgrade to Sovereign Pro ($49.99/mo) to unlock unlimited instant generations!");
      return;
    }

    setIsGenerating(true);
    setErrorText(null);
    setGenerationOutput(null);

    const apiBody = {
      toolType: selectedTool,
      inputs: {
        product_name: productName,
        category: category,
        avatar: avatar,
        pain_point: painPoint,
        desired_outcome: desiredOutcome,
        tone: tone,
        custom_offer: customOffer,
        platform_focus: platformFocus,
        store_type: storeType,
        regions: regions,
        shipping_time: shippingTime,
        return_window: returnWindow,
        
        // New tool inputs
        channel: outreachChannel,
        user_type: onboardingUserType,
        call_type: callType,
        community_type: communityType,
        goal: communityGoal,
        business: productName,
        avatar_profile: avatar,
        offer: customOffer,

        metrics: {
          trafficByChannel: {
            social: trafficSocial,
            organicSearch: trafficSearch,
            direct: trafficDirect
          },
          emailMetrics: {
            openRate: emailOpenRate / 100,
            clickThroughRate: emailClickRate / 100
          },
          paidAdsMetrics: {
            clickThroughRate: adCtr / 100,
            cpa: adCpa
          },
          productPageConversion: pdpConversion / 100
        }
      }
    };

    try {
       // Also block premium tools if on trial
       const isPremium = ['orchestrator', 'analytics_story', 'social_calendar', 'conversational_chat'].includes(selectedTool);
       if (isTrial && isPremium) {
         throw new Error("Premium Tool Locked: This generator tool is exclusive to Sovereign Pro subscribers. Upgrade your license to access high-tier predictive copy frameworks.");
       }

      const response = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody)
      });

      if (!response.ok) {
        throw new Error(`Server returned error code ${response.status}`);
      }

      const result = await response.json();
      setGenerationOutput(result.data);
      if (isTrial) {
        trackGeneration();
      }
    } catch (err: any) {
      console.error("AI copywriting execution issue:", err);
      setErrorText(err.message || "Failed to contact Gemini API. Please review parameters or server status.");
    } finally {
      setIsGenerating(false);
    }
  };

  const autofillPreset = (presetType: 'skincare' | 'capsule' | 'workout') => {
    if (presetType === 'skincare') {
      setProductName("Pure Radiance Sea Buckthorn Elixir");
      setCategory("Organic Skin Care");
      setAvatar("Busy professional mothers experiencing stress-induced breakouts and fine lines");
      setPainPoint("Overwhelmed by painful 12-step chemical regimes leaving dry patches");
      setDesiredOutcome("Simple 3-minute botanic ritual restoring a glowing, balanced complexion");
      setTone("calming, restorative, sensory, and science-supported");
      setCustomOffer("Get a free organic rose jade facial roller with code GLOWFACIAL!");
      setStoreType("Premium Phyto-Active Apothecary");
      setShippingTime("2-4 business days with premium custom sizing cardboard");
    } else if (presetType === 'capsule') {
      setProductName("Eco-Luxe Timeless Silhouette Collection");
      setCategory("Sustainable Apparel");
      setAvatar("Urban commuter executives looking to balance sustainable wardrobe aesthetics");
      setPainPoint("Morning dressing anxiety and wardrobe choices taking forever with eco guilt");
      setDesiredOutcome("Curate 15 elegant styles out of 5 core premium linen garments in under 60 seconds");
      setTone("ethical, luxury, minimal, and premium");
      setCustomOffer("Get $100 off your complete Starter Wardrobe slots code APPAREL100");
      setStoreType("Sustainable Organic Couture");
      setShippingTime("3-5 custom tailored business days");
    } else if (presetType === 'workout') {
      setProductName("Metabolic Athletic core 20-Min workout");
      setCategory("Functional Physical Training");
      setAvatar("Desk-bound white collar workers over forty suffering from lower back stiffness");
      setPainPoint("Too slow or sluggish to spend hours in public gyms risking joint pain");
      setDesiredOutcome("Regain joint stability and burn belly fat with 20-minute bodyweight routines from home");
      setTone("coach-supportive, direct, energetic, and safety-verified");
      setCustomOffer("Secure free physical therapist consultation with code ACTIVEFORTY");
      setStoreType("Home Athletic Subscription Platform");
      setShippingTime("Instant Digital Deployment to smartphone app");
    }
  };

  const toolsList = [
    { id: 'seo', name: 'SEO Content Pillar', icon: Search, desc: '3 Educational blog posts & detailed pillar outline' },
    { id: 'social', name: 'Viral Social Scripts', icon: Video, desc: 'TikTok/Reels teleprompters & IG Carousel slider' },
    { id: 'email', name: 'Sales Email Sequence', icon: Mail, desc: '3-Step conversion campaign matching avatars' },
    { id: 'webinar_funnel', name: 'Webinar Funnel Copy deck', icon: Video, desc: 'Complete webinar scripts outline, registrations & emails' },
    { id: 'social_calendar', name: '30-Day Content Calendar', icon: Calendar, desc: 'Daily post ideas, captions, specific CTA & hashtags' },
    { id: 'outreach_scripts', name: 'Outreach & Prospecting', icon: Send, desc: '3 Outreach variations, follow-up & friction bump replies' },
    { id: 'nurture_sequence', name: '5-Message Nurture sequence', icon: Mail, desc: '3 Persuasive nurture emails & 2 direct SMS deadline reminders' },
    { id: 'onboarding_content', name: 'Mobile Setup Onboarding', icon: Phone, desc: 'Personal welcome cards, feature overview checklists & CTAs' },
    { id: 'community_execution', name: 'Community Sprints Blueprint', icon: Layers, desc: 'Weekly challenges, P2P prompts, accountability loops & trackers' },
    { id: 'call_tracking', name: 'Call Tracking & Follow-up', icon: Phone, desc: 'Missed vs completed SMS, emails & spoken phone script' },
    { id: 'conversational_chat', name: 'Conversational AI Chat', icon: MessageSquare, desc: 'Dynamic qualification chatbot flow, branching replies & CTA' },
    { id: 'ads', name: 'Paid Ad Variant Copy', icon: Megaphone, desc: 'Meta Sponsored posts & search engine blueprints' },
    { id: 'pdp', name: 'PDP Product Showcase', icon: ShoppingBag, desc: 'High-converting descriptions, spec summaries & FAQs' },
    { id: 'visual', name: 'Visual Media Playbook', icon: Camera, desc: 'Studio camera shot list & unboxing storyboard' },
    { id: 'social_proof', name: 'Social Proof architect', icon: Star, desc: 'Persona reviews, website testimonials & UGC' },
    { id: 'support', name: 'CX Helpdesk & Policies', icon: HelpCircle, desc: 'Support templates, shipping rules & secure checkout' },
    { id: 'analytics_story', name: 'Funnel Storyteller', icon: BarChart3, desc: 'Diagnostic insights reports & testing ideas' },
    { id: 'communication', name: 'Communication AI Tools', icon: MessageSquare, desc: 'Call scripts, Chat widget flow, SMS, textbacks & webinar structure' },
    { id: 'sales_enablement', name: 'Sales Enablement Pack', icon: Send, desc: 'Outbound prospecting, QR engagement & Card followup sequencer' },
    { id: 'reputation_cx', name: 'CX Reputation & Trust', icon: CheckCircle2, desc: 'Reviews triggers, positive/negative response builder & sign directions' },
    { id: 'operations', name: 'Operations Stage Triggers', icon: Clock, desc: 'Appointment setups, 24h/1h calendar alerts & CRM transition messages' },
    { id: 'orchestrator', name: 'Campaign Orchestrator', icon: Layers, desc: 'Step-by-step roadmap and multi-agent plan' }
  ];

  return (
    <div className="space-y-6" id="ai-copywriter-section">
      {/* 🚀 Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 rounded-2xl p-6 shadow-md border border-emerald-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Sovereign Copy Engine
              </span>
              <span className="text-emerald-300 text-xs font-mono">Powered by Gemini 3.5 Flash</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-sans">
              AI Conversion Copywriter Studio
            </h2>
            <p className="text-emerald-100/80 text-sm max-w-2xl font-light">
              Craft beautiful, highly persuasive, and fully compliant marketing copy. Toggle any of our 14 specialized generators to construct visual mocks instantly tuned to your customer's deepest desires.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:self-center">
            <span className="text-xs text-emerald-300 font-mono hidden lg:inline mr-2">Quick Presets:</span>
            <button 
              onClick={() => autofillPreset('skincare')}
              className="text-xs bg-emerald-900 hover:bg-emerald-800 text-amber-200 border border-emerald-700/60 px-3 py-1.5 rounded-lg active:scale-95 transition-all text-left"
            >
              🌿 Skincare
            </button>
            <button 
              onClick={() => autofillPreset('capsule')}
              className="text-xs bg-emerald-900 hover:bg-emerald-800 text-amber-200 border border-emerald-700/60 px-3 py-1.5 rounded-lg active:scale-95 transition-all text-left"
            >
              👗 Apparel
            </button>
            <button 
              onClick={() => autofillPreset('workout')}
              className="text-xs bg-emerald-900 hover:bg-emerald-800 text-amber-200 border border-emerald-700/60 px-3 py-1.5 rounded-lg active:scale-95 transition-all text-left"
            >
              💪 Workout
            </button>
          </div>
        </div>
      </div>

      {/* Trial Status Banner */}
      {(!userSubscription || userSubscription.plan === 'Free Trial') && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-550/5 to-transparent border border-amber-500/25 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 mt-0.5 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">Strictly Limited 7-Day Trial Mode Active</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                You have used <span className="font-bold text-amber-400 font-mono">{generationsCount}/3</span> free generation credits. Advanced campaign roadmap planner, 30-day content calendar, diagnostics storyteller, and dynamic web chats are locked.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab?.('subscription')}
            className="text-xs whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all flex items-center gap-1.5 self-start md:self-center"
          >
            <span>Upgrade to Sovereign Pro ($49.99/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* 📋 Left configurations and selector */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-1.5 h-3 bg-emerald-600 rounded-full" />
                Step 1: Input Brand & Product Parameters
              </h3>
              {activeFunnel && (
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                  Funnel Linked: {activeFunnel.product.slice(0, 15)}...
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block text-slate-500 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Pure Botanical Facial Drops"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Category/Niche</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Organic Skincare"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Brand Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="conversion-focused, emotional, and sensory">Conversion & Sensory (Persuasive)</option>
                    <option value="minimal, scientific, and high-contrast styling">Minimal & Scientific</option>
                    <option value="authoritative, urgent, and scarcity-driven">Urgent & Scarcity-Driven</option>
                    <option value="luxury, premium, confident, and bespoke">Luxury & Bespoke</option>
                    <option value="playful, conversational, and energetic">Conversational & Playful</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Target Customer Profile / Bio-Persona</label>
                <textarea 
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="e.g. Working mothers experiencing dry patches and breakouts due to high-stress schedules."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Primary Problem/Anxiety (Pain Point)</label>
                <textarea 
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  placeholder="e.g. Overwhelmed by painful 10-step chemical skin treatment regimes that cause skin burn and dry patches."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Ultimate Goal/Aesthetic Result (Desired Outcome)</label>
                <textarea 
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  placeholder="e.g. A gorgeous, simple, 3-minute morning botanic ritual restoring glowing radiant facial moisture."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-[11px]"
                />
              </div>

              {/* 🛡️ Extended Parameters (Rendered Contextually) */}
              <AnimatePresence mode="popLayout">
                {selectedTool === 'email' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2"
                  >
                    <label className="block text-emerald-700 font-semibold">Special Campaign Launch Offer Details</label>
                    <input 
                      type="text" 
                      value={customOffer}
                      onChange={(e) => setCustomOffer(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white outline-none transition-all text-[11px]"
                    />
                  </motion.div>
                )}

                {selectedTool === 'social' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2"
                  >
                    <label className="block text-emerald-700 font-semibold">Social Platforms Focus</label>
                    <input 
                      type="text" 
                      value={platformFocus}
                      onChange={(e) => setPlatformFocus(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white outline-none transition-all text-[11px]"
                    />
                  </motion.div>
                )}

                {selectedTool === 'support' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-3"
                  >
                    <p className="text-emerald-700 font-semibold pb-1 border-b border-slate-100">Store / Fulfillment Config</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <label className="block text-slate-500 mb-0.5">Store Class / Type</label>
                        <input 
                          type="text" 
                          value={storeType}
                          onChange={(e) => setStoreType(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-0.5">Regions Served</label>
                        <input 
                          type="text" 
                          value={regions}
                          onChange={(e) => setRegions(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <label className="block text-slate-500 mb-0.5">Shipping Time</label>
                        <input 
                          type="text" 
                          value={shippingTime}
                          onChange={(e) => setShippingTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-0.5">Return Policy Window</label>
                        <input 
                          type="text" 
                          value={returnWindow}
                          onChange={(e) => setReturnWindow(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTool === 'outreach_scripts' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2.5"
                  >
                    <label className="block text-emerald-700 font-semibold text-[11px]">Outreach Target Channel</label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 border border-slate-205 rounded-xl text-[10px]">
                      {(['email', 'sms', 'linkedin'] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setOutreachChannel(ch)}
                          className={`py-1 rounded-lg font-mono uppercase transition-colors cursor-pointer select-none ${
                            outreachChannel === ch 
                              ? 'bg-emerald-600 text-white font-bold' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedTool === 'onboarding_content' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2.5"
                  >
                    <label className="block text-emerald-700 font-semibold text-[11px]">Onboarding End-User Profile</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-205 rounded-xl text-[10px]">
                      {(['client', 'agency'] as const).map((ut) => (
                        <button
                          key={ut}
                          type="button"
                          onClick={() => setOnboardingUserType(ut)}
                          className={`py-1 rounded-lg font-mono uppercase transition-colors cursor-pointer select-none ${
                            onboardingUserType === ut 
                              ? 'bg-emerald-600 text-white font-bold' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {ut}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedTool === 'call_tracking' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2.5"
                  >
                    <label className="block text-emerald-700 font-semibold text-[11px]">Call Tracker Type</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-205 rounded-xl text-[10px]">
                      {(['missed', 'completed'] as const).map((ct) => (
                        <button
                          key={ct}
                          type="button"
                          onClick={() => setCallType(ct)}
                          className={`py-1 rounded-lg font-mono uppercase transition-colors cursor-pointer select-none ${
                            callType === ct 
                              ? 'bg-amber-600 text-white font-bold' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {ct}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedTool === 'community_execution' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2"
                  >
                    <div>
                      <label className="block text-emerald-700 font-semibold text-[11px] mb-0.5">Community Profile</label>
                      <input 
                        type="text" 
                        value={communityType}
                        onChange={(e) => setCommunityType(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] outline-none focus:bg-white"
                        placeholder="e.g. Independent consultants & agency partners"
                      />
                    </div>
                    <div>
                      <label className="block text-emerald-700 font-semibold text-[11px] mb-0.5">Shared Sprints Goal</label>
                      <input 
                        type="text" 
                        value={communityGoal}
                        onChange={(e) => setCommunityGoal(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] outline-none focus:bg-white"
                        placeholder="e.g. achieve sustainable retention"
                      />
                    </div>
                  </motion.div>
                )}

                {selectedTool === 'social_calendar' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2"
                  >
                    <label className="block text-emerald-700 font-semibold text-[11px]">Platform Channels Focus</label>
                    <input 
                      type="text" 
                      value={platformFocus}
                      onChange={(e) => setPlatformFocus(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white outline-none transition-all text-[11px]"
                    />
                  </motion.div>
                )}

                {selectedTool === 'nurture_sequence' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-2"
                  >
                    <label className="block text-emerald-700 font-semibold text-[11px]">Special Offer Details</label>
                    <input 
                      type="text" 
                      value={customOffer}
                      onChange={(e) => setCustomOffer(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:bg-white outline-none transition-all text-[11px]"
                    />
                  </motion.div>
                )}

                {selectedTool === 'analytics_story' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-3 border-t border-slate-100 overflow-hidden space-y-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-800 font-bold text-[11px] uppercase tracking-wider font-mono">
                        📊 Current Funnel Performance Metrics
                      </span>
                      <button 
                        type="button"
                        onClick={() => setShowMetricsPanel(!showMetricsPanel)}
                        className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded underline cursor-pointer"
                      >
                        {showMetricsPanel ? 'Hide Variables' : 'Show Variables'}
                      </button>
                    </div>

                    {showMetricsPanel && (
                      <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold text-slate-700">
                        <div>
                          <label className="block text-slate-500 mb-0.5">Social Traffic / Mo</label>
                          <input 
                            type="number" 
                            value={trafficSocial}
                            onChange={(e) => setTrafficSocial(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Organic Search / Mo</label>
                          <input 
                            type="number" 
                            value={trafficSearch}
                            onChange={(e) => setTrafficSearch(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Direct Store Traffic</label>
                          <input 
                            type="number" 
                            value={trafficDirect}
                            onChange={(e) => setTrafficDirect(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Email Click Rate (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={emailClickRate}
                            onChange={(e) => setEmailClickRate(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Email Open Rate (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={emailOpenRate}
                            onChange={(e) => setEmailOpenRate(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Paid Ads CPA ($)</label>
                          <input 
                            type="number" 
                            value={adCpa}
                            onChange={(e) => setAdCpa(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Paid Ads CTR (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={adCtr}
                            onChange={(e) => setAdCtr(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Store Conversion (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={pdpConversion}
                            onChange={(e) => setPdpConversion(Number(e.target.value))}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 🛠️ Script Selectors */}
          <div className="bg-slate-50/70 rounded-2xl p-4 shadow-sm border border-slate-200/80">
            <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-amber-500 rounded-full" />
              Step 2: Choose Your AI Generator Tool
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-2">
              {toolsList.map((tool) => {
                const IconComponent = tool.icon;
                const isTrial = !userSubscription || userSubscription.plan === 'Free Trial';
                const isPremium = ['orchestrator', 'analytics_story', 'social_calendar', 'conversational_chat'].includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSelectedTool(tool.id as CopyToolType);
                      // Reset states
                      setGenerationOutput(null);
                      setErrorText(null);
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-xl text-left border cursor-pointer active:scale-98 transition-all duration-200 ${
                      selectedTool === tool.id 
                        ? 'bg-emerald-900 border-emerald-800 text-white shadow-sm' 
                        : 'bg-white border-slate-200/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${selectedTool === tool.id ? 'bg-emerald-800 text-amber-300' : 'bg-slate-150 text-slate-600'}`}>
                      <IconComponent className="w-4 h-4 text-inherit" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">{tool.name}</span>
                        {isTrial && isPremium && (
                          <span className="inline-flex items-center gap-0.5 text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-600 px-1 py-0.5 rounded-full font-black uppercase font-mono leading-none">
                            <Lock className="w-2 h-2 text-amber-500" /> PRO
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] ${selectedTool === tool.id ? 'text-emerald-100/80' : 'text-slate-400'} mt-0.5 font-light leading-snug truncate`}>
                        {tool.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <button
                disabled={isGenerating || !productName}
                onClick={executeGeneration}
                className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white py-3 px-4 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow shadow-emerald-800/10"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini Core Modeling...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Run Copy Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 📺 Right Column: Generator Result Stage */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[550px] relative flex flex-col shadow-inner">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Stage Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Preview Canvas
                </span>
                <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded">
                  {selectedTool.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>

            {/* Error view */}
            {errorText && (
              <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-4 text-rose-200 text-xs flex gap-3 mb-4 animate-fadeIn relative z-10">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-rose-300">Copywriting Engine Error</h4>
                  <p className="mt-1 leading-relaxed">{errorText}</p>
                </div>
              </div>
            )}

            {/* Main Stage Content */}
            <div className="flex-1 flex flex-col justify-center relative z-10 animate-fadeIn">
              {(() => {
                const isTrial = !userSubscription || userSubscription.plan === 'Free Trial';
                const isPremium = ['orchestrator', 'analytics_story', 'social_calendar', 'conversational_chat'].includes(selectedTool);
                
                if (isTrial && isPremium) {
                  return (
                    <motion.div
                      key="premium-locked"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 px-6 max-w-lg mx-auto space-y-6"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20 shadow-lg relative">
                        <Lock className="w-8 h-8 text-amber-500" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400" />
                      </div>
                      <div className="space-y-1">
                        <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          Sovereign Pro Exclusive Feature
                        </span>
                        <h3 className="text-lg font-bold font-sans text-slate-100 tracking-tight mt-2">
                          {toolsList.find(t => t.id === selectedTool)?.name || 'Premium Copy Generator'} is Locked
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                          This advanced copywriting tool is reserved for active Pro subscribers. Your 7-day trial supports basic copy frameworks like SEO content pillars and social proofs.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3 text-left">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Unlocked with Sovereign Pro:</h4>
                        <ul className="text-[11px] text-slate-400 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-450 shrink-0" />
                            <span className="text-slate-350">Unlimited Gemini 3.5 Flash core modeling</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-455 shrink-0" />
                            <span className="text-slate-355">30-Day automated social media calendar generator</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-455 shrink-0" />
                            <span className="text-slate-355">Full step-by-step Campaign Orchestrator & Roadmap</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-455 shrink-0" />
                            <span className="text-slate-355">Interactive Conversational AI Chat & Funnel Storyteller</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => setActiveTab?.('subscription')}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-lg transition cursor-pointer shadow shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                        >
                          <span>Upgrade Plan to Sovereign Pro</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedTool('seo')}
                          className="w-full sm:w-auto px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-lg border border-slate-750 transition cursor-pointer"
                        >
                          Return to Basic Tools
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <AnimatePresence mode="wait">
                    {/* 1. IDLE STATE */}
                    {!isGenerating && !generationOutput && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-12 px-4 max-w-sm mx-auto space-y-4"
                  >
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 mx-auto border border-slate-700">
                      <Sparkles className="w-8 h-8 text-amber-500/70" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-200">Copy Engine is Ready</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        Select a copywriting target block on the left, check your variables, and press "Run Copy Engine" to query Gemini.
                      </p>
                    </div>
                    <button
                      onClick={executeGeneration}
                      className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-amber-400 border border-slate-750 font-mono text-xs font-bold rounded-lg uppercase tracking-wider mx-auto cursor-pointer"
                    >
                      Instant Generation
                    </button>
                  </motion.div>
                )}

                {/* 2. GENERATING STATE */}
                {isGenerating && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 space-y-6 max-w-md mx-auto"
                  >
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-amber-400 border-r-emerald-500 rounded-full animate-spin" />
                      <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono">
                        Assembling Campaign Materials
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono space-y-1">
                        <p className="animate-pulse">📝 Formatting target JSON schema response...</p>
                        <p className="text-emerald-400">🔥 Modeling psychological hook variations...</p>
                        <p className="text-xs text-slate-500 font-light mt-2 italic">
                          "Matching the tone '{tone}' to customer avatar desires..."
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. GENERATION OUTPUT RENDERING ENGINE */}
                {!isGenerating && generationOutput && (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* SEO VIEW */}
                    {selectedTool === 'seo' && (
                      <div className="space-y-5 animate-fadeIn">
                        {/* Blog Post cards */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400">
                            🎯 Search INTENT Keyword Articles
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {(generationOutput.blogPosts || []).map((post: any, idx: number) => (
                              <div key={idx} className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden group">
                                <div className="absolute right-3 top-3">
                                  <button
                                    onClick={() => handleCopy(`${post.title}\nKeyword: ${post.keyword}\nOutline:\n${post.outline?.join('\n')}\nCTA: ${post.cta}`, `blog-${idx}`)}
                                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 select-none cursor-pointer"
                                  >
                                    {copiedText === `blog-${idx}` ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400 text-[9px] font-bold">COPIED</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>COPY</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div>
                                  <span className="text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded font-mono uppercase font-bold">
                                    Keyword: {post.keyword || 'SEO Title'}
                                  </span>
                                  <h5 className="text-sm font-semibold text-slate-100 mt-2 pr-12 leading-snug">
                                    {post.title || 'Untitled Pillar Article'}
                                  </h5>
                                </div>

                                <div className="pl-3 border-l-2 border-emerald-800/60 py-1 space-y-1.5 text-[11px] text-slate-300 font-light">
                                  {(post.outline || []).map((outlinePt: string, ptIdx: number) => (
                                    <p key={ptIdx}>👉 {outlinePt}</p>
                                  ))}
                                </div>
                                <div className="text-[10px] bg-slate-900 px-3 py-2 rounded-lg border border-slate-800/80 text-emerald-200 mt-1 flex items-center justify-between">
                                  <span><strong className="text-amber-400">CTA:</strong> {post.cta}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pillar Outline block */}
                        {generationOutput.pillarOutline && (
                          <div className="bg-slate-850 hover:border-slate-750 transition-all border border-slate-800/80 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <span className="text-xs uppercase font-mono font-bold text-amber-400 flex items-center gap-1.5">
                                <Layers className="w-4 h-4 text-emerald-400" />
                                SEO Pillar Article Outline
                              </span>
                              <button
                                onClick={() => handleCopy(JSON.stringify(generationOutput.pillarOutline, null, 2), 'pillar')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 select-none cursor-pointer"
                              >
                                {copiedText === 'pillar' ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 text-[10px]">COPIED JSON</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>COPY ALL</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="space-y-4 text-xs">
                              <div>
                                <h5 className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Recommended H1 Heading</h5>
                                <p className="text-sm text-slate-100 font-bold leading-snug">{generationOutput.pillarOutline.h1}</p>
                              </div>

                              <div className="space-y-3">
                                <h5 className="text-slate-400 text-[10px] uppercase tracking-wider mb-2 font-semibold">Sub-sections structure (H2)</h5>
                                {(generationOutput.pillarOutline.h2s || []).map((h2: any, h2Idx: number) => (
                                  <div key={h2Idx} className="bg-slate-900 border border-slate-850 p-3 rounded-lg space-y-1.5">
                                    <h6 className="text-slate-200 font-bold">H2: {h2.heading}</h6>
                                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pl-1">
                                      {(h2.bullets || []).map((b: string, bIdx: number) => (
                                        <li key={bIdx}>{b}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SOCIAL SCRIPTS VIEW */}
                    {selectedTool === 'social' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* 2 TikTok/Reels Scripts */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-rose-500" />
                            TikTok & Reels Short-Form Video scripts
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(generationOutput.reels || []).map((reel: any, rIdx: number) => (
                              <div key={rIdx} className="bg-slate-850 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 relative">
                                <div className="absolute right-3 top-3">
                                  <button
                                    onClick={() => handleCopy(`Hook: ${reel.hook}\nBody: ${reel.body}\nCTA: ${reel.cta}\nVisual: ${reel.visualCue}`, `reel-${rIdx}`)}
                                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700/80 cursor-pointer"
                                  >
                                    {copiedText === `reel-${rIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedText === `reel-${rIdx}` ? 'COPIED' : 'COPY'}</span>
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <span className="text-[9px] bg-rose-950 text-rose-300 font-mono px-2 py-0.5 rounded font-semibold">
                                    REEL SCENARIO #{rIdx + 1}
                                  </span>
                                  <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg text-[10px] text-slate-400">
                                    🎬 <strong className="text-slate-300 font-mono font-medium">Visual setup:</strong> {reel.visualCue}
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs text-slate-200">
                                  <p className="bg-emerald-950/40 border-l-2 border-amber-400 p-2 rounded">
                                    🎙️ <strong className="text-amber-300 font-mono">Hook spoken:</strong> "{reel.hook}"
                                  </p>
                                  <p className="bg-slate-900/60 p-2 rounded leading-relaxed">
                                    🎙️ <strong className="text-slate-400 font-mono">Story speech:</strong> {reel.body}
                                  </p>
                                </div>

                                <div className="bg-emerald-900/60 p-2 rounded text-[11px] text-emerald-200 font-medium text-center">
                                  🎯 CTA: "{reel.cta}"
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Instagram Carousel Screen Mockup */}
                        {generationOutput.instagramCarousel && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <span className="text-xs uppercase font-mono font-bold text-amber-400">
                                🤳 Instagram Carousel Captions
                              </span>
                              <div className="flex items-center gap-1">
                                {(generationOutput.instagramCarousel.slides || []).map((slide: any, slideIdx: number) => (
                                  <button
                                    key={slideIdx}
                                    onClick={() => setActiveCarouselSlide(slideIdx)}
                                    className={`w-5 h-5 rounded-md text-[10px] font-mono flex items-center justify-center font-bold border transition-all cursor-pointer ${
                                      activeCarouselSlide === slideIdx 
                                        ? 'bg-amber-400 border-amber-500 text-slate-950' 
                                        : 'bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    {slideIdx + 1}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <AnimatePresence mode="wait">
                              {generationOutput.instagramCarousel.slides?.[activeCarouselSlide] && (
                                <motion.div
                                  key={activeCarouselSlide}
                                  initial={{ opacity: 0, x: 5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: -5, y: 0 }}
                                  className="bg-slate-900 border border-slate-850 rounded-xl p-4 space-y-3 relative"
                                >
                                  <div className="absolute top-3 right-3">
                                    <button
                                      onClick={() => handleCopy(`Slide ${activeCarouselSlide + 1}: ${generationOutput.instagramCarousel.slides[activeCarouselSlide].title}\nVisual: ${generationOutput.instagramCarousel.slides[activeCarouselSlide].visualCue}\nCaption: ${generationOutput.instagramCarousel.slides[activeCarouselSlide].caption}`, 'slide')}
                                      className="p-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-[9px] text-slate-300 font-mono rounded cursor-pointer"
                                    >
                                      {copiedText === 'slide' ? 'COPIED' : 'COPY CELL'}
                                    </button>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] bg-slate-800 text-slate-350 px-2 py-0.5 rounded font-mono font-semibold">
                                      Slide {activeCarouselSlide + 1} of 5
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">Organic Grid Aesthetic</span>
                                  </div>

                                  <div className="border border-dashed border-slate-750 p-6 rounded-lg text-center text-slate-100 font-medium">
                                    {generationOutput.instagramCarousel.slides[activeCarouselSlide].title}
                                    <p className="text-[10px] text-slate-400 mt-2 font-mono font-light uppercase">
                                      🖼️ Mock Image Frame / Visual: "{generationOutput.instagramCarousel.slides[activeCarouselSlide].visualCue}"
                                    </p>
                                  </div>

                                  <div className="text-xs text-slate-320 leading-relaxed bg-slate-850 p-3 rounded-lg border border-slate-800/80">
                                    📝 <strong className="text-amber-300">Caption Body:</strong> "{generationOutput.instagramCarousel.slides[activeCarouselSlide].caption}"
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* LinkedIn card and community question */}
                        {generationOutput.linkedinPosts?.[0] && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                            <div className="absolute right-3 top-3">
                              <button
                                onClick={() => handleCopy(`${generationOutput.linkedinPosts[0].headline}\n\n${generationOutput.linkedinPosts[0].bodyText}`, 'li')}
                                className="p-1 px-2.5 bg-slate-800 text-[9px] text-slate-300 font-mono rounded cursor-pointer"
                              >
                                {copiedText === 'li' ? 'COPIED' : 'COPY'}
                              </button>
                            </div>
                            <span className="text-[9px] bg-cyan-950 text-cyan-300 font-mono px-2 py-0.5 rounded font-semibold uppercase">
                              🏢 B2B LinkedIn Strategy Angle: {generationOutput.linkedinPosts[0].angle}
                            </span>
                            <h5 className="text-xs font-bold text-slate-100 mt-1">{generationOutput.linkedinPosts[0].headline}</h5>
                            <p className="text-[11px] text-slate-350 leading-relaxed font-light whitespace-pre-wrap">{generationOutput.linkedinPosts[0].bodyText}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EMAIL SEQUENCE VIEW */}
                    {selectedTool === 'email' && (
                      <div className="space-y-4 animate-fadeIn">
                        <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400">
                          ✉️ Sequence Funnel Sequence Inbox
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* Left sequence email selectors */}
                          <div className="md:col-span-4 space-y-2">
                            {(generationOutput.sequence || []).map((email: any, eIdx: number) => (
                              <button
                                key={eIdx}
                                onClick={() => setSelectedEmailIndex(eIdx)}
                                className={`w-full p-3 rounded-xl border text-left cursor-pointer active:scale-98 transition-all ${
                                  selectedEmailIndex === eIdx 
                                    ? 'bg-slate-800 border-slate-700 text-slate-100 font-medium' 
                                    : 'bg-slate-900/60 border-slate-850 hover:bg-slate-850/60 text-slate-400'
                                }`}
                              >
                                <div className="text-[9px] font-mono font-bold text-amber-300 uppercase">
                                  Email #{eIdx + 1}
                                </div>
                                <h5 className="text-xs font-semibold truncate mt-1">
                                  {email.stage || `Stage ${eIdx + 1}`}
                                </h5>
                                <p className="text-[9px] text-slate-450 truncate mt-0.5 font-light">
                                  {email.subject}
                                </p>
                              </button>
                            ))}
                          </div>

                          {/* Right mock email body */}
                          <div className="md:col-span-8 bg-slate-850 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between">
                            <AnimatePresence mode="wait">
                              {generationOutput.sequence?.[selectedEmailIndex] && (
                                <motion.div
                                  key={selectedEmailIndex}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="p-5 space-y-4"
                                >
                                  {/* Headers */}
                                  <div className="space-y-2 pb-3 border-b border-slate-800 text-[11px] font-mono text-slate-400 relative">
                                    <div className="absolute top-0 right-0">
                                      <button
                                        onClick={() => handleCopy(`Subject: ${generationOutput.sequence[selectedEmailIndex].subject}\nPreview: ${generationOutput.sequence[selectedEmailIndex].preview}\n\n${generationOutput.sequence[selectedEmailIndex].body}\n\nCTA: ${generationOutput.sequence[selectedEmailIndex].cta}`, 'email-body')}
                                        className="p-1 px-2.5 bg-slate-800 text-[9px] text-slate-350 rounded border border-slate-700 cursor-pointer"
                                      >
                                        {copiedText === 'email-body' ? 'COPIED' : 'COPY'}
                                      </button>
                                    </div>

                                    <p><strong className="text-slate-300">To:</strong> customer_inbox@lead.com</p>
                                    <p><strong className="text-slate-300">Subject:</strong> {generationOutput.sequence[selectedEmailIndex].subject}</p>
                                    <p><strong className="text-slate-300">Preview:</strong> {generationOutput.sequence[selectedEmailIndex].preview}</p>
                                  </div>

                                  {/* Body */}
                                  <div className="bg-slate-900 border border-slate-850/80 p-5 rounded-lg text-xs leading-relaxed text-slate-200 whitespace-pre-line font-light font-sans max-h-[350px] overflow-y-auto">
                                    {generationOutput.sequence[selectedEmailIndex].body}
                                  </div>

                                  {/* Action button mock */}
                                  <div className="bg-emerald-900/40 p-3 rounded-lg border border-emerald-850/60 text-center font-mono text-[10px] text-emerald-100 flex items-center justify-between">
                                    <span>📩 <strong className="text-amber-400">CTA Landing Link:</strong> "{generationOutput.sequence[selectedEmailIndex].cta}"</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAID ADS VIEW */}
                    {selectedTool === 'ads' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Meta variants */}
                        <div className="space-y-4">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Megaphone className="w-4 h-4 text-emerald-400" />
                            Meta Sponsored Ad Variants
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(generationOutput.metaAds || []).map((ad: any, adIdx: number) => (
                              <div key={adIdx} className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3 relative text-[11px]">
                                <div className="absolute right-3 top-3">
                                  <button
                                    onClick={() => handleCopy(`Headline: ${ad.headline}\nText: ${ad.primaryText}\nDescription: ${ad.description}\nCTA: ${ad.cta}`, `meta-${adIdx}`)}
                                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-[9px] text-slate-300 font-mono rounded cursor-pointer"
                                  >
                                    {copiedText === `meta-${adIdx}` ? 'COPIED' : 'COPY'}
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-emerald-750 flex items-center justify-center text-amber-300 font-bold border border-emerald-600 font-mono text-[9px]">
                                    S
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-100">Sovereign Sponsor</h5>
                                    <span className="text-[8px] text-slate-450 uppercase font-mono tracking-wider">Social Ad variant #{adIdx+1}</span>
                                  </div>
                                </div>

                                <div className="text-slate-300 leading-relaxed mt-1 font-light bg-slate-900 p-3 rounded-lg border border-slate-850">
                                  {ad.primaryText}
                                </div>

                                <div className="bg-slate-900 border border-slate-850/85 p-3 rounded-xl flex items-center justify-between gap-2">
                                  <div className="max-w-[70%] truncate">
                                    <span className="text-[10px] text-slate-400 font-mono font-medium block uppercase tracking-wide">Sponsored</span>
                                    <strong className="text-xs text-slate-100 font-bold leading-none">{ad.headline}</strong>
                                    <p className="text-[10px] text-slate-450 truncate mt-0.5">{ad.description}</p>
                                  </div>
                                  <span className="bg-slate-800 hover:bg-slate-755 text-[9px] font-bold py-1.5 px-3 rounded uppercase tracking-wider text-amber-400 border border-slate-700/60 font-mono">
                                    {ad.cta || 'SHOP NOW'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Google search ads */}
                        {generationOutput.googleSearchAds && (
                          <div className="space-y-4">
                            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400">
                              🔍 Google Search Campaign Ad Groups
                            </h4>

                            <div className="grid grid-cols-1 gap-4">
                              {(generationOutput.googleSearchAds || []).map((grp: any, grpIdx: number) => (
                                <div key={grpIdx} className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3 relative text-xs">
                                  <div className="absolute right-3 top-3">
                                    <button
                                      onClick={() => handleCopy(`Group: ${grp.groupName}\nHeadlines:\n- ${grp.headlines?.join('\n- ')}\nDescriptions:\n- ${grp.descriptions?.join('\n- ')}`, `google-${grpIdx}`)}
                                      className="p-1 px-2.5 bg-slate-800 text-[9px] text-slate-300 font-mono rounded cursor-pointer"
                                    >
                                      {copiedText === `google-${grpIdx}` ? 'COPIED' : 'COPY GROUP'}
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] bg-slate-800 text-slate-350 px-2 py-0.5 rounded font-mono uppercase font-bold">
                                      Google Ad Group: {grp.groupName}
                                    </span>
                                  </div>

                                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-1.5 max-w-xl">
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-450">
                                      <span>Ad</span>
                                      <span>·</span>
                                      <span className="text-emerald-400 font-mono hover:underline">https://yourbrand.com/{category.toLowerCase().replace(/\s+/g, '-')}</span>
                                    </div>
                                    <h5 className="text-sm font-semibold text-[#1a0dab] dark:text-[#a0c5e8] leading-tight hover:underline cursor-pointer">
                                      {grp.headlines?.join(' | ') || 'Organic Solution | Custom Botanical Oils'}
                                    </h5>
                                    <p className="text-[11px] text-slate-350 leading-relaxed font-light">
                                      {(grp.descriptions || []).map((desc: string, descIdx: number) => (
                                        <span key={descIdx} className="block mt-0.5">{desc}</span>
                                      ))}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PD DETAILS PAGE VIEW */}
                    {selectedTool === 'pdp' && (
                      <div className="space-y-4 text-xs animate-fadeIn text-slate-300 font-light">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400">
                            🛍️ High-Converting Product Store Design
                          </h4>
                          <button
                            onClick={() => handleCopy(JSON.stringify(generationOutput, null, 2), 'pdp')}
                            className="p-1 px-2.5 bg-slate-800 text-[9px] text-slate-350 font-mono rounded cursor-pointer"
                          >
                            {copiedText === 'pdp' ? 'COPIED JSON' : 'COPY ALL DATA'}
                          </button>
                        </div>

                        <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-4">
                          <div>
                            <span className="text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono px-2 py-0.5 rounded uppercase font-bold">
                              PDP Title
                            </span>
                            <h5 className="text-lg font-bold text-slate-100 mt-1">{generationOutput.productTitle}</h5>
                          </div>

                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                            <span className="text-[9px] text-slate-450 uppercase font-mono font-bold block mb-1">
                              Short Grid View Description (40-60 words max)
                            </span>
                            <p className="text-slate-300 leading-relaxed font-normal italic">"{generationOutput.shortDescription}"</p>
                          </div>

                          <div>
                            <span className="text-[9px] text-slate-450 uppercase font-mono font-bold block mb-1">
                              Long Story-Driven Description & Narrative
                            </span>
                            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{generationOutput.longDescription}</p>
                          </div>

                          {/* Benefits / Specs grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] text-amber-400 uppercase font-mono font-bold block">
                                Key Benefits list
                              </span>
                              <ul className="space-y-1.5 pl-1">
                                {(generationOutput.keyBenefits || []).map((ben: string, bIdx: number) => (
                                  <li key={bIdx} className="flex items-start gap-1.5">
                                    <span className="text-emerald-400 text-[10px] mt-0.5">✔</span>
                                    <span>{ben}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
                              <span className="text-[10px] text-slate-300 uppercase font-mono font-bold block">
                                Specs / Technical Details
                              </span>
                              <ul className="space-y-1.5 pl-1">
                                {(generationOutput.technicalSpecs || []).map((spec: string, sIdx: number) => (
                                  <li key={sIdx} className="flex items-start gap-1.5">
                                    <span className="text-amber-400 text-[10px] mt-0.5">▪</span>
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl">
                            <strong className="text-[9px] text-slate-450 uppercase font-mono font-bold block mb-1">Sizing & Operational Guidelines</strong>
                            <p className="text-[11px] leading-relaxed">{generationOutput.sizeFitGuidance}</p>
                          </div>

                          {/* Who is for / Who is not for */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-850 text-[11px]">
                            <div className="space-y-1">
                              <strong className="text-emerald-400 font-bold block uppercase tracking-wide">Who this is for:</strong>
                              {(generationOutput.whoIsFor || []).map((p: string, i: number) => (
                                <p key={i}>✅ {p}</p>
                              ))}
                            </div>
                            <div className="space-y-1">
                              <strong className="text-rose-450 font-bold block uppercase tracking-wide">Who this is NOT for:</strong>
                              {(generationOutput.whoIsNotFor || []).map((p: string, i: number) => (
                                <p key={i}>❌ {p}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VISUAL PLAYBOOK VIEW */}
                    {selectedTool === 'visual' && (
                      <div className="space-y-5 animate-fadeIn text-xs">
                        {/* Camera Shot List */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-emerald-400" />
                            Studio Photographic Shot List
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {(generationOutput.shotList || []).map((shot: any, sIdx: number) => (
                              <div key={sIdx} className="bg-slate-850 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-slate-300">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded bg-slate-800 font-mono font-bold text-[10px] flex items-center justify-center border border-slate-700">
                                      {shot.shotNumber || sIdx+1}
                                    </span>
                                    <strong className="text-slate-100 font-semibold">{shot.type}</strong>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-light pl-6">Purpose/Target: {shot.purpose}</p>
                                </div>
                                <span className="bg-emerald-950/60 text-emerald-300 font-mono text-[10.5px] px-2.5 py-1 rounded border border-emerald-800/80 font-medium">
                                  Setting: {shot.setting}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Unboxing narrative script */}
                        {generationOutput.unboxingScript && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <span className="text-xs uppercase font-mono font-bold text-amber-400 block mb-1">
                              📽️ YouTube / IG Unboxing Video Script
                            </span>
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-450 font-mono">
                              <span>Narrator: {generationOutput.unboxingScript.narratorPersona}</span>
                              <span className="text-emerald-400">High Trust / Authentic Tone</span>
                            </div>

                            <div className="space-y-3">
                              {(generationOutput.unboxingScript.scenes || []).map((scene: any, sIdx: number) => (
                                <div key={sIdx} className="bg-slate-900 p-3 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <h6 className="text-[9px] uppercase font-mono font-bold text-amber-400">Scene {scene.sceneNumber || sIdx+1} Visuals</h6>
                                    <p className="text-[11px] text-slate-320 leading-relaxed font-light mt-1">{scene.visuals}</p>
                                  </div>
                                  <div className="border-l border-slate-800/80 pl-3 md:border-l-2">
                                    <h6 className="text-[9px] uppercase font-mono font-bold text-emerald-400">Scene Audio Spoken</h6>
                                    <p className="text-[11px] text-slate-100 leading-relaxed font-medium mt-1">"{scene.audio}"</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SOCIAL PROOF & UGC VIEW */}
                    {selectedTool === 'social_proof' && (
                      <div className="space-y-5 animate-fadeIn text-xs">
                        {/* 3 Customer reviews */}
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                            Multi-Persona Customer reviews (Skeptic vs. Tech vs. Enthusiast)
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(generationOutput.reviews || []).map((rev: any, rIdx: number) => (
                              <div key={rIdx} className="bg-slate-850 border border-slate-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <strong className="text-slate-150 block">{rev.customerName}</strong>
                                    <div className="flex items-center gap-0.5 text-amber-400">
                                      {Array.from({ length: rev.ratings || 5 }).map((_, s) => (
                                        <span key={s}>★</span>
                                      ))}
                                    </div>
                                  </div>
                                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono block w-fit">
                                    Persona: {rev.avatarPersona}
                                  </span>
                                  <p className="text-[10.5px] leading-relaxed text-slate-300 font-light font-sans italic">"{rev.reviewBody}"</p>
                                </div>

                                <div className="border-t border-slate-800/80 pt-2 font-mono text-[9px] text-slate-400 leading-snug space-y-1">
                                  <p><strong className="text-rose-450 uppercase">Prior:</strong> {rev.beforeSituation}</p>
                                  <p><strong className="text-emerald-400 uppercase">After:</strong> {rev.afterSituation}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial brick and UGC prompt */}
                        {generationOutput.testimonialBlock && (
                          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                            <div className="absolute top-3 right-3 text-slate-700/40 text-4xl font-serif">“</div>
                            <span className="text-[9px] bg-amber-950 text-amber-300 font-mono px-2 py-0.5 rounded font-bold uppercase block w-fit">
                              Highlight Testimonial (Website Hero Section)
                            </span>
                            <blockquote className="text-sm font-medium text-slate-100 italic leading-relaxed pt-1">
                              "{generationOutput.testimonialBlock.quote}"
                            </blockquote>
                            <div className="pt-2 border-t border-slate-800 text-slate-400 font-medium">
                              {generationOutput.testimonialBlock.author}
                              <span className="text-[11px] block mt-0.5 text-emerald-400 font-mono font-normal">
                                Credentials: {generationOutput.testimonialBlock.credentials || 'Certified Purchaser'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CX HELP & POLICIES VIEW */}
                    {selectedTool === 'support' && (
                      <div className="space-y-4 text-xs animate-fadeIn text-slate-300">
                        {/* FAQs and returns policies toggler */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          <div className="md:col-span-6 space-y-3 bg-slate-850 p-4 rounded-xl border border-slate-800">
                            <strong className="text-[10px] text-amber-400 uppercase font-mono font-bold block mb-1">FAQs & Trust Reassurance lines</strong>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {(generationOutput.faqs || []).map((faq: any, fIdx: number) => (
                                <div key={fIdx} className="bg-slate-900/60 p-2.5 rounded border border-slate-850 space-y-1">
                                  <h6 className="font-semibold text-slate-200">Q: {faq.question}</h6>
                                  <p className="text-[11px] text-slate-400 font-light">A: {faq.answer}</p>
                                </div>
                              ))}
                            </div>
                            <div className="p-2.5 bg-emerald-950/60 border border-emerald-900 rounded-lg text-emerald-300 italic text-[11px] font-mono leading-relaxed mt-1">
                              {generationOutput.trustCopy}
                            </div>
                          </div>

                          {/* Policies and templates */}
                          <div className="md:col-span-6 space-y-3">
                            <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-2">
                              <strong className="text-[10px] text-slate-300 uppercase font-mono font-bold block mb-1">Checked policy microcopy</strong>
                              <div className="text-[11px] leading-relaxed space-y-2">
                                <p><strong className="text-emerald-400">✈ Shipping:</strong> {generationOutput.shippingPolicy}</p>
                                <p><strong className="text-amber-300">↩ Returns & Window:</strong> {generationOutput.returnsPolicy}</p>
                              </div>
                            </div>

                            {/* Helpdesk templates */}
                            {generationOutput.supportTemplates && (
                              <div className="bg-slate-850 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                                <div className="border-b border-slate-800 bg-slate-900 p-2.5 flex items-center justify-between text-[10px] font-mono font-bold">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setActiveSupportTemplate('order')}
                                      className={`px-2 py-0.5 rounded ${activeSupportTemplate === 'order' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                      Where is order?
                                    </button>
                                    <button 
                                      onClick={() => setActiveSupportTemplate('return')}
                                      className={`px-2 py-0.5 rounded ${activeSupportTemplate === 'return' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                      Exchange Request
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleCopy(activeSupportTemplate === 'order' ? generationOutput.supportTemplates.whereIsMyOrder : generationOutput.supportTemplates.returnsAndExchanges, 'support-tpl')}
                                    className="p-1 px-2 bg-slate-800 text-[9px] text-slate-300 rounded cursor-pointer"
                                  >
                                    {copiedText === 'support-tpl' ? 'COPIED' : 'COPY'}
                                  </button>
                                </div>
                                <div className="p-3 bg-slate-900 text-[11px] font-mono leading-relaxed whitespace-pre-wrap truncate">
                                  {activeSupportTemplate === 'order' 
                                    ? generationOutput.supportTemplates.whereIsMyOrder 
                                    : (generationOutput.supportTemplates.returnsAndExchanges || generationOutput.supportTemplates.returnsAndExchanges)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PERFORMANCE METRICS ANALYST STORYTELLER VIEW */}
                    {selectedTool === 'analytics_story' && (
                      <div className="space-y-4 text-xs animate-fadeIn text-slate-300">
                        {generationOutput.dataStory && (
                          <div className="space-y-3">
                            <span className="text-[10px] bg-amber-950 text-amber-300 font-mono px-2 py-0.5 rounded font-bold uppercase block w-fit">
                              📊 CRM PERFORMANCE DATA STORY
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-emerald-950/20 border-l-2 border-emerald-500/80 p-3.5 rounded-xl space-y-1.5">
                                <h6 className="font-bold text-emerald-400 font-mono text-[10px] uppercase">🚀 High performer Win</h6>
                                <p className="text-[11px] leading-relaxed font-light">{generationOutput.dataStory.whatsWorking}</p>
                              </div>

                              <div className="bg-amber-950/20 border-l-2 border-amber-500/80 p-3.5 rounded-xl space-y-1.5">
                                <h6 className="font-bold text-amber-400 font-mono text-[10px] uppercase">📉 Pipeline Bottleneck</h6>
                                <p className="text-[11px] leading-relaxed font-light">{generationOutput.dataStory.underperforming}</p>
                              </div>

                              <div className="bg-rose-950/20 border-l-2 border-rose-500/85 p-3.5 rounded-xl space-y-1.5">
                                <h6 className="font-bold text-rose-450 font-mono text-[10px] uppercase">🚨 Funnel Leaks point</h6>
                                <p className="text-[11px] leading-relaxed font-light">{generationOutput.dataStory.leakPoints}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Recommend dynamic A/B test experiments */}
                        {generationOutput.experiments && (
                          <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl space-y-3">
                            <h5 className="font-bold text-slate-100 text-sm">Recommended Conversion Experiments (A/B Hypotheses)</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl space-y-1 text-[11px]">
                                <strong className="text-slate-400 font-mono">1. Paid Ads Test:</strong>
                                <p className="leading-relaxed font-light">{generationOutput.experiments.adsTest}</p>
                              </div>
                              <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl space-y-1 text-[11px]">
                                <strong className="text-slate-400 font-mono">2. Nurtures Test:</strong>
                                <p className="leading-relaxed font-light">{generationOutput.experiments.emailsTest}</p>
                              </div>
                              <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl space-y-1 text-[11px]">
                                <strong className="text-slate-400 font-mono">3. Storefront PDP Test:</strong>
                                <p className="leading-relaxed font-light">{generationOutput.experiments.pdpTest}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* strategic insights */}
                        {generationOutput.strategicInsights && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11.5px] leading-relaxed">
                            <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-1.5">
                              <span className="text-[9px] uppercase font-mono font-bold text-emerald-400">💡 Layout Storefront Optimizations</span>
                              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-350">
                                {(generationOutput.strategicInsights.storefrontOptimizations || []).map((ins: string, idx: number) => (
                                  <li key={idx}>{ins}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-slate-850 border border-slate-800 p-4 rounded-xl space-y-1.5">
                              <span className="text-[9px] uppercase font-mono font-bold text-amber-300">🎯 Demographic Messaging Refinements</span>
                              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-350">
                                {(generationOutput.strategicInsights.messagingRefinements || []).map((ins: string, idx: number) => (
                                  <li key={idx}>{ins}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC ORCHESTRATOR ROADMAP VIEW */}
                    {selectedTool === 'orchestrator' && (
                      <div className="space-y-4 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-emerald-400" />
                            Multi-Agent Campaign Orchestration Planner
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">JSON Engine: plan array formatted</span>
                        </div>

                        {/* Plan Timeline render */}
                        <div className="space-y-4">
                          {(generationOutput.plan || []).map((step: any, idx: number) => (
                            <div key={idx} className="relative pl-8 border-l border-slate-800 last:border-0 py-1">
                              {/* Step circle */}
                              <div className="absolute left-[-11px] top-1 w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 hover:border-emerald-500 flex items-center justify-center font-mono font-bold text-[10px] select-none transition-all">
                                {step.step || idx + 1}
                              </div>

                              <div className="bg-slate-850 hover:border-slate-750 transition-all border border-slate-800 rounded-xl p-4 space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                  <h5 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                                    {step.phase}
                                  </h5>
                                  <span className="text-[10px] w-fit font-mono bg-emerald-900/60 border border-emerald-850/80 rounded px-2 py-0.5 text-emerald-300 uppercase font-semibold">
                                    Agent Tool: {step.tool}
                                  </span>
                                </div>

                                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-slate-350 italic font-mono text-[10.5px] leading-relaxed">
                                  <span className="text-[9.5px] uppercase font-bold text-slate-500 block mb-0.5 font-mono">Suggested AI Prompt Trigger:</span>
                                  "{step.prompt}"
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC COMMUNICATION AI VIEW */}
                    {selectedTool === 'communication' && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            Multi-Channel Communication AI Script Set
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Live Call, Chatbot, SMS & Webinars</span>
                        </div>

                        {generationOutput.voiceScript && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-emerald-400" />
                                Outbound Voice AI agent call script
                              </span>
                              <button
                                onClick={() => handleCopy(`OUTBOUND VOICE CALL SCRIPT\n\nIntro: ${generationOutput.voiceScript.intro}\nPitch: ${generationOutput.voiceScript.pitch}\nCTA: ${generationOutput.voiceScript.cta}`, 'voice_script')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 cursor-pointer select-none"
                              >
                                {copiedText === 'voice_script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'voice_script' ? 'COPIED' : 'COPY'}</span>
                              </button>
                            </div>
                            <div className="space-y-3 font-sans text-slate-350">
                              <p className="p-3 bg-slate-900 border border-slate-850 rounded-lg"><strong className="text-emerald-400 text-[10px] uppercase font-mono block">Greeting / Opening Hook:</strong> "{generationOutput.voiceScript.intro}"</p>
                              <p className="p-3 bg-slate-900 border border-slate-850 rounded-lg"><strong className="text-emerald-400 text-[10px] uppercase font-mono block">Core pitch:</strong> "{generationOutput.voiceScript.pitch}"</p>
                              <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg space-y-1.5">
                                <strong className="text-amber-400 text-[10px] uppercase font-mono block">Objection Handlers:</strong>
                                {(generationOutput.voiceScript.objections || []).map((obj: string, idx: number) => (
                                  <p key={idx} className="text-slate-300 pl-2 border-l-2 border-emerald-800">✓ {obj}</p>
                                ))}
                              </div>
                              <p className="p-3 bg-slate-900 border border-slate-850 rounded-lg"><strong className="text-emerald-400 text-[10px] uppercase font-mono block">Target Call To Action:</strong> "{generationOutput.voiceScript.cta}"</p>
                            </div>
                          </div>
                        )}

                        {generationOutput.chatFlow && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-400" />
                                Live Conversational Widget Chat Flow
                              </span>
                              <button
                                onClick={() => handleCopy(JSON.stringify(generationOutput.chatFlow, null, 2), 'chat_flow')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 cursor-pointer select-none"
                              >
                                {copiedText === 'chat_flow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'chat_flow' ? 'COPIED FLOW' : 'COPY'}</span>
                              </button>
                            </div>
                            <div className="space-y-3 font-sans">
                              <div className="flex justify-start">
                                <div className="bg-emerald-950 border border-emerald-800/60 p-3 rounded-2xl rounded-tl-none max-w-md text-emerald-200">
                                  <span className="text-[10px] font-mono block font-bold text-emerald-400 mb-1">Bot Welcome Message:</span>
                                  {generationOutput.chatFlow.welcomeMessage}
                                </div>
                              </div>
                              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
                                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Interactive Qualifying Steps:</span>
                                {(generationOutput.chatFlow.qualifyingQuestions || []).map((q: string, idx: number) => (
                                  <p key={idx} className="text-slate-300 font-mono text-[11px] leading-relaxed pl-3 border-l-2 border-amber-500">❓ Step {idx + 1}: "{q}"</p>
                                ))}
                              </div>
                              <div className="flex justify-start">
                                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl rounded-tl-none max-w-md text-slate-350">
                                  <span className="text-[10px] font-mono block font-bold text-slate-400 mb-1">Backup/Agent Handshake Message:</span>
                                  {generationOutput.chatFlow.fallbackMessage}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generationOutput.smsDM && (
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3">
                              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest">📱 SMS & Instant Messenger templates</span>
                              <div className="space-y-3 text-[11px] text-slate-350">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850 relative">
                                  <span className="text-[9px] uppercase font-mono font-bold text-amber-400 block mb-1">Target Promo message</span>
                                  <p className="font-mono">"{generationOutput.smsDM.smsPromo}"</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850">
                                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block mb-1">Automated session alert</span>
                                  <p className="font-mono">"{generationOutput.smsDM.smsReminder}"</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850">
                                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block mb-1">Direct message (DMs) response template</span>
                                  <p className="leading-relaxed">"{generationOutput.smsDM.dmTemplate}"</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {generationOutput.missedCallTextBack && (
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest">📴 Missed-Call Auto Text-Back</span>
                                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                                  Instantly triggered upon missed inbound line. Increases business retention by responding automatically.
                                </p>
                                <div className="p-4 bg-emerald-950/60 border border-emerald-900/60 rounded-xl mt-3 text-emerald-200">
                                  <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 block mb-1 font-mono">Auto Message Text:</span>
                                  "{generationOutput.missedCallTextBack.smsText}"
                                </div>
                              </div>
                              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 text-slate-400 text-[10px] font-mono mt-2">
                                <strong className="text-slate-300">Default latency:</strong> {generationOutput.missedCallTextBack.followupDelay}
                              </div>
                            </div>
                          )}
                        </div>

                        {generationOutput.webinarFunnel && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                High-Ticket Webinar Funnel Content
                              </span>
                              <button
                                onClick={() => handleCopy(`WEBINAR FUNNEL\nHeadline: ${generationOutput.webinarFunnel.registrationHeadline}\nAgenda:\n${generationOutput.webinarFunnel.agendaPoints?.join('\n')}\nEmail Replay: ${generationOutput.webinarFunnel.postWebinarEmail}`, 'webinar_funnel')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 cursor-pointer select-none"
                              >
                                {copiedText === 'webinar_funnel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'webinar_funnel' ? 'COPIED' : 'COPY'}</span>
                              </button>
                            </div>
                            <div className="space-y-3 font-sans text-slate-350">
                              <div>
                                <h5 className="text-[10px] uppercase font-mono font-bold text-amber-400 mb-1">Registration Landing Page Title</h5>
                                <p className="text-sm font-bold text-slate-200 leading-snug">{generationOutput.webinarFunnel.registrationHeadline}</p>
                              </div>
                              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Webinar Training Agenda Points:</span>
                                {(generationOutput.webinarFunnel.agendaPoints || []).map((pt: string, idx: number) => (
                                  <p key={idx} className="text-[11.5px] leading-relaxed">🎬 {pt}</p>
                                ))}
                              </div>
                              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Followup Replay Email Template:</span>
                                <pre className="whitespace-pre-line font-light leading-relaxed text-[11px] text-slate-300">{generationOutput.webinarFunnel.postWebinarEmail}</pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC SALES ENABLEMENT VIEW */}
                    {selectedTool === 'sales_enablement' && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Send className="w-4 h-4 text-emerald-400" />
                            Premium Sales Enablement & Followup kit
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">B2B prospecting, QR logic, Biz cards</span>
                        </div>

                        {generationOutput.prospectingOutreach && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-400" />
                                Outbound High-Ticket Prospecting Email
                              </span>
                              <button
                                onClick={() => handleCopy(`Subject: ${generationOutput.prospectingOutreach.subject}\n\n${generationOutput.prospectingOutreach.intro}\n\n${generationOutput.prospectingOutreach.valueProposition}\n\n${generationOutput.prospectingOutreach.cta}`, 'prospecting_email')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 cursor-pointer select-none"
                              >
                                {copiedText === 'prospecting_email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'prospecting_email' ? 'COPIED' : 'COPY EMAIL'}</span>
                              </button>
                            </div>
                            <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-3 font-sans text-slate-300">
                              <p className="font-semibold text-slate-200 text-sm">Subject: {generationOutput.prospectingOutreach.subject}</p>
                              <div className="border-t border-slate-800/80 pt-3 space-y-2.5 font-light leading-relaxed">
                                <p className="whitespace-pre-line">{generationOutput.prospectingOutreach.intro}</p>
                                <p className="whitespace-pre-line p-3 bg-emerald-950/40 border border-emerald-900/40 rounded text-emerald-200 mt-2 font-mono text-[11px]">{generationOutput.prospectingOutreach.valueProposition}</p>
                                <p className="font-bold text-amber-300 pt-2"><span className="text-slate-450 text-[10px] uppercase font-mono block">Call To Action (CTA):</span> {generationOutput.prospectingOutreach.cta}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generationOutput.qrCodeFlow && (
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest">🔲 Offline QR Code Engagement Canvas</span>
                              <div className="space-y-3 font-sans text-slate-350">
                                <div>
                                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block mb-0.5">Physical card header</span>
                                  <h6 className="font-bold text-slate-100 text-sm leading-tight">{generationOutput.qrCodeFlow.welcomeHeader}</h6>
                                </div>
                                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-emerald-200">
                                  <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 block mb-0.5">Loyalty activation offer</span>
                                  <p className="font-semibold leading-relaxed font-mono">"{generationOutput.qrCodeFlow.incentiveOffer}"</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-850 leading-relaxed text-[11px]">
                                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block mb-0.5 font-mono">Client instructions</span>
                                  {generationOutput.qrCodeFlow.redemptionInstructions}
                                </div>
                              </div>
                            </div>
                          )}

                          {generationOutput.bizCardFollowUp && (
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest">📇 Business Card Scanner Follow-Up</span>
                                <div className="space-y-3 mt-3 font-sans text-slate-350">
                                  <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
                                    <h6 className="font-semibold text-slate-250 text-xs">Subject: {generationOutput.bizCardFollowUp.subject}</h6>
                                    <p className="whitespace-pre-line text-[11px] leading-relaxed font-light">{generationOutput.bizCardFollowUp.body}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-amber-300 text-[10.5px] font-semibold mt-3 text-center border-dashed">
                                🔗 CTA Link: "{generationOutput.bizCardFollowUp.calendarCta}"
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC REPUTATION & CX VIEW */}
                    {selectedTool === 'reputation_cx' && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Customer Experience, Trust & Reputation kit
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Review retention and recovery systems</span>
                        </div>

                        {generationOutput.reviewRequest && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <Star className="w-4 h-4 text-emerald-400" />
                                Automated Trust & Star Review Request outreach
                              </span>
                              <button
                                onClick={() => handleCopy(`Subject: ${generationOutput.reviewRequest.subject}\n\n${generationOutput.reviewRequest.body}\n\nIncentive: ${generationOutput.reviewRequest.incentive}`, 'review_request')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-700 cursor-pointer select-none"
                              >
                                {copiedText === 'review_request' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'review_request' ? 'COPIED' : 'COPY'}</span>
                              </button>
                            </div>
                            <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 space-y-2.5 font-sans text-slate-300">
                              <h5 className="font-semibold text-slate-200">Subject: {generationOutput.reviewRequest.subject}</h5>
                              <p className="whitespace-pre-line text-[11px] leading-relaxed font-light">{generationOutput.reviewRequest.body}</p>
                              <div className="bg-emerald-950/40 border border-emerald-900/40 p-3 rounded text-emerald-200 font-mono text-[10px] mt-2">
                                <strong className="text-amber-400 uppercase tracking-widest text-[9px] block mb-0.5 font-mono">Review Incentive:</strong>
                                {generationOutput.reviewRequest.incentive}
                              </div>
                            </div>
                          </div>
                        )}

                        {generationOutput.reputationReplies && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest flex items-center gap-1">❇️ Positive Star Reply (4-5★)</span>
                              <p className="text-[11px] text-slate-400">Auto-respond securely and build SEO value.</p>
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-300 italic text-[11px] leading-relaxed">
                                "{generationOutput.reputationReplies.positiveReviewReply}"
                              </div>
                            </div>

                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <span className="text-[10px] font-mono uppercase font-bold text-red-400 block tracking-widest flex items-center gap-1">🛑 Negative Star Recovery (1-2★)</span>
                              <p className="text-[11px] text-slate-400">Empathetic, brand-safe turnaround responder.</p>
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-300 italic text-[11px] leading-relaxed">
                                "{generationOutput.reputationReplies.negativeReviewReply}"
                              </div>
                            </div>
                          </div>
                        )}

                        {generationOutput.documentSigning && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                Secure Document / NDA Agreement guidelines
                              </span>
                            </div>
                            <div className="space-y-3 font-sans text-slate-350">
                              <p className="text-slate-200">{generationOutput.documentSigning.instructions}</p>
                              <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
                                {(generationOutput.documentSigning.stepByStep || []).map((step: string, idx: number) => (
                                  <p key={idx} className="text-slate-300 text-[11.5px] font-light leading-relaxed">📝 Step {idx + 1}: {step}</p>
                                ))}
                              </div>
                              <div className="pt-2 text-center">
                                <button className="cursor-pointer font-bold font-mono text-[10px] text-amber-300 border border-amber-500/40 rounded-xl px-4 py-2 hover:bg-amber-500/10 transition-all select-none uppercase">
                                  ⚡ {generationOutput.documentSigning.contractCta}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC OPERATIONS VIEW */}
                    {selectedTool === 'operations' && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            Operational automation CRM trigger sequences
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Calenders reminders and status triggers</span>
                        </div>

                        {generationOutput.bookingFlow && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest">✅ Active Booking Confirmation Flow</span>
                            <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-200 text-sm font-semibold font-sans">
                              {generationOutput.bookingFlow.confirmationMessage}
                            </div>
                            <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-450 leading-relaxed">
                              <strong className="text-slate-300 text-[10px] font-mono uppercase block mb-0.5">Rescheduling policy statement:</strong>
                              "{generationOutput.bookingFlow.reschedulePolicy}"
                            </div>
                          </div>
                        )}

                        {generationOutput.calendarReminders && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest">🔔 24-Hour Reminder Alert (SMS)</span>
                              <p className="text-[11px] text-slate-400">Triggered 24 hours prior to appointment.</p>
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-350 font-mono leading-relaxed">
                                "{generationOutput.calendarReminders.twentyFourHourSms}"
                              </div>
                            </div>

                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest">⚡ 1-Hour Session Nudge (SMS)</span>
                              <p className="text-[11px] text-slate-400 font-mono">Failsafe attendee retention text with meeting URL.</p>
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-350 font-mono leading-relaxed">
                                "{generationOutput.calendarReminders.oneHourSms}"
                              </div>
                            </div>
                          </div>
                        )}

                        {generationOutput.pipelineStageMessaging && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <span className="text-xs font-semibold text-slate-100 block">⚡ Pipeline progression automated trigger notifications</span>
                            <div className="space-y-3">
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl">
                                <span className="text-[9px] uppercase font-mono font-bold text-amber-400 block mb-1">Lead ➔ Qualified trigger text</span>
                                <p className="text-slate-300 italic">"{generationOutput.pipelineStageMessaging.leadToQualified}"</p>
                              </div>
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl">
                                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block mb-1">Qualified ➔ Proposal dispatch</span>
                                <p className="text-slate-300 italic">"{generationOutput.pipelineStageMessaging.qualifiedToProposal}"</p>
                              </div>
                              <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-xl">
                                <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 block mb-1">Proposal ➔ Agreement Finalized (Closed-Won)</span>
                                <p className="text-slate-300 italic font-medium">"{generationOutput.pipelineStageMessaging.proposalToClosed}"</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC 30-DAY CONTENT CALENDAR VIEW */}
                    {selectedTool === 'social_calendar' && generationOutput && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            Premium Social Media Content Calendar Sprint
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Bespoke daily post blueprints</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(generationOutput.calendar || []).map((dayData: any, idx: number) => (
                            <div key={idx} className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-700 transition">
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="bg-emerald-900 border border-emerald-700 text-emerald-350 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Day {dayData.day}
                                  </span>
                                  <span className="text-[10px] text-amber-300 font-mono tracking-widest uppercase">
                                    {dayData.platform}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-slate-450 block mb-0.5 font-mono">Post Strategy Block</span>
                                  <h5 className="font-bold text-slate-100 text-sm leading-tight">{dayData.postIdea}</h5>
                                </div>
                                <div className="p-3 bg-slate-900 border border-slate-855 rounded-lg text-slate-300 italic text-[11px] leading-relaxed font-light">
                                  "{dayData.caption}"
                                </div>
                                <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded text-emerald-300 font-sans text-[10px]">
                                  <span className="text-[8px] uppercase font-mono text-slate-450 block mb-0.5">Call to Action (CTA)</span>
                                  {dayData.cta}
                                </div>
                              </div>
                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {(dayData.hashtags || []).map((ht: string, hIdx: number) => (
                                    <span key={hIdx} className="text-[9px] font-mono text-slate-450">#{ht}</span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => handleCopy(`Platform: ${dayData.platform}\nPost Idea: ${dayData.postIdea}\nCaption: ${dayData.caption}\nCTA: ${dayData.cta}\nHashtags: ${dayData.hashtags.map((h: string) => '#' + h).join(' ')}`, `day-${dayData.day}`)}
                                  className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-700 cursor-pointer select-none"
                                >
                                  {copiedText === `day-${dayData.day}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedText === `day-${dayData.day}` ? 'COPIED' : 'COPY'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC OUTREACH SCRIPTS VIEW */}
                    {selectedTool === 'outreach_scripts' && generationOutput && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Send className="w-4 h-4 text-emerald-400" />
                            Premium Outbound Prospecting Outreach Pack
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Authority hooks and resistance bypass</span>
                        </div>

                        {/* Outreach Variations */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {(generationOutput.variations || []).map((v: any, vIdx: number) => (
                            <div key={vIdx} className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono color-emerald-400 uppercase font-bold text-emerald-400 tracking-wider">
                                    {v.title}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(`Subject: ${v.subject}\n\n${v.body}`, `v-${vIdx}`)}
                                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-700 cursor-pointer select-none"
                                  >
                                    {copiedText === `v-${vIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedText === `v-${vIdx}` ? 'COPIED' : 'COPY'}</span>
                                  </button>
                                </div>
                                {v.subject && (
                                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded font-semibold text-slate-200">
                                    Subject: {v.subject}
                                  </div>
                                )}
                                <p className="text-slate-300 font-light leading-relaxed whitespace-pre-line text-[11px] p-1">
                                  {v.body}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Follow up & Bump sequence */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {generationOutput.followup && (
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest">❇️ Sequence Step 2: 24h-48h Reminder Follow-up</span>
                                <button
                                  onClick={() => handleCopy(`Subject: ${generationOutput.followup.subject}\n\n${generationOutput.followup.body}`, 'outreach-followup')}
                                  className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-700 cursor-pointer select-none"
                                >
                                  {copiedText === 'outreach-followup' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedText === 'outreach-followup' ? 'COPIED' : 'COPY'}</span>
                                </button>
                              </div>
                              {generationOutput.followup.subject && (
                                <div className="p-2.5 bg-slate-900 border border-slate-850 rounded font-semibold text-[11px] text-slate-200">
                                  Subject: {generationOutput.followup.subject}
                                </div>
                              )}
                              <p className="text-slate-300 whitespace-pre-line font-light leading-relaxed text-[11px] p-1 bg-slate-900/60 p-3.5 rounded-xl border border-slate-855">
                                {generationOutput.followup.body}
                              </p>
                            </div>
                          )}

                          {generationOutput.bump && (
                            <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                                <span className="text-[10px] font-mono uppercase font-bold text-red-400 block tracking-widest">🛑 Final Step: High-friction Friction-free Bump Nudge</span>
                                <button
                                  onClick={() => handleCopy(`Subject: ${generationOutput.bump.subject}\n\n${generationOutput.bump.body}`, 'outreach-bump')}
                                  className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-700 cursor-pointer select-none"
                                >
                                  {copiedText === 'outreach-bump' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedText === 'outreach-bump' ? 'COPIED' : 'COPY'}</span>
                                </button>
                              </div>
                              {generationOutput.bump.subject && (
                                <div className="p-2.5 bg-slate-900 border border-slate-850 rounded font-semibold text-[11px] text-slate-200">
                                  Subject: {generationOutput.bump.subject}
                                </div>
                              )}
                              <p className="text-slate-300 whitespace-pre-line font-light leading-relaxed text-[11px] p-1 bg-slate-900/60 p-3.5 rounded-xl border border-slate-855">
                                {generationOutput.bump.body}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC NURTURE SEQUENCE VIEW */}
                    {selectedTool === 'nurture_sequence' && generationOutput && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-emerald-400" />
                            Premium 5-Message Automated Nurture Flow
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">3 Conversions emails & 2 direct SMS deadline nudges</span>
                        </div>

                        {/* Interactive Timeline-style Nurture Steps */}
                        <div className="space-y-5">
                          {/* Nurture Emails */}
                          {(generationOutput.emails || []).map((email: any, idx: number) => (
                            <div key={idx} className="bg-slate-850 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row md:items-start gap-4">
                              <div className="shrink-0 md:w-36 text-center md:text-left">
                                <span className="bg-emerald-950 border border-emerald-850 text-emerald-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider block text-center shadow-inner">
                                  Drip Message {idx * 2 + 1}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-450 block text-center mt-2 font-mono uppercase">Email Client</span>
                              </div>
                              <div className="flex-1 space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-855">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                                  <h6 className="font-bold text-slate-100 font-sans">{email.step}</h6>
                                  <button
                                    onClick={() => handleCopy(`Subject: ${email.subject}\n\n${email.body}`, `nurture-email-${idx}`)}
                                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-700 cursor-pointer select-none"
                                  >
                                    {copiedText === `nurture-email-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedText === `nurture-email-${idx}` ? 'COPIED' : 'COPY'}</span>
                                  </button>
                                </div>
                                <p className="font-semibold text-xs text-slate-200">Subject: {email.subject}</p>
                                <p className="text-slate-300 font-light leading-relaxed whitespace-pre-line text-[11px]">
                                  {email.body}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Nurture SMS Messages */}
                          {(generationOutput.smsMessages || []).map((sms: any, idx: number) => (
                            <div key={idx} className="bg-slate-850 border border-amber-900/20 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row md:items-start gap-4">
                              <div className="shrink-0 md:w-36 text-center md:text-left">
                                <span className="bg-amber-950 border border-amber-900/60 text-amber-400 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider block text-center shadow-inner">
                                  Drip Message {idx * 2 + 2}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-450 block text-center mt-2 font-mono uppercase">SMS Channel</span>
                              </div>
                              <div className="flex-1 space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-855">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                                  <h6 className="font-mono text-[10.5px] font-bold text-amber-400 tracking-wider flex items-center gap-1">📲 {sms.timing}</h6>
                                  <button
                                    onClick={() => handleCopy(sms.text, `nurture-sms-${idx}`)}
                                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-700 cursor-pointer select-none"
                                  >
                                    {copiedText === `nurture-sms-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedText === `nurture-sms-${idx}` ? 'COPIED' : 'COPY'}</span>
                                  </button>
                                </div>
                                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 italic text-slate-300 font-mono text-[11px] leading-relaxed">
                                  "{sms.text}"
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC MOBILE SETUP ONBOARDING VIEW */}
                    {selectedTool === 'onboarding_content' && generationOutput && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            Premium Private Client Portal Mobile Onboarding
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Push alerts, checklist steps & CTAs</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Left Mock App Device Screen */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                            <div className="space-y-4">
                              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-emerald-400 block">📱 Mock Mobile Device Simulator</span>
                              
                              {/* Inside App Frame */}
                              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4 font-sans text-slate-300">
                                <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl">
                                  <span className="text-[8px] font-mono uppercase bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-350 block w-max mb-1">In-App Greeting Card</span>
                                  <p className="text-[11.5px] leading-relaxed font-light whitespace-pre-line text-slate-205">
                                    {generationOutput.welcomeMessage}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">🚀 First Steps Checklist</span>
                                  <div className="space-y-2">
                                    {(generationOutput.checklist || []).map((step: string, sIdx: number) => (
                                      <div key={sIdx} className="flex items-start gap-2 text-[10.5px]">
                                        <div className="w-4 h-4 rounded-full border border-emerald-700/60 flex items-center justify-center font-mono text-[9px] text-emerald-400 font-extrabold shrink-0 mt-0.5 bg-emerald-955/30">
                                          ✓
                                        </div>
                                        <p className="font-light text-slate-300">{step}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <button className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-mono font-bold text-[10.5px] rounded-xl shadow border border-emerald-450 hover:border-emerald-300 transition uppercase select-none tracking-widest block text-center">
                                  {generationOutput.cta}
                                </button>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-slate-800/80 mt-4 flex justify-end">
                              <button
                                onClick={() => handleCopy(`Welcome: ${generationOutput.welcomeMessage}\nSetup Checklist:\n${(generationOutput.checklist || []).map((c: string, i: number) => `${i+1}. ${c}`).join('\n')}\nCTA: ${generationOutput.cta}`, 'onboarding-copy-full')}
                                className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-705 cursor-pointer"
                              >
                                {copiedText === 'onboarding-copy-full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedText === 'onboarding-copy-full' ? 'COPIED FULL MOCK' : 'COPY ONBOARDING PLOT'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Feature Overviews */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-amber-400 block">📚 App Key Feature Walks Overview</span>
                            <div className="space-y-3.5">
                              {(generationOutput.featureOverview || []).map((feat: any, idx: number) => (
                                <div key={idx} className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-1.5 hover:border-slate-800 transition">
                                  <h6 className="font-semibold text-slate-100 text-[11.5px] flex items-center justify-between font-sans">
                                    <span>{feat.title}</span>
                                    <span className="text-[8px] font-mono text-slate-500 uppercase">Interactive Walk {idx + 1}</span>
                                  </h6>
                                  <p className="text-[10.5px] text-slate-350 font-light leading-relaxed font-sans">{feat.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC COMMUNITY SPRINTS BLUEPRINT VIEW */}
                    {selectedTool === 'community_execution' && generationOutput && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-emerald-400" />
                            Premium Community Sprints & Group Execution Framework
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Weekly sprints, P2P prompts & tracking metrics</span>
                        </div>

                        {/* Top Highlights row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Sprints schedule */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest font-mono">📅 30-Day Monthly Sprint Blueprint</span>
                            <p className="text-[11.5px] font-light leading-relaxed text-slate-300 whitespace-pre-line font-sans">
                              {generationOutput.monthlySprintPlan}
                            </p>
                          </div>

                          {/* Accountability systems */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest font-mono">🤝 Peer accountability coordination</span>
                            <p className="text-[11.5px] font-light leading-relaxed text-slate-300 font-sans">
                              {generationOutput.accountabilityLoops}
                            </p>
                          </div>
                        </div>

                        {/* Weekly Challenges */}
                        <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-4">
                          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest">🏆 Step-by-Step Weekly Challenges Series</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(generationOutput.weeklyChallenges || []).map((challenge: string, cIdx: number) => (
                              <div key={cIdx} className="p-4 bg-slate-900 border border-slate-855 rounded-xl space-y-2 hover:border-slate-800 transition">
                                <span className="text-[8px] font-mono text-emerald-400 font-bold block uppercase">Weekly Mission {cIdx + 1}</span>
                                <p className="text-slate-300 text-[11px] leading-relaxed font-light font-sans">{challenge}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Conversation Starters & Tracking */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Peer prompts */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest">💬 Peer-to-Peer Engagement Prompts</span>
                            <div className="space-y-2.5">
                              {(generationOutput.peerPrompts || []).map((prompt: string, idx: number) => (
                                <div key={idx} className="p-3 bg-slate-900 border border-slate-850 rounded-lg text-[11px] font-light text-slate-300 leading-relaxed font-sans italic border-l-4 border-l-amber-500">
                                  {prompt}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* success indicators */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block tracking-widest">📊 Core Success Verification Metrics</span>
                            <p className="text-[11px] font-light text-slate-350 leading-relaxed font-sans mb-2">
                              {generationOutput.successTrackingSystem}
                            </p>
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-450 text-center uppercase tracking-wide">
                              🏆 COMMUNITY EXECUTION BLUEPRINT REGISTERED
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC CALL DISPATCH TRACKER VIEW */}
                    {selectedTool === 'call_tracking' && generationOutput && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5 font-mono">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            Call Follow-up Sequencer: Status "{callType === 'missed' ? 'MISSED CALL' : 'COMPLETED CALL'}"
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">SMS nudge, emails & spoken voiceover</span>
                        </div>

                        {/* Top Row: SMS Nudge & Spoken Voicemail */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* SMS dispatch */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-widest flex items-center gap-1">📲 Instant Outbound SMS</span>
                                <button
                                  onClick={() => handleCopy(generationOutput.smsFollowUp, 'ct-sms')}
                                  className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-705 cursor-pointer cursor-default"
                                >
                                  {copiedText === 'ct-sms' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedText === 'ct-sms' ? 'COPIED' : 'COPY'}</span>
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-450 mt-1">Automatic webhook trigger on dispatch status.</p>
                              <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl text-slate-205 italic font-mono text-[11px] mt-3 leading-relaxed">
                                "{generationOutput.smsFollowUp}"
                              </div>
                            </div>
                            <div className="pt-2 bg-emerald-950/20 border border-emerald-900/40 rounded p-2.5 text-center text-emerald-350 text-[10px] font-mono">
                              ⚡️ Sent to SMS routing gateway automatically
                            </div>
                          </div>

                          {/* Voicemail / spoken template */}
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-widest flex items-center gap-1">🎙️ Recipient Voicemail Spoken Script</span>
                                <button
                                  onClick={() => handleCopy(generationOutput.voicemailScript, 'ct-voicemail')}
                                  className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-705 cursor-pointer cursor-default"
                                >
                                  {copiedText === 'ct-voicemail' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedText === 'ct-voicemail' ? 'COPIED' : 'COPY'}</span>
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-450 mt-1">Read script aloud precisely if client drops to mailbox.</p>
                              <div className="p-4 bg-slate-905 border border-slate-850 rounded-xl text-slate-300 leading-relaxed font-sans text-[11px] mt-2 italic">
                                "{generationOutput.voicemailScript}"
                              </div>
                            </div>
                            <div className="pt-2 flex items-center gap-2 justify-center bg-slate-900/60 p-2.5 rounded-lg text-slate-450 text-[10px] font-mono">
                              <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              <span>Ready for Sales Dialers audio-drop</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row Email details */}
                        {generationOutput.emailFollowUp && (
                          <div className="bg-slate-850 border border-slate-800 rounded-xl p-5 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-2 font-mono">
                                <Mail className="w-4 h-4 text-emerald-400" />
                                Sequence Step 1: Broadcaster Follow-up Email
                              </span>
                              <button
                                onClick={() => handleCopy(`Subject: ${generationOutput.emailFollowUp.subject}\n\n${generationOutput.emailFollowUp.body}`, 'ct-email')}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[9px] text-slate-300 font-mono rounded flex items-center gap-1 border border-slate-705 cursor-pointer select-none"
                              >
                                {copiedText === 'ct-email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'ct-email' ? 'COPIED EMAIL' : 'COPY EMAIL'}</span>
                              </button>
                            </div>
                            <div className="bg-slate-900 border border-slate-850 rounded-xl p-4.5 space-y-3 text-slate-300 font-sans">
                              <h5 className="font-semibold text-slate-205">Subject: {generationOutput.emailFollowUp.subject}</h5>
                              <p className="whitespace-pre-line text-[11px] leading-relaxed font-light">{generationOutput.emailFollowUp.body}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC WEBINAR FUNNEL VIEW */}
                    {selectedTool === 'webinar_funnel' && (
                      <div className="space-y-6 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-emerald-400" />
                            Premium High-Converting Webinar Funnel Suite
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Full Copy, Scripts & Email Cadences</span>
                        </div>

                        {generationOutput.registrationPage && (
                          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 bg-emerald-900/40 text-emerald-300 font-mono text-[9px] tracking-wider font-semibold rounded-bl-xl border-l border-b border-emerald-800/60 uppercase">
                              Component 1: Registration Page Mock
                            </div>
                            
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                                🌐 Landing Page Frontend Copy
                              </span>
                              <button
                                onClick={() => handleCopy(`HEADLINE: ${generationOutput.registrationPage.headline}\nSUBTITLE: ${generationOutput.registrationPage.subhead}\nBULLETS:\n${generationOutput.registrationPage.bulletPoints?.join('\n')}\nCTA: ${generationOutput.registrationPage.ctaText}`, 'webinar-landing')}
                                className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-705 cursor-pointer"
                              >
                                {copiedText === 'webinar-landing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'webinar-landing' ? 'COPIED' : 'COPY ALL'}</span>
                              </button>
                            </div>

                            <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-xl space-y-4 font-sans text-slate-300">
                              <div className="text-center space-y-2 max-w-xl mx-auto">
                                <span className="p-1 px-2 bg-emerald-950/80 border border-emerald-850 text-emerald-400 font-mono text-[9px] rounded font-bold uppercase tracking-wider">
                                  FREE MASTERCLASS BROADCAST
                                </span>
                                <h3 className="text-base font-bold text-slate-100 leading-snug">
                                  {generationOutput.registrationPage.headline}
                                </h3>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                  {generationOutput.registrationPage.subhead}
                                </p>
                              </div>

                              <div className="border-t border-slate-800/80 pt-4 space-y-2.5 max-w-lg mx-auto">
                                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-widest text-center">
                                  What You'll Unlock Inside This Broadcast:
                                </span>
                                {(generationOutput.registrationPage.bulletPoints || []).map((bullet: string, idx: number) => (
                                  <div key={idx} className="flex items-start gap-2.5 text-[11px] text-slate-300 font-light leading-relaxed">
                                    <div className="p-1 bg-emerald-950 text-emerald-400 rounded-full text-[9px] font-mono mt-0.5">0{idx+1}</div>
                                    <p className="flex-1">{bullet}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-4 max-w-xs mx-auto text-center space-y-2">
                                <button
                                  type="button"
                                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-bold text-xs p-3.5 rounded-xl shadow-md uppercase tracking-wider font-mono cursor-pointer"
                                  onClick={() => alert("Simulated webinar enrollment saved. Checkout our next step tools below.")}
                                >
                                  {generationOutput.registrationPage.ctaText}
                                </button>
                                <p className="text-[9px] text-slate-500 font-mono">⚠️ 100% Secure & Private. Limited Seats Stream Protocol Enabled.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* DYNAMIC EMAIL SEQUENCE */}
                          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between pb-3 border-b border-slate-800/85">
                                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                                  📧 Automated Attendance Sequences
                                </span>
                              </div>
                              
                              <p className="text-[11px] text-slate-400 font-light my-2 leading-relaxed">
                                Toggle below to view registration confirmation and reminder sequences. Maintain 75%+ attendance via psychological micro-incentives.
                              </p>

                              {/* Tabs selector */}
                              <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl mb-4 border border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => setWebinarEmailTab('confirm')}
                                  className={`py-2 px-1 text-center font-mono rounded-lg transition-all cursor-pointer ${
                                    webinarEmailTab === 'confirm' 
                                      ? 'bg-slate-800 text-emerald-400 font-bold' 
                                      : 'text-slate-450 hover:text-slate-200'
                                  }`}
                                >
                                  Confirmation
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setWebinarEmailTab('1hour')}
                                  className={`py-2 px-1 text-center font-mono rounded-lg transition-all cursor-pointer ${
                                    webinarEmailTab === '1hour' 
                                      ? 'bg-slate-800 text-emerald-400 font-bold' 
                                      : 'text-slate-450 hover:text-slate-200'
                                  }`}
                                >
                                  1 Hour prior
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setWebinarEmailTab('10min')}
                                  className={`py-2 px-1 text-center font-mono rounded-lg transition-all cursor-pointer ${
                                    webinarEmailTab === '10min' 
                                      ? 'bg-slate-800 text-emerald-400 font-bold' 
                                      : 'text-slate-450 hover:text-slate-200'
                                  }`}
                                >
                                  10 Min prior
                                </button>
                              </div>

                              {webinarEmailTab === 'confirm' && generationOutput.confirmationEmail && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-mono font-bold text-emerald-400">Trigger: Immediately Upon Sign-up</span>
                                    <button
                                      onClick={() => handleCopy(`Subject: ${generationOutput.confirmationEmail.subject}\n\n${generationOutput.confirmationEmail.body}`, 'webinar-confirm-mail')}
                                      className="text-slate-400 hover:text-white text-[10px] underline flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedText === 'webinar-confirm-mail' ? 'Copied!' : 'Copy Email'}
                                    </button>
                                  </div>
                                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                                    <div className="text-[11px] text-slate-350 leading-relaxed font-sans">
                                      <p className="font-semibold text-slate-200 text-xs mb-1.5 font-sans">Subject: {generationOutput.confirmationEmail.subject}</p>
                                      <pre className="whitespace-pre-line font-light text-[11px] font-sans text-slate-300">{generationOutput.confirmationEmail.body}</pre>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {webinarEmailTab === '1hour' && generationOutput.reminderEmail1Hour && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-mono font-bold text-amber-400">Trigger: 1 Hour Before Stream Start</span>
                                    <button
                                      onClick={() => handleCopy(`Subject: ${generationOutput.reminderEmail1Hour.subject}\n\n${generationOutput.reminderEmail1Hour.body}`, 'webinar-1hr-mail')}
                                      className="text-slate-400 hover:text-white text-[10px] underline flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedText === 'webinar-1hr-mail' ? 'Copied!' : 'Copy Email'}
                                    </button>
                                  </div>
                                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                                    <div className="text-[11px] text-slate-350 leading-relaxed font-sans">
                                      <p className="font-semibold text-slate-200 text-xs mb-1.5 font-sans">Subject: {generationOutput.reminderEmail1Hour.subject}</p>
                                      <pre className="whitespace-pre-line font-light text-[11px] font-sans text-slate-300">{generationOutput.reminderEmail1Hour.body}</pre>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {webinarEmailTab === '10min' && generationOutput.reminderEmail10Min && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase font-mono font-bold text-red-400">Trigger: 10 Minutes Prior (Urgent Hook)</span>
                                    <button
                                      onClick={() => handleCopy(`Subject: ${generationOutput.reminderEmail10Min.subject}\n\n${generationOutput.reminderEmail10Min.body}`, 'webinar-10m-mail')}
                                      className="text-slate-400 hover:text-white text-[10px] underline flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedText === 'webinar-10m-mail' ? 'Copied!' : 'Copy Email'}
                                    </button>
                                  </div>
                                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                                    <div className="text-[11px] text-slate-350 leading-relaxed font-sans">
                                      <p className="font-semibold text-slate-200 text-xs mb-1.5 font-sans">Subject: {generationOutput.reminderEmail10Min.subject}</p>
                                      <pre className="whitespace-pre-line font-light text-[11px] font-sans text-slate-300">{generationOutput.reminderEmail10Min.body}</pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* REPLAY PAGE COPY WITH ACTION CTA */}
                          {generationOutput.replayPage && (
                            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800/85">
                                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                                    🔴 Urgency Replay Page Copy
                                  </span>
                                  <button
                                    onClick={() => handleCopy(`HEADLINE: ${generationOutput.replayPage.headline}\nSUMMARY: ${generationOutput.replayPage.summary}\nCTA: ${generationOutput.replayPage.coreCallToAction}`, 'webinar-replay-copy')}
                                    className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-[9px] text-slate-450 font-mono rounded flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                                  >
                                    {copiedText === 'webinar-replay-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>COPY REPLAY</span>
                                  </button>
                                </div>
                                <p className="text-[11px] text-slate-400 font-light my-2">
                                  Use this copy surrounding your recorded webinar container. Promotes immediate program eligibility action check-ins.
                                </p>
                                
                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 mt-3">
                                  <div className="px-2 py-0.5 bg-red-950/85 text-red-400 font-mono text-[9px] uppercase rounded border border-red-900 w-max font-bold animate-pulse">
                                    EXPIRING BROADCAST STREAM
                                  </div>
                                  <h5 className="text-xs font-bold text-slate-100 font-display leading-snug">{generationOutput.replayPage.headline}</h5>
                                  <p className="text-[11px] text-slate-350 leading-relaxed font-sans font-light">
                                    {generationOutput.replayPage.summary}
                                  </p>
                                  <div className="pt-2.5 bg-slate-950/60 p-2.5 border border-slate-800 rounded-lg text-emerald-400 text-center font-bold text-[10.5px]">
                                    👉 CTA: "{generationOutput.replayPage.coreCallToAction}"
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* WEBINAR SCRIPT OUTLINE CARD */}
                        {generationOutput.scriptOutline && (
                          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800/85">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">Component 4: Live Masterclass Script Outline</span>
                                <h4 className="text-xs font-bold text-slate-100 font-display">45-Minute Live Interactive Broadcast Hook & Presentation Blueprint</h4>
                              </div>
                              <button
                                onClick={() => handleCopy(`HOOK: ${generationOutput.scriptOutline.hook}\nCONTENT:\n${generationOutput.scriptOutline.contentSections?.join('\n')}\nTRANSITION: ${generationOutput.scriptOutline.pitchTransition}\nPITCH: ${generationOutput.scriptOutline.offerPitch}`, 'webinar-script')}
                                className="p-1 px-3 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                              >
                                {copiedText === 'webinar-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'webinar-script' ? 'COPIED SCRIPT' : 'COPY SCRIPT'}</span>
                              </button>
                            </div>

                            <div className="space-y-4 font-sans text-slate-300">
                              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                                <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 font-mono">0-5 MIN: Dynamic High-Stakes Hook</span>
                                <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans font-light">{generationOutput.scriptOutline.hook}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {(generationOutput.scriptOutline.contentSections || []).map((sect: string, idx: number) => (
                                  <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5">
                                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 font-mono">Core Training block {idx + 1}</span>
                                    <p className="text-[11px] text-slate-300 font-light leading-relaxed">{sect}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                                  <span className="text-[9px] uppercase font-mono font-bold text-amber-400 font-mono">The Transition into Solution presentation</span>
                                  <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans italic">{generationOutput.scriptOutline.pitchTransition}</p>
                                </div>
                                <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl space-y-1.5">
                                  <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 font-mono">The Offer pitch & Urgency limits</span>
                                  <p className="text-[11.5px] text-emerald-200 leading-relaxed font-sans font-light">{generationOutput.scriptOutline.offerPitch}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* POST WEBINAR PITCH EMAIL */}
                        {generationOutput.postWebinarPitchEmail && (
                          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/85">
                              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 animate-pulse">
                                📩 Post-Webinar High-Ticket Pitch Email
                              </span>
                              <button
                                onClick={() => handleCopy(`Subject: ${generationOutput.postWebinarPitchEmail.subject}\n\n${generationOutput.postWebinarPitchEmail.body}`, 'webinar-post-pitch')}
                                className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                              >
                                {copiedText === 'webinar-post-pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedText === 'webinar-post-pitch' ? 'COPIED' : 'COPY'}</span>
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed font-light">
                              Dispatched 2 hours and 24 hours post-webinar to non-buyers. Drives prospects directly to program alignment reviews.
                            </p>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                              <p className="font-semibold text-slate-200 text-xs font-sans">Subject: {generationOutput.postWebinarPitchEmail.subject}</p>
                              <pre className="whitespace-pre-line font-light text-[11px] font-sans text-slate-300 mt-2">{generationOutput.postWebinarPitchEmail.body}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC CONVERSATIONAL AI CHAT FLOW VIEW */}
                    {selectedTool === 'conversational_chat' && (
                      <div className="space-y-6 animate-fadeIn text-xs" id="chat-flow-block">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            Elite Conversational AI Chat Flow Builder
                          </h4>
                          <span className="text-[9px] text-slate-450 font-mono">Interactive Simulated Sandbox + Export Deck</span>
                        </div>

                        {/* Control Tabs */}
                        <div className="flex border-b border-slate-800">
                          <button
                            id="tab-phone-preview"
                            onClick={() => setChatConfigTab('phone')}
                            className={`px-4 py-2 text-[11px] font-mono font-medium border-b-2 cursor-pointer transition-colors ${
                              chatConfigTab === 'phone'
                                ? 'border-amber-500 text-amber-400 bg-slate-850/40 opacity-100'
                                : 'border-transparent text-slate-400 hover:text-slate-300'
                            }`}
                          >
                            📱 Interactive Live Simulator
                          </button>
                          <button
                            id="tab-export-config"
                            onClick={() => setChatConfigTab('config')}
                            className={`px-4 py-2 text-[11px] font-mono font-medium border-b-2 cursor-pointer transition-colors ${
                              chatConfigTab === 'config'
                                ? 'border-amber-500 text-amber-400 bg-slate-850/40 opacity-100'
                                : 'border-transparent text-slate-400 hover:text-slate-300'
                            }`}
                          >
                            ⚙️ Prompt & Raw Configuration Deck
                          </button>
                        </div>

                        {chatConfigTab === 'phone' ? (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Simulator Instructions */}
                            <div className="lg:col-span-5 space-y-4">
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-sans">
                                <h5 className="font-semibold text-slate-205 text-xs flex items-center gap-1.5">
                                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                                  Simulated Agent Objectives
                                </h5>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                                  This live mobilization sandbox simulates how an AI agent uses the generated dynamic copywriting schemas to interact, capture intents, and book high-ticket conversions.
                                </p>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2 text-[10px]">
                                    <span className="p-0.5 rounded bg-emerald-950 border border-emerald-850 text-emerald-400 font-bold font-mono">STEP 1</span>
                                    <span className="text-slate-300">Evaluate customer's bottleneck or pain points dynamically.</span>
                                  </div>
                                  <div className="flex items-start gap-2 text-[10px]">
                                    <span className="p-0.5 rounded bg-emerald-950 border border-emerald-850 text-emerald-400 font-bold font-mono">STEP 2</span>
                                    <span className="text-slate-300">Identify target scaling goals to grade lead value tags.</span>
                                  </div>
                                  <div className="flex items-start gap-2 text-[10px]">
                                    <span className="p-0.5 rounded bg-amber-950 border border-amber-850 text-amber-400 font-bold font-mono">STEP 3</span>
                                    <span className="text-slate-300">Deploy your custom-crafted offer and capture the calendar appointment!</span>
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                                  <button
                                    id="chat-simulator-reset-btn"
                                    onClick={() => {
                                      setCurrentChatIndex(0);
                                      setChatAnswers({});
                                      setActivePreShowOffer(false);
                                    }}
                                    className="p-1 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded text-[10px] font-mono cursor-pointer flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    RESET SIMULATION
                                  </button>
                                  <span className="text-[9px] text-emerald-400 bg-emerald-950/40 p-1 px-2 rounded-full border border-emerald-900/60 font-mono">ACTIVE PROTOCOL</span>
                                </div>
                              </div>

                              <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-2 text-slate-400 text-[11px] font-light leading-relaxed font-sans">
                                <p className="font-semibold text-slate-300 text-xs">💡 Custom Copywriter Parameters:</p>
                                <p>• <b>Niche Category:</b> {category || 'Organic Branding Services'}</p>
                                <p>• <b>Avatar Target:</b> {avatar || 'Busy business owners'}</p>
                                <p>• <b>Primary Solution:</b> {desiredOutcome || 'Double booking ratios in 14 days'}</p>
                                <p>• <b>Offer Call:</b> {customOffer || 'Complimentary Audit'}</p>
                              </div>
                            </div>

                            {/* Simulated Smartphone Framed UI Container */}
                            <div className="lg:col-span-7 flex justify-center">
                              <div className="w-full max-w-[340px] bg-slate-950 rounded-[40px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col h-[520px]">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/3 right-1/3 h-5 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
                                  <div className="w-12 h-1 bg-black rounded-full" />
                                </div>

                                {/* Status Bar / App Header */}
                                <div className="bg-slate-900 pt-6 pb-2.5 px-5 border-b border-slate-800 flex items-center justify-between z-10 font-sans">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                                    <div>
                                      <h5 className="font-bold text-slate-100 text-[10px] tracking-wide uppercase">AI ASSISTANT</h5>
                                      <p className="text-[8px] text-slate-400 font-mono">Conversation Online • ID: 2.4.1</p>
                                    </div>
                                  </div>
                                  <button
                                    id="chat-phone-action-call"
                                    onClick={() => alert("Simulating instant voice-over IP routing to human receptionist...")}
                                    className="p-1.5 bg-slate-850 hover:bg-slate-805 rounded-full text-slate-300 border border-slate-755 cursor-pointer"
                                    title="Call agent"
                                  >
                                    <Phone className="w-3 h-3 text-emerald-400" />
                                  </button>
                                </div>

                                {/* Live Chat Messages Stream */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans custom-scrollbar bg-slate-950">
                                  {/* Bot Welcome Bubble */}
                                  <div className="flex items-start gap-2 max-w-[85%]">
                                    <div className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-750 flex items-center justify-center font-mono text-[8px] text-emerald-300 font-bold shrink-0">
                                      AI
                                    </div>
                                    <div className="bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-sm p-3 shadow-md">
                                      <p className="text-[10px] text-slate-300 font-light leading-relaxed">
                                        {generationOutput.greeting || `Hi! Welcome. Let's build a customized roadmap. Ready to supercharge your conversion funnels?`}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Dynamic Questions Rendering Loop */}
                                  {(generationOutput.questions || []).map((q: any, idx: number) => {
                                    const hasAnswered = !!chatAnswers[q.id];
                                    const isQuestionVisible = idx <= currentChatIndex;

                                    if (!isQuestionVisible) return null;

                                    return (
                                      <div key={q.id} className="space-y-3 pt-1">
                                        {/* Question Bubble */}
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                          <div className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-750 flex items-center justify-center font-mono text-[8px] text-emerald-300 font-bold shrink-0">
                                            AI
                                          </div>
                                          <div className="bg-slate-900 border border-slate-855 rounded-2xl rounded-tl-sm p-3 shadow-md">
                                            <p className="text-[10px] text-slate-300 font-light leading-relaxed">
                                              {q.question}
                                            </p>
                                          </div>
                                        </div>

                                        {/* User Choices or Answer Bubble */}
                                        {hasAnswered ? (
                                          <div className="space-y-3">
                                            {/* User Answer Bubble */}
                                            <div className="flex justify-end pr-1">
                                              <div className="bg-emerald-600/90 text-white border border-emerald-500 rounded-2xl rounded-tr-sm p-3 max-w-[80%] shadow-md animate-fadeIn">
                                                <p className="text-[10px] font-medium leading-relaxed">
                                                  {chatAnswers[q.id].optionText}
                                                </p>
                                              </div>
                                            </div>

                                            {/* Bot Branching Response Bubble */}
                                            <div className="flex items-start gap-2 max-w-[85%] animate-fadeIn">
                                              <div className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-750 flex items-center justify-center font-mono text-[8px] text-emerald-300 font-bold shrink-0">
                                                AI
                                              </div>
                                              <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl rounded-tl-sm shadow-md text-slate-350">
                                                <p className="text-[10px] leading-relaxed font-light italic">
                                                  ✨ {q.branchingResponses?.[chatAnswers[q.id].optionIndex] || `Excellent selection! Let's align that key metric.`}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          /* Option pickers */
                                          idx === currentChatIndex && !activePreShowOffer && (
                                            <div className="pl-7 space-y-1.5 max-w-[90%] animate-fadeIn">
                                              {(q.options || []).map((option: string, optIdx: number) => {
                                                const optKey = optIdx === 0 ? 'A' : optIdx === 1 ? 'B' : 'C';
                                                return (
                                                  <button
                                                    key={optIdx}
                                                    id={`btn-chat-opt-${q.id}-${optKey}`}
                                                    onClick={() => {
                                                      const updatedAnswers = {
                                                        ...chatAnswers,
                                                        [q.id]: { optionText: option, optionIndex: optKey }
                                                      };
                                                      setChatAnswers(updatedAnswers);
                                                      
                                                      // Check if more questions remain
                                                      if (idx < (generationOutput.questions || []).length - 1) {
                                                        setTimeout(() => {
                                                          setCurrentChatIndex(idx + 1);
                                                        }, 500);
                                                      } else {
                                                        // Show offer presentation phase
                                                        setTimeout(() => {
                                                          setActivePreShowOffer(true);
                                                        }, 500);
                                                      }
                                                    }}
                                                    className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-850 text-[10px] text-amber-300 rounded-xl border border-slate-800 hover:border-amber-900/40 transition shadow-sm cursor-pointer"
                                                  >
                                                    <span className="font-mono font-bold text-amber-500 mr-1">{optKey}.</span> {option}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    );
                                  })}

                                  {/* Final Offer presentation & Custom CTA Link */}
                                  {activePreShowOffer && generationOutput.offerPresentation && (
                                    <div className="space-y-3 pt-3 animate-fadeIn">
                                      {/* Offer Presentation Bot Bubble */}
                                      <div className="flex items-start gap-2 max-w-[85%]">
                                        <div className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-750 flex items-center justify-center font-mono text-[8px] text-emerald-300 font-bold shrink-0">
                                          AI
                                        </div>
                                        <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl rounded-tl-sm shadow-md space-y-2">
                                          <div className="p-1 px-1.5 bg-amber-950 border border-amber-900/60 text-amber-400 font-mono text-[7px] rounded-md font-bold uppercase tracking-wider inline-block">
                                            🎯 PRE-QUALIFIED SPECIAL OFFER
                                          </div>
                                          <h6 className="text-[10.5px] font-bold text-slate-100 leading-tight">
                                            {generationOutput.offerPresentation.headline}
                                          </h6>
                                          <ul className="space-y-1 text-[9px] text-slate-350 list-none pl-0">
                                            {(generationOutput.offerPresentation.bullets || []).map((bullet: string, bIdx: number) => (
                                              <li key={bIdx} className="flex items-start gap-1">
                                                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                                                <span>{bullet}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>

                                      {/* booking instructions bubble */}
                                      <div className="flex items-start gap-2 max-w-[85%]">
                                        <div className="w-5 h-5 rounded-full bg-emerald-990 border border-emerald-750 flex items-center justify-center font-mono text-[8px] text-emerald-300 font-bold shrink-0">
                                          AI
                                        </div>
                                        <div className="bg-slate-900 border border-slate-850 p-3 rounded-2xl rounded-tl-sm shadow-md">
                                          <p className="text-[10px] text-slate-300 font-light leading-relaxed">
                                            {generationOutput.bookingCta}
                                          </p>
                                        </div>
                                      </div>

                                      {/* CTA Live Scheduler Integration Buttons */}
                                      <div className="pl-7 space-y-2 max-w-[90%] font-sans">
                                        <button
                                          id="btn-chat-cta-appointment"
                                          onClick={() => alert(`Redirecting prospect safely to capture slot for: "${customOffer}"`)}
                                          className="w-full p-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-440 text-slate-950 text-[10px] font-extrabold text-center rounded-xl shadow-md border border-amber-400 hover:border-amber-300 transition uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                                        >
                                          <span>📅 {generationOutput.offerPresentation.ctaText}</span>
                                          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                                        </button>

                                        {/* Handoff Trigger Bubble */}
                                        <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-[8px] text-slate-400 leading-relaxed font-light">
                                          💬 <b>Human Agent Helpdesk:</b> <br />
                                          {generationOutput.handoffMessage}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Prompt & Raw Blueprint JSON Tab */
                          <div className="space-y-4">
                            {/* Copy Configuration Block */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden animate-fadeIn">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-sans">
                                  <FileText className="w-4 h-4 text-emerald-400" />
                                  Copy complete Prompt & Flow Blueprint JSON
                                </span>
                                <button
                                  id="chat-flow-copy-config-btn"
                                  onClick={() => handleCopy(JSON.stringify(generationOutput, null, 2), 'chat-flow-config')}
                                  className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-[10px] text-slate-300 font-mono rounded flex items-center gap-1.5 border border-slate-705 cursor-pointer"
                                >
                                  {copiedText === 'chat-flow-config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedText === 'chat-flow-config' ? 'COPIED' : 'COPY ALL'}</span>
                                </button>
                              </div>

                              <div className="space-y-2 font-sans">
                                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                                  This complete parameters architecture has been generated tailored to your brand goals. You can directly import this JSON blueprint configuration into major visual chatbot platforms (such as <b>Voiceflow</b>, <b>ManyChat</b>, <b>Zendesk</b>, or <b>Landbot</b>) to instantiate physical assets immediately.
                                </p>
                              </div>

                              <div className="p-4 bg-slate-950 rounded-xl overflow-y-auto max-h-[300px] border border-slate-850 font-mono text-[10px] text-slate-350">
                                <pre>{JSON.stringify(generationOutput, null, 2)}</pre>
                              </div>
                            </div>

                            {/* System Prompt tuning advice */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 animate-fadeIn">
                              <h5 className="font-semibold text-slate-205 text-xs flex items-center gap-1.5 font-sans">
                                🧠 Optimized System Prompt Tuning Guide
                              </h5>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-light font-sans">
                                To seed this diagnostic dialog inside your customer chatbot engine, use the following systemic guidelines:
                              </p>
                              <pre className="bg-slate-950 p-4 rounded-xl text-[10px] text-slate-450 font-mono whitespace-pre-line leading-relaxed border border-slate-855 text-slate-300">
                                {`You are a conversational pre-qualification bot for ${productName}.
                                Your persona style is purely ${tone || 'conversion-focused, professional, and friendly'}.
                                Your primary objective is to qualify users according to their bottlenecks and offer the "${customOffer}".
                                
                                ALWAYS align the qualifying steps with these criteria:
                                - If user mentions CPA bottleneck or budget leaks, tag lead as "High CPA Leak".
                                - If user mentions scaling setups, tag lead as "Value Expansion Profile".
                                - Redirect pre-qualified users to secure scheduling invitations immediately.`}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
