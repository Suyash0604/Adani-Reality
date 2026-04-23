import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Phone, 
  BarChart3, 
  List, 
  Shield, 
  User, 
  ChevronRight,
  Menu,
  ChevronLeft,
  ShieldAlert,
  History
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

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
    { label: 'Security', to: '/admin', icon: Shield },
    { label: 'Call Records', to: '/records', icon: History },
  ],
};

const AppShell = ({ title, children, fitViewport = false }) => {
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navItems = navByRole[user?.role] ?? [];

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-3 shadow-sm shrink-0">
        <div className="mx-auto flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://www.tandtrealty.in/image/logo/new/comp/adani-realty.png" 
              alt="Adani Realty" 
              className="h-8 object-contain"
            />
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <h1 className="text-xl font-bold text-[#0A2C5E] tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200" type="button">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D71920] border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5">
              <div className="rounded-full bg-[#0A2C5E] p-1.5 text-white">
                <User size={14} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#0A2C5E]">{user?.name}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">{user?.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full mx-auto relative overflow-hidden">
        {/* Navigation - Collapsible via Button inside Sidebar */}
        <aside 
          className={`h-full ${isExpanded ? 'w-64' : 'w-16'} shrink-0 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-lg lg:shadow-none flex flex-col`}
        >
          <div className="p-3">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mb-4 flex w-full items-center justify-center rounded-xl p-2.5 transition-all ${
                isExpanded ? 'hover:bg-slate-100 text-slate-500' : 'bg-[#0A2C5E]/5 text-[#0A2C5E]'
              }`}
            >
              {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center transition-all">
              {isExpanded ? (
                <span className="block px-1 text-left">Navigation</span>
              ) : (
                <span>•••</span>
              )}
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = location.pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-4 rounded-xl px-3.5 py-3 text-sm font-bold transition-all relative group/item ${
                      active 
                        ? 'bg-[#0A2C5E] text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span className={`${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 whitespace-nowrap`}>
                      {item.label}
                    </span>
                    {active && isExpanded && (
                      <div className="absolute right-2 opacity-100">
                        <ChevronRight size={14} />
                      </div>
                    )}
                    {/* Tooltip for collapsed state */}
                    {!isExpanded && (
                      <div className="absolute left-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className={`mt-auto p-4 border-t border-slate-50 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity`}>
            <div className="rounded-xl bg-orange-50 p-3">
              <p className="text-[10px] font-bold text-orange-800 uppercase">Support</p>
              <p className="text-[11px] text-orange-600 mt-1">Need help? Contact IT helpdesk at ext. 404</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className="flex-1 transition-all duration-300 px-6 py-6 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
