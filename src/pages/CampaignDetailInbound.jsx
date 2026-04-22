import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  PieChart, 
  AlertCircle, 
  Activity, 
  BrainCircuit, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  User,
  Phone,
  LayoutDashboard,
  Users,
  CheckCircle2,
  X
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useContext } from 'react';
import { AppContext } from '../context/appContextObject';

const AgentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const mockAgents = [
    { name: 'Sameer Khan', calls: 24, score: 4.8 },
    { name: 'Pooja Sharma', calls: 18, score: 4.5 },
    { name: 'Rohan Verma', calls: 21, score: 4.2 },
    { name: 'Anjali Gupta', calls: 15, score: 4.9 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-black text-[#0A2C5E]">Active Agents</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Campaign Monitoring</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {mockAgents.map((agent, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{agent.name}</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase">Available</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#0A2C5E]">{agent.calls} Calls</p>
                <div className="flex items-center justify-end gap-1 text-[9px] font-black text-amber-500 uppercase">
                  Avg. {agent.score} ⭐️
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="w-full bg-[#0A2C5E] text-white font-black uppercase tracking-widest py-3 rounded-xl text-xs">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0A2C5E] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
        <CheckCircle2 size={18} className="text-emerald-400" />
        <span className="text-xs font-black uppercase tracking-widest">{message}</span>
      </div>
    </div>
  );
};

const TicketsTable = ({ campaign }) => {
  const mockTickets = [
    { id: 'TKT-1024', customer: 'Rahul Sharma', subject: 'Possession delay query', priority: 'High', status: 'Open', date: '22/04/2026' },
    { id: 'TKT-1025', customer: 'Anjali Gupta', subject: 'Document verification', priority: 'Medium', status: 'Resolved', date: '21/04/2026' },
    { id: 'TKT-1026', customer: 'Suresh Raina', subject: 'Parking slot allocation', priority: 'Low', status: 'In Progress', date: '22/04/2026' },
    { id: 'TKT-1027', customer: 'Sneha Desai', subject: 'Maintenance fee dispute', priority: 'High', status: 'Escalated', date: '20/04/2026' },
    { id: 'TKT-1028', customer: 'Vikram Patel', subject: 'Site visit coordination', priority: 'Medium', status: 'Open', date: '22/04/2026' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-wider">Active {campaign.title} Tickets</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time case tracking</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#0A2C5E] transition-all shadow-sm">
            <Users size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockTickets.map((tkt, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{tkt.id}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700">{tkt.customer}</td>
                <td className="px-6 py-4 text-xs text-slate-600">{tkt.subject}</td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                    tkt.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                    tkt.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {tkt.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      tkt.status === 'Resolved' ? 'bg-emerald-500' :
                      tkt.status === 'Open' ? 'bg-blue-500 animate-pulse' :
                      tkt.status === 'Escalated' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                    <span className="text-xs font-bold text-slate-700">{tkt.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{tkt.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GenericInboundDetail = ({ campaign, triggerAction }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Resolution Rate', value: `${campaign.resolutionRate}%`, icon: <CheckCircle2 className="text-emerald-600" size={20} /> },
          { label: 'Pending Cases', value: campaign.pendingCases, icon: <Clock className="text-amber-600" size={20} /> },
          { label: 'Critical Escalations', value: campaign.criticalEscalations, icon: <AlertCircle className="text-rose-600" size={20} /> },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
              {kpi.icon}
            </div>
            <p className="text-3xl font-black text-[#0A2C5E]">{kpi.value}</p>
          </div>
        ))}
      </div>
      
      <TicketsTable campaign={campaign} />
    </div>
  );
};

const CampaignDetailInbound = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { inboundCampaigns } = useContext(AppContext);
  const campaign = inboundCampaigns.find(c => c.id === campaignId);
  const [showAgents, setShowAgents] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!campaign) {
    return (
      <AppShell title="Campaign Not Found">
        <div className="p-8 text-center text-slate-800">
          <h2 className="text-2xl font-bold">Campaign not found</h2>
          <Link to="/supervisor" className="text-blue-600 hover:underline mt-4 inline-block font-bold">Return to Dashboard</Link>
        </div>
      </AppShell>
    );
  }

  const triggerAction = () => setShowToast(true);

  // Determine Primary Action Button Label
  const getActionLabel = () => {
    if (campaign.id === 'ib-1') return "Escalate Critical Cases";
    if (campaign.id === 'ib-2') return "Improve Knowledge Base";
    if (campaign.id === 'ib-3') return "Optimize Lead Routing";
    return "Execute Campaign Action";
  };

  // Standardized view for all inbound campaigns
  const renderDetailView = () => {
    return <GenericInboundDetail campaign={campaign} triggerAction={triggerAction} />;
  };

  return (
    <AppShell title={`${campaign.title} Detail`}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6">
        <Link to="/supervisor" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Campaign</Link>
        <ChevronRight size={10} className="text-slate-300" />
        <Link to="/supervisor" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Inbound</Link>
        <ChevronRight size={10} className="text-slate-300" />
        <span className="text-[10px] font-black text-[#0A2C5E] uppercase tracking-widest">{campaign.title}</span>
      </nav>

      {/* Header Profile */}
      <section className="bg-white rounded-2xl border border-slate-100 p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
               <LayoutDashboard size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-[#0A2C5E] tracking-tight">{campaign.title}</h1>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Inbound</span>
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-4">
                 <span>Global Hub · Pune</span>
                 <span className="h-1 w-1 bg-slate-300 rounded-full" />
                 <span className="text-blue-600">{campaign.callsToday} Active Calls Today</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/supervisor')}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Campaign Specific Body */}
      {renderDetailView()}

      {/* Modals & Toasts */}
      <AgentModal isOpen={showAgents} onClose={() => setShowAgents(false)} />
      <Toast show={showToast} message="Action triggered successfully" />
    </AppShell>
  );
};

export default CampaignDetailInbound;
