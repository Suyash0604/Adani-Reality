import React from 'react';
import { 
  PhoneCall, 
  UserCheck, 
  CalendarCheck, 
  Activity, 
  TrendingUp, 
  Target,
  ChevronRight,
  TrendingDown,
  BrainCircuit
} from 'lucide-react';

const CampaignPreSalesDetail = ({ campaign, triggerAction }) => {
  return (
    <div className="space-y-8">
      {/* 1. KPI Cards (4 metrics) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Numbers Dialed', value: campaign.details.stats.total, icon: <PhoneCall size={16} /> },
          { label: 'Connect Rate', value: `${campaign.connectRate}%`, icon: <Activity size={16} /> },
          { label: 'Lead Quality', value: `${campaign.details.leadQuality}%`, icon: <Target size={16} /> },
          { label: 'Conversions', value: campaign.conversions, icon: <CalendarCheck size={16} /> },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
               {kpi.icon}
               <span className="text-[10px] font-black uppercase tracking-widest">{kpi.label}</span>
            </div>
            <p className="text-3xl font-black text-[#0A2C5E]">{kpi.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* 2. Main Content (8 cols) */}
        <div className="col-span-8 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
             <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest mb-8 flex items-center gap-2">
               <Target size={16} className="text-purple-500" />
               Performance Funnel
             </h3>
             <div className="space-y-6">
                {[
                  { label: 'Numbers Dialed', val: campaign.details.stats.total },
                  { label: 'Connected Calls', val: campaign.details.stats.reached },
                  { label: 'Site Visits', val: campaign.conversions },
                ].map((item, i) => (
                  <div key={i}>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-600">{item.label}</span>
                        <span className="text-[10px] font-black text-[#0A2C5E] uppercase">{item.val}</span>
                     </div>
                     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(item.val / campaign.details.stats.total) * 100}%` }} />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* 3. Side Panel (4 cols) */}
        <div className="col-span-4 space-y-8">
           {/* AI Insights Card */}
           <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm ring-4 ring-purple-50/50">
              <div className="flex items-center gap-2 mb-4 text-[#0A2C5E]">
                <BrainCircuit size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">AI Insights</h3>
              </div>
              <div className="space-y-4">
                 {[
                   "High intent leads primarily coming from digital organic sources.",
                   "Connect rate dropping during 2-4 PM window; suggest rescheduling.",
                   "Leads from Pune region showing 15% higher site visit probability."
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreSalesDetail;
