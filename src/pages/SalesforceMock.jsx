import { useState, useMemo } from 'react';
import { 
  PhoneCall, 
  BadgeCheck, 
  Phone, 
  Brain, 
  X,
  PhoneIncoming,
  CalendarCheck,
  Clock,
  Star,
  Zap,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Info,
  History,
  CheckCircle2,
  AlertCircle,
  Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { leads, mockRecentCalls } from '../data/mockData';
import { useApp } from '../context/useApp';

const agentKpis = [
  { label: 'Calls Today', value: '18', trend: '▲ 3 vs yesterday', icon: PhoneIncoming, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-4 border-blue-500' },
  { label: 'Site Visits Booked', value: '04', trend: '▲ 1 vs yesterday', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-4 border-emerald-500' },
  { label: 'Avg Handle Time', value: '6:42', trend: '▼ 0:18 vs target', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-4 border-amber-500' },
  { label: 'QA Score (Avg)', value: '87%', trend: '▲ 4% vs last week', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-l-4 border-purple-500' },
];

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { 
    setActiveCustomer, 
    resetCallSession, 
    setSelectedLeadId, 
    selectedLeadId, 
    callState, 
    visitBooked, 
    triggerIncomingCall,
    incomingCall,
    acceptCall,
    previewIncomingCall,
    setCallType,
    setIncomingCall
  } = useApp();
  
  const [toast, setToast] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           lead.propertyInterest.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Category filter
      if (activeFilter === 'All Leads') return true;
      if (activeFilter === 'Hot 🔥') return lead.aiIntentScore > 80;
      if (activeFilter === 'Warm') return lead.aiIntentScore <= 80 && lead.aiIntentScore > 40;
      if (activeFilter === 'Cold') return lead.aiIntentScore <= 40;
      if (activeFilter === 'Realty One') return lead.propertyInterest.includes('Realty One');
      if (activeFilter === 'Elysium') return lead.propertyInterest.includes('Elysium');
      
      return true;
    });
  }, [activeFilter, searchQuery]);

  const handleCallLead = (lead) => {
    setSelectedLeadId(lead.id);
    setActiveCustomer(lead);
    resetCallSession();
    setCallType('outgoing');
    setCallState('idle');
    navigate('/agent');
  };

  return (
    <AppShell title="Agent Command Center">
      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {agentKpis.map((kpi, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 ${kpi.border}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={16} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 mb-1">{kpi.value}</p>
              <span className={`text-[10px] font-bold ${kpi.trend.includes('▲') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: CRM Leads */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-[#0A2C5E]">CRM Leads</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Your assigned leads across all projects</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs w-48 focus:ring-2 focus:ring-[#0A2C5E] transition-all" 
                  />
                </div>
                <button 
                  onClick={() => triggerIncomingCall(leads[0].id)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  <Zap size={14} className="fill-current" />
                  Simulate Call
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 flex flex-wrap gap-2">
              {['All Leads', 'Hot 🔥', 'Warm', 'Cold', 'Realty One', 'Elysium'].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === f ? 'bg-[#0A2C5E] text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
              {filteredLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  className={`group relative rounded-2xl border p-5 transition-all hover:shadow-lg bg-white overflow-hidden ${selectedLeadId === lead.id ? 'border-[#D71920]' : 'border-slate-100'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{lead.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400">{lead.phone}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${lead.aiIntentScore > 80 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                      {lead.aiIntentScore > 80 ? 'Hot 🔥' : 'Warm'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                       <span className="text-[11px] font-bold text-slate-600 truncate">{lead.propertyInterest}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${lead.aiIntentScore}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 tracking-widest">
                       <span>Stage: Enquiry</span>
                       <span>{lead.aiIntentScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCallLead(lead)}
                      className="flex-1 bg-[#0A2C5E] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0c3875] transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={12} className="fill-current" />
                      Call Now
                    </button>
                    <button className="px-3 py-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredLeads.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-12">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No leads found for "{activeFilter}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           {/* Performance Breakdown */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest">Today's Performance</h3>
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Calls', val: '18' },
                  { label: 'Connected', val: '12' },
                  { label: 'Site Visits', val: '04' },
                  { label: 'Conversion', val: '22%' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-50 text-center">
                    <p className="text-xl font-black text-[#0A2C5E]">{item.val}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
           </div>

           {/* Recent Call Summary */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest">Recent Call Summary</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-2 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockRecentCalls.slice(0, 3).map((call, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-800">{call.customer}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{call.issue} · {call.duration}</p>
                        </td>
                        <td className="px-2 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${
                            call.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                            call.status === 'Escalated' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {call.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0A2C5E] transition-colors border-t border-slate-50"
              >
                View Full History
              </button>
           </div>


        </div>
      </div>

      {/* MODALS */}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#0A2C5E] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <History className="text-blue-300" size={24} />
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Full Call History</h3>
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Showing all interactions for April 2026</p>
                </div>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Issue</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Final Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockRecentCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-4">
                         <span className="text-sm font-bold text-slate-800">{call.customer}</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs font-medium text-slate-600">{call.issue}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-xs font-bold text-slate-500">{call.duration}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                            call.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                            call.status === 'Escalated' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {call.status}
                          </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowHistoryModal(false)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Close History</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-8">
           <div className="bg-[#0A2C5E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Zap size={14} className="text-emerald-400 fill-current" />
              </div>
              <p className="text-xs font-bold">{toast}</p>
           </div>
        </div>
      )}

      {incomingCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-transparent" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 animate-bounce">
                  <Phone size={24} fill="currentColor" />
                </div>
                <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] animate-pulse">Incoming Call</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-2xl font-black text-[#0A2C5E] tracking-tight">{incomingCall.lead.name}</h4>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{incomingCall.lead.city} · {incomingCall.lead.propertyInterest}</p>
              </div>
              
              <div className="bg-[#F8FAFC] rounded-3xl p-5 mb-8 border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Bot size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Handover Summary</span>
                </div>
                <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic">
                  "Customer asking about airport proximity and pricing for 4BHK units."
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    acceptCall();
                    navigate('/agent');
                  }}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  Accept Call
                </button>
                <button
                  type="button"
                  onClick={() => {
                    previewIncomingCall();
                    navigate('/agent');
                  }}
                  className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AgentDashboard;
