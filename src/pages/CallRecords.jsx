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
  Frown
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';

const CallRecords = () => {
  const { callRecords } = useApp();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState(user?.role === 'supervisor' ? 'agent' : 'individual');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [isPlaying, setIsPlaying] = useState(null);
  
  const navigate = useNavigate();
  const isSupervisor = user?.role === 'supervisor';

  // --- Filtering Logic ---
  const filteredRecords = useMemo(() => {
    let base = callRecords;
    
    // Role-based filtering
    if (user?.role === 'agent') {
      base = base.filter(r => r.agent === user.name);
    }
    
    // Supervisor selection
    if (selectedAgent) {
      base = base.filter(r => r.agent === selectedAgent);
    }

    // Search query
    if (searchQuery) {
      base = base.filter(r => 
        r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.agent && r.agent.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sentiment filter
    if (sentimentFilter !== 'All') {
      base = base.filter(r => r.sentiment === sentimentFilter);
    }

    return base;
  }, [callRecords, selectedAgent, user, searchQuery, sentimentFilter]);

  // --- Analytics Logic ---
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    if (total === 0) return { avgDuration: '0m', avgScore: 0, positive: 0, negative: 0 };
    
    const avgScore = Math.round(filteredRecords.reduce((acc, r) => acc + r.score, 0) / total);
    const positive = Math.round((filteredRecords.filter(r => r.sentiment === 'Positive').length / total) * 100);
    const negative = Math.round((filteredRecords.filter(r => r.sentiment === 'Negative' || r.sentiment === 'Mixed').length / total) * 100);
    
    return { total, avgDuration: '5m 20s', avgScore, positive, negative };
  }, [filteredRecords]);

  const agentPerformance = useMemo(() => {
    const groups = callRecords.reduce((acc, record) => {
      const agent = record.agent || 'Unknown';
      if (!acc[agent]) {
        acc[agent] = {
          name: agent,
          totalCalls: 0,
          totalScore: 0,
          conversions: 0,
          sentimentCounts: { Positive: 0, Neutral: 0, Negative: 0 },
          latestDate: record.date
        };
      }
      acc[agent].totalCalls += 1;
      acc[agent].totalScore += record.score || 0;
      if (record.outcome === 'Visit Booked') acc[agent].conversions += 1;
      acc[agent].sentimentCounts[record.sentiment] = (acc[agent].sentimentCounts[record.sentiment] || 0) + 1;
      return acc;
    }, {});

    return Object.values(groups).map(agent => {
      const avg = Math.round(agent.totalScore / agent.totalCalls);
      let status = 'Needs Focus';
      if (avg >= 85) status = 'Top Performer';
      else if (avg >= 75) status = 'High Performer';
      else if (avg >= 65) status = 'Average';
      
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
      <div className="space-y-6">
        
        {/* 📊 TOP SUMMARY STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Calls</p>
            <div className="flex items-end gap-2">
               <p className="text-2xl font-black text-[#0A2C5E] leading-none">{stats.total}</p>
               <span className="text-[10px] font-bold text-emerald-500 mb-0.5">↑ +5%</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Duration</p>
            <div className="flex items-end gap-2">
               <p className="text-2xl font-black text-[#0A2C5E] leading-none">{stats.avgDuration}</p>
               <span className="text-[10px] font-bold text-slate-400 mb-0.5">vs 4m 50s</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Quality</p>
            <div className="flex items-end gap-2">
               <p className="text-2xl font-black text-emerald-600 leading-none">{stats.avgScore}%</p>
               <span className="text-[10px] font-bold text-emerald-500 mb-0.5">↑ +2%</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Positive</p>
            <div className="flex items-end gap-2">
               <p className="text-2xl font-black text-blue-600 leading-none">{stats.positive}%</p>
               <span className="text-[10px] font-bold text-slate-300 mb-0.5">Stable</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Negative</p>
            <div className="flex items-end gap-2">
               <p className="text-2xl font-black text-rose-500 leading-none">{stats.negative}%</p>
               <span className="text-[10px] font-bold text-rose-400 mb-0.5">↓ -1%</span>
            </div>
          </div>
        </div>

        {/* --- VIEW SWITCHER --- */}
        {isSupervisor && (
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit">
              <button 
                onClick={() => setViewMode('agent')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'agent' ? 'bg-[#0A2C5E] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Users size={14} /> Agent Performance
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
          </div>
        )}

        {viewMode === 'agent' ? (
          /* --- AGENT PERFORMANCE VIEW --- */
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {agentPerformance.map((agent, idx) => (
              <div key={agent.name} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-lg font-black text-[#0A2C5E]">
                       {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800">{agent.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        agent.status === 'Top Performer' ? 'bg-emerald-50 text-emerald-600' : 
                        agent.status === 'High Performer' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-10 items-center">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Calls</p>
                       <p className="text-base font-black text-slate-700">{agent.totalCalls}</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg Score</p>
                       <p className="text-base font-black text-slate-700">{agent.avgScore}%</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Conversion</p>
                       <p className="text-base font-black text-blue-600">{agent.conversionRate}%</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedAgent(agent.name); setViewMode('individual'); }}
                      className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                    >
                       <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- INTERACTION LOGS VIEW --- */
          <div className="space-y-4">
            
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
                     <Filter size={14} /> More Filters
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
                             {row.outcome === 'Visit Booked' && (
                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase">🔥 High Intent</span>
                             )}
                             {row.summary?.toLowerCase().includes('price') && (
                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[8px] font-black uppercase">💰 Price Issue</span>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {row.agent?.charAt(0)}
                             </div>
                             <span className="text-xs font-bold text-slate-600">{row.agent}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.duration}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                             row.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' :
                             row.sentiment === 'Negative' || row.sentiment === 'Mixed' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                             {row.sentiment === 'Positive' ? <Smile size={12} /> : row.sentiment === 'Neutral' ? <Meh size={12} /> : <Frown size={12} />}
                             {row.sentiment}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`text-sm font-black ${
                              row.score >= 80 ? 'text-emerald-600' :
                              row.score >= 60 ? 'text-amber-500' : 'text-rose-600'
                           }`}>{row.score}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setIsPlaying(isPlaying === row.id ? null : row.id)}
                                className={`p-2 rounded-xl transition-all ${isPlaying === row.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                              >
                                 <Play size={14} fill={isPlaying === row.id ? "currentColor" : "none"} />
                              </button>
                              <button 
                                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                   expanded === row.id ? 'bg-[#0A2C5E] text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                 {expanded === row.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                 {expanded === row.id ? 'Close' : 'Details'}
                              </button>
                           </div>
                        </td>
                      </tr>

                      {/* --- 🔽 EXPANDED VIEW (RICH PANEL) --- */}
                      {expanded === row.id && (
                        <tr className="bg-[#F8FAFC]">
                          <td colSpan={6} className="px-8 py-8 border-l-4 border-blue-600 animate-in slide-in-from-left-1 duration-300">
                             <div className="grid grid-cols-12 gap-8">
                                {/* AI Summary & Transcript */}
                                <div className="col-span-8 space-y-6">
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">AI Interaction Summary</p>
                                      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                                         <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80} /></div>
                                         <p className="text-[14px] font-bold text-slate-700 leading-relaxed italic">
                                            "{row.summary || "Agent effectively engaged the customer regarding Adani Western Heights. Addressed location concerns and successfully moved toward a site visit booking."}"
                                         </p>
                                      </div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase mb-3"><Activity size={14} /> AI Performance Rating</p>
                                         <div className="space-y-3">
                                            {[
                                               { label: 'Opening', score: 'Excellent' },
                                               { label: 'Pitch', score: 'Good' },
                                               { label: 'Closing', score: 'Needs Work' },
                                            ].map((rate) => (
                                               <div key={rate.label} className="flex justify-between items-center">
                                                  <span className="text-[11px] font-bold text-slate-500">{rate.label}</span>
                                                  <span className="text-[11px] font-black text-[#0A2C5E] uppercase">{rate.score}</span>
                                               </div>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase mb-3"><Target size={14} /> Improvement Tips</p>
                                         <ul className="text-[11px] font-bold text-slate-600 space-y-2">
                                            <li>• Mention payment plans earlier</li>
                                            <li>• Validate location commute times</li>
                                            <li>• Direct closing attempt failed</li>
                                         </ul>
                                      </div>
                                   </div>

                                   {/* Audio Simulation */}
                                   <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                      <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-3">
                                            <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100"><Play size={16} fill="currentColor" /></button>
                                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Call Recording</span>
                                         </div>
                                         <span className="text-[11px] font-bold text-slate-400 tabular-nums">03:45 / {row.duration}</span>
                                      </div>
                                      <div className="h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                                         <div className="h-full bg-blue-600 w-1/3" />
                                         {/* Markers */}
                                         <div className="absolute top-0 left-1/4 w-1 h-full bg-amber-400" title="Objection" />
                                         <div className="absolute top-0 left-2/3 w-1 h-full bg-emerald-400" title="High Intent" />
                                      </div>
                                   </div>
                                </div>

                                {/* Side Actions & Insights */}
                                <div className="col-span-4 space-y-4">
                                   <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Key Insights</p>
                                      <div className="space-y-4">
                                         <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm"><MapPin size={16} /></div>
                                            <p className="text-[11px] font-bold text-blue-900 leading-tight">Location concern raised regarding metro access.</p>
                                         </div>
                                         <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-amber-600 shadow-sm"><DollarSign size={16} /></div>
                                            <p className="text-[11px] font-bold text-amber-900 leading-tight">Comparison with competition pricing mentioned.</p>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="grid grid-cols-1 gap-2">
                                      <button 
                                        onClick={() => navigate(`/qa/${row.id}`)}
                                        className="w-full py-4 bg-[#0A2C5E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0c3875] shadow-xl shadow-blue-100 transition-all"
                                      >
                                         Full Intelligence Report
                                      </button>
                                      <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                         <Download size={14} /> Export Recording
                                      </button>
                                   </div>
                                </div>
                             </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center bg-white">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4"><Search size={32} /></div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No interactions found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CallRecords;
