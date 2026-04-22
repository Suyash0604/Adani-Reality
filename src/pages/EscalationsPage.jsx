import { useApp } from '../context/useApp';
import AppShell from '../components/layout/AppShell';
import { ShieldAlert, Clock, ChevronRight, MessageSquare, User, Calendar } from 'lucide-react';

const EscalationsPage = () => {
  const { escalations } = useApp();

  return (
    <AppShell title="Escalation Management">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0A2C5E]">Escalation Repository</h1>
              <p className="text-sm text-slate-500 font-medium">Monitoring and resolving high-priority interaction deviations.</p>
            </div>
          </div>
          <div className="flex gap-8 px-6 border-l border-slate-100">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-xl font-black text-amber-500">{escalations.filter(e => e.status !== 'Resolved').length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
              <p className="text-xl font-black text-emerald-500">{escalations.filter(e => e.status === 'Resolved').length}</p>
            </div>
          </div>
        </div>

        {/* Escalation Feed */}
        <div className="grid gap-6">
          {escalations.map((esc) => (
            <div key={esc.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#0A2C5E]">{esc.customer}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={12} /> {esc.sessionDate}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          esc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {esc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
                    <p className="text-xs font-bold text-slate-600 flex items-center justify-end gap-1">
                      <Clock size={12} /> {esc.timestamp}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 italic relative">
                      <MessageSquare size={16} className="absolute -top-2 -left-2 text-slate-300" />
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">"{esc.reason}"</p>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 flex flex-col justify-center gap-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase">Assigned To</p>
                         <p className="text-sm font-black text-[#0A2C5E]">{esc.escalatedTo}</p>
                       </div>
                       <button className="h-8 w-8 rounded-full bg-[#0A2C5E] text-white flex items-center justify-center hover:scale-110 transition-transform">
                         <ChevronRight size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {escalations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <ShieldAlert size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Critical Deviations Found</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default EscalationsPage;
