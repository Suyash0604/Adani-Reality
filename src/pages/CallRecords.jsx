import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { useApp } from '../context/useApp';

const CallRecords = () => {
  const { callRecords } = useApp();
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const records = callRecords;

  return (
    <AppShell title="Call Records">
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Date</th>
              <th className="py-2">Agent</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Sentiment</th>
              <th className="py-2">Score</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => (
              <Fragment key={row.id}>
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-3">{row.date}</td>
                  <td>{row.agent}</td>
                  <td>{row.customer}</td>
                  <td>{row.duration}</td>
                  <td>{row.sentiment}</td>
                  <td className="font-semibold text-[#0A2C5E]">{row.score}</td>
                  <td>
                    <button
                      type="button"
                      className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold"
                      onClick={() => setExpanded((prev) => (prev === row.id ? null : row.id))}
                    >
                      {expanded === row.id ? 'Hide' : 'Expand'}
                    </button>
                  </td>
                </tr>
                {expanded === row.id ? (
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <td colSpan={7} className="p-4">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">Summary:</span> {row.summary}
                      </p>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.sentimentProgress}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Sentiment Progress</p>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/qa/${row.id}`)}
                          className="rounded-lg bg-[#0A2C5E] px-4 py-2 text-xs font-bold text-white transition-all hover:shadow-md"
                        >
                          View Full QA Report
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
                        >
                          Download Transcript
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
};

export default CallRecords;
