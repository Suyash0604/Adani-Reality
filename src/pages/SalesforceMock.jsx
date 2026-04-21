import { useState } from 'react';
import { PhoneCall, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { leads } from '../data/mockData';
import { useApp } from '../context/useApp';

const SalesforceMock = () => {
  const navigate = useNavigate();
  const { setActiveCustomer, resetCallSession, setSelectedLeadId, selectedLeadId, callState, visitBooked } = useApp();
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
            <p className="text-sm text-slate-500">Select a lead and initiate AI-powered call flow.</p>
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
            Current session: <span className="font-semibold uppercase">{callState.replace('_', ' ')}</span>
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
                  <PhoneCall size={14} /> Call via AI
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-6 right-6 rounded-lg bg-[#0A2C5E] px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      ) : null}
    </AppShell>
  );
};

export default SalesforceMock;
