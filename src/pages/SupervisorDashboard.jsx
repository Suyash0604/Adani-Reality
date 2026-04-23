import React, { useState, useEffect, useContext } from 'react';
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
  X,
  Filter,
  Calendar,
  MoreVertical,
  Flag,
  TrendingUp,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line, 
  LineChart, 
  Cell,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
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

const funnelData = [
  { stage: 'Leads Called', count: 1248, percentage: '100%', color: 'bg-blue-500' },
  { stage: 'Interested', count: 386, percentage: '30.9%', color: 'bg-indigo-500' },
  { stage: 'Site Visit Booked', count: 142, percentage: '11.4%', color: 'bg-violet-500' },
  { stage: 'Visited', count: 88, percentage: '7.1%', color: 'bg-purple-500' },
  { stage: 'Booked', count: 28, percentage: '2.2%', color: 'bg-emerald-500' },
];

const campaignPerformanceData = [
  { name: 'Realty One', calls: 1248, interested: 386, siteVisits: 142, bookings: 28, conversion: 22.4 },
  { name: 'Elysium', calls: 842, interested: 221, siteVisits: 88, bookings: 16, conversion: 18.1 },
  { name: 'Codename ONE', calls: 1120, interested: 298, siteVisits: 112, bookings: 19, conversion: 16.9 },
  { name: 'Aangan', calls: 488, interested: 108, siteVisits: 42, bookings: 6, conversion: 14.3 },
];

const projectCards = [
  { 
    name: 'Adani Realty One', 
    health: 94, 
    calls: '1,248', 
    interested: '30.9%', 
    bookings: 28, 
    conversion: 22.4, 
    trend: 'up', 
    history: [45, 52, 48, 61, 55, 68, 72] 
  },
  { 
    name: 'Adani Elysium', 
    health: 88, 
    calls: '842', 
    interested: '26.2%', 
    bookings: 16, 
    conversion: 18.1, 
    trend: 'up', 
    history: [32, 38, 35, 42, 40, 48, 45] 
  },
  { 
    name: 'Adani Codename ONE', 
    health: 82, 
    calls: '1,120', 
    interested: '26.6%', 
    bookings: 19, 
    conversion: 16.9, 
    trend: 'down', 
    history: [55, 50, 48, 45, 42, 40, 38] 
  },
  { 
    name: 'Adani Aangan', 
    health: 76, 
    calls: '488', 
    interested: '22.1%', 
    bookings: 6, 
    conversion: 14.3, 
    trend: 'up', 
    history: [20, 22, 25, 28, 24, 30, 32] 
  },
];

const criticalIssuesData = [
  { id: 'ISS-001', campaign: 'Grievance Redressal', agent: 'Rahul Kumar', type: 'Negative Sentiment', timeOpen: '12 min', priority: 'P1', status: 'Pending' },
  { id: 'ISS-002', campaign: 'Adani Realty One', agent: 'Sneha Patil', type: 'Call Drop', timeOpen: '5 min', priority: 'P2', status: 'In Progress' },
  { id: 'ISS-003', campaign: 'Payment Followup', agent: 'Arjun Menon', type: 'Compliance Alert', timeOpen: '22 min', priority: 'P1', status: 'Pending' },
  { id: 'ISS-004', campaign: 'Support Desk', agent: 'Nisha Kapoor', type: 'Extended Silence', timeOpen: '1 min', priority: 'P3', status: 'Pending' },
];

const generate7DayData = (base, variance, type = 'count') => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    value: type === 'percent' 
      ? Math.min(100, Math.max(0, base + (Math.random() * variance * 2 - variance)))
      : Math.max(0, Math.round(base + (Math.random() * variance * 2 - variance)))
  }));
};

const campaignTrendData = {
  'ib-1': { // Grievance Redressal
    calls: generate7DayData(150, 30),
    resolution: generate7DayData(88, 10, 'percent'),
    critical: generate7DayData(5, 4),
    trend: 'up'
  },
  'ib-2': { // Customer Service
    calls: generate7DayData(220, 40),
    resolution: generate7DayData(92, 5, 'percent'),
    critical: generate7DayData(2, 2),
    trend: 'up'
  },
  'ib-3': { // Sales Enquiry
    calls: generate7DayData(180, 25),
    resolution: generate7DayData(85, 12, 'percent'),
    critical: generate7DayData(3, 3),
    trend: 'down'
  },
  'ob-1': { // Pre-sales
    calls: generate7DayData(400, 80),
    connect: generate7DayData(45, 10, 'percent'),
    conversions: generate7DayData(12, 5),
    trend: 'up'
  },
  'ob-2': { // Payment Followup
    calls: generate7DayData(350, 60),
    connect: generate7DayData(52, 8, 'percent'),
    conversions: generate7DayData(8, 4),
    trend: 'down'
  },
  'ob-3': { // Festive Offers
    calls: generate7DayData(500, 100),
    connect: generate7DayData(38, 15, 'percent'),
    conversions: generate7DayData(25, 10),
    trend: 'up'
  }
};

const inboundSummaryData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  'Grievance Redressal': Math.round(82 + Math.random() * 12),
  'Customer Service': Math.round(88 + Math.random() * 8),
  'Sales Enquiry': Math.round(75 + Math.random() * 15),
}));

const outboundSummaryData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  'Pre-sales': Math.round(40 + Math.random() * 10),
  'Payment Followup': Math.round(48 + Math.random() * 12),
  'Festive Offers': Math.round(35 + Math.random() * 20),
}));

const activityFeed = [
  { id: 1, text: "Rahul Kumar converted lead on Adani Realty One", time: "2 min ago", type: "success" },
  { id: 2, text: "New critical issue raised in Grievance Redressal", time: "5 min ago", type: "error" },
  { id: 3, text: "Campaign 'Festive Offers' reached 80% target", time: "12 min ago", type: "info" },
  { id: 4, text: "Sneha Patil scheduled a site visit for Elysium", time: "15 min ago", type: "success" },
  { id: 5, text: "Compliance alert triggered in Payment campaign", time: "25 min ago", type: "warning" },
  { id: 6, text: "System load balanced across 12 nodes", time: "1 hour ago", type: "info" },
  { id: 7, text: "New agent onboarded: Karan Sharma", time: "2 hours ago", type: "info" },
  { id: 8, text: "Weekly performance report generated", time: "3 hours ago", type: "info" },
  { id: 9, text: "Arjun Menon requested a break", time: "4 hours ago", type: "warning" },
  { id: 10, text: "Backup completed successfully", time: "5 hours ago", type: "success" },
];

const CampaignSparkline = ({ data, trend = 'up', color }) => {
  const chartColor = color || (trend === 'up' ? '#10b981' : '#f43f5e');
  return (
    <div className="w-24 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`sparkline-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-slate-100 shadow-xl rounded-lg p-2 text-[10px] font-black text-slate-600">
                    {payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={chartColor} 
            strokeWidth={2} 
            fillOpacity={1} 
            fill={`url(#sparkline-${trend})`} 
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CampaignDetailPanel = ({ campaign, type = 'inbound' }) => {
  const id = campaign.id;
  const data = campaignTrendData[id] || (type === 'inbound' ? campaignTrendData['ib-1'] : campaignTrendData['ob-1']);
  const mainColor = type === 'inbound' ? '#3b82f6' : '#8b5cf6';
  
  return (
    <div className="bg-slate-50/50 p-6 border-y border-slate-100 animate-in slide-in-from-top duration-300">
      <div className="grid grid-cols-3 gap-6 h-[160px]">
        {/* Panel A: Calls Volume */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Volume (7D)</span>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Avg: {Math.round(data.calls.reduce((acc, curr) => acc + curr.value, 0) / 7)}</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.calls}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                <Bar dataKey="value" fill={mainColor} radius={[4, 4, 0, 0]} barSize={20} />
                <ReferenceLine y={data.calls.reduce((acc, curr) => acc + curr.value, 0) / 7} stroke="#94a3b8" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel B: Resolution / Connect Rate */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {type === 'inbound' ? 'Resolution % Trend' : 'Connect Rate % Trend'}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Target: 90%</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={type === 'inbound' ? data.resolution : data.connect}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '90%', fill: '#ef4444', fontSize: 8 }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={mainColor} 
                  strokeWidth={3} 
                  dot={({ cx, cy, payload }) => (
                    <circle key={payload.day} cx={cx} cy={cy} r={3} fill={payload.value < 90 ? '#ef4444' : mainColor} stroke="white" strokeWidth={1} />
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel C: Critical Issues / Conversions */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {type === 'inbound' ? 'Critical Issues Timeline' : 'Daily Conversions'}
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={type === 'inbound' ? data.critical : data.conversions}>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                  {(type === 'inbound' ? data.critical : data.conversions).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={type === 'inbound' ? (entry.value > 3 ? '#ef4444' : '#10b981') : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [selectedTimeRange, setSelectedTimeRange] = useState('Today');
  const [selectedShift, setSelectedShift] = useState('Morning');
  const [showCriticalDrawer, setShowCriticalDrawer] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const agentPerformanceData = [
    { name: 'Rahul Kumar', status: 'On Call', callsToday: 42, aht: '4:15', conversions: 4, resolution: 88, lastActivity: '2 min ago', color: 'bg-amber-500', performance: 'Top Performer' },
    { name: 'Sneha Patil', status: 'Available', callsToday: 38, aht: '3:50', conversions: 5, resolution: 92, lastActivity: '5 min ago', color: 'bg-emerald-500', performance: 'Top Performer' },
    { name: 'Arjun Menon', status: 'On Call', callsToday: 35, aht: '5:30', conversions: 2, resolution: 72, lastActivity: '10 min ago', color: 'bg-amber-500', performance: 'Average' },
    { name: 'Nisha Kapoor', status: 'Break', callsToday: 28, aht: '4:45', conversions: 1, resolution: 65, lastActivity: '15 min ago', color: 'bg-slate-400', performance: 'Needs Attention' },
    { name: 'Vivek Desai', status: 'Available', callsToday: 45, aht: '3:20', conversions: 6, resolution: 95, lastActivity: '1 min ago', color: 'bg-emerald-500', performance: 'Top Performer' },
  ];

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
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <Link to="/supervisor" className="hover:text-slate-600 cursor-pointer">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">Campaign Intelligence</span>
          </nav>
          <h1 className="text-2xl font-black text-[#0A2C5E] tracking-tight">Supervisor Command Center</h1>
        </div>
        
        <div className="flex items-center gap-4">

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

      <section className="grid grid-cols-6 gap-4 mb-8">
        {[
          { 
            label: 'Total Calls Today', 
            value: '312', 
            trend: '↑ 12%', 
            sparkline: [210, 240, 220, 280, 260, 310, 312],
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            onClick: () => setShowCallsBreakdown(true)
          },
          { 
            label: 'Conversion Rate', 
            value: '3.2%', 
            subValue: 'Target: 5.0%',
            trend: '↓ 2%', 
            color: 'text-amber-600', 
            bg: 'bg-amber-50'
          },
          { 
            label: 'Critical Issues', 
            value: '07', 
            trend: '↑ 1', 
            color: 'text-rose-600', 
            bg: 'bg-rose-50',
            onClick: () => setShowCriticalDrawer(true)
          },
          { 
            label: 'Active Agents', 
            value: '112', 
            breakdown: '🟠 45 | 🟢 52 | ⚪ 15',
            trend: '↑ 5', 
            color: 'text-blue-600', 
            bg: 'bg-blue-50'
          },
          { 
            label: 'Avg Handle Time', 
            value: '4:12', 
            trend: '↓ 15s', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50'
          },
          { 
            label: 'Total Bookings', 
            value: '28', 
            trend: '↑ 4', 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-50'
          },
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            onClick={kpi.onClick}
            className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all flex flex-col justify-between ${kpi.onClick ? 'cursor-pointer hover:border-blue-200 hover:shadow-md hover:scale-[1.02]' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">{kpi.label}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${kpi.bg} ${kpi.color}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
                {kpi.subValue && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{kpi.subValue}</p>}
                {kpi.breakdown && <p className="text-[10px] font-bold text-slate-500 mt-0.5">{kpi.breakdown}</p>}
              </div>
              {kpi.sparkline && (
                <div className="mb-1">
                  <CampaignSparkline 
                    data={kpi.sparkline.map((val, i) => ({ day: i, value: val }))} 
                    color={idx === 0 ? "#10b981" : "#3b82f6"} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 2: CAMPAIGN OVERVIEW (MOVED UP) */}
      <section className="mb-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-lg font-black text-[#0A2C5E] tracking-tight">Project Overview</h2>
          </div>
        </div>

        {/* 2A: Campaign Cards */}
        <div className="grid grid-cols-4 gap-6">
          {projectCards.map((card, idx) => (
            <div key={idx} className={`bg-white rounded-2xl shadow-sm border-l-4 p-5 hover:shadow-md transition-all ${card.trend === 'up' ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-slate-800">{card.name}</h3>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${card.health > 85 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  Score: {card.health}
                </span>
              </div>
              
              <div className="h-10 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={card.history.map((v, i) => ({ val: v, i }))}>
                    <defs>
                      <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={card.trend === 'up' ? '#10b981' : '#f43f5e'} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={card.trend === 'up' ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke={card.trend === 'up' ? '#10b981' : '#f43f5e'} strokeWidth={2} fillOpacity={1} fill={`url(#grad-${idx})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>{card.calls} Calls</span>
                    <span className="text-slate-200">|</span>
                    <span>{card.interested} Int.</span>
                  </div>
                  <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    {card.conversion}%
                    {card.trend === 'up' ? <ArrowUpRight className="text-emerald-500" size={18} /> : <ArrowDownRight className="text-rose-500" size={18} />}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bookings</p>
                  <p className="text-sm font-bold text-slate-700">{card.bookings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2B: Full Width Grouped Bar Chart */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-[#0A2C5E]">Project Performance This Month</h3>
            <div className="flex gap-4 items-center">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="h-2 w-2 rounded-full bg-blue-500" /> Calls</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="h-2 w-2 rounded-full bg-indigo-500" /> Interested</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="h-2 w-2 rounded-full bg-violet-500" /> Site Visits</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Bookings</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="h-0.5 w-4 bg-rose-500" /> Conv %</div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Bar yAxisId="left" dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar yAxisId="left" dataKey="interested" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar yAxisId="left" dataKey="siteVisits" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar yAxisId="left" dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2C: Conversion Funnel Comparison */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-[#0A2C5E] mb-8">Conversion Funnel Comparison</h3>
          <div className="space-y-10">
            {campaignPerformanceData.map((camp, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">{camp.name}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency: {camp.conversion}%</span>
                </div>
                <div className="flex h-10 w-full gap-1">
                  {[
                    { label: 'Leads', val: camp.calls, color: 'bg-blue-500' },
                    { label: 'Int.', val: camp.interested, color: 'bg-indigo-500' },
                    { label: 'Visits', val: camp.siteVisits, color: 'bg-violet-500' },
                    { label: 'Booked', val: camp.bookings, color: 'bg-emerald-500' }
                  ].map((stage, sIdx, arr) => {
                    const width = (stage.val / camp.calls) * 100;
                    const prevVal = sIdx > 0 ? arr[sIdx-1].val : null;
                    const dropoff = prevVal ? Math.round((1 - stage.val / prevVal) * 100) : null;
                    
                    return (
                      <div key={sIdx} className="relative group" style={{ width: `${width}%`, minWidth: '40px' }}>
                        <div className={`h-full ${stage.color} rounded-md opacity-80 hover:opacity-100 transition-all flex items-center px-3 overflow-hidden`}>
                           <span className="text-[9px] font-black text-white whitespace-nowrap">{stage.val}</span>
                        </div>
                        {dropoff !== null && (
                          <div className="absolute -top-6 left-0 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-1 rounded border border-rose-100">-{dropoff}%</span>
                          </div>
                        )}
                        <div className="absolute -bottom-6 left-0 text-[8px] font-black text-slate-400 uppercase tracking-tight">{stage.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: TABS & CAMPAIGN LIST */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px] mb-10">
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
            <>
              {/* Inbound Summary Chart */}
              <div className="px-6 py-6 border-b border-slate-50 bg-slate-50/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-[#0A2C5E]">Resolution Rate — Last 7 Days</h3>
                  <div className="flex gap-4">
                    {['Grievance Redressal', 'Customer Service', 'Sales Enquiry'].map((camp, idx) => (
                      <div key={camp} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-indigo-500' : 'bg-violet-500'}`} />
                        <span className="text-[10px] font-bold text-slate-500">{camp}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={inboundSummaryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                      <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="Grievance Redressal" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Customer Service" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Sales Enquiry" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Health</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Resolution %</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Critical</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Calls Today</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {campaignData.inbound.map((campaign, idx) => (
                    <React.Fragment key={campaign.id}>
                      <tr 
                        onClick={() => setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)} 
                        className={`group hover:bg-slate-50 transition-all cursor-pointer ${expandedCampaign === campaign.id ? 'bg-slate-50/80' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <PhoneIncoming size={16} />
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="min-w-[140px]">
                                <span className="text-sm font-bold text-slate-800">{campaign.title}</span>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Click to view trends</p>
                              </div>
                              <CampaignSparkline 
                                data={campaignTrendData[`ib-${idx+1}`]?.calls || generate7DayData(150, 30)} 
                                trend={campaignTrendData[`ib-${idx+1}`]?.trend || 'up'}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-emerald-100 bg-emerald-50 text-[10px] font-black text-emerald-600">
                            {Math.floor(80 + Math.random() * 15)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${
                                campaign.resolutionRate > 85 ? 'bg-emerald-500' :
                                campaign.resolutionRate > 70 ? 'bg-amber-500' : 'bg-rose-500'
                              }`} style={{ width: `${campaign.resolutionRate}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-600">{campaign.resolutionRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`text-sm font-bold ${campaign.criticalEscalations > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                            {campaign.criticalEscalations}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-slate-700">{campaign.callsToday}</span>
                            <span className="text-[8px] font-bold text-emerald-500">↑ 14%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Healthy</span>
                        </td>
                      </tr>
                      {expandedCampaign === campaign.id && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <CampaignDetailPanel campaign={{...campaign, id: `ib-${idx+1}`}} type="inbound" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'outbound' && (
            <>
              {/* Outbound Summary Chart */}
              <div className="px-6 py-6 border-b border-slate-50 bg-slate-50/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-[#0A2C5E]">Connect Rate — Last 7 Days</h3>
                  <div className="flex gap-4">
                    {['Pre-sales', 'Payment Followup', 'Festive Offers'].map((camp, idx) => (
                      <div key={camp} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${idx === 0 ? 'bg-purple-500' : idx === 1 ? 'bg-fuchsia-500' : 'bg-pink-500'}`} />
                        <span className="text-[10px] font-bold text-slate-500">{camp}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={outboundSummaryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                      <YAxis domain={[20, 80]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="Pre-sales" stroke="#a855f7" strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Payment Followup" stroke="#d946ef" strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Festive Offers" stroke="#ec4899" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Health</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect Rate</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conversions</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Efficiency</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {outboundCampaigns.map((campaign, idx) => (
                    <React.Fragment key={campaign.id}>
                      <tr 
                        onClick={() => setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)} 
                        className={`group hover:bg-slate-50 transition-all cursor-pointer ${expandedCampaign === campaign.id ? 'bg-slate-50/80' : ''}`}
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><PhoneOutgoing size={16} /></div>
                            <div className="flex items-center gap-6">
                              <div className="min-w-[140px]">
                                <span className="text-sm font-bold text-slate-800">{campaign.title}</span>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Click to view trends</p>
                              </div>
                              <CampaignSparkline 
                                data={campaignTrendData[`ob-${idx+1}`]?.calls || generate7DayData(400, 80)} 
                                trend={campaignTrendData[`ob-${idx+1}`]?.trend || 'up'}
                                color="#a855f7"
                              />
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-full border-2 border-purple-100 bg-purple-50 text-[10px] font-black text-purple-600">
                            {Math.floor(75 + Math.random() * 20)}
                          </div>
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
                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                          {campaign.callsMade > 0 ? ((campaign.conversions / campaign.callsMade) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={(e) => { e.stopPropagation(); startCalling(campaign.id); }} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${campaign.status === 'Calling' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-[#D71920] text-white hover:bg-rose-700'}`}>
                            {campaign.status === 'Calling' ? 'Active' : 'Start'}
                          </button>
                        </td>
                      </tr>
                      {expandedCampaign === campaign.id && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <CampaignDetailPanel campaign={{...campaign, id: `ob-${idx+1}`}} type="outbound" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'all' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Health</th>
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
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">{campaign.title}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                       {campaign.id.startsWith('ib') ? `Res: ${campaign.resolutionRate}%` : `Conv: ${campaign.conversions}`}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-slate-200 bg-slate-50 text-[9px] font-black text-slate-600">
                        {Math.floor(70 + Math.random() * 25)}
                      </div>
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

      {/* SECTION 4: AGENT STATUS + LEAD FUNNEL + ACTIVITY FEED */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left: Agent Performance Table (40%) */}
        <section className="col-span-12 xl:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0A2C5E]">Agent Performance</h2>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Calls</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AHT</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conv.</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Res %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {agentPerformanceData.map((agent, i) => (
                  <tr 
                    key={i} 
                    onClick={() => {
                      if (agent.status === 'On Call') {
                        setSelectedAgent({...supervisorAgents[0], name: agent.name, customer: 'John Doe'});
                      } else {
                        addToast(`${agent.name} is not currently on a call`, 'info');
                      }
                    }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#D71920] transition-colors">{agent.name}</p>
                        <span className={`text-[9px] font-black uppercase px-1 rounded ${
                          agent.performance === 'Top Performer' ? 'bg-emerald-50 text-emerald-600' :
                          agent.performance === 'Average' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                        }`}>{agent.performance}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${agent.color} animate-pulse`} />
                        <span className="text-[10px] font-bold text-slate-600">{agent.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-700">{agent.callsToday}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-slate-700">{agent.aht}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-emerald-600">{agent.conversions}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-bold ${agent.resolution > 85 ? 'text-emerald-600' : agent.resolution > 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {agent.resolution}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Center: Lead Funnel + KPI sparklines (35%) */}
        <section className="col-span-12 xl:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#0A2C5E]">Lead Conversion Funnel</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              {funnelData.map((stage, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stage.stage}</span>
                    <span className="text-xs font-bold text-slate-700">{stage.count}</span>
                  </div>
                  <div className="h-8 w-full bg-slate-50 rounded-lg overflow-hidden flex items-center relative border border-slate-100">
                    <div 
                      className={`h-full ${stage.color} opacity-80 transition-all duration-1000 ease-out flex items-center justify-end px-3`}
                      style={{ width: stage.percentage }}
                    >
                      <span className="text-[10px] font-black text-white">{stage.percentage}</span>
                    </div>
                  </div>
                  {i < funnelData.length - 1 && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                      <div className="h-2 w-[1px] bg-slate-300" />
                      <div className="text-[8px] font-black text-rose-500 bg-rose-50 px-1.5 rounded-full border border-rose-100">
                        -{ (parseFloat(funnelData[i].percentage) - parseFloat(funnelData[i+1].percentage)).toFixed(1) }%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Weekly Trend</p>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-blue-700">+14.2%</span>
                  <CampaignSparkline 
                    data={[12, 15, 14, 18, 16, 20, 22].map((val, i) => ({ day: i, value: val }))} 
                    color="#3b82f6" 
                  />
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Efficiency Score</p>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-emerald-700">92%</span>
                  <CampaignSparkline 
                    data={[85, 88, 87, 90, 89, 92, 92].map((val, i) => ({ day: i, value: val }))} 
                    color="#10b981" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* SECTION 5: CRITICAL ISSUES PANEL */}
      <section className="mb-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <ShieldAlert size={18} />
            </div>
            <h2 className="text-sm font-bold text-[#0A2C5E]">Critical Issues Queue</h2>
          </div>
          <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">View All Issues</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue ID</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Type</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Time Open</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Priority</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {criticalIssuesData.map((issue, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{issue.id}</td>
                  <td className="px-4 py-4 text-xs font-medium text-slate-600">{issue.campaign}</td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-800">{issue.agent}</td>
                  <td className="px-4 py-4 text-xs font-medium text-rose-600 italic">{issue.type}</td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-700 text-center">{issue.timeOpen}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      issue.priority === 'P1' ? 'bg-rose-100 text-rose-700' :
                      issue.priority === 'P2' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Assign</button>
                      <button className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-200">Escalate</button>
                      <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200">Resolve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Critical Issues Side Drawer */}
      {showCriticalDrawer && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCriticalDrawer(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="bg-rose-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldAlert size={20} />
                    Critical Issues Queue
                  </h3>
                  <p className="text-xs text-rose-100 font-bold uppercase tracking-widest mt-1">07 Issues requires attention</p>
                </div>
                <button onClick={() => setShowCriticalDrawer(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {criticalIssuesData.map((issue, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 group hover:border-rose-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase rounded-lg">{issue.priority}</span>
                      <span className="text-[10px] font-bold text-slate-400">{issue.timeOpen} ago</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{issue.type}</h4>
                    <p className="text-[11px] font-medium text-slate-500 mb-4">{issue.campaign} · {issue.agent}</p>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100">Review Call</button>
                      <button className="flex-1 py-2 bg-[#0A2C5E] rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#0c3875]">Take Action</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">Mark All as Read</button>
              </div>
            </div>
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