import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('agent@adani.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('agent');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // AuthContext expects an object { email, role }
    if (login({ email, password, role })) {
      navigate(role === 'agent' ? '/salesforce' : '/supervisor');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* Visual Section - Left Side */}
      <div className="relative hidden w-1/2 lg:block">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000" 
          alt="Adani Realty Premium Property" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2C5E]/80 via-[#0A2C5E]/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
             <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md border border-white/20">
               <Building2 size={28} />
             </div>
             <span className="text-2xl font-bold tracking-tight">Adani <span className="font-light">Realty</span></span>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-6">
              <Sparkles size={14} className="text-amber-300" />
              AI-Powered Sales Intelligence
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Elevate the <br />
              <span className="text-amber-400 font-serif italic">Customer Journey</span>
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Welcome to the specialized AI Contact Center for Adani Realty. Streamlining lead qualification and sales performance through real-time transcript analysis.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-white/60">
            <p>© 2026 Adani Realty</p>
            <div className="h-4 w-[1px] bg-white/20" />
            <p>Digital Excellence Center</p>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 bg-slate-50">
        <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-10 lg:hidden">
            <img 
              src="https://www.tandtrealty.in/image/logo/new/comp/adani-realty.png" 
              alt="Adani Realty" 
              className="h-10 object-contain mx-auto"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#0A2C5E]">Secure Access</h3>
            <p className="mt-2 text-slate-500 font-medium">Please enter your specialized credentials to access the AI Sales Dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Work Email</label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#0A2C5E] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 transition-all focus:ring-2 focus:ring-[#0A2C5E] focus:outline-none placeholder:text-slate-300"
                  placeholder="agent@adani.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-[#0A2C5E] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 transition-all focus:ring-2 focus:ring-[#0A2C5E] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">System Role</label>
              <div className="grid grid-cols-2 gap-3">
                {['agent', 'supervisor'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all border ${
                      role === r 
                        ? 'bg-[#0A2C5E] border-[#0A2C5E] text-white shadow-lg' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-[#0A2C5E]/30'
                    }`}
                  >
                    {r === 'agent' ? <Building2 size={16} /> : <ShieldCheck size={16} />}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D71920] py-4 text-sm font-bold text-white transition-all hover:bg-[#bf161c] hover:shadow-xl active:scale-95 group"
            >
              Sign In to Your Workspace
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-8 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-[#0A2C5E] transition-colors">Forgot Password?</a>
            <a href="#" className="hover:text-[#0A2C5E] transition-colors">System Status</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
