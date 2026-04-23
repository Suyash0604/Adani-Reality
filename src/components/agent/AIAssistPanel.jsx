import { Sparkles, Bot, MessageSquare, Zap, Target, MapPin, DollarSign } from 'lucide-react';

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

  const smartTags = [
    { label: 'Price Sensitive', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', active: latestCustomerMessage.toLowerCase().includes('price') },
    { label: 'Location Priority', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50', active: latestCustomerMessage.toLowerCase().includes('location') },
    { label: 'High Intent', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', active: latestCustomerMessage.toLowerCase().includes('price') && latestCustomerMessage.toLowerCase().includes('location') },
  ];

  return (
    <section className="flex flex-col h-full bg-white">
      <div className="flex shrink-0 items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Sparkles className="text-blue-600" size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight uppercase">AI Co-Pilot</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Assist</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Smart Tags Section */}
        {isLiveMode && (
          <div className="flex flex-wrap gap-2">
            {smartTags.map((tag, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${
                  tag.active 
                  ? `${tag.bg} ${tag.color} border-current border-opacity-20` 
                  : 'bg-slate-50 text-slate-300 border-slate-100'
                }`}
              >
                <tag.icon size={11} />
                {tag.label}
              </div>
            ))}
          </div>
        )}

        {/* The Recommended Script - Softer Palette */}
        <div 
          key={pulseKey || 'empty'}
          className={`group relative rounded-2xl p-6 transition-all duration-500 border-2 ${
            aiAnalyzing 
            ? 'border-blue-100 bg-blue-50/30 animate-pulse' 
            : 'border-blue-100 bg-blue-50/50 text-blue-900 shadow-sm shadow-blue-900/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/70">
              {aiAnalyzing ? 'AI is thinking...' : 'Recommended Response'}
            </span>
          </div>

          <p className="text-[14px] font-bold leading-relaxed text-blue-900/90">
            {aiAnalyzing 
              ? "Synthesizing response..."
              : topRecommendedScript || 'Listening for customer cues...'
            }
          </p>

          {!aiAnalyzing && (
            <div className="mt-6 pt-5 border-t border-blue-200/50 flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Conf: 94%</span>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-all">
                Copy Script
              </button>
            </div>
          )}
        </div>

        {/* Secondary Insights - Compact */}
        {isLiveMode && (
          <div className="space-y-4">
             <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                   <Zap size={12} className="text-amber-500" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Insight</p>
                </div>
                <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                   {liveInsight || 'Waiting for intent...'}
                </p>
             </div>
          </div>
        )}

        {summaryMode && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 animate-in slide-in-from-bottom-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Post-Call Summary</p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight mb-1">Final Intent</p>
                <p className="text-[13px] font-bold text-slate-700">{summaryData?.finalIntent || 'Qualified'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight mb-1">Key Memory</p>
                <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{summaryData?.keyInsight || memoryInsight}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AIAssistPanel;
