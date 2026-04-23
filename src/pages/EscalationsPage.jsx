import { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';
import AppShell from '../components/layout/AppShell';
import { 
  ShieldAlert, 
  CheckCircle2, 
  UserPlus, 
  Clock
} from 'lucide-react';

const EscalationsPage = () => {
  const { escalations } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');

  // Simple stats
  const stats = useMemo(() => ({
    pending: escalations.filter(e => e.status !== 'Resolved').length,
    resolved: escalations.filter(e => e.status === 'Resolved').length,
    overdue: 1
  }), [escalations]);

  // Priority logic & sorting
  const getPriority = (reason) => {
    const text = reason.toLowerCase();
    if (text.includes('pricing') || text.includes('critical')) return { label: 'High', color: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-50' };
    if (text.includes('complaint')) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-50' };
    return { label: 'Low', color: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-50' };
  };

  const sortedEscalations = useMemo(() => {
    return [...escalations]
      .filter(e => filterStatus === 'All' || e.status === filterStatus)
      .sort((a, b) => {
        const pA = getPriority(a.reason).label;
        const pB = getPriority(b.reason).label;
        const order = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return order[pA] - order[pB];
      });
  }, [escalations, filterStatus]);

  return (
    <AppShell title="Escalation Management">
      <div className="w-full px-8 space-y-6 animate-in fade-in duration-500">
        
        {/* 1. TOP SUMMARY (MINIMAL) */}
        <div className="flex items-center justify-center gap-12 bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending:</span>
              <span className="text-sm font-black text-amber-500">{stats.pending}</span>
           </div>
           <div className="w-px h-4 bg-slate-100" />
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved:</span>
              <span className="text-sm font-black text-emerald-500">{stats.resolved}</span>
           </div>
           <div className="w-px h-4 bg-slate-100" />
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overdue:</span>
              <span className="text-sm font-black text-rose-500">{stats.overdue}</span>
           </div>
        </div>

        {/* 6. SIMPLE FILTER */}
        <div className="flex justify-end">
           <select 
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
             className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 uppercase outline-none"
           >
              <option value="All">All Escalations</option>
              <option value="Pending">Pending Only</option>
              <option value="Resolved">Resolved Only</option>
           </select>
        </div>

        {/* 5. CLEAN CARD STRUCTURE */}
        <div className="space-y-3">
          {sortedEscalations.map((esc) => {
            const p = getPriority(esc.reason);
            const isPending = esc.status !== 'Resolved';

            return (
              <div key={esc.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between hover:border-slate-200 transition-all shadow-sm">
                <div className="flex items-center gap-6 flex-1">
                  {/* 2. PRIORITY TAG */}
                  <div className={`w-20 px-2 py-1 rounded-lg ${p.bg} ${p.text} text-[10px] font-black uppercase text-center tracking-widest border border-current border-opacity-10`}>
                    {p.label === 'High' ? '🔴 ' : p.label === 'Medium' ? '🟡 ' : '🟢 '} {p.label}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-800">{esc.customer}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">{esc.reason}</p>
                  </div>

                  <div className="flex items-center gap-8 px-8 border-x border-slate-50">
                    <div className="text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Pending</p>
                       <p className="text-xs font-black text-slate-700">{isPending ? '2h' : '0h'}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Assigned To</p>
                       <p className="text-xs font-black text-[#0A2C5E]">{esc.escalatedTo}</p>
                    </div>
                  </div>
                </div>

                {/* 4. CLEAR ACTION BUTTONS */}
                <div className="flex items-center gap-2 ml-6">
                   {isPending && (
                     <>
                        <button className="h-9 px-4 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-100 transition-all flex items-center gap-2 border border-emerald-100">
                           <CheckCircle2 size={14} /> Resolve
                        </button>
                        <button className="h-9 px-4 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all flex items-center gap-2">
                           <UserPlus size={14} /> Reassign
                        </button>
                     </>
                   )}
                   {!isPending && (
                      <span className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">Completed</span>
                   )}
                </div>
              </div>
            );
          })}
        </div>

        {sortedEscalations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <ShieldAlert size={32} className="mx-auto text-slate-200 mb-2" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching escalations</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default EscalationsPage;
