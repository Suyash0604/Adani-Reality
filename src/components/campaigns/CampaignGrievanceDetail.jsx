import React from 'react';
import { 
  Ticket, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  User,
  History,
  Timer,
  BrainCircuit
} from 'lucide-react';

const CampaignGrievanceDetail = ({ campaign, triggerAction }) => {
  const tickets = [
    { id: 'TKT-1001', customer: 'Amit Shah', issue: 'Possession Delay', priority: 'High', status: 'In Progress', age: '48h' },
    { id: 'TKT-1004', customer: 'Sunita Rao', issue: 'Leakage in B-Wing', priority: 'Critical', status: 'Escalated', age: '72h' },
    { id: 'TKT-1009', customer: 'Rajesh Kumar', issue: 'Parking Allocation', priority: 'Medium', status: 'Pending', age: '12h' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. KPI Cards (4 metrics) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Tickets Raised', value: '42', icon: <Ticket size={16} /> },
          { label: 'Active Tickets', value: '124', icon: <History size={16} /> },
          { label: 'Resolution Time', value: '5.2h', icon: <Timer size={16} /> },
          { label: 'Resolved Today', value: '28', icon: <CheckCircle2 size={16} /> },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
               {kpi.icon}
               <span className="text-[10px] font-black uppercase tracking-widest">{kpi.label}</span>
            </div>
            <p className="text-3xl font-black text-[#0A2C5E]">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* 2. Main Content (8 cols) */}
        <div className="col-span-8 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest flex items-center gap-2">
                 <AlertCircle size={16} className="text-rose-500" />
                 Active Priority Tickets
               </h3>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-black text-blue-600">{t.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-700">{t.customer}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">{t.issue}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        t.status === 'Escalated' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
             <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest mb-6">Area Breakdown</h3>
             <div className="space-y-6">
                {Object.entries(campaign.details.breakdown).map(([key, val]) => (
                  <div key={key}>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-xs font-black text-slate-800">{val}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0A2C5E]" style={{ width: `${val}%` }} />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* 3. Side Panel (4 cols) */}
        <div className="col-span-4 space-y-8">
           {/* AI Insights Card */}
           <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm ring-4 ring-blue-50/50">
              <div className="flex items-center gap-2 mb-4 text-[#0A2C5E]">
                <BrainCircuit size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">AI Insights</h3>
              </div>
              <div className="space-y-4">
                 {[
                   "Time to resolution for 'Possession' issues has increased by 12% this week.",
                   "Predictive analysis suggests a spike in 'Quality' complaints from B-Wing.",
                   "Sentiment in resolved tickets has improved by 0.5 points."
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#0A2C5E] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">SLA Compliance</h3>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                 <span className="text-xs font-bold text-blue-200">On-Time Response</span>
                 <span className="text-sm font-black">88%</span>
              </div>
              <div className="flex items-center justify-between py-3">
                 <span className="text-xs font-bold text-blue-200">Pending &gt; 48h</span>
                 <span className="text-sm font-black text-rose-300">12</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignGrievanceDetail;
