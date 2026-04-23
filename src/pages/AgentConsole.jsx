import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Timer, Brain, Target, Zap, Clock, TrendingUp, MessageSquare, History, PhoneCall, ShieldAlert, Bot } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import CustomerContextCard from '../components/agent/CustomerContextCard';
import TranscriptPanel from '../components/agent/TranscriptPanel';
import AIAssistPanel from '../components/agent/AIAssistPanel';
import CallControlBar from '../components/agent/CallControlBar';
import { useApp } from '../context/useApp';
import { transcriptScript, leads } from '../data/mockData';
import useTranscript from '../hooks/useTranscript';
import useAISuggestions from '../hooks/useAISuggestions';

const AgentConsole = () => {
  const {
    callState,
    setCallState,
    callType,
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
    allProjects,
    incomingCall,
    acceptCall,
    triggerIncomingCall,
    setIncomingCall,
  } = useApp();

  const [muted, setMuted] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ projectId: '', date: '', time: '' });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const navigate = useNavigate();
  const callStartRef = useRef(null);
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
    if (allCustomerText.includes('price')) return 'Customer cares about commute plus pricing value.';
    return 'Customer is engaged; continue qualification and move toward conversion.';
  }, [transcriptMessages]);

  const liveInsight = useMemo(() => {
    const text = latestCustomerMessage.toLowerCase();
    if (!text) return '';
    if (text.includes('location')) return 'Highlight connectivity and commute corridors.';
    if (text.includes('price')) return 'Position value and financing support.';
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
    aiThinkingTimerRef.current = setTimeout(() => setAiAnalyzing(false), 450);
    return () => { if (aiThinkingTimerRef.current) clearTimeout(aiThinkingTimerRef.current); };
  }, [latestCustomerMessage, callState]);

  useEffect(() => {
    if (callState === 'dialing' && !dialingTimerRef.current) {
      callStartRef.current = new Date();
      dialingTimerRef.current = setTimeout(() => setCallState('active'), 2000);
    }
    return () => {
      if (callState !== 'dialing' && dialingTimerRef.current) {
        clearTimeout(dialingTimerRef.current);
        dialingTimerRef.current = null;
      }
    };
  }, [callState, setCallState]);

  const onNewScriptMessage = useCallback(
    (next) => {
      if (next.sender === 'customer') setAiAnalyzing(true);
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
    setCallState('dialing');
    callStartRef.current = new Date();
    setElapsedSeconds(0);
    dialingTimerRef.current = setTimeout(() => setCallState('active'), 1400);
  };

  const startNewCall = () => {
    reset();
    resetCallSession();
    setElapsedSeconds(0);
    callStartRef.current = null;
  };

  const endCall = () => {
    if (!['active', 'on_hold'].includes(callState)) return;
    const endedAt = new Date();
    setCallState('ended');
    setAiAnalyzing(false);
    if (!visitBooked) setDisposition('Follow-up required');
    completeCallWithQa({ startedAt: callStartRef.current || endedAt, endedAt });
    reset();
  };

  const handleHold = () => { if (callState === 'active') setCallState('on_hold'); };
  const handleResume = () => { if (callState === 'on_hold') setCallState('active'); };

  const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const ss = String(elapsedSeconds % 60).padStart(2, '0');
  const summaryData = { finalIntent: currentIntent, keyInsight: memoryInsight, outcome: visitBooked ? 'Visit Booked' : 'Not Converted' };

  const isInCall = callState === 'active' || callState === 'on_hold' || callState === 'dialing';
  const isPreCall = callState === 'pre-call';
  const isIdle = callState === 'idle';

  return (
    <AppShell title="Agent Console" fitViewport>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Compact Top Header */}
        <div className="shrink-0 px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call Status</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${callState === 'active' ? 'bg-blue-500 animate-pulse' : isPreCall ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                   {callState === 'dialing' ? 'Dialing...' : callState.replace('-', ' ').replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex flex-col border-l border-slate-100 pl-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
              <span className="text-xs font-black text-slate-700 mt-0.5 tabular-nums">{mm}:{ss}</span>
            </div>

            <div className="flex flex-col border-l border-slate-100 pl-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intent</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <TrendingUp size={12} className="text-blue-500" />
                 <span className="text-xs font-black text-slate-800">{Math.max(activeCustomer?.aiIntentScore ?? 0, intentConfidence)}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${isPreCall ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isPreCall ? 'bg-amber-500' : 'bg-blue-500'}`} />
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isPreCall ? 'text-amber-700' : 'text-blue-700'}`}>
                {isPreCall ? 'Incoming Preview Mode' : 'AI Monitoring Active'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {isIdle ? (
            /* COMPACT LANDING STATE (IDLE) */
            <div className="flex-1 flex flex-col items-center justify-center bg-white">
              <div className="max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm">
                  <PhoneCall size={32} />
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">👋 Ready to start calling?</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                   Select a lead from your dashboard or click below to start a manual session.
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={activeCustomer ? startCall : () => navigate('/salesforce')}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-200 active:scale-95"
                  >
                    {activeCustomer ? `Call ${activeCustomer.name}` : 'Select a Lead'}
                  </button>
                </div>

                {/* Recent Activity Mini-list */}
                {callRecords && callRecords.length > 0 && (
                  <div className="mt-12 text-left bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <History size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-700">Last Lead: {callRecords[0].customer}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{callRecords[0].outcome} • {callRecords[0].date}</p>
                            </div>
                            <button 
                              onClick={() => navigate(`/qa/${callRecords[0].id}`)}
                              className="text-[10px] font-black text-blue-600 hover:underline uppercase"
                            >
                              Details
                            </button>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* PRE-CALL & ACTIVE CONSOLE STATE */
            <>
              {/* Left: Customer Profile (20%) */}
              <div className="w-[20%] shrink-0 border-r border-slate-200 bg-white p-4 overflow-y-auto">
                <CustomerContextCard customer={activeCustomer} />
              </div>

              {/* Center: Live Transcript (55-60%) */}
              <div className="flex-1 flex flex-col bg-[#F8FAFC] relative">
                {isPreCall && (
                  <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-3 animate-in slide-in-from-top-2">
                     <Bot size={14} className="text-amber-600" />
                     <p className="text-[11px] font-bold text-amber-900 uppercase tracking-tight">AI Preview: Conversation ongoing between bot and customer</p>
                  </div>
                )}
                <div className="flex-1 overflow-hidden p-4 pb-24">
                  <TranscriptPanel messages={transcriptMessages} callState={callState} />
                </div>
                
                {/* 🔘 STICKY BOTTOM ACTION BAR */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                  <CallControlBar
                    callState={callState}
                    callType={callType}
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
                      resetCallSession();
                      navigate('/salesforce');
                    }}
                    onGoToQa={() => {
                      const lastId = callRecords[0]?.id;
                      if (lastId) navigate(`/qa/${lastId}`);
                      else navigate('/qa');
                    }}
                  />
                </div>
              </div>

              {/* Right: AI Assistant (25%) */}
              <div className="w-[25%] shrink-0 border-l border-slate-200 bg-white flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-y-auto p-4">
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
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="w-full max-w-md rounded-3xl bg-white overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-amber-500 p-6 text-white flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Target size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Schedule Site Visit</h3>
                <p className="text-xs text-white/80 font-bold uppercase tracking-widest">Confirm logistics for {activeCustomer?.name}</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Project Site</label>
                <select 
                  value={bookingDetails.projectId}
                  onChange={(e) => setBookingDetails({...bookingDetails, projectId: e.target.value})}
                  className="w-full rounded-2xl border-slate-200 text-sm py-3.5 px-4 focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50"
                >
                  <option value="">Select a site...</option>
                  {allProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date</label>
                  <input 
                    type="date"
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                    className="w-full rounded-2xl border-slate-200 text-sm py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Time</label>
                  <input 
                    type="time"
                    value={bookingDetails.time}
                    onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                    className="w-full rounded-2xl border-slate-200 text-sm py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                  <strong>Note:</strong> Automated confirmation will be sent to the customer via WhatsApp once confirmed.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  disabled={!bookingDetails.projectId || !bookingDetails.date || !bookingDetails.time}
                  className="flex-1 rounded-2xl bg-amber-500 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-amber-600 shadow-xl shadow-amber-200 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95"
                  onClick={() => {
                    const project = allProjects.find(p => p.id === bookingDetails.projectId);
                    setVisitBooked(true);
                    setDisposition(`Visit scheduled for ${project?.name} on ${bookingDetails.date} at ${bookingDetails.time}`);
                    setShowVisitModal(false);
                  }}
                >
                  Confirm Booking
                </button>
                <button 
                  onClick={() => setShowVisitModal(false)} 
                  className="px-8 py-4 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AgentConsole;
