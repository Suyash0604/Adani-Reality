import React from 'react';
import { useParams, Link } from 'react-router-dom';
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
  X,
  Target
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { campaignData } from '../data/mockData';

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

import CampaignPreSalesDetail from '../components/campaigns/CampaignPreSalesDetail';
import CampaignPaymentDetail from '../components/campaigns/CampaignPaymentDetail';
import CampaignOffersDetail from '../components/campaigns/CampaignOffersDetail';

const CampaignDetailOutbound = () => {
  const { campaignId } = useParams();
  const campaign = campaignData.outbound.find(c => c.id === campaignId);
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
    if (campaign.id === 'ob-1') return "Optimize Dialing Lists";
    if (campaign.id === 'ob-2') return "Trigger Payment Reminders";
    if (campaign.id === 'ob-3') return "Launch Promotion Blast";
    return "Execute Outreach Action";
  };

  // Determine which sub-view to render
  const renderDetailView = () => {
    const props = { campaign, triggerAction };
    switch (campaign.id) {
      case 'ob-1': return <CampaignPreSalesDetail {...props} />;
      case 'ob-2': return <CampaignPaymentDetail {...props} />;
      case 'ob-3': return <CampaignOffersDetail {...props} />;
      default: return null;
    }
  };

  return (
    <AppShell title={`${campaign.title} Detail`}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6">
        <Link to="/supervisor" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors">Campaign</Link>
        <ChevronRight size={10} className="text-slate-300" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outbound</span>
        <ChevronRight size={10} className="text-slate-300" />
        <span className="text-[10px] font-black text-[#0A2C5E] uppercase tracking-widest">{campaign.title}</span>
      </nav>

      {/* Header Profile */}
      <section className="bg-white rounded-2xl border border-slate-100 p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
               <LayoutDashboard size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-[#0A2C5E] tracking-tight">{campaign.title}</h1>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Outbound</span>
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-4">
                 <span>Central Command</span>
                 <span className="h-1 w-1 bg-slate-300 rounded-full" />
                 <span className="text-purple-600">{campaign.callsMade} Total Contacts Target</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAgents(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <Users size={14} />
              View Active Agents
            </button>
            <button 
              onClick={triggerAction}
              className="px-6 py-3 bg-[#0A2C5E] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              {getActionLabel()}
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

export default CampaignDetailOutbound;
