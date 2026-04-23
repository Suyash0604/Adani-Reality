import { Fragment, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  Users, 
  List, 
  TrendingUp, 
  Award, 
  Activity, 
  Search, 
  Filter, 
  Play, 
  Download, 
  MessageSquare, 
  Zap, 
  Target, 
  MapPin, 
  DollarSign,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Smile,
  Meh,
  Frown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Flame,
  BrainCircuit,
  Settings2
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';

const CallRecords = () => {
  const { callRecords } = useApp();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState(user?.role === 'supervisor' ? 'manager' : 'individual');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  
  const navigate = useNavigate();
  const isSupervisor = user?.role === 'supervisor';

  // --- Filtering Logic ---
  const filteredRecords = useMemo(() => {
    let base = callRecords;
    if (user?.role === 'agent') base = base.filter(r => r.agent === user.name);
    if (selectedAgent) base = base.filter(r => r.agent === selectedAgent);
    if (searchQuery) {
      base = base.filter(r => 
        r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.agent && r.agent.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (sentimentFilter !== 'All') base = base.filter(r => r.sentiment === sentimentFilter);
    return base;
  }, [callRecords, selectedAgent, user, searchQuery, sentimentFilter]);

  const lowPerfCalls = useMemo(() => filteredRecords.filter(r => r.score < 65), [filteredRecords]);

  // --- Analytics Logic ---
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    if (total === 0) return { avgDuration: '0m', avgScore: 0, positive: 0, negative: 0, conv: 0 };
    const avgScore = Math.round(filteredRecords.reduce((acc, r) => acc + r.score, 0) / total);
    const convCount = filteredRecords.filter(r => r.outcome === 'Visit Booked').length;
    const conv = Math.round((convCount / total) * 100);
    return { total, avgDuration: '5m 20s', avgScore, conv };
  }, [filteredRecords]);

  const agentPerformance = useMemo(() => {
    const groups = callRecords.reduce((acc, record) => {
      const agent = record.agent || 'Unknown';
      if (!acc[agent]) {
        acc[agent] = { name: agent, totalCalls: 0, totalScore: 0, conversions: 0, latestDate: record.date };
      }
      acc[agent].totalCalls += 1;
      acc[agent].totalScore += record.score || 0;
      if (record.outcome === 'Visit Booked') acc[agent].conversions += 1;
      return acc;
    }, {});

    return Object.values(groups).map(agent => {
      const avg = Math.round(agent.totalScore / agent.totalCalls);
      let status = 'needs_focus';
      if (avg >= 85) status = 'top_performer';
      else if (avg >= 75) status = 'average';
      
      return {
        ...agent,
        avgScore: avg,
        conversionRate: Math.round((agent.conversions / agent.totalCalls) * 100),
        status
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [callRecords]);

  return (
    <AppShell title="Call Intelligence">
      <div className="space-y-8">
        
        {/* --- VIEW SWITCHER --- */}
        {isSupervisor && (
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit">
            <button 
              onClick={() => setViewMode('manager')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'manager' ? 'bg-[#0A2C5E] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <BarChart3 size={14} /> Agent Performance
            </button>
            <button 
              onClick={() => setViewMode('individual')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'individual' ? 'bg-[#0A2C5E] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <List size={14} /> Interaction Logs
            </button>
          </div>
        )}

        {viewMode === 'manager' ? (
          /* ========================================================
             MANAGER DECISION DASHBOARD
             ======================================================== */
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* 1. TOP: EXECUTIVE SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Calls</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-[#0A2C5E]">{stats.total}</p>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} /> +8%
                  </span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-rose-100 shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Rate</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-rose-600">{stats.conv}%</p>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                    <ArrowDownRight size={12} /> -3% ⚠
                  </span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Quality Score</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-emerald-600">{stats.avgScore}</p>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} /> +2%
                  </span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Issue</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black text-slate-700">Price Objection</p>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">42%</span>
                </div>
              </div>
            </div>
            {/* 3. 👥 AGENT PERFORMANCE ACTIONABLE LIST */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Agent Performance Matrix</h3>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Name</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Score</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conv Rate</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Calls</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {agentPerformance.map((agent) => (
                      <tr key={agent.name} className="hover:bg-slate-50/30 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-black text-[#0A2C5E]">{agent.name.charAt(0)}</div>
                             <span className="text-sm font-bold text-slate-700">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`text-sm font-black ${agent.avgScore < 65 ? 'text-rose-600' : 'text-slate-700'}`}>{agent.avgScore}%</span>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-sm font-black text-blue-600">{agent.conversionRate}%</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-400 tabular-nums">{agent.totalCalls}</td>
                        <td className="px-8 py-5">
                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              agent.status === 'needs_focus' ? 'bg-rose-50 text-rose-600' :
                              agent.status === 'top_performer' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                           }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'needs_focus' ? 'bg-rose-600 animate-pulse' : agent.status === 'top_performer' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                              {agent.status.replace('_', ' ')}
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => { setSelectedAgent(agent.name); setViewMode('individual'); }} className="px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100">View Calls</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            {/* 7. 🎯 LOW PERFORMING CALLS SECTION */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <Frown size={18} className="text-rose-500" />
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Low Quality Interactions (Score &lt; 65)</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lowPerfCalls.length} Found</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowPerfCalls.slice(0, 3).map((call) => (
                    <div key={call.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg transition-all group">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Customer</p>
                             <p className="text-xs font-black text-slate-800">{call.customer}</p>
                             <p className="text-[10px] font-black text-slate-400 mt-2 uppercase mb-1">Agent</p>
                             <p className="text-xs font-bold text-slate-500">{call.agent}</p>
                          </div>
                          <span className="text-sm font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">{call.score}</span>
                       </div>
                       <p className="text-[11px] text-slate-500 leading-relaxed mb-4 line-clamp-2 italic">"{call.summary}"</p>
                       <button 
                         onClick={() => { setExpanded(call.id); setViewMode('individual'); }}
                         className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all"
                       >
                          Analyze Failure
                       </button>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        ) : (
          /* ========================================================
             INTERACTION LOGS (DOWNGRADED PRIORITY FOR MANAGER)
             ======================================================== */
          <div className="space-y-4 animate-in fade-in duration-500">
            
            {/* 🔍 SEARCH + FILTERS */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="flex-1 relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by customer or agent..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
               </div>
               <div className="flex gap-2">
                  <select 
                    value={sentimentFilter}
                    onChange={(e) => setSentimentFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none"
                  >
                     <option value="All">All Sentiment</option>
                     <option value="Positive">Positive</option>
                     <option value="Neutral">Neutral</option>
                     <option value="Negative">Negative</option>
                  </select>
                  <button className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                     <Settings2 size={14} /> Filters
                  </button>
               </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interaction</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sentiment</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quality</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.map((row) => (
                    <Fragment key={row.id}>
                      <tr className={`group hover:bg-slate-50/50 transition-all ${expanded === row.id ? 'bg-blue-50/20' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="text-sm font-black text-slate-800">{row.customer}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{row.date} · {row.time}</span>
                             {row.summary?.toLowerCase().includes('price') && (
                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[8px] font-black uppercase tracking-tight">💰 Price Issue</span>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-600">{row.agent}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.duration}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                             row.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' :
                             row.sentiment === 'Negative' || row.sentiment === 'Mixed' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                             {row.sentiment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`text-sm font-black ${row.score >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.score}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-end">
                              <button 
                                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                   expanded === row.id ? 'bg-[#0A2C5E] text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                 {expanded === row.id ? 'Close' : 'Analyze'}
                              </button>
                           </div>
                        </td>
                      </tr>
                      {expanded === row.id && (
                        <tr className="bg-[#F8FAFC]">
                          <td colSpan={4} className="px-8 py-8 border-l-4 border-blue-600 animate-in slide-in-from-left-1 duration-300">
                             <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-8 space-y-6">
                                   <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Interaction Summary</p>
                                      <p className="text-[14px] font-bold text-slate-700 leading-relaxed italic">"{row.summary}"</p>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="text-[10px] font-black text-blue-600 uppercase mb-3">AI Rating</p>
                                         <div className="space-y-3">
                                            {['Opening', 'Pitch', 'Closing'].map(l => (
                                               <div key={l} className="flex justify-between items-center"><span className="text-[11px] font-bold text-slate-500">{l}</span><span className="text-[11px] font-black text-[#0A2C5E] uppercase">Good</span></div>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="text-[10px] font-black text-emerald-600 uppercase mb-3">Improvement Tips</p>
                                         <ul className="text-[11px] font-bold text-slate-600 space-y-2"><li>• Mention payment plans earlier</li><li>• Validate location commute times</li></ul>
                                      </div>
                                   </div>
                                </div>
                                <div className="col-span-4 space-y-4">
                                   <button onClick={() => navigate(`/qa/${row.id}`)} className="w-full py-4 bg-[#0A2C5E] text-white rounded-2xl text-[10px] font-black uppercase hover:bg-[#0c3875] shadow-xl transition-all">Full Intelligence Report</button>
                                   <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><Download size={14} /> Export Recording</button>
                                </div>
                             </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CallRecords;
