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
  Volume2
} from 'lucide-react';
import { Funnel } from '../types';

interface AICopywriterStudioProps {
  activeFunnel: Funnel | null | undefined;
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
  | 'orchestrator';

export default function AICopywriterStudio({ activeFunnel }: AICopywriterStudioProps) {
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const executeGeneration = async () => {
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
    { id: 'ads', name: 'Paid Ad Variant Copy', icon: Megaphone, desc: 'Meta Sponsored posts & search engine blueprints' },
    { id: 'pdp', name: 'PDP Product Showcase', icon: ShoppingBag, desc: 'High-converting descriptions, spec summaries & FAQs' },
    { id: 'visual', name: 'Visual Media Playbook', icon: Camera, desc: 'Studio camera shot list & unboxing storyboard' },
    { id: 'social_proof', name: 'Social Proof architect', icon: Star, desc: 'Persona reviews, website testimonials & UGC' },
    { id: 'support', name: 'CX Helpdesk & Policies', icon: HelpCircle, desc: 'Support templates, shipping rules & secure checkout' },
    { id: 'analytics_story', name: 'Funnel Storyteller', icon: BarChart3, desc: 'Diagnostic insights reports & testing ideas' },
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
              Craft beautiful, highly persuasive, and fully compliant marketing copy. Toggle any of our 10 specialized generators to construct visual mocks instantly tuned to your customer's deepest desires.
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
                    <div className={`p-1.5 rounded-lg mt-0.5 ${selectedTool === tool.id ? 'bg-emerald-800 text-amber-300' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComponent className="w-4 h-4 text-inherit" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold">{tool.name}</h4>
                      <p className={`text-[10px] ${selectedTool === tool.id ? 'text-emerald-100/80' : 'text-slate-400'} mt-0.5 font-light leading-snug`}>
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
            <div className="flex-1 flex flex-col justify-center relative z-10">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
