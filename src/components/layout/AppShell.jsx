import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  Phone, 
  History, 
  ShieldAlert,
  User, 
  Search,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useApp } from '../../context/useApp';

const navByRole = {
  agent: [
    { label: 'Dashboard', to: '/salesforce', icon: LayoutDashboard },
    { label: 'Agent Console', to: '/agent', icon: Phone },
    { label: 'Call Records', to: '/records', icon: History },
  ],
  supervisor: [
    { label: 'Dashboard', to: '/supervisor', icon: LayoutDashboard },
    { label: 'Call Intelligence', to: '/records', icon: History },
    { label: 'Escalations', to: '/escalations', icon: ShieldAlert },
  ],
  admin: [
    { label: 'Security', to: '/admin', icon: ShieldAlert },
    { label: 'Call Records', to: '/records', icon: History },
  ],
};

const AppShell = ({ title, children, fitViewport = false }) => {
  const { user, logout } = useAuth();
  const { isNavExpanded: isExpanded, setIsNavExpanded: setIsExpanded } = useApp();
  const location = useLocation();
  const navItems = navByRole[user?.role] ?? [];

  return (
    <div className="h-screen overflow-hidden bg-[#FDFDFF] text-slate-900 flex flex-col font-sans">
      {/* --- TOP HEADER --- */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-12">
          {/* LOGO - AS REQUESTED: DO NOT CHANGE */}
          <div className="flex items-center gap-4">
             <img 
               src="https://www.tandtrealty.in/image/logo/new/comp/adani-realty.png" 
               alt="Adani Realty" 
               className="h-8 object-contain"
             />
             <div className="h-4 w-px bg-slate-200" />
             <h1 className="text-sm font-black text-[#0A2C5E] uppercase tracking-[0.15em]">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* POWERED BY BRANDING */}
          <div className="hidden md:flex flex-col items-end gap-0.5 px-4 py-1.5 rounded-xl bg-slate-50/50 border border-slate-100">
             <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Powered by</span>
             <span className="text-[10px] font-black text-[#0A2C5E] uppercase tracking-wider leading-none">Markytics.ai</span>
          </div>
          
          <div className="h-8 w-px bg-slate-100 hidden md:block" />

          {/* USER PROFILE & LOGOUT */}
          <div className="flex items-center gap-4 group">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[#0A2C5E] leading-tight">{user?.name}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{user?.role}</p>
             </div>
             <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A2C5E] shadow-sm">
                <User size={20} />
             </div>
             
             <div className="h-8 w-px bg-slate-100" />
             
             <button
               onClick={logout}
               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all group"
             >
               <LogOut size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* --- SIDEBAR --- */}
        <aside 
          className={`h-full ${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-slate-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40`}
        >
          {/* TOP TOGGLE */}
          <div className="p-4 border-b border-slate-50">
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="w-full flex items-center justify-center h-10 rounded-xl text-[#0A2C5E] bg-blue-50/50 hover:bg-blue-50 transition-all"
             >
                <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}>
                  <ChevronLeft size={18} />
                </div>
             </button>
          </div>

          {/* NAV ITEMS */}
          <div className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    active 
                      ? 'bg-[#0A2C5E] text-white shadow-xl shadow-blue-100' 
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
                >
                  <div className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state (Show name on hover) */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-4 py-2.5 bg-[#0A2C5E] text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-xl opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 pointer-events-none z-[100] shadow-[0_10px_30px_-5px_rgba(10,44,94,0.3)] whitespace-nowrap border border-white/10">
                      {item.label}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0A2C5E] rotate-45 border-l border-b border-white/10" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-slate-50 mt-auto">
             <div className={`transition-all duration-500 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Powered by</p>
                <p className="text-[10px] font-black text-[#0A2C5E] uppercase tracking-widest">Markytics.ai</p>
             </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className={`flex-1 ${fitViewport ? 'overflow-hidden' : 'overflow-y-auto px-10 py-10'} bg-[#FDFDFF] scroll-smooth scrollbar-hide`}>
           <div className={`h-full ${fitViewport ? '' : 'max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700'}`}>
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
