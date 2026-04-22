import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Timer, Brain, Target } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import CustomerContextCard from '../components/agent/CustomerContextCard';
import TranscriptPanel from '../components/agent/TranscriptPanel';
import AIAssistPanel from '../components/agent/AIAssistPanel';
import CallControlBar from '../components/agent/CallControlBar';
import { useApp } from '../context/useApp';
import { transcriptScript } from '../data/mockData';
import useTranscript from '../hooks/useTranscript';
import useAISuggestions from '../hooks/useAISuggestions';

const lifecycle = ['idle', 'dialing', 'active', 'on_hold', 'ended'];

const AgentConsole = () => {
  const {
    callState,
    setCallState,
    activeCustomer,
    setActiveCustomer,
    transcriptMessages,
    setTranscriptMessages,
    addTranscriptMessage,
    completeCallWithQa,
    visitBooked,
    setVisitBooked,
    setDisposition,
    lastCallSummary,
    resetCallSession,
    callRecords,
    incomingCall,
    acceptCall,
    triggerIncomingCall,
    setIncomingCall,
  } = useApp();

  const [muted, setMuted] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [activityMessage, setActivityMessage] = useState('Ready to start outbound call.');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const navigate = useNavigate();
  const callStartRef = useRef(null);
  const callEndRef = useRef(null);
  const dialingTimerRef = useRef(null);
  const aiThinkingTimerRef = useRef(null);

  const latestCustomerMessage = useMemo(() => {
    const lastCustomer = [...transcriptMessages].reverse().find((msg) => msg.sender === 'customer');
    return lastCustomer?.text || '';
  }, [transcriptMessages]);

  const dynamicSuggestions = useAISuggestions(latestCustomerMessage);

  const currentIntent = useMemo(() => {
    const text = latestCustomerMessage.toLowerCase();
    if (!text) return 'Unknown';
    if (text.includes('price')) return 'Pricing Evaluation';
    if (text.includes('location')) return 'Location Validation';
    if (text.includes('exploring')) return 'Discovery / Exploration';
    return 'General Qualification';
  }, [latestCustomerMessage]);

  const intentConfidence = useMemo(() => {
    if (!latestCustomerMessage) return 20;
    const matches = ['price', 'location', 'exploring'].filter((k) => latestCustomerMessage.toLowerCase().includes(k)).length;
    return 30 + matches * 22;
  }, [latestCustomerMessage]);

  const triggerCount = useMemo(() => {
    const text = transcriptMessages.map((m) => m.text.toLowerCase()).join(' ');
    return ['exploring', 'price', 'location'].filter((key) => text.includes(key)).length;
  }, [transcriptMessages]);

  const memoryInsight = useMemo(() => {
    const allCustomerText = transcriptMessages
      .filter((m) => m.sender === 'customer')
      .map((m) => m.text.toLowerCase())
      .join(' ');

    if (!allCustomerText) return 'Customer context is building. Waiting for intent indicators.';

    if (allCustomerText.includes('price') && allCustomerText.includes('location')) {
      return 'Customer is comparing options and cares about commute plus pricing value.';
    }
    if (allCustomerText.includes('exploring')) {
      return 'Likely early-stage buyer, engaged and open to guided recommendations.';
    }

    return 'Customer is engaged; continue qualification and move toward conversion.';
  }, [transcriptMessages]);

  const liveInsight = useMemo(() => {
    const text = latestCustomerMessage.toLowerCase();
    if (!text) return '';
    if (text.includes('location')) return 'Customer mentioned location concern. Highlight connectivity, commute corridors, and nearby landmarks.';
    if (text.includes('price')) return 'Customer raised pricing concern. Position value, payment plans, and financing support.';
    if (text.includes('exploring')) return 'Customer is exploring options. Focus on discovery and shortlist recommendation.';
    return 'Continue qualification and establish timeline urgency.';
  }, [latestCustomerMessage]);

  useEffect(() => {
    if (!(callState === 'active' || callState === 'on_hold') || !callStartRef.current) return undefined;

    const timer = setInterval(() => {
      const sec = Math.floor((Date.now() - callStartRef.current.getTime()) / 1000);
      setElapsedSeconds(sec);
    }, 1000);

    return () => clearInterval(timer);
  }, [callState]);

  useEffect(() => {
    if (!latestCustomerMessage || callState !== 'active') return undefined;

    aiThinkingTimerRef.current = setTimeout(() => {
      setAiAnalyzing(false);
    }, 450);

    return () => {
      if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current);
    };
  }, [latestCustomerMessage, callState]);

  useEffect(() => {
    return () => {
      if (dialingTimerRef.current) clearTimeout(dialingTimerRef.current);
      if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current);
    };
  }, []);

  const onNewScriptMessage = useCallback(
    (next) => {
      if (next.sender === 'customer') {
        setAiAnalyzing(true);
      }

      const now = new Date();
      addTranscriptMessage({
        id: `${next.sender}-${now.getTime()}-${Math.random().toString(16).slice(2)}`,
        sender: next.sender,
        text: next.text,
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      });
    },
    [addTranscriptMessage],
  );

  const { reset } = useTranscript({ script: transcriptScript, isRunning: callState === 'active', onMessage: onNewScriptMessage });

  const startCall = () => {
    if (!activeCustomer || callState === 'active' || callState === 'on_hold' || callState === 'dialing') return;

    setTranscriptMessages([]);
    setVisitBooked(false);
    setDisposition('');
    setAiAnalyzing(false);
    setActivityMessage(`Dialing ${activeCustomer.name}...`);
    setCallState('dialing');
    callStartRef.current = new Date();
    callEndRef.current = null;
    setElapsedSeconds(0);

    dialingTimerRef.current = setTimeout(() => {
      setCallState('active');
      setActivityMessage(`Call connected with ${activeCustomer.name}. AI assist is listening.`);
    }, 1400);
  };

  const startNewCall = () => {
    reset();
    resetCallSession();
    setActivityMessage('Ready to start outbound call.');
    setElapsedSeconds(0);
    callStartRef.current = null;
    callEndRef.current = null;
  };

  const endCall = () => {
    if (!['active', 'on_hold'].includes(callState)) return;
    const endedAt = new Date();
    callEndRef.current = endedAt;
    setCallState('ended');
    setAiAnalyzing(false);

    if (!visitBooked) setDisposition('Follow-up required');
    completeCallWithQa({ startedAt: callStartRef.current || endedAt, endedAt });

    const durationSeconds = Math.max(1, Math.floor((endedAt.getTime() - (callStartRef.current?.getTime() || endedAt.getTime())) / 1000));
    setElapsedSeconds(durationSeconds);
    setActivityMessage(`Call ended. Duration ${String(Math.floor(durationSeconds / 60)).padStart(2, '0')}:${String(durationSeconds % 60).padStart(2, '0')}.`);
    reset();
  };

  const handleHold = () => {
    if (callState !== 'active') return;
    setCallState('on_hold');
    setActivityMessage('Customer is on hold. Resume when ready.');
  };

  const handleResume = () => {
    if (callState !== 'on_hold') return;
    setCallState('active');
    setActivityMessage('Call resumed. Continue qualification.');
  };

  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const ss = String(elapsedSeconds % 60).padStart(2, '0');
  const summaryData = {
    finalIntent: currentIntent,
    keyInsight: memoryInsight,
    outcome: visitBooked ? 'Visit Booked' : 'Not Converted',
  };

  // For Demo: Trigger incoming call after 10 seconds if idle
  useEffect(() => {
    if (callState === 'idle' && !incomingCall) {
      const timer = setTimeout(() => {
        triggerIncomingCall(leads[0].id);
      }, 10000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [callState, incomingCall, triggerIncomingCall]);

  return (
    <AppShell title="Agent Console" fitViewport>
      <div className="mb-3 rounded-xl border border-[#0A2C5E]/15 bg-white px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
            <Phone size={14} className="text-[#0A2C5E]" /> {callState === 'dialing' ? 'Dialing...' : callState.replace('_', ' ')}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
            <Timer size={14} className="text-[#0A2C5E]" /> {mm}:{ss}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
            <Brain size={14} className="text-[#0A2C5E]" /> Intent: {Math.max(activeCustomer?.aiIntentScore ?? 0, intentConfidence)}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${visitBooked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Target size={14} /> Conversion: {visitBooked ? 'Booked' : 'Pending'}
          </span>
          <button 
            onClick={() => triggerIncomingCall(leads[0].id)}
            className="ml-auto px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-100"
          >
            Demo Incoming
          </button>
          <span className="text-xs text-slate-500">Supervisor may join if needed</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">{activityMessage}</p>

        <div className="mt-2 grid grid-cols-5 gap-2">
          {lifecycle.map((step) => {
            const active = lifecycle.indexOf(step) <= lifecycle.indexOf(callState);
            const isCurrent = step === callState;
            return (
              <div
                key={step}
                className={`rounded-md border px-2 py-1 text-center text-[11px] font-semibold uppercase transition-all ${
                  isCurrent
                    ? 'border-[#0A2C5E] bg-[#0A2C5E] text-white shadow-md'
                    : active
                      ? 'border-[#0A2C5E]/40 bg-[#0A2C5E]/10 text-[#0A2C5E]'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {step.replace('_', ' ')}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid h-[calc(100%-126px)] grid-cols-12 gap-3">
        <div className="col-span-3 h-full min-h-0">
          <CustomerContextCard customer={activeCustomer} />
        </div>

        <div className="col-span-5 flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <div className="min-h-0 flex-1 p-2">
            <TranscriptPanel messages={transcriptMessages} callState={callState} />
          </div>
          <CallControlBar
            callState={callState}
            muted={muted}
            onToggleMute={() => setMuted((prev) => !prev)}
            onStartCall={startCall}
            onHold={handleHold}
            onResume={handleResume}
            onBookVisit={() => setShowVisitModal(true)}
            onEndCall={endCall}
            onStartNewCall={startNewCall}
            incomingCall={incomingCall}
            onAcceptCall={acceptCall}
            onRejectCall={() => {
              setIncomingCall(null);
              setTranscriptMessages([]);
            }}
            onGoToQa={() => {
              const lastId = callRecords[0]?.id;
              if (lastId) navigate(`/qa/${lastId}`);
              else navigate('/qa');
            }}
          />
        </div>

        <div className="col-span-4 h-full min-h-0">
          <AIAssistPanel
            suggestions={callState === 'ended' ? [] : dynamicSuggestions}
            latestCustomerMessage={latestCustomerMessage}
            triggerCount={triggerCount}
            callState={callState}
            pulseKey={latestCustomerMessage}
            aiAnalyzing={aiAnalyzing}
            memoryInsight={memoryInsight}
            summaryMode={callState === 'ended'}
            summaryData={summaryData}
            liveInsight={liveInsight}
            lastCallSummary={lastCallSummary}
          />
        </div>
      </div>

      {showVisitModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-6">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-[#0A2C5E]">Site Visit Booking</h3>
            <p className="mt-2 text-sm text-slate-600">
              Visit booked for Saturday, 11:30 AM at Adani Experience Center. Confirmation shared on SMS and WhatsApp.
            </p>
            <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              Booking confirmed - high conversion opportunity marked.
            </div>
            <button
              type="button"
              className="mt-4 rounded-lg bg-[#D71920] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
              onClick={() => {
                setVisitBooked(true);
                setDisposition('Visit booked - warm lead');
                setActivityMessage('Site visit booked. Move to strong close.');
                setShowVisitModal(false);
              }}
            >
              Confirm & Continue Call
            </button>
          </div>
        </div>
      ) : null}

    </AppShell>
  );
};

export default AgentConsole;
