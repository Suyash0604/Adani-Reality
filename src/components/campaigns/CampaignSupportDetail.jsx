import React from 'react';
import { 
  Headphones, 
  HelpCircle, 
  Smile, 
  Zap, 
  BookOpen, 
  PhoneOutgoing, 
  MessageCircle,
  FileText,
  BrainCircuit
} from 'lucide-react';

const CampaignSupportDetail = ({ campaign, triggerAction }) => {
  return (
    <div className="space-y-8">
      {/* 1. KPI Cards (4 metrics) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Incoming Calls', value: '320', icon: <Headphones size={16} /> },
          { label: 'AI Deflection', value: '62%', icon: <Zap size={16} /> },
          { label: 'CSAT Index', value: '4.8', icon: <Smile size={16} /> },
          { label: 'Docs Requested', value: '88', icon: <FileText size={16} /> },
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
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-500" />
                  Knowledge Base Impact
                </h3>
             </div>
             
             <div className="space-y-6">
                {[
                  { topic: 'Registration Process', usage: 82, deflection: 75 },
                  { topic: 'Payment Schedule', usage: 65, deflection: 40 },
                  { topic: 'Home Loan NOC', usage: 45, deflection: 90 },
                ].map((item, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-700">{item.topic}</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase">{item.deflection}% Deflected</span>
                     </div>
                     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${item.deflection}%` }} />
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
             <h3 className="text-sm font-black text-[#0A2C5E] uppercase tracking-widest mb-6">Channel Distribution</h3>
             <div className="grid grid-cols-3 gap-8">
                {[
                  { label: 'Voice Calls', val: 55 },
                  { label: 'WhatsApp', val: 30 },
                  { label: 'Email', val: 15 },
                ].map((c, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl text-center">
                     <p className="text-2xl font-black text-slate-800">{c.val}%</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
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
                   "Knowledge base deflection is improving for 'Registration' FAQs.",
                   "CSAT score has risen by 0.3 points following bot training.",
                   "WhatsApp channel volume is trending up by 15% WoW."
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#0A2C5E] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Support Status</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs font-bold text-blue-200">
                    <span>Active Queues</span>
                    <span className="text-sm font-black text-white">04</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold text-blue-200">
                    <span>Bot Uptime</span>
                    <span className="text-sm font-black text-emerald-400">99.9%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSupportDetail;
