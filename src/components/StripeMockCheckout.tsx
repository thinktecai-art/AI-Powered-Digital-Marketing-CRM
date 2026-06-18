import React, { useState, useMemo, useEffect } from 'react';
import { Asset, Contact } from '../types';
import { loadStripe, Stripe as StripeType } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  CreditCard,
  CheckCircle, 
  ExternalLink, 
  Code, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Eye,
  Info,
  Layers,
  ArrowRight,
  Settings,
  X,
  Check,
  Building,
  RefreshCw
} from 'lucide-react';

interface StripeMockCheckoutProps {
  asset: Asset;
  activeFunnelPrice?: string;
  contacts: Contact[];
  onUpdateContact: (contact: Contact) => void;
  sendWebNotification: (title: string, body: string) => void;
}

// Inner Component for Real Stripe Elements Form
interface RealStripeFormProps {
  amount: number;
  productName: string;
  leadName: string;
  onPaymentSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

function RealStripeForm({ amount, productName, leadName, onPaymentSuccess, onCancel }: RealStripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Trigger checkout submission - with redirect: 'if_required' to allow keeping the SPA state intact
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred during payment.');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      } else {
        setErrorMessage(`Stripe status: ${paymentIntent?.status || 'awaiting verification'}`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred processing elements confirmation.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Secure Card Details</label>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200/60 text-[11px] flex items-center gap-1.5 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ACTION PANEL BUTTONS */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Confirming Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Authorize ${(amount / 100).toLocaleString()}.00 USD</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function StripeMockCheckout({ 
  asset, 
  activeFunnelPrice = '$5,000', 
  contacts, 
  onUpdateContact, 
  sendWebNotification 
}: StripeMockCheckoutProps) {
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(contacts[0]?.id || '');
  const [showSettings, setShowSettings] = useState(false);

  // Stripe Keys configurations status loader
  const [stripeKeys, setStripeKeys] = useState(() => {
    const localPk = localStorage.getItem('local_stripe_pk') || '';
    const localSk = localStorage.getItem('local_stripe_sk') || '';
    
    // Fallback to environment configuration compiled on client
    const envPk = ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as string) || '';

    return {
      publishableKey: localPk || envPk,
      secretKey: localSk,
      isConnected: !!(localPk || envPk),
      isUsingEnv: !!envPk && !localPk
    };
  });

  // Settings State Inputs
  const [inputPk, setInputPk] = useState(localStorage.getItem('local_stripe_pk') || '');
  const [inputSk, setInputSk] = useState(localStorage.getItem('local_stripe_sk') || '');

  // Form states for manual simulation fallback
  const [stripeForm, setStripeForm] = useState({
    email: '',
    cardNum: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '123',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentDoneTxId, setPaymentDoneTxId] = useState('');

  // Elements Integration states
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [elementsLoading, setElementsLoading] = useState(false);
  const [elementsError, setElementsError] = useState<string | null>(null);

  // Initialize loadStripe only if key is configure properly
  const stripePromise = useMemo(() => {
    if (stripeKeys.publishableKey && stripeKeys.publishableKey.trim() !== '') {
      return loadStripe(stripeKeys.publishableKey.trim());
    }
    return null;
  }, [stripeKeys.publishableKey]);

  // Parse deal price to numeric cents
  const parseNumericPrice = (pStr: string): number => {
    const numbers = pStr.replace(/[^0-9]/g, '');
    return Number(numbers) || 1500;
  };

  const finalPriceValue = parseNumericPrice(activeFunnelPrice);
  const amountInCents = finalPriceValue * 100;

  const embedCodeString = `<!-- Stripe Checkout Embedded Anchor Link -->
<a href="https://buy.stripe.com/mock_live_ai_crm_${asset.id}" 
   class="stripe-payment-link" 
   style="background:#0055ff; color:#fff; padding:10px 20px; border-radius:8px; font-weight:bold; text-decoration:none;">
   Buy ${asset.title.replace('Copy for ', '')}
</a>`;

  const handleOpenCheckout = async () => {
    setPaymentDone(false);
    setPaymentDoneTxId('');
    setClientSecret(null);
    setElementsError(null);

    const currentLead = contacts.find(c => c.id === selectedLeadId) || contacts[0];
    if (currentLead) {
      setStripeForm({
        email: currentLead.email,
        cardNum: '4242 4242 4242 4242',
        cardExp: '12/28',
        cardCvc: '424',
        cardName: currentLead.name
      });
    }

    setIsCheckoutOpen(true);

    // If Stripe credentials are set, automatically start loading the PaymentIntent
    if (stripeKeys.isConnected) {
      setElementsLoading(true);
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amountInCents,
            currency: 'usd',
            productName: asset.title.replace('Copy for ', ''),
            leadId: currentLead?.id || 'anonymous_test',
            customSecretKey: stripeKeys.secretKey || undefined
          })
        });

        const data = await response.json();
        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setElementsError(data.message || data.error || 'Failed to create Stripe Payment Intent');
        }
      } catch (err: any) {
        setElementsError('Connection error: Make sure node server is fully online and accessible.');
        console.error('Payment intent generation error:', err);
      } finally {
        setElementsLoading(false);
      }
    }
  };

  const saveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('local_stripe_pk', inputPk.trim());
    localStorage.setItem('local_stripe_sk', inputSk.trim());

    const envPk = ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as string) || '';
    const activePk = inputPk.trim() || envPk;

    setStripeKeys({
      publishableKey: activePk,
      secretKey: inputSk.trim(),
      isConnected: !!activePk,
      isUsingEnv: !!envPk && !inputPk.trim()
    });

    setShowSettings(false);
    sendWebNotification("🔌 Stripe Configured", "Saved custom Stripe API key credentials locally.");
  };

  const clearKeys = () => {
    localStorage.removeItem('local_stripe_pk');
    localStorage.removeItem('local_stripe_sk');
    setInputPk('');
    setInputSk('');

    const envPk = ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as string) || '';

    setStripeKeys({
      publishableKey: envPk,
      secretKey: '',
      isConnected: !!envPk,
      isUsingEnv: !!envPk
    });
    sendWebNotification("🔌 Stripe Disconnected", "Custom keys cleared. Reverted to default sandbox.");
  };

  // Transaction Handler for both elements success & manual simulation
  const handlePaymentSuccess = (transactionId: string) => {
    setIsProcessing(false);
    setPaymentDoneTxId(transactionId);
    setPaymentDone(true);

    const currentLead = contacts.find(c => c.id === selectedLeadId) || contacts[0];
    if (currentLead) {
      const paymentLog = {
        id: `stripe-pay-${Date.now()}`,
        type: 'Payment' as const,
        notes: `💳 Real Stripe Payment Complete: Charged $${finalPriceValue.toLocaleString()} for product "${asset.title?.replace('Copy for ', '')}". Transaction ID: ${transactionId}`,
        timestamp: new Date().toISOString()
      };

      const currentLogs = currentLead.activityLogs || [];
      const updatedLead: Contact = {
        ...currentLead,
        funnelStage: 'Upsell', 
        dealValue: currentLead.dealValue + finalPriceValue,
        lastActivity: paymentLog.timestamp,
        notes: `💳 Stripe Checkout: Completed Purchase of ${asset.title.replace('Copy for ', '')} ($${finalPriceValue.toLocaleString()})`,
        activityLogs: [...currentLogs, paymentLog]
      };

      onUpdateContact(updatedLead);

      sendWebNotification(
        "💰 Real Stripe Payment Approved!",
        `Lead ${currentLead.name} paid $${finalPriceValue.toLocaleString()}. Transaction Synchronized.`
      );
    }
  };

  // Manual fallback checkout simulation
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const simulatedTxId = `ch_mock_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      handlePaymentSuccess(simulatedTxId);
    }, 2000);
  };

  return (
    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4.5 space-y-4 shadow-sm text-xs mt-3">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5 font-bold font-sans">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stripe Payment Integration</span>
          </div>

          {/* Connected Badge */}
          {stripeKeys.isConnected ? (
            <span className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded tracking-wide font-mono uppercase flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Stripe Connected
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[9px] px-1.5 py-0.5 rounded tracking-wide font-mono uppercase">
              Demo Sandbox Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500 font-medium text-[11px] block bg-white px-2 py-0.5 rounded border border-emerald-100">
            Price Point: {activeFunnelPrice}
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-emerald-100 text-slate-500 hover:text-emerald-800 rounded-lg transition-all"
            title="Configure Stripe Client API Keys"
          >
            <Settings className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* STRIPE SECRET SETTINGS FORM */}
      {showSettings && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner animate-fade-in text-[11px] leading-relaxed text-slate-600">
          <div className="flex items-center justify-between border-b pb-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-slate-500" /> Connect Your Stripe Account
            </span>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p>
            Connect your own Stripe developer credentials to activate live or test-mode Stripe Elements. 
            API keys are saved <strong>locally</strong> inside your browser and never transit outside of this application.
          </p>

          <form onSubmit={saveKeys} className="space-y-3 pt-1 text-slate-700">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Stripe Publishable Key (pk_test...)</label>
              <input
                type="text"
                value={inputPk}
                onChange={(e) => setInputPk(e.target.value)}
                placeholder="pk_test_51..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Stripe Secret Key (sk_test...)</label>
              <input
                type="password"
                value={inputSk}
                onChange={(e) => setInputSk(e.target.value)}
                placeholder="sk_test_51..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={clearKeys}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-all cursor-pointer font-semibold uppercase text-[10px]"
              >
                Clear / Disconnect Key
              </button>
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer text-xs"
              >
                Connect Credentials
              </button>
            </div>
          </form>
        </div>
      )}

      <p className="text-slate-600 leading-relaxed">
        Verify your funnel conversion mechanics. Use standard embeds to integrate CTAs, or process card checkouts instantly within the app.
      </p>

      {/* LEAD SELECTOR FOR TEST TARGETS */}
      <div className="bg-white border border-emerald-100 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 px-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-bold uppercase">Simulation Target</div>
          <span className="text-slate-500">Select active sandbox contact:</span>
        </div>
        <select
          value={selectedLeadId}
          onChange={(e) => setSelectedLeadId(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs rounded-lg p-1.5 focus:outline-none"
        >
          {contacts.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.funnelStage} Stage)</option>
          ))}
        </select>
      </div>

      {/* CTA BUTTONS ROW */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={handleOpenCheckout}
          className="bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{stripeKeys.isConnected ? 'Launch Real Stripe Elements' : 'Launch Mock Stripe Flow'}</span>
        </button>

        <button
          onClick={() => setShowEmbedCode(!showEmbedCode)}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Code className="w-3.5 h-3.5 text-slate-500" />
          <span>{showEmbedCode ? 'Hide HTML Code' : 'Embed Payment Link'}</span>
        </button>
      </div>

      {/* COLLAPSIBLE EMBED SNIPPET */}
      {showEmbedCode && (
        <div className="space-y-2 bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-950 font-mono text-[10px] space-y-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="text-emerald-400 font-bold">🎯 Product CTA Anchor</span>
            <span className="text-slate-500 font-mono tracking-widest uppercase">Direct Embed</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed select-all text-slate-300">{embedCodeString}</pre>
          <p className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 font-sans">
            Copy and paste this HTML block into your Landing Pages code config.
          </p>
        </div>
      )}

      {/* STRIPE CHECKOUT EXPERIENTIAL OVERLAY MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#f8f9fa] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh] font-sans text-xs">
            
            {/* LEFT AREA: STRIPE ORDER DETAILS */}
            <div className="w-full md:w-5/12 bg-slate-900 text-slate-300 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-lg font-black tracking-tighter text-xs">S</div>
                  <span className="text-sm font-bold text-white tracking-wider">
                    STRIPE <span className="text-[10px] text-slate-500 uppercase font-mono bg-slate-800 px-1 py-0.5 rounded ml-1">
                      {stripeKeys.isConnected ? 'Real Elements' : 'Simulation'}
                    </span>
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-slate-500 text-xs font-mono tracking-wider uppercase block">Immediate Purchase</span>
                  <h3 className="text-lg font-bold text-white leading-snug">{asset.title.replace('Copy for ', '')}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Configured for active consulting / service products.</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Subtotal</span>
                    <span>${finalPriceValue.toLocaleString()}.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Processing Surcharge</span>
                    <span className="text-emerald-400 font-mono font-bold">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-slate-800/80">
                    <span>Amount Due</span>
                    <span className="text-emerald-400">${finalPriceValue.toLocaleString()}.00 USD</span>
                  </div>
                </div>

                {stripeKeys.isConnected && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl space-y-1">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider block font-mono">🔑 Active Stripe Credentials</span>
                    <p className="text-[10px] text-slate-400 font-mono leading-normal break-all">
                      PK: {stripeKeys.publishableKey.slice(0, 16)}...<br/>
                      SK: {stripeKeys.secretKey ? '••••••••' : 'Using App ENV'}
                    </p>
                  </div>
                )}
              </div>

              {/* LOCK FOOTER */}
              <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 fill-emerald-950/40" />
                  <span>Guaranteed Secure SDK checkout environment.</span>
                </div>
                <p>
                  {stripeKeys.isConnected 
                    ? 'Card payment details are sent securely directly to Stripe servers.' 
                    : 'Mock account cleared internally. Actual cards will not be billed.'}
                </p>
              </div>
            </div>

            {/* RIGHT AREA: CHECKOUT FORM CONTAINER */}
            <div className="w-full md:w-7/12 bg-white p-6 md:p-8 flex flex-col justify-between">
              
              {/* HEADER CONTROL */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> 
                  <span>{stripeKeys.isConnected ? 'Rendered Stripe Elements' : 'Enter Card Credentials'}</span>
                </span>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-mono text-xs uppercase px-2 py-0.5 cursor-pointer font-bold"
                >
                  Cancel
                </button>
              </div>

              {paymentDone ? (
                /* SUCCESS SCREEN */
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8 animate-fade-in">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm animate-pulse">
                    <CheckCircle className="w-8 h-8 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Payment Processed Successfully!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Authorized Charge of ${finalPriceValue.toLocaleString()}.00 completed. Lead is currently advanced to Upsell Stage.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border max-w-sm text-left font-mono text-[10px] space-y-1 text-slate-600">
                    <div><strong>Transaction Id:</strong> {paymentDoneTxId}</div>
                    <div><strong>Destination CRM:</strong> synchronized to Firestore</div>
                    <div><strong>Status:</strong> Charged & Advanced to Upsell stage</div>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="bg-emerald-950 hover:bg-slate-900 text-white font-bold text-xs py-2 px-6 rounded-xl transition-all cursor-pointer"
                  >
                    Return to CRM Panel
                  </button>
                </div>
              ) : (
                /* CHECKOUT FORMS */
                <div className="flex-1 flex flex-col justify-between">
                  {stripeKeys.isConnected ? (
                    /* REAL ELEMENTS PAYMENT FORM */
                    <div className="space-y-3.5">
                      {elementsLoading && (
                        <div className="text-center py-10 space-y-3 text-slate-500">
                          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                          <p className="font-mono text-[11px]">Creating Secure Payment Intent on Server...</p>
                        </div>
                      )}

                      {elementsError && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span>Stripe SDK Failure</span>
                          </div>
                          <p className="text-[11px] leading-relaxed font-mono">{elementsError}</p>
                          <button
                            onClick={handleOpenCheckout}
                            className="bg-red-200/50 hover:bg-red-200 text-red-700 text-[10px] uppercase font-bold py-1 px-2.5 rounded transition-all cursor-pointer"
                          >
                            Retry Request
                          </button>
                        </div>
                      )}

                      {clientSecret && stripePromise && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <RealStripeForm
                            amount={amountInCents}
                            productName={asset.title.replace('Copy for ', '')}
                            leadName={stripeForm.cardName}
                            onPaymentSuccess={handlePaymentSuccess}
                            onCancel={() => setIsCheckoutOpen(false)}
                          />
                        </Elements>
                      )}
                    </div>
                  ) : (
                    /* MANUAL BACK_UP SIMULATOR IF UNCONNECTED */
                    <form onSubmit={handleSimulatePayment} className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3.5">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email address</label>
                          <input 
                            type="email"
                            value={stripeForm.email}
                            onChange={(e) => setStripeForm({ ...stripeForm, email: e.target.value })}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="customer@domain.com"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card information</label>
                          <div className="relative">
                            <input 
                              type="text"
                              value={stripeForm.cardNum}
                              onChange={(e) => setStripeForm({ ...stripeForm, cardNum: e.target.value })}
                              required
                              className="w-full bg-slate-50 border border-slate-200 rounded-t-xl p-2.5 text-xs text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="4242 4242 4242 4242"
                            />
                            <div className="grid grid-cols-2">
                              <input 
                                type="text"
                                value={stripeForm.cardExp}
                                onChange={(e) => setStripeForm({ ...stripeForm, cardExp: e.target.value })}
                                required
                                className="w-full bg-slate-50 border-r border-t border-slate-200 p-2.5 text-xs text-slate-700 font-mono rounded-bl-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="MM / YY"
                              />
                              <input 
                                type="text"
                                value={stripeForm.cardCvc}
                                onChange={(e) => setStripeForm({ ...stripeForm, cardCvc: e.target.value })}
                                required
                                className="w-full bg-slate-50 border-t border-slate-200 p-2.5 text-xs text-slate-700 font-mono rounded-br-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="CVC"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name on card</label>
                          <input 
                            type="text"
                            value={stripeForm.cardName}
                            onChange={(e) => setStripeForm({ ...stripeForm, cardName: e.target.value })}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Johnathan Doe"
                          />
                        </div>

                        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex gap-2.5 text-amber-800 leading-relaxed text-[11px]">
                          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Demo sandbox trigger active.</strong> You can simulate transaction advancement directly, or click the settings cog ⚙️ in the upper right to connect real details.
                          </div>
                        </div>
                      </div>

                      {/* ACTION SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Authorizing Clearing House...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Simulate Checkout of ${finalPriceValue.toLocaleString()}.00 USD</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
