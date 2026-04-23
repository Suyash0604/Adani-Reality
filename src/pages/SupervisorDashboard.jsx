import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Radio, 
  MessageSquare, 
  Users, 
  LogOut, 
  AlertCircle, 
  Sparkles,
  Zap,
  CheckCircle2,
  PhoneIncoming,
  PhoneOutgoing,
  Target,
  Activity,
  ChevronRight,
  Layers,
  Plus,
  Play,
  FileText,
  Check,
  Upload,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { supervisorAgents, supervisorKpis, campaignData } from '../data/mockData';
import { AppContext } from '../context/appContextObject';

const mockTranscripts = [
  { speaker: 'Customer', text: 'I am looking at properties in North Ahmedabad.' },
  { speaker: 'Agent', text: 'Great! We have some premium options in Atelier Greens.' },
  { speaker: 'Customer', text: 'What is the current possession timeline?' },
  { speaker: 'Agent', text: 'It is scheduled for December 2025. Would you like a site visit?' },
  { speaker: 'Customer', text: 'I need to check my schedule first.' },
  { speaker: 'Agent', text: 'Understood. We have a special festive offer valid this weekend.' },
];

const conversionData = [
  { project: 'Adani Realty One', totalCalls: '1,248', interested: '386 (30.9%)', siteVisits: 142, bookings: 28, conversion: '22.4%', trend: 'up', trendValue: '3.2%' },
  { project: 'Adani Elysium', totalCalls: '842', interested: '221 (26.2%)', siteVisits: 88, bookings: 16, conversion: '18.1%', trend: 'up', trendValue: '1.8%' },
  { project: 'Adani Codename ONE', totalCalls: '1,120', interested: '298 (26.6%)', siteVisits: 112, bookings: 19, conversion: '16.9%', trend: 'down', trendValue: '0.4%' },
  { project: 'Adani Aangan', totalCalls: '488', interested: '108 (22.1%)', siteVisits: 42, bookings: 6, conversion: '14.3%', trend: 'up', trendValue: '0.9%' },
];

const agentStatusData = [
  { id: 1, name: 'Rahul Kumar', status: 'On Call', detail: 'On call · Priya Mehta · 4:22', color: 'bg-amber-500', sentiment: '🙂' },
  { id: 2, name: 'Sneha Patil', status: 'Available', detail: 'Available · Last call 12 min ago', color: 'bg-emerald-500', sentiment: '🙂' },
  { id: 3, name: 'Arjun Menon', status: 'On Call', detail: 'On call · Outbound · Codename ONE', color: 'bg-amber-500', sentiment: '😐' },
  { id: 4, name: 'Nisha Kapoor', status: 'Break', detail: 'Break · Returns 3:15 PM', color: 'bg-slate-400', sentiment: '😐' },
  { id: 5, name: 'Vivek Desai', status: 'Available', detail: 'Available · Logged in 8:58 AM', color: 'bg-emerald-500', sentiment: '🙂' },
];

const SupervisorDashboard = () => {
  // Global Floor State
  const [activeIntervention, setActiveIntervention] = useState(null);
  const [targetAgentId, setTargetAgentId] = useState(null);
  const [whisperText, setWhisperText] = useState('');
  const [toasts, setToasts] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('inbound');
  const [showCallsBreakdown, setShowCallsBreakdown] = useState(false);
  
  const [agentsData, setAgentsData] = useState(supervisorAgents);

  const { 
    allProjects, 
    outboundCampaigns, 
    addProject, 
    addCampaign, 
    updateCampaignStatus
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const [newProject, setNewProject] = useState({ name: '', location: '', file: null });
  const [newCampaign, setNewCampaign] = useState({ 
    title: '', projectId: '', file: null, script: '{{1}}', variables: [''], language: 'English', voice: 'Neural Female'
  });

  const [transcriptIndex, setTranscriptIndex] = useState(0);

  useEffect(() => {
    const matches = newCampaign.script.match(/\{\{(\d+)\}\}/g) || [];
    const uniqueIndices = [...new Set(matches.map(m => parseInt(m.match(/\d+/)[0])))].sort((a, b) => a - b);
    const maxIndex = uniqueIndices.length > 0 ? Math.max(...uniqueIndices) : 0;
    
    if (newCampaign.variables.length !== maxIndex) {
      setNewCampaign(prev => {
        const newVars = [...prev.variables];
        if (maxIndex > prev.variables.length) {
          for (let i = prev.variables.length; i < maxIndex; i++) newVars.push('');
        } else {
          newVars.length = maxIndex;
        }
        return { ...prev, variables: newVars };
      });
    }
  }, [newCampaign.script]);

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
    if (type === 'monitor') addToast(`Started monitoring ${agentName}`, 'info');
    if (type === 'whisper') addToast(`Whisper mode active for ${agentName}`, 'warning');
    if (type === 'barge') addToast(`Joined ${agentName}'s call`, 'error');
  };

  const startCalling = (campaignId) => {
    updateCampaignStatus(campaignId, 'Calling', Math.floor(Math.random() * 10));
    addToast('Dialer started for campaign', 'success');
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    addProject({ ...newProject, id: `proj-${Date.now()}` });
    setShowCreateProject(false);
    setNewProject({ name: '', location: '', file: null });
    addToast('Project created successfully', 'success');
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const project = allProjects.find(p => p.id === newCampaign.projectId);
    const newCamp = {
      id: `ob-${Date.now()}`,
      title: `${newCampaign.title} (${project?.name || 'General'})`,
      callsMade: 0, connectRate: 0, conversions: 0, status: 'Ready',
      details: {
        stats: { total: 0, reached: 0, failed: 0 },
        metrics: { siteVisits: 0, dropped: 0 },
        aiInsights: 'Campaign ready to start',
        leadQuality: 0,
        script: newCampaign.script,
        variables: newCampaign.variables,
        language: newCampaign.language,
        voice: newCampaign.voice
      }
    };
    addCampaign(newCamp);
    setShowCreateCampaign(false);
    setNewCampaign({ title: '', projectId: '', file: null, script: '{{1}}', variables: [''], language: 'English', voice: 'Neural Female' });
    addToast('Campaign launched successfully', 'success');
  };

  const downloadSample = () => addToast('Sample lead file downloaded', 'info');
  const downloadProjectSample = () => addToast('Sample project specs downloaded', 'info');

  return (
    <AppShell title="Campaign Intelligence">
      {/* Header & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/supervisor" className="hover:text-slate-600 cursor-pointer">Dashboard</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600">Campaign Intelligence</span>
        </nav>
        
        <div className="flex items-center gap-3">
           <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              <Plus size={14} />
              New Project
            </button>
           <button
              onClick={() => setShowCreateCampaign(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A2C5E] rounded-lg text-[10px] font-black text-white hover:bg-[#0c3875] transition-all shadow-md uppercase tracking-widest"
            >
              <Plus size={14} />
              New Campaign
            </button>
        </div>
      </div>

      {/* KPI Strip */}
      <section className="grid grid-cols-4 gap-4 mb-8">
        {[
          { 
            label: 'Total Calls Today', 
            value: '312', 
            trend: '↑ 12%', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            onClick: () => setShowCallsBreakdown(true)
          },
          { 
            label: 'Conversion Rate', 
            value: '3.2%', 
            trend: '↓ 2%', 
            color: 'text-amber-600', 
            bg: 'bg-amber-50'
          },
          { 
            label: 'Critical Issues', 
            value: '07', 
            trend: '↑ 1', 
            color: 'text-rose-600', 
            bg: 'bg-rose-50'
          },
          { 
            label: 'Active Agents', 
            value: '112', 
            trend: '↑ 5', 
            color: 'text-blue-600', 
            bg: 'bg-blue-50'
          },
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            onClick={kpi.onClick}
            className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all ${kpi.onClick ? 'cursor-pointer hover:border-blue-200 hover:shadow-md' : ''}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${kpi.bg} ${kpi.color}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Middle Grid: Agent Status & Project Conversion */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Agent Status List */}
        <section className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
             <h2 className="text-sm font-bold text-[#0A2C5E]">Agent Status – Right Now</h2>
          </div>
          <div className="flex-1 p-0 overflow-y-auto max-h-[400px]">
            {agentStatusData.map((agent, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedAgent({...supervisorAgents[0], name: agent.name, customer: agent.detail.split('·')[1]?.trim() || 'Sneha ji'})}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-[#0A2C5E] group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-[#D71920] transition-colors">{agent.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">{agent.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className={`h-2 w-2 rounded-full ${agent.color}`} />
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                     agent.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                     agent.status === 'On Call' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                   }`}>
                     {agent.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Conversion Table */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
             <h2 className="text-sm font-bold text-[#0A2C5E]">Conversion by Project – This Month</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Calls</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interested</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Site Visits</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bookings</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conversion</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {conversionData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">{row.project}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.totalCalls}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-600">{row.interested}</td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-700 text-center">{row.siteVisits}</td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-700 text-center">{row.bookings}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        parseFloat(row.conversion) > 20 ? 'bg-emerald-50 text-emerald-600' :
                        parseFloat(row.conversion) > 15 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {row.conversion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.trend === 'up' ? <ArrowUpRight size={12} className="text-emerald-500" /> : <ArrowDownRight size={12} className="text-rose-500" />}
                        <span className={`text-xs font-bold ${row.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{row.trendValue}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Tabs & Campaign List */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex">
            {['inbound', 'outbound', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#0A2C5E]' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab} Campaigns
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D71920]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          {activeTab === 'inbound' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Resolution %</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pending</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Critical</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Calls Today</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {campaignData.inbound.map((campaign) => (
                  <tr key={campaign.id} onClick={() => navigate(`/campaigns/inbound/${campaign.id}`)} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          <PhoneIncoming size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{campaign.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${campaign.resolutionRate}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{campaign.resolutionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">{campaign.pendingCases}</td>
                    <td className="px-6 py-4 text-center">
                       <span className={`text-sm font-bold ${campaign.criticalEscalations > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {campaign.criticalEscalations}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">{campaign.callsToday}</td>
                    <td className="px-6 py-4 text-right">
                       <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Healthy</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'outbound' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect Rate</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conversions</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Calls Made</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Efficiency</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {outboundCampaigns.map((campaign) => (
                  <tr key={campaign.id} onClick={() => navigate(`/campaigns/outbound/${campaign.id}`)} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><PhoneOutgoing size={16} /></div>
                        <span className="text-sm font-bold text-slate-800">{campaign.title}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${campaign.connectRate}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{campaign.connectRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-emerald-600">{campaign.conversions}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">{campaign.callsMade}</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                      {campaign.callsMade > 0 ? ((campaign.conversions / campaign.callsMade) * 100).toFixed(1) : 0}%
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={(e) => { e.stopPropagation(); startCalling(campaign.id); }} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${campaign.status === 'Calling' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-[#D71920] text-white hover:bg-rose-700'}`}>
                        {campaign.status === 'Calling' ? 'Active' : 'Start'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'all' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[...campaignData.inbound, ...outboundCampaigns].map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/campaigns/${campaign.id.startsWith('ib') ? 'inbound' : 'outbound'}/${campaign.id}`)}>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${campaign.id.startsWith('ib') ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {campaign.id.startsWith('ib') ? 'Inbound' : 'Outbound'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{campaign.title}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                       {campaign.id.startsWith('ib') ? `Res: ${campaign.resolutionRate}%` : `Conv: ${campaign.conversions}`}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="text-xs font-bold text-slate-500">{campaign.status || 'Active'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* MODALS */}

      {/* Total Calls Breakdown Modal */}
      {showCallsBreakdown && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-10 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold text-[#0A2C5E]">Total Calls — Today Breakdown</h3>
                <button onClick={() => setShowCallsBreakdown(false)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors hover:bg-slate-100 rounded-full"><X size={24} /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-y-12 gap-x-8 mb-10">
                <div className="text-center group border-r border-slate-100">
                   <p className="text-4xl font-bold text-[#0A2C5E] mb-1">198</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbound</p>
                </div>
                <div className="text-center group">
                   <p className="text-4xl font-bold text-[#0A2C5E] mb-1">114</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outbound</p>
                </div>
                <div className="text-center group border-r border-slate-100">
                   <p className="text-4xl font-bold text-[#0A2C5E] mb-1">84</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Only</p>
                </div>
                <div className="text-center group">
                   <p className="text-4xl font-bold text-[#0A2C5E] mb-1">228</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Handled</p>
                </div>
              </div>
              
              <p className="text-xs font-bold text-slate-400 italic mb-8">Peak hour: 2 PM — 51 calls. Busiest project: Realty One (142 calls)</p>
              
              <button onClick={() => setShowCallsBreakdown(false)} className="px-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
                Close
              </button>
           </div>
        </div>
      )}

      {/* Agent Details Modal */}
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
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    AI Insights
                  </h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-[10px] font-bold text-amber-800 uppercase mb-1">Observation</p>
                      <p className="text-xs text-amber-900 font-medium">Customer is pushing back on GST. Agent should pivot to festive pricing.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleIntervention('whisper', selectedAgent.id, selectedAgent.name)}
                        className="w-full bg-amber-500 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                      >
                        Whisper Advice
                      </button>
                      <button 
                        onClick={() => handleIntervention('barge', selectedAgent.id, selectedAgent.name)}
                        className="w-full bg-rose-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                      >
                        Barge-In
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal (Detailed) */}
      {showCreateProject && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#0A2C5E] p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Initialize New Project</h3>
              <button onClick={() => setShowCreateProject(false)} className="hover:bg-white/10 p-1 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Project Name</label>
                <input required type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full rounded-xl border-slate-200 text-base py-3 px-4 focus:ring-2 focus:ring-[#0A2C5E] outline-none transition-all shadow-sm" placeholder="e.g. Adani Shantigram Phase II" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Location</label>
                <input required type="text" value={newProject.location} onChange={e => setNewProject({...newProject, location: e.target.value})} className="w-full rounded-xl border-slate-200 text-base py-3 px-4 focus:ring-2 focus:ring-[#0A2C5E] outline-none" placeholder="e.g. Ahmedabad, Gujarat" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Project Specs (CSV/PDF)</label>
                  <button type="button" onClick={downloadProjectSample} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Download Sample</button>
                </div>
                <div className="relative group cursor-pointer">
                  <input type="file" onChange={e => setNewProject({...newProject, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${newProject.file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 group-hover:border-[#0A2C5E] bg-slate-50'}`}>
                    {newProject.file ? <><Check className="text-emerald-500 mb-2" size={24} /><span className="text-xs font-bold text-emerald-700">{newProject.file.name}</span></> : <><Upload className="text-slate-400 group-hover:text-[#0A2C5E] mb-2 transition-colors" size={24} /><span className="text-xs font-bold text-slate-500 uppercase tracking-tight text-center">Upload blueprints or specifications</span></>}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-[#0A2C5E] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-[#0c3875] transition-all active:scale-[0.98] mt-4">Create Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal (Detailed) */}
      {showCreateCampaign && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
            <div className="bg-[#0A2C5E] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">New Outbound Campaign</h3>
              <button onClick={() => setShowCreateCampaign(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Campaign Title</label>
                    <input required type="text" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} className="w-full rounded-2xl border-slate-200 text-base py-3.5 px-5 focus:ring-2 focus:ring-[#0A2C5E] outline-none shadow-sm bg-slate-50/50" placeholder="e.g. Q3 Sales Push" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Project</label>
                    <select required value={newCampaign.projectId} onChange={e => setNewCampaign({...newCampaign, projectId: e.target.value})} className="w-full rounded-2xl border-slate-200 text-base py-3.5 px-5 focus:ring-2 focus:ring-[#0A2C5E] bg-slate-50/50">
                      <option value="">Select a project...</option>
                      {allProjects.map(p => <option key={p.id} value={p.id}>{p.name} - {p.location}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Language</label>
                      <select value={newCampaign.language} onChange={e => setNewCampaign({...newCampaign, language: e.target.value})} className="w-full rounded-2xl border-slate-200 text-sm py-3 px-4 bg-slate-50/50"><option>English</option><option>Hindi</option><option>Marathi</option><option>Gujarati</option></select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Voice Tone</label>
                      <select value={newCampaign.voice} onChange={e => setNewCampaign({...newCampaign, voice: e.target.value})} className="w-full rounded-2xl border-slate-200 text-sm py-3 px-4 bg-slate-50/50"><option>Neural Female</option><option>Neural Male</option><option>Professional</option><option>Friendly</option></select>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Lead File (CSV/XLSX)</label>
                      <button type="button" onClick={downloadSample} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-widest"><Upload size={12} className="rotate-180" /> Download Sample</button>
                    </div>
                    <div className="relative group cursor-pointer">
                      <input required type="file" onChange={e => setNewCampaign({...newCampaign, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[140px] ${newCampaign.file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 group-hover:border-[#0A2C5E] bg-slate-50'}`}>
                        {newCampaign.file ? <><Check className="text-emerald-500 mb-2" size={32} /><span className="text-sm font-bold text-emerald-700">{newCampaign.file.name}</span></> : <><Upload className="text-slate-400 group-hover:text-[#0A2C5E] mb-2 transition-colors" size={32} /><span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Click or drag lead file to upload</span></>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Interaction Script</label>
                    <textarea required value={newCampaign.script} onChange={e => setNewCampaign({...newCampaign, script: e.target.value})} className="w-full h-44 rounded-2xl border-slate-200 text-sm py-4 px-5 focus:ring-2 focus:ring-[#0A2C5E] outline-none shadow-sm italic bg-white" placeholder="Enter script... Use {{1}} for variables." />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Script Variables</label>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                      {newCampaign.variables.map((v, i) => (
                        <input key={i} type="text" value={v} onChange={e => { const v2 = [...newCampaign.variables]; v2[i] = e.target.value; setNewCampaign({...newCampaign, variables: v2}); }} className="w-full rounded-xl border-slate-200 text-sm py-2.5 px-4 bg-white" placeholder={`Variable ${i+1} Name`} />
                      ))}
                      <button type="button" onClick={() => setNewCampaign({...newCampaign, variables: [...newCampaign.variables, ''], script: newCampaign.script + ` {{${newCampaign.variables.length + 1}}}`})} className="text-[10px] font-black text-[#0A2C5E] hover:text-[#D71920] uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">+ Add Variable</button>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-[#0A2C5E] text-white rounded-2xl text-base font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#0c3875] transition-all mt-4">Create Campaign</button>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`animate-in slide-in-from-right-8 rounded-xl px-4 py-3 text-sm font-bold shadow-2xl flex items-center gap-2 border ${t.type === 'error' ? 'bg-rose-600 text-white border-rose-500' : t.type === 'warning' ? 'bg-amber-500 text-white border-amber-400' : t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#0A2C5E] text-white border-slate-700'}`}>
            <Zap size={14} className="animate-pulse" />{t.message}
          </div>
        ))}
      </div>
    </AppShell>
  );
};

export default SupervisorDashboard;