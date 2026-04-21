import React from 'react';
import { 
  Gift, 
  Tag, 
  MapPin, 
  Zap, 
  MousePointer2, 
  TrendingUp, 
  BarChart3,
  Calendar,
  BrainCircuit
} from 'lucide-react';

const CampaignOffersDetail = ({ campaign, triggerAction }) => {
  return (
    <div className="space-y-8">
      {/* 1. KPI Cards (4 metrics) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Offers Sent', value: '1,450', icon: <Tag size={16} /> },
          { label: 'Redemptions', value: '8.4%', icon: <MousePointer2 size={16} /> },
          { label: 'Event RSVPs', value: '35', icon: <Calendar size={16} /> },
          { label: 'Heat Level', value: 'High', icon: <Zap size={16} /> },
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
           <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest mb-8 flex items-center gap-2">
                 <Gift size={16} className="text-purple-500" />
                 Promotion Success
              </h3>
              <div className="grid grid-cols-3 gap-6">
                 {[
                   { label: 'GST Waiver', impact: 45 },
                   { label: 'Clubhouse Free', impact: 30 },
                   { label: 'Parking Disc.', impact: 25 },
                 ].map((promo, idx) => (
                   <div key={idx} className="p-6 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                      <p className="text-[10px] font-black text-purple-400 uppercase mb-2">{promo.label}</p>
                      <p className="text-2xl font-black text-purple-700">{promo.impact}%</p>
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
                   "Weekends between 11 AM - 1 PM show 14% higher engagement.",
                   "GST Waiver is the most clicked offer across all regions.",
                   "Lead engagement lift of +14% compared to SMS-only campaigns."
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#0A2C5E] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Strategic Slot</h3>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                 <p className="text-[10px] font-black text-purple-300 uppercase mb-1">Peak Time</p>
                 <p className="text-sm font-bold">Weekends | 11AM - 1PM</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignOffersDetail;
