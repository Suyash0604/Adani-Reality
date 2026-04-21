import { PhoneCall, UserRound, MapPin, Building2, Wallet, CircleDot, Sparkles } from 'lucide-react';

const Item = ({ icon, label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-2">
    <p className="text-[11px] text-slate-500">{label}</p>
    <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-800">
      {icon}
      {value}
    </p>
  </div>
);

const CustomerContextCard = ({ customer }) => {
  if (!customer) {
    return <div className="rounded-xl bg-white p-4 shadow-sm">No customer selected.</div>;
  }

  return (
    <section className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0A2C5E]">Customer Profile</h2>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#0A2C5E]/10 px-3 py-1 text-xs font-semibold text-[#0A2C5E]">
          <PhoneCall size={12} /> Live Lead
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <UserRound size={16} className="text-[#0A2C5E]" /> {customer.name}
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={14} /> {customer.city}
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <PhoneCall size={14} /> {customer.phone}
        </p>
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-y-auto pr-1">
        <Item icon={<Building2 size={14} className="text-[#0A2C5E]" />} label="Property" value={customer.propertyInterest} />
        <Item icon={<Wallet size={14} className="text-[#0A2C5E]" />} label="Budget" value={customer.budget} />
        <Item icon={<CircleDot size={14} className="text-[#0A2C5E]" />} label="Source" value={customer.leadSource} />
        <Item icon={<Sparkles size={14} className="text-[#0A2C5E]" />} label="Intent" value={`${customer.aiIntentScore}`} />
      </div>
    </section>
  );
};

export default CustomerContextCard;
