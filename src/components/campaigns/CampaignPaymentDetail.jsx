import React from 'react';
import { 
  CreditCard, 
  Wallet, 
  History, 
  BadgeCheck, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  BrainCircuit
} from 'lucide-react';

const CampaignPaymentDetail = ({ campaign, triggerAction }) => {
  return (
    <div className="space-y-8">
      {/* 1. KPI Cards (4 metrics) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Outreach Success', value: '72%', icon: <CreditCard size={16} /> },
          { label: 'Total Collected', value: '₹1.2 Cr', icon: <Wallet size={16} /> },
          { label: 'Commitments', value: '45', icon: <History size={16} /> },
          { label: 'Dues Pending', value: '₹4.8 Cr', icon: <Clock size={16} /> },
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
                 <TrendingUp size={16} className="text-emerald-500" />
                 Collection Tracking
              </h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-600">Quarterly Progress</span>
                       <span className="text-[10px] font-black text-emerald-600 uppercase">24% Achieved</span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-emerald-500" style={{ width: '24%' }} />
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-10">
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">PTP Accuracy</p>
                    <p className="text-2xl font-black text-slate-700">82%</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Collect Time</p>
                    <p className="text-2xl font-black text-slate-700">12 Days</p>
                 </div>
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
                   "Payment commitments are 20% higher when outreach starts at 10 AM.",
                   "Average dispute resolution time has decreased by 2 days.",
                   "Predictive modeling shows high success for WhatsApp-led reminders."
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#0A2C5E] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Notices Status</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-200 font-bold">1st Reminders</span>
                    <span className="font-black">124</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-200 font-bold">Final Notices</span>
                    <span className="font-black text-rose-300">12</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPaymentDetail;
