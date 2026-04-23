import { useEffect, useRef, useState } from 'react';

const TranscriptPanel = ({ messages, callState }) => {
  const scrollRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  const isEnded = callState === 'ended';
  const showTyping = callState === 'active' && messages.length > 0;

  return (
    <section className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Live Transcript</h2>
        </div>
        {callState === 'active' && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-blue-600">Active Stream</span>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[#F8FAFC]/50 p-6 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-300">
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Ready for connection</p>
          </div>
        ) : (
          messages.map((message) => {
            const isAgent = message.sender === 'agent';
            return (
              <div key={message.id} className={`flex ${isAgent ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-1`}>
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed transition-all ${
                    isAgent 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10 rounded-tl-none' 
                      : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tr-none'
                  }`}
                >
                  <p className="font-medium">{message.text}</p>
                  <div className={`mt-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isAgent ? 'text-blue-100' : 'text-slate-400'}`}>
                    <span>{isAgent ? 'You' : 'Customer'}</span>
                    <span>•</span>
                    <span>{message.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {showTyping && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Customer speaking</span>
          </div>
        )}
      </div>

      {!isAtBottom && (
        <button 
          onClick={() => {
            if (scrollRef.current) {
               scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
               setIsAtBottom(true);
            }
          }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-xl animate-in slide-in-from-bottom-4"
        >
          Scroll to New Messages
        </button>
      )}
    </section>
  );
};

export default TranscriptPanel;
