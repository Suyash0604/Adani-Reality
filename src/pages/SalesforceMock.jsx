import { useState } from 'react';
import { PhoneCall, BadgeCheck, Phone, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { leads } from '../data/mockData';
import { useApp } from '../context/useApp';

const SalesforceMock = () => {
  const navigate = useNavigate();
  const { 
    setActiveCustomer, 
    resetCallSession, 
    setSelectedLeadId, 
    selectedLeadId, 
    callState, 
    visitBooked, 
    triggerIncomingCall,
    incomingCall,
    acceptCall,
    setTranscriptMessages,
    setIncomingCall
  } = useApp();
  const [toast, setToast] = useState('');

  const handleCallLead = (lead) => {
    setSelectedLeadId(lead.id);
    setActiveCustomer(lead);
    resetCallSession();
    setToast(`Lead ${lead.name} loaded. Auto task created: Outbound call + qualification.`);
    setTimeout(() => setToast(''), 3000);
    navigate('/agent');
  };

  return (
    <AppShell title="Salesforce Mock">
      <section className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0A2C5E]">CRM Lead Pipeline</h2>
            <p className="text-sm text-slate-500">Select a lead and initiate call flow.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => triggerIncomingCall(leads[0].id)}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-200"
            >
              Demo Incoming Call
            </button>
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
              Current session: <span className="font-semibold uppercase">{callState.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        {visitBooked ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <BadgeCheck size={14} /> Last call conversion completed: Site Visit Booked
          </div>
        ) : null}
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <div className="space-y-3">
          {leads.map((lead) => (
            <article
              key={lead.id}
              onClick={() => {
                setSelectedLeadId(lead.id);
                setActiveCustomer(lead);
              }}
              className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${selectedLeadId === lead.id ? 'border-[#D71920] bg-[#D71920]/5' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.propertyInterest}</p>
                  <p className="text-sm text-slate-500">{lead.city} · Budget {lead.budget}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D71920] px-3 py-2 text-sm font-semibold text-white hover:bg-[#bf161c] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking button
                    handleCallLead(lead);
                  }}
                >
                  <PhoneCall size={14} /> Call via console
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-6 right-6 rounded-lg bg-[#0A2C5E] px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      ) : null}

      {incomingCall && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-500">
          <div className="w-80 rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse">
                <Phone size={20} />
              </div>
              <div className="px-2 py-1 bg-emerald-50 rounded text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                Live Incoming
              </div>
            </div>
            
            <h4 className="text-base font-black text-[#0A2C5E] mb-1">{incomingCall.lead.name}</h4>
            <p className="text-xs text-slate-500 mb-4">Initial screening completed by AI Bot</p>
            
            <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-1.5">
                <Brain size={12} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Handover Summary</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed italic">
                "Customer is asking about airport proximity and needs detailed floor plans for 4BHK units."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={(e) => {
                  console.log('View Details clicked');
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Setting active customer:', incomingCall.lead.name);
                  setActiveCustomer(incomingCall.lead);
                  setTranscriptMessages(incomingCall.aiHistory);
                  
                  console.log('Navigating to /agent...');
                  // Attempt standard navigate
                  navigate('/agent');
                  
                  // Fallback for demo environments
                  setTimeout(() => {
                    if (window.location.pathname !== '/agent') {
                      console.log('Standard navigate failed, trying direct location update');
                      window.location.assign('/agent');
                    }
                  }, 150);
                }}
                className="py-2.5 rounded-xl bg-[#0A2C5E] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0c3875] shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                View Details
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIncomingCall(null);
                }}
                className="py-2.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default SalesforceMock;
