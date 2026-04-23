import { UserRound } from 'lucide-react';

const CustomerContextCard = ({ customer }) => {
  if (!customer) {
    return (
      <div className="h-full rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center p-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select a lead to view details</p>
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-xl">
           <UserRound size={20} className="text-[#0A2C5E]" />
        </div>
        <div>
           <h2 className="text-base font-black text-[#0A2C5E] uppercase tracking-tight">{customer.name}</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Contact</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Location', value: customer.city },
          { label: 'Phone', value: customer.phone },
          { label: 'Interest', value: customer.propertyInterest },
          { label: 'Budget', value: customer.budget },
          { label: 'Source', value: customer.leadSource },
        ].map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</span>
            <span className="text-sm font-bold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerContextCard;
