import { Fragment, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Clock, ChevronRight, Users, List, TrendingUp, Award, Activity } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useApp } from '../context/useApp';
import { useAuth } from '../context/useAuth';

const CallRecords = () => {
  const { callRecords, escalations } = useApp();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState(user?.role === 'supervisor' ? 'agent' : 'individual');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const navigate = useNavigate();

  const isSupervisor = user?.role === 'supervisor';

  const filteredRecords = useMemo(() => {
    let base = callRecords;
    // Security: Agents only see their own calls
    if (user?.role === 'agent') {
      base = base.filter(r => r.agent === user.name);
    }
    // Supervisor Drill-down
    if (selectedAgent) {
      base = base.filter(r => r.agent === selectedAgent);
    }
    return base;
  }, [callRecords, selectedAgent, user]);

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
      <div className="space-y-8">
        
        {/* Manager View Switcher */}
        {isSupervisor && (
          <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex gap-1">
              <button 
                onClick={() => setViewMode('agent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  viewMode === 'agent' ? 'bg-[#0A2C5E] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Users size={16} /> Agent Analytics
              </button>
              <button 
                onClick={() => setViewMode('individual')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  viewMode === 'individual' ? 'bg-[#0A2C5E] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <List size={16} /> Interaction Log
              </button>
            </div>
            <div className="flex items-center gap-4 px-4 border-l border-slate-100">
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Team Avg</p>
                 <p className="text-sm font-black text-[#0A2C5E]">82%</p>
               </div>
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Volume</p>
                 <p className="text-sm font-black text-[#0A2C5E]">{callRecords.length}</p>
               </div>
            </div>
          </div>
        )}

        {viewMode === 'agent' ? (
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-xl font-black text-[#0A2C5E] flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Team Performance Leaderboard
              </h2>
              <p className="text-sm text-slate-500">Aggregated insights and quality benchmarks by agent.</p>
            </div>

            <div className="grid gap-4">
              {agentPerformance.map((agent, idx) => (
                <div key={agent.name} className="group relative overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 p-5 hover:border-[#0A2C5E]/30 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                    {idx === 0 ? <Award size={100} /> : <Activity size={100} />}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${
                        idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#0A2C5E]">{agent.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            agent.status === 'Top Performer' ? 'bg-emerald-100 text-emerald-700' : 
                            agent.status === 'High Performer' ? 'bg-blue-100 text-blue-700' : 
                            agent.status === 'Average' ? 'bg-slate-100 text-slate-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {agent.status}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Last Session: {agent.latestDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Volume</p>
                         <p className="text-xl font-black text-slate-700">{agent.totalCalls}</p>
                       </div>
                       <div className="text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Quality</p>
                         <p className={`text-xl font-black ${agent.avgScore >= 85 ? 'text-emerald-500' : 'text-slate-700'}`}>{agent.avgScore}%</p>
                       </div>
                       <div className="text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Conversion</p>
                         <p className="text-xl font-black text-[#0A2C5E]">{agent.conversionRate}%</p>
                       </div>
                       <button 
                         onClick={() => {
                           setSelectedAgent(agent.name);
                           setViewMode('individual');
                         }}
                         className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#0A2C5E] hover:text-white transition-all shadow-sm"
                       >
                         <ChevronRight size={20} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 animate-in fade-in duration-500">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#0A2C5E]">Interaction Log</h2>
                {selectedAgent && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-[#0A2C5E] uppercase border border-slate-200 animate-in zoom-in duration-300">
                    Agent: {selectedAgent}
                    <button onClick={() => setSelectedAgent(null)} className="hover:text-rose-500 ml-1">✕</button>
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredRecords.length} Records Found</p>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Date</th>
                  <th className="py-2">Agent</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Sentiment</th>
                  <th className="py-2">Score</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="border-b border-slate-100 group hover:bg-slate-50 transition-all">
                      <td className="py-4 font-medium text-slate-600">{row.date}</td>
                      <td className="text-slate-600">{row.agent}</td>
                      <td className="font-bold text-[#0A2C5E]">{row.customer}</td>
                      <td className="text-slate-500">{row.duration}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          row.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {row.sentiment}
                        </span>
                      </td>
                      <td className="font-black text-[#0A2C5E] text-base">{row.score}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          className={`rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                            expanded === row.id 
                              ? 'bg-[#0A2C5E] text-white shadow-md' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          onClick={() => setExpanded((prev) => (prev === row.id ? null : row.id))}
                        >
                          {expanded === row.id ? 'Close' : 'Expand'}
                        </button>
                      </td>
                    </tr>
                    {expanded === row.id ? (
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <td colSpan={7} className="p-6">
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-8">
                              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Session Summary</p>
                              <p className="text-sm font-bold text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                 {row.summary}
                              </p>
                              <div className="mt-6 flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/qa/${row.id}`)}
                                  className="rounded-xl bg-[#0A2C5E] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-95"
                                >
                                  View Detailed Intelligence
                                </button>
                                <button
                                  type="button"
                                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50"
                                >
                                  Download Audio
                                </button>
                              </div>
                            </div>
                            <div className="col-span-4">
                              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Sentiment Pulse</p>
                              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-2">
                                  <div className="h-full bg-emerald-500" style={{ width: `${row.sentimentProgress}%` }} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Interaction Score: {row.sentimentProgress}%</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                No records found for this criteria
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
};

export default CallRecords;
