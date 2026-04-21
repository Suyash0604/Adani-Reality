import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Zap, 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Award,
  Flag,
  FileText,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useApp } from '../context/useApp';

const PerformanceIndicator = ({ label, status }) => {
  const isPositive = status === 'pass';
  const isWarning = status === 'warning';
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:shadow-sm transition-all">
      <div className={`p-1.5 rounded-full ${
        isPositive ? 'bg-emerald-100 text-emerald-600' : 
        isWarning ? 'bg-amber-100 text-amber-600' : 
        'bg-rose-100 text-rose-600'
      }`}>
        {isPositive ? <CheckCircle2 size={16} /> : 
         isWarning ? <AlertTriangle size={16} /> : 
         <ShieldAlert size={16} />}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-xs font-bold text-slate-700">{isPositive ? 'Strong performance' : isWarning ? 'Areas for improvement' : 'Critical issue'}</p>
      </div>
    </div>
  );
};

const QAPage = () => {
  const { callId } = useParams();
  const { qaResult, lastCallSummary, callRecords } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const activeCallData = useMemo(() => {
    if (callId) {
      const record = callRecords.find(r => r.id === callId);
      if (record) return record;
    }
    if (callRecords.length > 0) return callRecords[0];
    if (lastCallSummary) {
      return {
        ...lastCallSummary,
        id: 'latest-session',
        customer: lastCallSummary.customerName,
        score: qaResult.total,
        breakdown: qaResult.breakdown,
        softSkills: qaResult.softSkills,
        date: new Date().toLocaleDateString('en-IN'),
        outcome: lastCallSummary.visitBooked ? 'Visit Booked' : 'Follow-up',
        sentiment: 'Positive'
      };
    }
    return null;
  }, [callId, callRecords, lastCallSummary, qaResult]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AppShell title="Manager View">
        <div className="flex h-[70vh] flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-[#0A2C5E]" />
          <p className="mt-4 text-sm font-bold text-slate-600 tracking-widest uppercase animate-pulse">Scanning Call Signals...</p>
        </div>
      </AppShell>
    );
  }

  if (!activeCallData) {
    return (
      <AppShell title="Manager Analysis">
        <div className="flex h-[70vh] flex-col items-center justify-center text-center">
          <FileText size={48} className="text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Intelligence Deficit</h2>
          <p className="text-slate-500 mt-2">No call session data available for this identifier.</p>
          <button onClick={() => navigate('/supervisor')} className="mt-6 bg-[#0A2C5E] text-white px-6 py-2 rounded-xl font-bold shadow-lg active:scale-95 transition-all">Command Center</button>
        </div>
      </AppShell>
    );
  }

  const score = activeCallData.score || 84;
  const isExcellent = score >= 85;
  const riskLevel = score >= 80 ? 'Low' : score >= 60 ? 'Medium' : 'High';
  const previousScore = 72;
  const improvement = score - previousScore;

  return (
    <AppShell title="Manager Insights">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0A2C5E] tracking-tight">{activeCallData.customer}</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Session ID: {activeCallData.id?.split('-')[1] || '884'} <span className="opacity-30">•</span> {activeCallData.date}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
               <div className="text-right">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Outcome</p>
                 <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{activeCallData.outcome}</span>
               </div>
               <div className="text-right border-l pl-4 border-slate-200">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5 tracking-tighter">Sentiment</p>
                 <span className="text-xs font-bold text-slate-700">🙂 Positive</span>
               </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          {/* Main Decision Pillar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                < Award size={80} />
              </div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Quality Index</h3>
              
              <div className="relative flex items-center justify-center mb-6">
                 <div className="w-40 h-40 rounded-full border-[12px] border-slate-50 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-black ${isExcellent ? 'text-[#0A2C5E]' : 'text-amber-500'}`}>{score}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points</span>
                 </div>
                 {/* Circular Progress Overlay */}
                 <svg className="absolute inset-x-0 inset-y-0 w-44 h-44 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                   <circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    className={`${isExcellent ? 'text-[#0A2C5E]' : 'text-amber-400'} opacity-20`}
                    strokeDasharray="276"
                    strokeDashoffset={276 - (276 * score / 100)}
                    strokeLinecap="round"
                   />
                 </svg>
              </div>

              <div className={`px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border ${
                score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {score >= 80 ? 'Excellent' : 'Needs Review'}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 w-full pt-8 border-t border-slate-50">
                 <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Risk Level</p>
                    <p className={`text-sm font-black ${riskLevel === 'Low' ? 'text-emerald-500' : 'text-rose-500'}`}>{riskLevel}</p>
                 </div>
                 <div className="text-center border-l border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Growth</p>
                    <p className="text-sm font-black text-emerald-500 flex items-center justify-center gap-1">
                      <TrendingUp size={14} /> +{improvement}%
                    </p>
                 </div>
              </div>
            </section>

            {/* Performance Trend Card */}
            <section className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-4">Historical Pulse</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white/60">Previous Call</span>
                    <p className="text-xl font-bold">{previousScore}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <TrendingUp className="text-emerald-400" size={20} />
                    <div className="h-px w-8 bg-white/20" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white/60">Current Call</span>
                    <p className="text-xl font-bold">{score}</p>
                  </div>
                </div>
                <div className="mt-4 bg-white/10 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/60">Status</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    Consistent Improvement
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 p-2 opacity-5 translate-x-4 translate-y-4">
                <BarChart3 size={120} />
              </div>
            </section>
          </div>

          {/* Quick Signals Pillar */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Key Signals Grid */}
            <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                <Zap size={14} className="text-amber-500" />
                Performance Signals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <PerformanceIndicator label="Introduction & Brand" status="pass" />
                <PerformanceIndicator label="Product Knowledge" status="pass" />
                <PerformanceIndicator label="Pricing Objections" status="warning" />
                <PerformanceIndicator label="Closing & Next Steps" status="pass" />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
               {/* Coaching Focus */}
               <section className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                 <h3 className="text-xs font-black uppercase text-amber-700/60 tracking-[0.2em] mb-4">Manager To-Do</h3>
                 <div className="space-y-4">
                   <div className="flex items-start gap-3">
                      <Sparkles size={16} className="text-amber-600 mt-0.5" />
                      <p className="text-sm font-bold text-amber-900 leading-tight">Focus: Improve pricing objection handling through 'Festive' bundle pivots.</p>
                   </div>
                   <div className="h-px bg-amber-200/50 w-full" />
                   <div className="flex items-center justify-between text-xs font-black text-amber-700 uppercase tracking-widest">
                     <span>Priority</span>
                     <span className="text-rose-600">Medium</span>
                   </div>
                 </div>
               </section>

               {/* Agent Benchmarking */}
               <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                 <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Peer Context</h3>
                 <div className="space-y-4">
                    <div className="flex items-end justify-between">
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Agent Rank</p>
                         <p className="text-2xl font-black text-[#0A2C5E]">Top 10%</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Score</p>
                         <p className="text-lg font-bold text-slate-700">76 / 100</p>
                       </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: '90%' }} />
                    </div>
                 </div>
               </section>
            </div>

            {/* Quick Actions Panel */}
            <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Management Decisions</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-[#0A2C5E] transition-all group">
                  <FileText size={20} className="text-slate-600 group-hover:text-[#0A2C5E]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Full Transcript</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-500 transition-all group">
                  <Flag size={20} className="text-slate-600 group-hover:text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Flag for Review</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-500 transition-all group">
                  <MessageSquare size={20} className="text-slate-600 group-hover:text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Send Coaching</span>
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default QAPage;
