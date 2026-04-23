import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Phone, 
  History, 
  ShieldAlert,
  User, 
  ChevronRight,
  Menu,
  ChevronLeft,
  Settings,
  HelpCircle,
  Search
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

const AppShell = ({ title, children }) => {
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

          {/* SEARCH BAR - MODERN TOUCH */}
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 w-80 group focus-within:bg-white focus-within:border-blue-200 transition-all">
             <Search size={14} className="text-slate-400 group-focus-within:text-[#0A2C5E]" />
             <input 
               type="text" 
               placeholder="Search properties, leads..." 
               className="bg-transparent border-none outline-none px-3 text-xs font-medium text-slate-600 placeholder:text-slate-300 w-full"
             />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <button className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#0A2C5E] transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
             </button>
             <button className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#0A2C5E] transition-all">
                <HelpCircle size={18} />
             </button>
          </div>

          <div className="h-8 w-px bg-slate-100" />

          {/* USER PROFILE - MODERN CLEAN */}
          <div className="flex items-center gap-3 group cursor-pointer">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[#0A2C5E] leading-tight">{user?.name}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{user?.role}</p>
             </div>
             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-[#0A2C5E] shadow-sm overflow-hidden group-hover:shadow-md transition-all">
                <User size={20} />
             </div>
             <button
               onClick={logout}
               className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
             >
               <LogOut size={16} />
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* --- SIDEBAR - MODERN MINIMAL --- */}
        <aside 
          className={`h-full ${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-slate-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40`}
        >
          {/* TOP TOGGLE */}
          <div className="p-4 border-b border-slate-50">
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="w-full flex items-center justify-center h-10 rounded-xl text-[#0A2C5E] bg-blue-50/50 hover:bg-blue-50 transition-all group"
             >
                <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}>
                  <ChevronLeft size={18} />
                </div>
             </button>
          </div>

          {/* NAV ITEMS */}
          <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
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
                  
                  {/* Active Indicator Pin */}
                  {active && (
                    <div className="absolute left-0 w-1 h-4 bg-white rounded-r-full my-auto inset-y-0" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-50 shadow-2xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* BOTTOM CONTROLS (Empty since settings removed) */}
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto px-10 py-10 bg-[#FDFDFF] scroll-smooth scrollbar-hide">
           <div className="max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
