import { Sparkles, BrainCircuit, Zap, Lightbulb, Bot } from 'lucide-react';

const AIAssistPanel = ({
  suggestions,
  latestCustomerMessage,
  triggerCount,
  callState,
  pulseKey,
  aiAnalyzing,
  memoryInsight,
  summaryMode,
  summaryData,
  liveInsight,
}) => {
  const isLiveMode = callState === 'active' || callState === 'on_hold';
  const topRecommendedScript = suggestions[0]?.script;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex shrink-0 items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#D71920]" size={16} />
          <h2 className="text-lg font-semibold text-[#0A2C5E]">{isLiveMode ? 'AI Assistant · LIVE' : 'AI Assistant'}</h2>
        </div>
        {isLiveMode ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-[#0A2C5E]/10 px-2 py-1 text-[10px] font-semibold text-[#0A2C5E]">
            <BrainCircuit size={11} /> Insights: {triggerCount}
          </div>
        ) : null}
      </div>

      {!isLiveMode ? (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
          AI Assistant activates only during an active call.
        </div>
      ) : (
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        <div className="rounded-lg bg-[#0A2C5E] p-3 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">Recommended Script</p>
          <p className="mt-1 text-sm">
            {topRecommendedScript || 'Thanks for sharing that. I can help shortlist the best option and schedule your site visit.'}
          </p>
        </div>

        {summaryMode ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Final AI Summary</p>
            <p className="mt-1">Final intent: {summaryData?.finalIntent || 'Qualified Discussion'}</p>
            <p className="mt-1">Key insight: {summaryData?.keyInsight || memoryInsight}</p>
            <p className="mt-1">Outcome: {summaryData?.outcome || 'Follow-up required'}</p>
          </div>
        ) : (
          <>
            <div
              key={pulseKey || 'empty'}
              className={`rounded-lg border p-3 transition-all duration-300 ${
                latestCustomerMessage
                  ? 'scale-[1.01] animate-[pulse_0.55s_ease-in-out_1] border-[#D71920]/70 bg-[#fff5f5] shadow-[0_0_0_2px_rgba(215,25,32,0.15)]'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <p className="flex items-center gap-2 text-xs font-semibold text-[#D71920]">
                <Zap size={13} /> Live Trigger Insight
              </p>
              <p className="mt-1 text-xs text-slate-600">{liveInsight || 'Waiting for trigger from customer response.'}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Suggested Next Action</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
                <li>Greet customer</li>
                <li>Confirm interest</li>
                <li>Ask availability</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <Bot size={12} /> AI Insight Memory
              </p>
              <p className="mt-1">{memoryInsight}</p>
            </div>
          </>
        )}

        {aiAnalyzing && !summaryMode ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Analyzing customer response...</p>
            <p className="mt-1">Generating best next script and positioning strategy.</p>
          </div>
        ) : null}

        {suggestions.map((item) => (
          <article key={`${item.title}-${item.trigger}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1 text-sm font-semibold text-[#0A2C5E]">
                <Lightbulb size={14} /> {item.title}
              </h3>
              <span className="rounded-full bg-[#D71920]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#D71920]">{item.trigger}</span>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="mt-3 rounded-md bg-[#0A2C5E] p-2 text-xs text-white">
              <p className="font-semibold">Recommended Script</p>
              <p className="mt-1 opacity-90">{item.script}</p>
            </div>
          </article>
        ))}
      </div>
      )}
    </section>
  );
};

export default AIAssistPanel;
