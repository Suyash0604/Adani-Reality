import React from 'react';
import { 
  Users, 
  MapPin, 
  PieChart, 
  Sparkles, 
  ChevronRight, 
  Target, 
  TrendingUp, 
  Building2,
  Gem,
  Star,
  BrainCircuit
} from 'lucide-react';

const CampaignEnquiryDetail = ({ campaign, triggerAction }) => {
  const hotLeads = [
    { name: 'Sanjay Gupta', project: 'Atelier Greens', budget: '1.8 Cr', intent: 92 },
    { name: 'Meera Deshmukh', project: 'Western Heights', budget: '2.5 Cr', intent: 88 },
    { name: 'Rahul Varma', project: 'Codename Capital', budget: '1.2 Cr', intent: 85 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. KPI Cards (4 metrics) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Hot Leads', value: '112', icon: <Sparkles size={16} /> },
          { label: 'Site Visits', value: '34', icon: <Building2 size={16} /> },
          { label: 'Intent Score', value: '82%', icon: <Target size={16} /> },
          { label: 'Active Projects', value: '07', icon: <MapPin size={16} /> },
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
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  High Intent Leads
                </h3>
             </div>
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Budget</th>
                      <th className="px-6 py-4">Intent</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {hotLeads.map((lead, i) => (
                     <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{lead.name}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{lead.project}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{lead.budget}</td>
                        <td className="px-6 py-4">
                           <span className="text-[10px] font-black text-emerald-600">{lead.intent}%</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
             <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest mb-8">Interest Frequency</h3>
             <div className="grid grid-cols-4 gap-6">
                {[
                  { label: '1 BHK', val: '12%' },
                  { label: '2 BHK', val: '35%' },
                  { label: '3 BHK', val: '42%' },
                  { label: 'Penthouse', val: '11%' },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                     <p className="text-2xl font-black text-[#0A2C5E]">{item.val}</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{item.label}</p>
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
                   "High intent leads primarily coming from digital organic sources.",
                   "Pricing objections rising in the Mumbai region for 3 BHK units.",
                   "Follow-up conversion is 2x higher for leads with >85% intent score."
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                 <TrendingUp size={20} className="text-emerald-200" />
                 <h3 className="text-sm font-black uppercase tracking-widest text-emerald-100">Top Interest</h3>
              </div>
              <p className="text-xl font-black mb-1">Atelier Greens</p>
              <p className="text-[10px] text-emerald-100 font-bold opacity-80 uppercase tracking-widest">
                +12% WoW Growth
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignEnquiryDetail;
