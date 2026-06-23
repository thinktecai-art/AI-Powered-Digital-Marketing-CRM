import React, { useState } from 'react';
import { Asset, FunnelStageType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Award, 
  HelpCircle, 
  ArrowRight, 
  Percent, 
  Sparkles, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  stageType: FunnelStageType;
  assetAId: string;
  assetBId: string;
  trafficSplitA: number; // e.g. 50 (so B gets 100 - A)
  status: 'Running' | 'Paused' | 'Ended';
  winnerAssetId?: string;
  createdAt: string;
}

interface ABTestManagerProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  sendWebNotification: (title: string, body: string) => void;
  setLiveAlerts: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ABTestManager({
  assets,
  setAssets,
  sendWebNotification,
  setLiveAlerts
}: ABTestManagerProps) {
  // We'll manage A/B experiments in local storage or fallback to pre-loaded standard examples
  const [tests, setTests] = useState<ABTest[]>(() => {
    const saved = localStorage.getItem('crm_ab_tests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved A/B tests", e);
      }
    }
    
    // Fallback: Seed with 1 beautiful default A/B test
    const defaultTest: ABTest = {
      id: 'ab-test-1',
      name: 'V1 Short-Authority Hook vs V2 Story-Bridge Narrative',
      stageType: 'Lead Capture',
      assetAId: 'asset-lead-1', // Default seeds usually contain lead-1 and lead-2, let's find or link dynamically
      assetBId: 'asset-lead-2',
      trafficSplitA: 50,
      status: 'Running',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    };
    return [defaultTest];
  });

  // State for active test selected in list
  const [activeTestId, setActiveTestId] = useState<string>(tests[0]?.id || '');
  
  // Create Test Form states
  const [isCreating, setIsCreating] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestStage, setNewTestStage] = useState<FunnelStageType>('Lead Capture');
  const [newTestAssetA, setNewTestAssetA] = useState('');
  const [newTestAssetB, setNewTestAssetB] = useState('');
  const [newTrafficSplit, setNewTrafficSplit] = useState(50);

  // Helper to persist tests
  const saveTests = (updatedTests: ABTest[]) => {
    setTests(updatedTests);
    localStorage.setItem('crm_ab_tests', JSON.stringify(updatedTests));
  };

  // Filter assets matching selected stage
  const assetsInSelectedStage = assets.filter(a => a.stageType === newTestStage);

  // Get current active test configuration
  const activeTest = tests.find(t => t.id === activeTestId);
  
  // Find referenced Assets for active test
  const assetA = activeTest ? assets.find(a => a.id === activeTest.assetAId) : null;
  const assetB = activeTest ? assets.find(a => a.id === activeTest.assetBId) : null;

  // Calculate comparative metrics
  const getCtr = (asset: Asset | null) => {
    if (!asset) return 0;
    if (asset.performanceMetrics?.ctr !== undefined) return asset.performanceMetrics.ctr;
    const views = asset.performanceMetrics?.views || 100;
    const clicks = asset.performanceMetrics?.clicks || 4;
    return views > 0 ? parseFloat(((clicks / views) * 100).toFixed(2)) : 0;
  };

  const getConversions = (asset: Asset | null) => {
    return asset?.performanceMetrics?.conversions || 0;
  };

  const getViews = (asset: Asset | null) => {
    return asset?.performanceMetrics?.views || 0;
  };

  const getClicks = (asset: Asset | null) => {
    return asset?.performanceMetrics?.clicks || 0;
  };

  // Create test handler
  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestAssetA || !newTestAssetB) {
      alert("Please fill in all A/B test parameters.");
      return;
    }
    if (newTestAssetA === newTestAssetB) {
      alert("Asset A and Asset B must be different copies.");
      return;
    }

    const newTest: ABTest = {
      id: `ab-test-${Date.now()}`,
      name: newTestName.trim(),
      stageType: newTestStage,
      assetAId: newTestAssetA,
      assetBId: newTestAssetB,
      trafficSplitA: newTrafficSplit,
      status: 'Running',
      createdAt: new Date().toISOString()
    };

    const updated = [newTest, ...tests];
    saveTests(updated);
    setActiveTestId(newTest.id);
    setIsCreating(false);
    
    // Clear states
    setNewTestName('');
    setNewTestAssetA('');
    setNewTestAssetB('');
    setNewTrafficSplit(50);

    sendWebNotification("🧪 A/B Experiment Initialized", `New test "${newTest.name}" is now active in ${newTest.stageType}.`);
    setLiveAlerts(prev => [`🧪 Initialized A/B test: "${newTest.name}"`, ...prev]);
  };

  // Delete test
  const handleDeleteTest = (id: string) => {
    const updated = tests.filter(t => t.id !== id);
    saveTests(updated);
    if (activeTestId === id && updated.length > 0) {
      setActiveTestId(updated[0].id);
    } else if (updated.length === 0) {
      setActiveTestId('');
    }
    setLiveAlerts(prev => [`🗑️ Archiving A/B test records`, ...prev]);
  };

  // Pause / Resume Test
  const toggleTestStatus = (id: string) => {
    const updated = tests.map(t => {
      if (t.id === id) {
        const newStatus: ABTest['status'] = t.status === 'Running' ? 'Paused' : 'Running';
        return { ...t, status: newStatus };
      }
      return t;
    });
    saveTests(updated);
  };

  // TRAFFIC SIMULATOR
  // This helps demonstrate conversion difference side-by-side by running simulated traffic
  const handleSimulateTraffic = (visitorCount: number = 100) => {
    if (!activeTest || !assetA || !assetB) return;
    if (activeTest.status !== 'Running') {
      alert("This experiment is not running. Please resume it first!");
      return;
    }

    // Determine visitors split
    const shareA = activeTest.trafficSplitA / 100;
    const visitorsA = Math.round(visitorCount * shareA);
    const visitorsB = visitorCount - visitorsA;

    // Define mock performance probabilities
    // We make asset B slightly higher performing by default so there's an interesting statistical curve!
    const baseCtrA = 4.5;  // 4.5% CTR
    const baseCtrB = 6.2;  // 6.2% CTR
    const baseCvrA = 1.8;  // 1.8% conversion rate
    const baseCvrB = 2.8;  // 2.8% conversion rate

    // Generate outcome metrics for A
    let clicksA = 0;
    let conversionsA = 0;
    for (let i = 0; i < visitorsA; i++) {
      if (Math.random() * 100 < baseCtrA) {
        clicksA++;
        if (Math.random() * 100 < baseCvrA * 20) { // clicks-to-conversions scaling
          conversionsA++;
        }
      }
    }

    // Generate outcome metrics for B
    let clicksB = 0;
    let conversionsB = 0;
    for (let i = 0; i < visitorsB; i++) {
      if (Math.random() * 100 < baseCtrB) {
        clicksB++;
        if (Math.random() * 100 < baseCvrB * 20) {
          conversionsB++;
        }
      }
    }

    // Update the asset records in parents state
    setAssets(prev => prev.map(a => {
      if (a.id === assetA.id) {
        const p = a.performanceMetrics || { views: 0, clicks: 0, ctr: 0, conversions: 0 };
        const newViews = (p.views || 0) + visitorsA;
        const newClicks = (p.clicks || 0) + clicksA;
        const newConversions = (p.conversions || 0) + conversionsA;
        const newCtr = newViews > 0 ? parseFloat(((newClicks / newViews) * 100).toFixed(2)) : 0;
        return {
          ...a,
          performanceMetrics: {
            views: newViews,
            clicks: newClicks,
            ctr: newCtr,
            conversions: newConversions
          }
        };
      }
      if (a.id === assetB.id) {
        const p = a.performanceMetrics || { views: 0, clicks: 0, ctr: 0, conversions: 0 };
        const newViews = (p.views || 0) + visitorsB;
        const newClicks = (p.clicks || 0) + clicksB;
        const newConversions = (p.conversions || 0) + conversionsB;
        const newCtr = newViews > 0 ? parseFloat(((newClicks / newViews) * 100).toFixed(2)) : 0;
        return {
          ...a,
          performanceMetrics: {
            views: newViews,
            clicks: newClicks,
            ctr: newCtr,
            conversions: newConversions
          }
        };
      }
      return a;
    }));

    setLiveAlerts(prev => [
      `🧪 Sent ${visitorCount} simulated visitors: A +${visitorsA} views (+${clicksA} clicks, +${conversionsA} cvr) | B +${visitorsB} views (+${clicksB} clicks, +${conversionsB} cvr)`,
      ...prev
    ]);
    sendWebNotification(
      "⚡ Traffic Simulation Run",
      `Dispatched ${visitorCount} views. Asset A CTR is ${getCtr(assetA)}%, Asset B CTR is ${getCtr(assetB)}%.`
    );
  };

  // DECLARE WINNER UTILITY
  const handleDeclareWinner = (winnerId: string, winnerLabel: 'A' | 'B') => {
    if (!activeTest) return;
    const winner = winnerId === activeTest.assetAId ? assetA : assetB;
    const loser = winnerId === activeTest.assetAId ? assetB : assetA;
    if (!winner || !loser) return;

    // Save test status as Ended
    const updatedTests = tests.map(t => {
      if (t.id === activeTest.id) {
        return {
          ...t,
          status: 'Ended' as const,
          winnerAssetId: winnerId
        };
      }
      return t;
    });
    saveTests(updatedTests);

    // Apply winner badge / notes optimization recommendation to the winning asset in parent copy directory
    setAssets(prev => prev.map(a => {
      if (a.id === winner.id) {
        return {
          ...a,
          title: `🏆 [A/B Winner] ${a.title}`,
          notes: `Declared Champion in experiment "${activeTest.name}" on ${new Date().toLocaleDateString()}. Completed split testing with conversion metrics outperforming alternative by ${Math.abs(getCtr(winner) - getCtr(loser)).toFixed(1)}% CTR boost.`
        };
      }
      return a;
    }));

    sendWebNotification("🏆 A/B Winner Proclaimed!", `Asset ${winnerLabel} ("${winner.title}") has been locked as the champion layout.`);
    setLiveAlerts(prev => [`🏆 Declared Champion asset: "${winner.title}" for stage ${activeTest.stageType}`, ...prev]);
  };

  // Stage options that have assets to select from
  const getActiveAssetStages = (): FunnelStageType[] => {
    const stages = new Set<FunnelStageType>();
    assets.forEach(a => stages.add(a.stageType));
    return Array.from(stages);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER EXPLANATION CARD */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3 h-3 animate-pulse" />
              CONVERSION EXPERIMENT LAB
            </span>
            <h3 className="text-base font-display font-bold text-white">Interactive A/B Copy Optimization</h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Define experimental tests by coupling two distinct copy assets of the same stage. Allocate incoming traffic slices, run micro-simulations, and analyze side-by-side conversion performance in real-time.
            </p>
          </div>

          <button
            onClick={() => {
              setIsCreating(!isCreating);
              // Set initial asset picks if possible
              const stage = getActiveAssetStages()[0] || 'Lead Capture';
              setNewTestStage(stage);
              const matching = assets.filter(a => a.stageType === stage);
              if (matching.length >= 2) {
                setNewTestAssetA(matching[0].id);
                setNewTestAssetB(matching[1].id);
              }
            }}
            className="w-full md:w-auto flex items-center justify-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 font-extrabold text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Launch A/B Test</span>
          </button>
        </div>
      </div>

      {/* CREATE NEW EXPERIMENT FORM MODAL/DRAWER OVERLAY */}
      {isCreating && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-sm text-slate-800">Launch A/B Copy Experiment</h3>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold font-mono"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateTest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Experiment Name / Objective</label>
              <input 
                type="text"
                required
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="e.g. Landing Page headline hook - Authority vs Storytelling"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Funnel Stage</label>
              <select
                value={newTestStage}
                onChange={(e) => {
                  const stage = e.target.value as FunnelStageType;
                  setNewTestStage(stage);
                  const matching = assets.filter(a => a.stageType === stage);
                  if (matching.length >= 2) {
                    setNewTestAssetA(matching[0].id);
                    setNewTestAssetB(matching[1].id);
                  } else {
                    setNewTestAssetA('');
                    setNewTestAssetB('');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
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

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Traffic Distribution (Split A)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={newTrafficSplit}
                  onChange={(e) => setNewTrafficSplit(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-700 min-w-[70px] text-center">
                  {newTrafficSplit}/{100 - newTrafficSplit}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Select Asset A (Variation A)</label>
              <select
                value={newTestAssetA}
                onChange={(e) => setNewTestAssetA(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              >
                <option value="">-- Choose first copy --</option>
                {assetsInSelectedStage.map(a => (
                  <option key={a.id} value={a.id}>{a.title} (#{a.id})</option>
                ))}
              </select>
              {assetsInSelectedStage.length < 2 && (
                <p className="text-[10px] text-amber-600">⚠️ Stage requires at least 2 assets to run tests. Generate another asset first!</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Select Asset B (Variation B)</label>
              <select
                value={newTestAssetB}
                onChange={(e) => setNewTestAssetB(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              >
                <option value="">-- Choose second copy --</option>
                {assetsInSelectedStage.map(a => (
                  <option key={a.id} value={a.id}>{a.title} (#{a.id})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={assetsInSelectedStage.length < 2}
                className="px-4 py-2 text-xs font-extrabold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Activate Experiment
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* EXPERIMENTS LIST AND SIDE-BY-SIDE PANELS */}
      {tests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          🔬 No copy experiments active. Click "Launch A/B Test" above to start testing metrics side-by-side!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* EXPERIMENT SELECTOR SIDEBAR */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wide">Active Experiments</h4>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {tests.map(t => {
                const isActive = t.id === activeTestId;
                const matchesWinner = t.winnerAssetId;
                
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTestId(t.id)}
                    className={`p-3 cursor-pointer rounded-xl border transition-all text-left space-y-1 ${
                      isActive
                        ? 'bg-emerald-50/15 border-emerald-600 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        t.status === 'Running'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'Paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                      }`}>
                        {t.status}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">{t.stageType}</span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight" title={t.name}>
                      {t.name}
                    </h5>

                    {matchesWinner && (
                      <div className="flex items-center gap-1 text-[9px] text-amber-600 font-extrabold">
                        <Award className="w-2.5 h-2.5 shrink-0" />
                        <span>Winner Declared</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN SIDE-BY-SIDE ANALYTICAL CONTAINER */}
          <div className="lg:col-span-3 space-y-4">
            {activeTest && assetA && assetB ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
                
                {/* EXPERIMENT CONTROL PANEL HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-800 flex items-center gap-1.5">
                      <Flame className="text-amber-500 w-4 h-4" />
                      {activeTest.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comparing performance at stage: <strong className="text-slate-600">{activeTest.stageType}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Pause/Resume buttons */}
                    <button
                      onClick={() => toggleTestStatus(activeTest.id)}
                      className={`text-xs p-1.5 border rounded-lg transition-all ${
                        activeTest.status === 'Running'
                          ? 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-800'
                      }`}
                      title={activeTest.status === 'Running' ? 'Pause experiment traffic' : 'Resume experiment traffic'}
                    >
                      {activeTest.status === 'Running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    {/* Simulation buttons */}
                    <button
                      onClick={() => handleSimulateTraffic(100)}
                      disabled={activeTest.status !== 'Running'}
                      className="text-xs bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                      <span>Dispatch 100 Sim visitors</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTest(activeTest.id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* GRAPHICAL COMPARISON BAR CHART */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wide flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Visual Performance Gap
                  </h4>

                  <div className="space-y-4">
                    {/* CTR Gap */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>Click-Through Rate (CTR) comparison</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          Gap: <strong className="text-emerald-700">{Math.abs(getCtr(assetA) - getCtr(assetB)).toFixed(1)}%</strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-2 text-[10px] font-bold text-slate-400">A: {getCtr(assetA)}%</span>
                        <div className="col-span-8 bg-slate-200 h-3 rounded-full overflow-hidden relative">
                          <div 
                            style={{ width: `${Math.min(100, (getCtr(assetA) / 15) * 100)}%` }} 
                            className="bg-slate-400 h-full rounded-full transition-all duration-500"
                          />
                        </div>
                        <span className="col-span-2 text-[10px] font-mono text-right font-bold text-slate-500">({getClicks(assetA)} clk)</span>
                      </div>
                      <div className="grid grid-cols-12 items-center gap-4 mt-2">
                        <span className="col-span-2 text-[10px] font-bold text-emerald-600">B: {getCtr(assetB)}%</span>
                        <div className="col-span-8 bg-slate-200 h-3 rounded-full overflow-hidden relative">
                          <div 
                            style={{ width: `${Math.min(100, (getCtr(assetB) / 15) * 100)}%` }} 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          />
                        </div>
                        <span className="col-span-2 text-[10px] font-mono text-right font-bold text-slate-500">({getClicks(assetB)} clk)</span>
                      </div>
                    </div>

                    {/* Conversion Rate Gap */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>Conversions (Closed Leads)</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          Ratio: <strong className="text-emerald-700">{getConversions(assetA)} vs {getConversions(assetB)}</strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-2 text-[10px] font-bold text-slate-400">A: {getConversions(assetA)}</span>
                        <div className="col-span-8 bg-slate-200 h-3 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${Math.min(100, (getConversions(assetA) / Math.max(1, getConversions(assetA) + getConversions(assetB))) * 100)}%` }} 
                            className="bg-slate-400 h-full transition-all duration-500"
                          />
                        </div>
                        <span className="col-span-2 text-[10px] font-mono text-right font-bold text-slate-500">({getViews(assetA)} view)</span>
                      </div>
                      <div className="grid grid-cols-12 items-center gap-4 mt-2">
                        <span className="col-span-2 text-[10px] font-bold text-emerald-600">B: {getConversions(assetB)}</span>
                        <div className="col-span-8 bg-slate-200 h-3 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${Math.min(100, (getConversions(assetB) / Math.max(1, getConversions(assetA) + getConversions(assetB))) * 100)}%` }} 
                            className="bg-emerald-500 h-full transition-all duration-500"
                          />
                        </div>
                        <span className="col-span-2 text-[10px] font-mono text-right font-bold text-slate-500">({getViews(assetB)} view)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SIDE-BY-SIDE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* CARD VARIATION A */}
                  <div className={`p-4 rounded-xl border relative transition-all ${
                    activeTest.winnerAssetId === assetA.id
                      ? 'bg-amber-50/25 border-amber-400 shadow'
                      : 'bg-white border-slate-200'
                  }`}>
                    {activeTest.winnerAssetId === assetA.id && (
                      <span className="absolute top-3 right-3 bg-amber-400 text-emerald-950 px-2 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 uppercase tracking-wide">
                        <Award className="w-3 h-3" /> Winner
                      </span>
                    )}

                    <div className="mb-3">
                      <span className="text-[10px] uppercase font-mono font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        Variation A (Split: {activeTest.trafficSplitA}%)
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs mt-1.5 truncate">{assetA.title}</h4>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 h-32 overflow-y-auto mb-4 text-[11px] font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {assetA.content}
                    </div>

                    {activeTest.status === 'Running' && (
                      <button
                        onClick={() => handleDeclareWinner(assetA.id, 'A')}
                        className="w-full text-center py-1.5 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-lg text-xs font-bold text-slate-600 hover:text-amber-900 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Declare Variation A Winner</span>
                      </button>
                    )}
                  </div>

                  {/* CARD VARIATION B */}
                  <div className={`p-4 rounded-xl border relative transition-all ${
                    activeTest.winnerAssetId === assetB.id
                      ? 'bg-amber-50/25 border-amber-400 shadow'
                      : 'bg-white border-slate-200'
                  }`}>
                    {activeTest.winnerAssetId === assetB.id && (
                      <span className="absolute top-3 right-3 bg-amber-400 text-emerald-950 px-2 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 uppercase tracking-wide">
                        <Award className="w-3 h-3" /> Winner
                      </span>
                    )}

                    <div className="mb-3">
                      <span className="text-[10px] uppercase font-mono font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        Variation B (Split: {100 - activeTest.trafficSplitA}%)
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs mt-1.5 truncate">{assetB.title}</h4>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 h-32 overflow-y-auto mb-4 text-[11px] font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {assetB.content}
                    </div>

                    {activeTest.status === 'Running' && (
                      <button
                        onClick={() => handleDeclareWinner(assetB.id, 'B')}
                        className="w-full text-center py-1.5 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-lg text-xs font-bold text-slate-600 hover:text-amber-900 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Declare Variation B Winner</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Please select an experiment from the sidebar list.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
