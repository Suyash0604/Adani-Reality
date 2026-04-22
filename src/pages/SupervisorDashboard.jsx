import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, 
  MessageSquare, 
  Users, 
  Mic, 
  MicOff, 
  LogOut, 
  AlertCircle, 
  TrendingDown, 
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  PhoneIncoming,
  PhoneOutgoing,
  BarChart3,
  Target,
  Clock,
  ArrowUpRight,
  PieChart,
  BrainCircuit,
  Activity,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  LayoutDashboard,
  Layers,
  Search
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { supervisorAgents, supervisorKpis, campaignData } from '../data/mockData';
import { Plus, Upload, Play, FileText, Check, Calendar, DollarSign, Home } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/appContextObject';

const kpiCards = [
  { label: 'Active Calls', value: supervisorKpis.activeCalls },
  { label: 'Avg Handle Time', value: supervisorKpis.avgHandleTime },
  { label: 'Site Visits Booked', value: supervisorKpis.siteVisitsBooked },
  { label: 'Avg Intent Score', value: `${supervisorKpis.avgIntentScore}/100` },
];

const mockTranscripts = [
  { speaker: 'Customer', text: 'I am looking at properties in North Ahmedabad.' },
  { speaker: 'Agent', text: 'Great! We have some premium options in Atelier Greens.' },
  { speaker: 'Customer', text: 'What is the current possession timeline?' },
  { speaker: 'Agent', text: 'It is scheduled for December 2025. Would you like a site visit?' },
  { speaker: 'Customer', text: 'I need to check my schedule first.' },
  { speaker: 'Agent', text: 'Understood. We have a special festive offer valid this weekend.' },
];

const SupervisorDashboard = () => {
  // Global Floor State
  const [activeIntervention, setActiveIntervention] = useState(null); // 'monitor' | 'whisper' | 'barge'
  const [targetAgentId, setTargetAgentId] = useState(null);
  const [whisperText, setWhisperText] = useState('');
  const [whisperHistory, setWhisperHistory] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // Real-time Agent Data (for demo updates)
  const [agentsData, setAgentsData] = useState(supervisorAgents);

  const { 
    allProjects, 
    outboundCampaigns, 
    addProject, 
    addCampaign, 
    updateCampaignStatus,
    supervisorView: activeView,
    setSupervisorView: setActiveView
  } = useContext(AppContext);

  // Navigation State
  const navigate = useNavigate();

  // Modal State
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  // Form States
  const [newProject, setNewProject] = useState({ 
    name: '', 
    location: '', 
    file: null
  });
  const [newCampaign, setNewCampaign] = useState({ title: '', projectId: '', file: null });

  // Reaction States
  const [isAdapting, setIsAdapting] = useState(false);
  const [lastWhisperReaction, setLastWhisperReaction] = useState(null);

  // Intervention Timers
  const [interventionDuration, setInterventionDuration] = useState(0);
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (activeIntervention) {
      timer = setInterval(() => {
        setInterventionDuration(prev => prev + 1);
      }, 1000);
    } else {
      setInterventionDuration(0);
    }
    return () => clearInterval(timer);
  }, [activeIntervention]);

  useEffect(() => {
    let transcriptTimer;
    if (activeIntervention === 'monitor') {
      transcriptTimer = setInterval(() => {
        setTranscriptIndex(prev => (prev + 1) % mockTranscripts.length);
      }, 3000);
    }
    return () => clearInterval(transcriptTimer);
  }, [activeIntervention]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleIntervention = (type, agentId, agentName) => {
    setActiveIntervention(type);
    setTargetAgentId(agentId);
    setTranscriptIndex(0);
    setWhisperHistory([]);
    setLastWhisperReaction(null);
    
    if (type === 'monitor') addToast(`Started monitoring ${agentName}`, 'info');
    if (type === 'whisper') addToast(`Whisper mode active for ${agentName}`, 'warning');
    if (type === 'barge') addToast(`Joined ${agentName}'s call`, 'error');
  };

  const stopIntervention = () => {
    const agentName = agentsData.find(a => a.id === targetAgentId)?.name;
    if (activeIntervention === 'whisper') addToast(`Whisper session ended for ${agentName}`, 'info');
    if (activeIntervention === 'monitor') addToast(`Monitoring stopped for ${agentName}`, 'info');
    setActiveIntervention(null);
    setTargetAgentId(null);
    setWhisperText('');
    setIsAdapting(false);
  };

  const sendWhisper = (agentName) => {
    if (!whisperText.trim()) return;
    const msg = whisperText.trim();
    setWhisperHistory(prev => [...prev, msg]);
    setWhisperText('');
    addToast(`Whisper sent to ${agentName}`, 'success');
    
    // Simulate Agent Adaptation
    setIsAdapting(true);
    setTimeout(() => {
      setIsAdapting(false);
      setLastWhisperReaction("We also have flexible pricing and limited availability for south-facing units...");
      
      // Improve score after successful whisper
      setAgentsData(prev => prev.map(a => {
        if (a.id === targetAgentId) {
          const newScore = Math.min(a.scriptScore + 4, 100);
          return { ...a, scriptScore: newScore, alert: false };
        }
        return a;
      }));
    }, 2000);
  };

  const targetAgentInfo = agentsData.find(a => a.id === targetAgentId);

  const downloadSample = () => {
    const content = "Name,Mobile no\nJohn Doe,9876543210\nJane Smith,9123456789";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Campaign sample downloaded', 'info');
  };

  const downloadProjectSample = () => {
    const content = "Project Name,Location,Specifications,Unit Types,Total Area\nAdani Western Heights,Mumbai,Premium 4BHK,3/4 BHK,2500 sqft";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Project sample downloaded', 'info');
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    const id = `proj-${allProjects.length + 1}`;
    addProject({ ...newProject, id });
    setShowCreateProject(false);
    setNewProject({ name: '', location: '', file: null });
    addToast('Project created successfully', 'success');
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const id = `ob-${outboundCampaigns.length + 1}`;
    const project = allProjects.find(p => p.id === newCampaign.projectId);
    const title = `${newCampaign.title} (${project?.name || 'General'})`;
    
    const newCamp = {
      id,
      title,
      callsMade: 0,
      connectRate: 0,
      conversions: 0,
      status: 'Ready',
      details: {
        stats: { total: 0, reached: 0, failed: 0 },
        metrics: { siteVisits: 0, dropped: 0 },
        aiInsights: 'Campaign ready to start',
        leadQuality: 0
      }
    };
    
    addCampaign(newCamp);
    setShowCreateCampaign(false);
    setNewCampaign({ title: '', projectId: '', file: null });
    addToast('Campaign launched successfully', 'success');
  };

  const startCalling = (campaignId) => {
    updateCampaignStatus(campaignId, 'Calling', Math.floor(Math.random() * 10));
    addToast('Dialer started for campaign', 'success');
  };

  return (
    <AppShell title={activeView === 'agent' ? "Live Command Center" : "Campaign Intelligence"}>
      {/* View Toggle */}
      <div className="mb-6 flex justify-start">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveView('agent')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeView === 'agent' 
              ? 'bg-white text-[#0A2C5E] shadow-sm ring-1 ring-slate-200' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users size={16} />
            Agent View
          </button>
          <button
            onClick={() => setActiveView('campaign')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeView === 'campaign' 
              ? 'bg-white text-[#0A2C5E] shadow-sm ring-1 ring-slate-200' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers size={16} />
            Campaign View
          </button>
        </div>
        {activeView === 'campaign' && (
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Plus size={14} className="text-[#D71920]" />
              New Project
            </button>
            <button
              onClick={() => setShowCreateCampaign(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A2C5E] rounded-xl text-xs font-bold text-white hover:bg-[#0c3875] transition-all shadow-md"
            >
              <Plus size={14} className="text-emerald-400" />
              New Campaign
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Feed</span>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`animate-in slide-in-from-right-8 rounded-xl px-4 py-3 text-sm font-bold shadow-2xl flex items-center gap-2 border ${
            t.type === 'error' ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/40' : 
            t.type === 'warning' ? 'bg-amber-500 text-white border-amber-400 shadow-amber-900/40' : 
            t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/40' :
            'bg-[#0A2C5E] text-white border-slate-700 shadow-[#0A2C5E]/40'
          }`}>
            <Zap size={14} className="animate-pulse" />
            {t.message}
          </div>
        ))}
      </div>

      {/* Global Floor State Banner */}
      <section className={`mb-6 transition-all duration-500 rounded-2xl p-4 flex items-center justify-between border shadow-lg ${
        activeIntervention === 'barge' ? 'bg-rose-50 border-rose-200 animate-pulse' :
        activeIntervention === 'whisper' ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-400/20 shadow-amber-100' :
        activeIntervention === 'monitor' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-400/20 shadow-blue-100' :
        'bg-white border-slate-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-2.5 transition-all duration-300 ${
            activeIntervention ? 'bg-white shadow-md scale-110' : 'bg-slate-100'
          }`}>
            {activeIntervention === 'barge' ? <Users className="text-rose-600" /> :
             activeIntervention === 'whisper' ? <MessageSquare className="text-amber-500 animate-bounce" /> :
             activeIntervention === 'monitor' ? <Radio className="text-blue-600 animate-pulse" /> :
             <Radio className="text-slate-400" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase flex items-center gap-2">
              {activeIntervention ? (
                <>
                  <span className={
                    activeIntervention === 'monitor' ? 'text-blue-600' : 
                    activeIntervention === 'whisper' ? 'text-amber-600' : 
                    'text-rose-600'
                  }>
                    {activeIntervention === 'monitor' ? '👂 MONITORING ACTIVE' : 
                     activeIntervention === 'whisper' ? '💬 WHISPER MODE' : 
                     '🚀 BARGE-IN ACTIVE'}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600">Agent: {targetAgentInfo?.name}</span>
                  <span className="text-slate-300">|</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-tighter text-white ${
                    activeIntervention === 'monitor' ? 'bg-blue-600' : 
                    activeIntervention === 'whisper' ? 'bg-amber-600' : 
                    'bg-rose-600'
                  }`}>
                    {formatTime(interventionDuration)}
                  </span>
                </>
              ) : "Command Center Idle"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {activeIntervention === 'barge' ? "You are speaking in the 3-way conference." :
               activeIntervention === 'whisper' ? `Private coaching active for ${targetAgentInfo?.name} • Guidance history enabled` :
               activeIntervention === 'monitor' ? "Silent Listening Mode • Real-time transcript preview enabled" :
               "All agents operating normally."}
            </p>
          </div>
        </div>
        
        {activeIntervention && (
          <button 
            onClick={stopIntervention}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition-all active:scale-95 shadow-md group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Stop Intervention
          </button>
        )}
      </section>

      {/* KPI Overview */}
      <section className={`grid grid-cols-4 gap-4 mb-8 transition-all duration-500 ${activeIntervention ? 'opacity-40 grayscale-[0.5] pointer-events-none scale-95' : 'opacity-100'}`}>
        {activeView === 'agent' ? (
          kpiCards.map((card) => (
            <article key={card.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{card.label}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-3xl font-bold text-[#0A2C5E]">{card.value}</p>
                <div className="h-2 w-12 rounded-full bg-slate-50 overflow-hidden">
                  <div className="h-full w-2/3 bg-[#0A2C5E] opacity-20" />
                </div>
              </div>
            </article>
          ))
        ) : (
          <>
            {[
              { label: 'Total Inbound Calls', value: campaignData.kpis.totalInbound, icon: <PhoneIncoming className="text-blue-600" size={16} /> },
              { label: 'Total Outbound Calls', value: campaignData.kpis.totalOutbound, icon: <PhoneOutgoing className="text-purple-600" size={16} /> },
              { label: 'Site Visits Booked', value: campaignData.kpis.siteVisitsBooked, icon: <Target className="text-emerald-600" size={16} /> },
              { label: 'Active Campaigns', value: campaignData.kpis.activeCampaigns, icon: <Activity className="text-amber-600" size={16} /> },
            ].map((card) => (
              <article key={card.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{card.label}</p>
                  {card.icon}
                </div>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-3xl font-bold text-[#0A2C5E]">{card.value}</p>
                  <div className="h-1 w-12 rounded-full bg-slate-50 overflow-hidden">
                    <div className="h-full w-4/5 bg-[#0A2C5E] opacity-10" />
                  </div>
                </div>
              </article>
            ))}
          </>
        )}
      </section>

      {activeView === 'agent' ? (
        <div className="grid grid-cols-1 gap-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-[#0A2C5E]" />
            Active Calls
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentsData.map((agent) => {
              const isTarget = targetAgentId === agent.id;
              const otherActive = activeIntervention && !isTarget;
              const cardMode = isTarget ? activeIntervention : null;
              
              return (
                <article
                  key={agent.id}
                  onClick={() => !activeIntervention && setSelectedAgent(agent)}
                  className={`group bg-white rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    cardMode === 'barge' ? 'border-rose-500 bg-rose-50/50 shadow-rose-200 shadow-xl scale-[1.02] z-20' :
                    cardMode === 'whisper' ? 'border-amber-400 bg-amber-50 shadow-amber-200 shadow-2xl scale-[1.05] z-20' :
                    cardMode === 'monitor' ? 'border-blue-500 bg-blue-50 shadow-blue-200 shadow-2xl scale-105 z-20' :
                    otherActive ? 'opacity-40 blur-[1px] border-slate-100 grayscale-[0.4] scale-95' :
                    'border-slate-100 hover:border-blue-200 shadow-sm cursor-pointer'
                  }`}
                >
                  {/* Visual Status Indicator */}
                  {cardMode === 'monitor' && <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-500 animate-pulse" />}
                  {cardMode === 'whisper' && <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-500 animate-pulse" />}
                  {cardMode === 'barge' && <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-500 animate-pulse" />}


                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#0A2C5E] group-hover:text-[#D71920] transition-colors">{agent.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{agent.status} • {agent.duration}</p>
                      </div>
                      <div className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                        agent.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {agent.sentiment}
                      </div>
                    </div>

                    {/* AI Pulse / Whisper Feedback */}
                    {cardMode === 'whisper' ? (
                      <div className="space-y-4 mb-4 animate-in fade-in zoom-in-95 duration-500">
                          {/* Status Message */}
                          <div className={`rounded-xl px-3 py-2 flex items-center gap-3 transition-colors ${
                            isAdapting ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isAdapting ? <Sparkles size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            <span className="text-[11px] font-bold">
                              {isAdapting ? "Agent adapting response..." : "Agent improved response based on coaching"}
                            </span>
                          </div>
                          
                          {/* Reaction Transcript */}
                          {lastWhisperReaction && (
                            <div className="bg-white border border-amber-100 rounded-xl p-3 shadow-inner italic">
                              <div className="flex items-center gap-2 mb-1">
                                <Radio size={10} className="text-blue-400" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Live Output</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">"{lastWhisperReaction}"</p>
                            </div>
                          )}

                          {/* Whisper History */}
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Session Guidance</p>
                            {whisperHistory.map((m, i) => (
                              <div key={i} className="bg-amber-600 text-white text-[10px] px-3 py-2 rounded-xl rounded-tr-none ml-6 font-medium shadow-sm">
                                {m}
                              </div>
                            ))}
                          </div>
                      </div>
                    ) : cardMode === 'monitor' ? (
                      <div className="bg-blue-600 rounded-xl p-3 mb-4 text-white shadow-inner animate-in fade-in duration-500">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Radio size={12} className="animate-pulse" />
                              <span className="text-[10px] font-bold tracking-widest uppercase">Live Transcript</span>
                            </div>
                            <div className="flex gap-0.5">
                              <div className="w-0.5 h-3 bg-white/40 animate-[bounce_1s_infinite_0ms]" />
                              <div className="w-0.5 h-4 bg-white animate-[bounce_1.2s_infinite_200ms]" />
                              <div className="w-0.5 h-2 bg-white/60 animate-[bounce_0.8s_infinite_400ms]" />
                            </div>
                          </div>
                          <div className="space-y-1 mt-2">
                            <p className="text-[8px] font-bold text-blue-200 uppercase tracking-wider">
                              {mockTranscripts[transcriptIndex].speaker}
                            </p>
                            <p className="text-xs font-medium leading-relaxed animate-in slide-in-from-bottom-1">
                              "{mockTranscripts[transcriptIndex].text}"
                            </p>
                          </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles size={12} className="text-[#0A2C5E]" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Live AI Insight</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                          {agent.alert ? "Customer raised pricing objection. Agent is struggling to pivot to value-prop." : "Customer is showing high intent. Guide agent to confirm site visit."}
                        </p>
                      </div>
                    )}

                    {/* Progress & Risk */}
                    <div className="space-y-3 mb-6">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                          <span>Script Adherence</span>
                          <span className={`transition-colors duration-1000 ${isTarget ? 'text-[#D71920]' : 'text-[#0A2C5E]'}`}>
                            {agent.scriptScore}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-[1500ms] ease-out ${
                            cardMode === 'whisper' ? 'bg-amber-500' : 
                            cardMode === 'monitor' ? 'bg-blue-500' : 
                            'bg-[#0A2C5E]'
                          }`} style={{ width: `${agent.scriptScore}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Intervention Controls */}
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={activeIntervention && !isTarget}
                        onClick={() => handleIntervention('monitor', agent.id, agent.name)}
                        className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-8 transition-all w-full ${
                          cardMode === 'monitor' ? 'bg-blue-600 text-white shadow-blue-300 shadow-md ring-2 ring-white/20' : 
                          activeIntervention && !isTarget ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-0' :
                          'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        <Radio size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Monitor Live Session</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Glow Overlay for Active State */}
                  {isTarget && (
                    <div className={`absolute top-0 right-0 p-2 animate-pulse`}>
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        cardMode === 'barge' ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' :
                        cardMode === 'whisper' ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' :
                        'bg-blue-500 shadow-[0_0_12px_#3b82f6]'
                      }`} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        /* CAMPAIGN VIEW LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* INBOUND COLUMN */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PhoneIncoming size={20} className="text-blue-600" />
                </div>
                Inbound Campaigns
              </h2>
              <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-tighter">Live Status</span>
            </div>

            <div className="space-y-4">
              {campaignData.inbound.map((campaign) => {
                return (
                  <div 
                    key={campaign.id}
                    onClick={() => navigate(`/campaigns/inbound/${campaign.id}`)}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer group hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-800">{campaign.title}</h3>
                          {campaign.resolutionRate > 90 && (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                              Top Performer 🏆
                            </span>
                          )}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="p-3 bg-blue-50/50 rounded-xl">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Resolution</p>
                          <p className="text-lg font-bold text-blue-700">{campaign.resolutionRate}%</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                          <p className="text-lg font-bold text-slate-700">{campaign.pendingCases}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${campaign.criticalEscalations > 0 ? 'bg-rose-50' : 'bg-slate-50'}`}>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${campaign.criticalEscalations > 0 ? 'text-rose-400' : 'text-slate-400'}`}>Critical</p>
                          <p className={`text-lg font-bold ${campaign.criticalEscalations > 0 ? 'text-rose-600' : 'text-slate-700'}`}>{campaign.criticalEscalations}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                           <Activity size={10} /> {campaign.callsToday} Calls Today
                         </span>
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Operational Details</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OUTBOUND COLUMN */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PhoneOutgoing size={20} className="text-purple-600" />
                </div>
                Outbound Campaigns
              </h2>
              <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-1 rounded-full uppercase tracking-tighter">Live Status</span>
            </div>

            <div className="space-y-4">
              {outboundCampaigns.map((campaign) => {
                const isCalling = campaign.status === 'Calling';
                return (
                  <div 
                    key={campaign.id}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-purple-200 transition-all duration-300 overflow-hidden group hover:shadow-lg hover:shadow-purple-500/5 relative"
                  >
                    <div className="p-5" onClick={() => navigate(`/campaigns/outbound/${campaign.id}`)}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-800">{campaign.title}</h3>
                          {campaign.conversions > 30 && (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                               High Efficiency 🚀
                            </span>
                          )}
                          {isCalling && (
                            <span className="bg-rose-100 text-rose-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1 animate-pulse">
                               Active Calling 📞
                            </span>
                          )}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className={`p-3 rounded-xl ${campaign.connectRate < 50 && campaign.callsMade > 0 ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-purple-50/50'}`}>
                          <div className="flex justify-between items-center mb-0.5">
                            <p className={`text-[9px] font-black uppercase tracking-widest ${campaign.connectRate < 50 && campaign.callsMade > 0 ? 'text-rose-400' : 'text-purple-400'}`}>Connect Rate</p>
                            {campaign.connectRate < 50 && campaign.callsMade > 0 && <AlertCircle size={10} className="text-rose-500 animate-pulse" />}
                          </div>
                          <p className={`text-lg font-bold ${campaign.connectRate < 50 && campaign.callsMade > 0 ? 'text-rose-600' : 'text-purple-700'}`}>{campaign.connectRate}%</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl relative overflow-hidden group/conv">
                          {campaign.conversions > 30 && <div className="absolute top-0 right-0 p-1"><Sparkles size={10} className="text-emerald-400" /></div>}
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Conversions</p>
                          <p className="text-lg font-bold text-emerald-700">{campaign.conversions}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                           <Activity size={10} /> {campaign.callsMade} Calls Made
                         </span>
                         {!isCalling && (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               startCalling(campaign.id);
                             }}
                             className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D71920] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                           >
                             <Play size={10} fill="currentColor" /> Start Calling
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Agent Details Modal (Placeholder same as before but uses local agentsData) */}
      {selectedAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col">
            <div className="bg-[#0A2C5E] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{selectedAgent.name}</h3>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-1">Live Call Analysis • Customer: {selectedAgent.customer}</p>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="rounded-full hover:bg-white/10 p-2 transition-colors"
                type="button"
              >
                <LogOut className="rotate-180" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-12 gap-6 bg-slate-50">
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex-1 min-h-[300px]">
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                    <Radio size={14} className="text-rose-500 animate-pulse" />
                    Live Transcript Stream
                  </h4>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase ml-3">Agent</span>
                      <p className="bg-[#0A2C5E] text-white text-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                        Hello Sneha ji, I noticed you were looking for 3BHK options in Atelier Greens.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-3">Customer</span>
                      <p className="bg-white text-slate-700 text-sm px-4 py-3 rounded-2xl rounded-tr-none shadow-sm border border-slate-100 italic">
                        Yes, but I am specifically worried about the GST impact and all-inclusive pricing.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase ml-3">Agent</span>
                      <p className="bg-[#0A2C5E] text-white text-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                        I completely understand. We have a festive offer that covers a substantial part of the registration costs...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    Real-time AI Assist
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-700 uppercase mb-1">Suggested Pivot</p>
                      <p className="text-xs text-amber-900 font-medium leading-relaxed">
                        Customer is stalling on tax. Briefly explain the 'Ready-to-move' GST benefits to rebuild value.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <p className="text-[10px] font-black text-blue-700 uppercase mb-1">Intent Scoring</p>
                      <div className="mt-2 h-2 w-full bg-blue-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: '82%' }} />
                      </div>
                      <p className="text-[10px] font-bold text-blue-800 mt-1 uppercase">82% Intent High</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end items-center px-8">
              <button 
                onClick={() => setSelectedAgent(null)}
                className="bg-[#0A2C5E] text-white px-8 py-2.5 rounded-xl text-xs font-extrabold uppercase shadow-xl transition-all active:scale-95"
              >
                Return to Command Center
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#0A2C5E] p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Initialize New Project</h3>
              <button onClick={() => setShowCreateProject(false)} className="hover:bg-white/10 p-1 rounded-full"><LogOut className="rotate-180" size={20} /></button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Project Name</label>
                <input 
                  required
                  type="text" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  className="w-full rounded-xl border-slate-200 text-base py-3 px-4 focus:ring-2 focus:ring-[#0A2C5E] focus:border-transparent transition-all shadow-sm"
                  placeholder="e.g. Adani Shantigram Phase II"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Location</label>
                <input 
                  required
                  type="text" 
                  value={newProject.location}
                  onChange={e => setNewProject({...newProject, location: e.target.value})}
                  />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Project Specs (CSV/PDF)</label>
                  <button 
                    type="button"
                    onClick={downloadProjectSample}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Download Sample
                  </button>
                </div>
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    onChange={e => setNewProject({...newProject, file: e.target.files[0]})}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${newProject.file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 group-hover:border-[#0A2C5E] bg-slate-50'}`}>
                    {newProject.file ? (
                      <>
                        <Check className="text-emerald-500 mb-2" size={24} />
                        <span className="text-xs font-bold text-emerald-700">{newProject.file.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-slate-400 group-hover:text-[#0A2C5E] mb-2 transition-colors" size={24} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight text-center">Upload project blueprints or specifications</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-[#0A2C5E] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-[#0c3875] transition-all active:scale-[0.98] mt-4">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#0A2C5E] p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">New Outbound Campaign</h3>
              <button onClick={() => setShowCreateCampaign(false)} className="hover:bg-white/10 p-1 rounded-full"><LogOut className="rotate-180" size={20} /></button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Campaign Title</label>
                <input 
                  required
                  type="text" 
                  value={newCampaign.title}
                  onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                  className="w-full rounded-xl border-slate-200 text-base py-3 px-4 focus:ring-2 focus:ring-[#0A2C5E] focus:border-transparent transition-all shadow-sm"
                  placeholder="e.g. Q3 Sales Push"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Select Project</label>
                <select 
                  required
                  value={newCampaign.projectId}
                  onChange={e => setNewCampaign({...newCampaign, projectId: e.target.value})}
                  className="w-full rounded-xl border-slate-200 text-base py-3 px-4 focus:ring-2 focus:ring-[#0A2C5E] focus:border-transparent transition-all shadow-sm"
                >
                  <option value="">Select a project...</option>
                  {allProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.location}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Lead File (CSV/XLSX)</label>
                  <button 
                    type="button"
                    onClick={downloadSample}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-tight"
                  >
                    <Upload size={10} className="rotate-180" /> Download Sample
                  </button>
                </div>
                <div className="relative group cursor-pointer">
                  <input 
                    required
                    type="file" 
                    onChange={e => setNewCampaign({...newCampaign, file: e.target.files[0]})}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${newCampaign.file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 group-hover:border-[#0A2C5E] bg-slate-50'}`}>
                    {newCampaign.file ? (
                      <>
                        <Check className="text-emerald-500 mb-2" size={24} />
                        <span className="text-xs font-bold text-emerald-700">{newCampaign.file.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-slate-400 group-hover:text-[#0A2C5E] mb-2 transition-colors" size={24} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Upload leads for this campaign</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-[#D71920] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-rose-700 transition-all active:scale-[0.98] mt-4">
                Launch Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default SupervisorDashboard;
