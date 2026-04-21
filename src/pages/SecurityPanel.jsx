import AppShell from '../components/layout/AppShell';
import { securityMatrix } from '../data/mockData';

const complianceCards = [
  { label: 'Encryption', value: 'AES-256' },
  { label: 'Transport Security', value: 'TLS 1.3' },
  { label: 'Data Residency', value: 'India' },
  { label: 'Retention Policy', value: '24 months rolling' },
];

const SecurityPanel = () => {
  return (
    <AppShell title="Security & Access Control">
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#0A2C5E]">Role Permissions Matrix</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Role</th>
              <th className="py-2">Call recordings</th>
              <th className="py-2">QA access</th>
              <th className="py-2">Data access</th>
            </tr>
          </thead>
          <tbody>
            {securityMatrix.map((row) => (
              <tr key={row.role} className="border-b border-slate-100">
                <td className="py-2 font-semibold text-slate-800">{row.role}</td>
                <td>{row.callRecordings}</td>
                <td>{row.qaAccess}</td>
                <td>{row.dataAccess}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6 grid grid-cols-4 gap-4">
        {complianceCards.map((item) => (
          <article key={item.label} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 text-xl font-bold text-[#0A2C5E]">{item.value}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
};

export default SecurityPanel;
